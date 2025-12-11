const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    position_job: String,
    role: {
      type: String,
      default: "USER", // Mặc định là USER. Muốn có tài khoản MANAGER thì do admin cấp.
    },

    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    requestFriends: Array, // Lời mời đã gửi
    acceptFriends: Array, // Lời mời đã nhận
    friendList: [
      // danh sách bạn bè
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
    statusOnline: String,
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
