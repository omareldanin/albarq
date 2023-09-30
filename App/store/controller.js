const Store = require("./model");
const User = require("../user/model");
const Permission = require("../permission/model");
// Create a new store
exports.createStore = async (req, res) => {
  const { name, notes, userId, tenantId, branchId } = req.body;
  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.add_page) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const store = await Store.create({
      name,
      notes,
      userId,
      tenantId,
      branchId,
    });

    return res.status(201).json({ success: true, store });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all stores
exports.getStores = async (req, res) => {
  const { size, page, userId, name, branchId, tenantId } = req.query;

  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.add_page) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let stores = null;

    let filters = {
      tenantId,
    };

    if (userId) {
      filters.userId = userId;
    }

    if (branchId) {
      filters.branchId = branchId;
    }

    if (name) {
      filters.name = { [Op.like]: `%${name}%` };
    }

    if (page) {
      stores = await Store.findAll({
        limit: limit,
        offset: offset,
        where: filters,
        include: [User],
      });
    } else {
      stores = await Store.findAll({
        where: filters,
        include: [User],
      });
    }

    const count = await Store.count({ where: filters });
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res.status(200).json({ count, pages: numOfPages, results: stores });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get a single Store by ID
exports.getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.add_page) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const store = await Store.findByPk(id, {
      include: [User],
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({ success: true, store });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update a Store by ID
exports.updateStore = async (req, res) => {
  const { id } = req.params;
  const { name, notes, userId } = req.body;
  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.add_page) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const store = await Store.findByPk(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    store.name = name;
    store.notes = notes;
    store.userId = userId;

    await store.save();

    return res.status(200).json({ success: true, store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a Store by ID
exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.add_page) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const store = await Store.findByPk(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.destroy();

    return res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
