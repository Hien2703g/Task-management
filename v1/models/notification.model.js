const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    User_id: String, // Người nhận
    Sender_id: String, // Người gửi
    title: String,
    message: String,
    type: String,
    readed: {
      type: Boolean,
      default: false,
    },
    URL: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
  "notifications"
);

module.exports = Notification;
