const Government = require("./model");
const User = require("../user/model");

// Create a new government
exports.createGovernment = async (req, res) => {
  const { name } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const government = await Government.create({
      name,
      tenantId: user.tenantId,
    });

    return res.status(201).json({ succuss: true, government });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all governments
exports.getGovernments = async (req, res) => {
  const { size, page } = req.query;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let governments = null;

    if (page) {
      governments = await Government.findAll({
        limit: limit,
        offset: offset,
        where: {
          tenantId: user.tenantId,
        },
      });
    } else {
      governments = await Government.findAll({
        where: {
          tenantId: user.tenantId,
        },
      });
    }

    const count = await Government.count({
      where: {
        tenantId: user.tenantId,
      },
    });
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count, pages: numOfPages, results: governments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single government by ID
exports.getGovernmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const government = await Government.findByPk(id);

    if (!government) {
      return res.status(404).json({ message: "government not found" });
    }

    return res.status(200).json({ government });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update a government by ID
exports.updateGovernment = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const { name } = req.body;

    const government = await Government.findByPk(id);

    if (!government) {
      return res.status(404).json({ message: "government not found" });
    }

    government.name = name;

    await government.save();

    return res.status(200).json({ government });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a government by ID
exports.deleteGovernment = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const government = await Government.findByPk(id);

    if (!government) {
      return res.status(404).json({ message: "government not found" });
    }

    await government.destroy();

    return res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
