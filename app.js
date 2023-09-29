const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const cors = require("cors");
const http = require("http");
//-------settings-----------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

const server = http.createServer(app);

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(upload.single("image"));

app.use("/uploads", express.static("uploads"));

app.options("*", cors()); // include before other routes

app.use(cors());

require("./routes/index.js")(app);

sequelize
  .sync()
  .then((result) => {
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
