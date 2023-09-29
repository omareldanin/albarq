const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

//models===================
const User = require("./model");
const Permission = require("../permission/model");
const Repository = require("../repository/model");
const Branch = require("../branch/model");
const Region = require("../region/model");
const Client = require("../client/model");
const ClientAssistant = require("../clientAssistant/model");
const Tenant = require("../tenant/model");

//generate token=======================
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, "albarq334533?/sdsd/.987654rfw2", {
    expiresIn: "5400h",
  });
  return token;
};

exports.createUser = async (req, res) => {
  const {
    name,
    phone,
    salary,
    role,
    password,
    account_type,
    branchId,
    repositoryId,
    permissions,
    tenantId,
    is_client,
    is_client_assistant,
  } = req.body;

  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission, Client],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (
      admin.account_type !== "admin" &&
      !admin.permission?.add_clients &&
      !admin.permission?.manage_employee
    ) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      phone,
      salary,
      role,
      image: req.file ? req.file.filename : null,
      password: hashedPassword,
      branchId,
      repositoryId,
      account_type,
      tenantId,
    });

    let permission = null;

    if (permissions) {
      permission = await Permission.create({
        ...permissions,
        userId: user.id,
      });
    }

    if (is_client) {
      await Client.create({ userId: user.id, tenantId });
    }

    if (is_client_assistant) {
      await ClientAssistant.create({
        userId: user.id,
        tenantId,
        clientId: admintoken.client.id,
      });
    }

    const token = generateToken(user.id);

    user.token = token;

    await user.save();

    return res.status(201).json({ success: true, user, permission });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.createClientAssistant = async (req, res) => {
  const {
    name,
    phone,
    salary,
    password,
    manage_product,
    manage_category,
    tenantId,
  } = req.body;

  try {
    const clientToken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const client = await User.findOne({
      where: { token: clientToken },
      include: [Client],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!client && client.account_type !== "client") {
      return res.status(404).json({ message: "you are not authorized" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      phone,
      salary,
      role,
      image: req.file ? req.file.filename : null,
      password: hashedPassword,
      account_type: "client assistant",
      tenantId,
    });

    let permission = null;

    permission = await Permission.create({
      manage_category,
      manage_product,
      userId: user.id,
    });

    await ClientAssistant.create({
      userId: user.id,
      tenantId,
      clientId: client.client.id,
    });

    const token = generateToken(user.id);

    user.token = token;

    await user.save();

    return res.status(201).json({ success: true, user, permission });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.createAdmin = async (req, res) => {
  const { name, phone, password, tenantId } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user.super_admin) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name,
      phone,
      password: hashedPassword,
      account_type: "admin",
      role: "مدير الشركه",
      tenantId,
    });

    const adminToken = generateToken(admin.id);

    admin.token = adminToken;

    await admin.save();

    return res.status(201).json({ success: true, admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.getAllAdmins = async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const size = req.query.size ? req.query.size : 10;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user.super_admin) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let filters = {
      account_type: "admin",
    };

    if (req.query.name) {
      filters.name = { [Op.like]: `%${req.query.name}%` };
    }

    if (req.query.phone) {
      filters.phone = req.query.phone;
    }

    if (req.query.tenantId) {
      filters.tenantId = req.query.tenantId;
    }

    const users = await User.findAll({
      limit: limit,
      offset: offset,
      where: filters,
    });

    const count = await User.count({ where: filters }); // Get total number of users
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count: count, pages: numOfPages, results: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({
      where: { phone },
      include: [Permission, Repository, Branch, Region, Tenant],
    });

    if (!user) {
      return res.status(404).json({ error: "البريد أو كلمة المرور غير صحيحة" });
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
    }

    const token = generateToken(user.id);

    user.token = token;

    if (req.body.fcm) {
      user.fcm = req.body.fcm;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        image: user.image
          ? "http://" + req.get("host") + "/uploads/" + user.image
          : null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Permission, Repository, Branch, Region, Tenant],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!user) {
      return res.status(404).json({ message: "غير موجود" });
    }

    if (user.image) {
      user.image = "http://" + req.get("host") + "/uploads/" + user.image;
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const admintoken = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token: admintoken },
      include: [Permission, Client],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.manage_employee) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const user = await User.findByPk(id, {
      include: [Permission],
      attributes: { exclude: ["password"] },
    });

    await user.update(req.body);

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res, next) => {
  const page = req.query.page ? req.query.page : 1;
  const size = req.query.size ? req.query.size : 10;

  try {
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let filters = {
      account_type: req.query.account_type,
    };

    if (req.query.name) {
      filters.name = { [Op.like]: `%${req.query.name}%` };
    }

    if (req.query.phone) {
      filters.phone = req.query.phone;
    }

    if (req.query.tenantId) {
      filters.tenantId = req.query.tenantId;
    }

    if (req.query.role) {
      filters.phone = req.query.role;
    }

    if (req.query.branchId) {
      filters.branchId = req.query.branchId;
    }

    const users = await User.findAll({
      limit: limit,
      offset: offset,
      where: filters,
    });

    const count = await User.count({ where: filters }); // Get total number of users
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count: count, pages: numOfPages, results: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isEqual = await bcrypt.compare(old_password, user.password);

    if (!isEqual) {
      return res.status(401).json({ error: "wrong password" });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ error: "password not matched" });
    }
    const hashedPassword = await bcrypt.hash(new_password, 12);

    user.password = hashedPassword;

    await user.save();
    // send email with new password
    return res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const admin = await User.findOne({
      where: { token },
      include: [Permission],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (admin.account_type !== "admin" && !admin.permission?.manage_employee) {
      return res.status(400).json({ message: "you are not authorized" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await user.destroy();

    return res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
