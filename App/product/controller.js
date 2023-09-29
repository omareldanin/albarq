const Product = require("./model");
const jwt = require("jsonwebtoken");
const User = require("../user/model");
const Client = require("../client/model");
const ClientAssistant = require("../clientAssistant/model");
const Permission = require("../permission/model");

exports.createProduct = async (req, res) => {
  const { title, price, available, quantity, colors, sizes } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const user = await User.findOne({
      where: { token },
      include: [
        Permission,
        Client,
        { model: ClientAssistant, include: Client },
      ],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
