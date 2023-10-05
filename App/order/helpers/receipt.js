const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const pdf = require("html-pdf");
const QRCode = require("qrcode");
const jsbarcode = require("jsbarcode");
const { Canvas } = require("canvas");

// Function to generate the PDF receipt
const generateBarcode = async (orderId) => {
  return new Promise((resolve, reject) => {
    const canvas = new Canvas();
    jsbarcode(canvas, orderId, {
      lineColor: "#000",
      width: 2,
      height: 30,
      displayValue: false,
    });
    canvas.toDataURL("image/png", (err, png) => {
      if (err) {
        reject(err);
      } else {
        resolve(png);
      }
    });
  });
};

const generateReceipt = async (order) => {
  const templatePath = path.join(__dirname, "receipt.hbs");

  const template = fs.readFileSync(templatePath, "utf8");

  const compiledTemplate = handlebars.compile(template, {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  });

  const date = new Date(order.createdAt);

  const qr = await QRCode.toString(
    `${order.id}`,
    {
      errorCorrectionLevel: "H",
      type: "svg",
    },
    function (err, data) {
      if (err) throw err;
      return data;
    }
  );

  const barcode = await generateBarcode(order.id);

  const html = compiledTemplate({
    logo: order.tenantLogo,
    id: order.id,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    client_name: order.client_name,
    client_phone: order.client_phone,
    date: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }),
    address: `${order.address}`,
    quantity: order.quantity ? order.quantity : "",
    type: order.order_type ? order.order_type : "",
    notes: order.details ? order.datails : "",
    total: order.invoice_amount.toLocaleString("en-US"),
    tenant: order.tenant,
    registration: order.registration,
    qr: qr,
    barcode,
  });

  const options = { format: "A5", phantomPath: "/usr/local/bin/phantomjs" };

  pdf
    .create(html, options)
    .toFile(`storage/receipt/receipt${order.id}.pdf`, (err, res) => {
      if (err) return console.log(err);
      return res.filename;
    });
};

module.exports = { generateReceipt };
