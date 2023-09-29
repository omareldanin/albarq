const Repository = require("./model");
const Branch = require("../branch/model");
const User = require("../user/model");
const Permission = require("../permission/model");

// Create a new repository
exports.createRepository = async (req, res) => {
  const { name, branchId, tenantId } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_repository) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const repository = await Repository.create({ name, branchId, tenantId });

    return res.status(201).json({ success: true, repository });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all repositories
exports.getRepositories = async (req, res) => {
  const { size, page, branchId, tenantId } = req.query;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_repository) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let repositories = null;

    let filters = {
      tenantId,
    };

    if (branchId) {
      filters.branchId = branchId;
    }

    if (page) {
      repositories = await Repository.findAll({
        limit: limit,
        offset: offset,
        include: Branch,
        where: filters,
      });
    } else {
      repositories = await Repository.findAll({
        include: Branch,
        where: filters,
      });
    }

    const count = await Repository.count({ where: filters });
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count, pages: numOfPages, results: repositories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single repository by ID
exports.getRepositoryById = async (req, res) => {
  const { repositoryId } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_repository) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const repository = await Repository.findByPk(repositoryId, {
      include: Branch,
    });

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    return res.status(200).json(repository);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a repository by ID
exports.updateRepository = async (req, res) => {
  const { repositoryId } = req.params;
  const { name, branchId } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_repository) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const repository = await Repository.findByPk(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repository.name = name;
    repository.branchId = branchId;

    await repository.save();

    res.status(200).json(repository);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a repository by ID
exports.deleteRepository = async (req, res) => {
  const { repositoryId } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (user.account_type !== "admin" && !user.permission?.add_repository) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const repository = await Repository.findByPk(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    await repository.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
