const Category = require("./model");
const User = require("../user/model");
const Client = require("../client/model");
const ClientAssistant = require("../clientAssistant/model");

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Client, { model: ClientAssistant, include: Client }],
    });

    if (!user) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    let clientId = null;

    if (user.account_type === "client") {
      clientId = user.id;
    } else {
      clientId = user.clientAssistant.client.userId;
    }

    const category = await Category.create({
      name,
      userId: clientId,
    });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Client, { model: ClientAssistant, include: Client }],
    });

    if (!user) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    let clientId = null;

    if (user.account_type === "client") {
      clientId = user.id;
    } else {
      clientId = user.clientAssistant.client.userId;
    }

    const categories = await Category.findAll({ where: { userId: clientId } });

    return res.status(200).json({ success: true, results: categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.getOneCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Client, { model: ClientAssistant, include: Client }],
    });

    if (!user) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    let clientId = null;

    if (user.account_type === "client") {
      clientId = user.id;
    } else {
      clientId = user.clientAssistant.client.userId;
    }

    const category = await Category.findOne({
      where: { id, userId: clientId },
    });

    return res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.editOne = async (req, res) => {
  const { id } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Client, { model: ClientAssistant, include: Client }],
    });

    if (!user) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    let clientId = null;

    if (user.account_type === "client") {
      clientId = user.id;
    } else {
      clientId = user.clientAssistant.client.userId;
    }

    const category = await Category.findByPk(id);

    if (+category.userId !== +clientId) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    await category.update({ name: req.body.name });

    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [Client, { model: ClientAssistant, include: Client }],
    });

    if (!user) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    let clientId = null;

    if (user.account_type === "client") {
      clientId = user.id;
    } else {
      clientId = user.clientAssistant.client.userId;
    }

    const category = await Category.findByPk(id);

    if (+category.userId !== +clientId) {
      return res.status(404).json({ message: "you are not authorized" });
    }

    await category.destroy();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};
