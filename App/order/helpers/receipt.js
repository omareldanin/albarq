const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Function to generate the PDF receipt
const generateReceipt = async (order, tenant, host) => {
  const doc = new PDFDocument();

  // Set the output path for the PDF
  const outputPath = path.join("storage/receipt", `receipt${order.id}.pdf`);
  const stream = fs.createWriteStream(outputPath);

  doc.pipe(stream);

  // Add content to the PDF
  doc.image(`http://${host}:3000/uploads/${tenant.logo}`, 50, 50, {
    width: 100,
  }); // Add logo at position (50, 50) with width of 100
  -p;
  doc.fontSize(18).text("Order Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order.id}`);
  doc.moveDown();
  doc.fontSize(12).text(`Customer Name: ${order.recipient_name}`);
  doc.moveDown();
  doc.fontSize(12).text(`Total Amount: $${order.invoice_amount}`);

  doc.end();

  // Return the output path of the generated PDF
  return `receipt${order.id}.pdf`;
};

module.exports = { generateReceipt };
