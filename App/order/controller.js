const Branch = require("../branch/model");
const Repository = require("../repository/model");
const Tenant = require("../tenant/model");
const Client = require("../client/model");
const User = require("../user/model");
const Order = require("./model");
const Region = require("../region/model");
const sequelize = require("sequelize");
const { generateReceipt, deleteFile } = require("./helpers/receipt");

const status = [
  "تم تسجيل الطلب",
  "جاهز للارسال",
  "بالطريق مع المندوب",
  "تم تسليم الطلب",
  "استبدال الطلب",
  "راجع جزئى",
  "راجع كلي",
  "مؤجل",
  "تغيير العنوان",
  "اعاده الارسال",
  "عند مندوب الاستلام",
  "قيد المعالجه",
];

exports.createOrderByClient = async (req, res) => {
  const { orders } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const client = await User.findOne({
      where: { token },
      include: [Tenant, Client],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!client) {
      return res.status(404).json({ message: "not found" });
    }

    const ordersData = await Promise.all(
      orders.map(async (order) => {
        let delivery_amount = 0;

        if (order.government === "بغداد") {
          delivery_amount = client.tenant.baghdad_price;
        } else {
          delivery_amount = client.tenant.governments_price;
        }

        let branch = await Branch.findOne({
          where: { governmentId: order.governmentId },
        });

        return {
          ...order,
          delivery_amount,
          tenantId: client.tenantId,
          clientId: client.client.id,
          branchId: branch ? branch.id : null,
        };
      })
    );

    let results = await Order.bulkCreate(ordersData);

    results = await Promise.all(
      results.map(async (order) => {
        const receiptPath = await generateReceipt(
          order,
          client.tenant,
          req.host
        );

        await Order.update(
          { receipt: "/storage/receipt" + receiptPath },
          { where: { id: order.id } }
        );

        return {
          ...order.toJSON(),
          receipt: "/storage/receipt" + receiptPath,
        };
      })
    );

    return res.status(201).json({ success: true, results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.getClientNumbers = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const client = await User.findOne({
      where: { token },
      include: [Tenant, Client],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!client) {
      return res.status(404).json({ message: "not found" });
    }

    const result = await Order.findAll({
      attributes: [
        [sequelize.literal("SUM(invoice_amount - delivery_amount)"), "total"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        clientId: client.client.id,
        status: { [sequelize.Op.not]: "تم تسليم الطلب" },
      },
    });

    const numbers = await Order.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      where: {
        clientId: client.client.id,
      },
    });

    status.forEach((state) => {
      const indexOfStatus = numbers.indexOf(
        (number) => number.status === state
      );

      if (indexOfStatus < 0) {
        numbers.push({
          status: state,
          count: 0,
        });
      }
    });

    return res.status(200).json({ currentProcesses: result, numbers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.getClientOrders = async (req, res) => {
  const { status, size, page } = req.query;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const client = await User.findOne({
      where: { token },
      include: [Tenant, Client],
      attributes: { exclude: ["password"] }, // exclude password from response
    });

    if (!client) {
      return res.status(404).json({ message: "not found" });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    let orders = null;

    if (page) {
      orders = await Order.findAll({
        limit,
        offset,
        where: {
          clientId: client.client.id,
        },
      });
    } else {
      orders = await Order.findAll({
        where: {
          clientId: client.client.id,
        },
      });
    }

    const count = await Product.count({ where: { ...filters } }); // Get total number of products
    const numOfPages = Math.ceil(count / limit); // Calculate number of pages

    return res
      .status(200)
      .json({ count: count, pages: numOfPages, results: orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

exports.createReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    // Generate the PDF receipt
    const receiptPath = await generateReceipt(order);

    // Return the download link to the client
    res.json({
      receiptLink: `http://${req.host}/storage/receipt/${receiptPath}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
