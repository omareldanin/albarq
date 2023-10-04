const Branch = require("./model");
const Region = require("../region/model");
const Repository = require("../repository/model");
const User = require("../user/model");
const Permission = require("../permission/model");

// Create a new branch
exports.createBranch = async (req, res) => {
  const { name, email, phone, government, tenantId } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_branch) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const branch = await Branch.create({
      name,
      email,
      phone,
      tenantId,
      government,
    });

    return res.status(201).json({ success: true, branch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all branches
exports.getBranches = async (req, res) => {
  const { size, page, name, phone, tenantId } = req.query;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_branch) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let branches = null;

    let filters = {};

    if (tenantId) {
      filters.tenantId = tenantId;
    }

    if (name) {
      filters.name = { [Op.like]: `%${name}%` };
    }

    if (phone) {
      filters.name = phone;
    }

    if (page) {
      branches = await Branch.findAll({
        limit: limit,
        offset: offset,
        where: filters,
      });
    } else {
      branches = await Branch.findAll({
        where: filters,
      });
    }

    const count = await Branch.count({ where: filters });
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count, pages: numOfPages, results: branches });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get a single branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_branch) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const { id } = req.params;

    const branch = await Branch.findByPk(id, {
      include: [Region, Repository],
    });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    return res.status(200).json({ success: true, branch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update a branch by ID
exports.updateBranch = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, government } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_branch) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    branch.name = name;
    branch.email = email;
    branch.phone = phone;
    branch.government = government;

    await branch.save();

    return res.status(200).json({ success: true, branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a branch by ID
exports.deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_branch) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await branch.destroy();

    return res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
