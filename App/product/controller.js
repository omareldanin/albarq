const Product = require("./model");
const User = require("../user/model");
const Client = require("../client/model");
const ClientAssistant = require("../clientAssistant/model");
const Permission = require("../permission/model");
const ProductColor = require("../productColor/model");
const ProductSize = require("../productSize/model");
const Sequelize = require("sequelize");

exports.createProduct = async (req, res) => {
  const { title, price, available, categoryId, quantity, colors } = req.body;
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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const product = await Product.create({
      title,
      price,
      available,
      categoryId,
      quantity,
      image: req.file ? req.file.filename : null,
      userId:
        user.account_type === "client"
          ? user.id
          : user.clientAssistant.client.userId,
    });

    const colorsInJson = JSON.parse(colors);

    let productColors = [];

    let sizes = [];

    colorsInJson.forEach((color) => {
      for (let i = 0; i < colorsInJson.length; i++) {
        productColors.push({
          productId: product.id,
          name: color.name,
          sizes: color.sizes,
        });
      }
    });

    const productColorRes = await ProductColor.bulkCreate(productColors);

    for (let i = 0; i < productColors.length; i++) {
      for (let j = 0; j < productColors[i].sizes.length; j++) {
        sizes.push({
          name: productColors[i].sizes[j].name,
          quantity: productColors[i].sizes[j].quantity,
          productColorId: productColorRes[i].id,
        });
      }
    }

    const productSizes = await ProductSize.bulkCreate(sizes);

    return res.status(200).json(product, productColorRes, productSizes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.getClientProducts = async (req, res) => {
  const { size, page, categoryId } = req.query;

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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let filters = {
      userId:
        user.account_type === "client"
          ? user.id
          : user.clientAssistant.client.userId,
    };

    let products = [];

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (page) {
      products = await Product.findAll({
        limit,
        offset,
        where: filters,
        attributes: [
          "id",
          "title",
          "price",
          "available",
          "quantity",
          [
            Sequelize.literal(
              `CONCAT("https://${req.get("host")}/uploads/", image)`
            ),
            "image",
          ],
        ],
        include: [{ model: ProductColor, include: ProductSize }],
      });
    } else {
      products = await Product.findAll({
        where: filters,
        attributes: [
          "id",
          "title",
          "price",
          "available",
          "quantity",
          [
            Sequelize.literal(
              `CONCAT("https://${req.get("host")}/uploads/", image)`
            ),
            "image",
          ],
        ],
        include: [{ model: ProductColor, include: ProductSize }],
      });
    }

    const count = await Product.count({ where: { ...filters } }); // Get total number of products
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count: count, pages: numOfPages, results: products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const product = await Product.findByPk(id, {
      include: [{ model: ProductColor, include: ProductSize }],
    });

    const colors = JSON.parse(req.body.colors);

    await product.update(req.body);

    colors.forEach(async (color) => {
      await ProductColor.update({ ...color }, { where: { id: color.id } });

      color.sizes.forEach(async (size) => {
        await ProductSize.update({ ...size }, { where: { id: size.id } });
      });
    });

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.addColors = async (req, res) => {
  const { productId, colors } = req.body;
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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }
    let productColors = [];

    let sizes = [];

    colors.forEach((color) => {
      for (let i = 0; i < colors.length; i++) {
        productColors.push({
          productId,
          name: color.name,
          sizes: color.sizes,
        });
      }
    });

    const productColorRes = await ProductColor.bulkCreate(productColors);

    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors[i].sizes.length; j++) {
        sizes.push({
          name: productColors[i].sizes[j].name,
          quantity: productColors[i].sizes[j].quantity,
          productColorId: productColorRes[i].id,
        });
      }
    }

    const productSizes = await ProductSize.bulkCreate(sizes);

    return res.status(200).json(productColorRes, productSizes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteColor = async (req, res) => {
  const { id } = req.params;
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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const productColor = await ProductColor.findByPk(id);

    await productColor.destroy();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteSize = async (req, res) => {
  const { id } = req.params;
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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const productSize = await ProductSize.findByPk(id);

    await productSize.destroy();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.getOneProduct = async (req, res) => {
  const { id } = req.params;
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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const product = await Product.findByPk(id, {
      attributes: [
        "id",
        "title",
        "price",
        "available",
        "quantity",
        [
          Sequelize.literal(
            `CONCAT("https://${req.get("host")}/uploads/", image)`
          ),
          "image",
        ],
      ],
      include: [{ model: ProductColor, include: ProductSize }],
    });

    return res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteOne = async (req, res) => {
  const { id } = req.params;
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

    if (user.account_type !== "client" && !user.permission.manage_product) {
      return res.status(401).json({ message: "you are not authorized" });
    }

    const product = await Product.findByPk(id);

    await product.destroy();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
