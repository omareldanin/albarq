const Notification = require("./model");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const { Op } = require("sequelize");
// const serviceAccount = require("../talabatek-firebase.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// exports.sendNotification = async (req, res) => {
//   const { title, description, topic, usersIds } = req.body;

//   try {
//     const messaging = admin.messaging();

//     if (topic) {
//       const users = await User.findAll({ where: { role: topic } });

//       await messaging.send({
//         notification: {
//           title: title,
//           body: description,
//         },
//         topic: topic,
//       });

//       const notification = [];

//       users.forEach(async (user) => {
//         notification.push({
//           userId: user.id,
//           title,
//           description,
//         });
//       });

//       await Notification.bulkCreate(notification);
//     } else {
//       const users = await User.findAll({
//         where: { id: { [Op.in]: usersIds } },
//       });

//       const notification = [];

//       let fcms = [];

//       users.forEach(async (user) => {
//         notification.push({
//           userId: user.id,
//           title,
//           description,
//         });
//         if (user.fcm) {
//           fcms.push(user.fcm);
//         }
//       });

//       await Notification.bulkCreate(notification);

//       await messaging.subscribeToTopic(fcms, "custom");

//       await messaging.send({
//         notification: {
//           title: title,
//           body: description,
//         },
//         topic: "custom",
//       });

//       await messaging.unsubscribeFromTopic(fcmTokens, "custom");
//     }

//     return res.status(200).json({ message: "success" });
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

exports.getUserNotification = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const decodedToken = jwt.verify(token, "albarq334533?/sdsd/.987654rfw2");

    if (!decodedToken.userId) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const notifications = await Notification.findAll({
      where: {
        userId: decodedToken.userId,
      },
      order: [["createdAt", "DESC"]],
    });

    const results = notifications.map((notification) => {
      const timeAgo = moment(notification.createdAt).fromNow();
      return { ...notification.toJSON(), timeAgo };
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid token" });
  }
};

exports.makeAllSeen = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const decodedToken = jwt.verify(token, "albarq334533?/sdsd/.987654rfw2");

    if (!decodedToken.userId) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    await Notification.update(
      { seen: true },
      {
        where: {
          userId: decodedToken.userId,
          seen: false,
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid token" });
  }
};

exports.makeOneSeen = async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization.split(" ")[1]; // get token from Authorization header

    const decodedToken = jwt.verify(token, "albarq334533?/sdsd/.987654rfw2");

    if (!decodedToken.userId) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    await Notification.update(
      { seen: true },
      {
        where: {
          userId: decodedToken.userId,
          id,
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid token" });
  }
};
