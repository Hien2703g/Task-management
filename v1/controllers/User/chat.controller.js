const { connect } = require("mongoose");
const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../Socket/chat.socket");
//[GET]/chat/
// module.exports.index = async (req, res) => {
//   //SocketIO
//   chatSocket(res);
//   //End SocketIO

//   //Lấy data từ database
//   const chats = await Chat.find({
//     deleted: false,
//   });
//   for (const chat of chats) {
//     const infoUser = await User.findOne({
//       _id: chat.user_id,
//     }).select("fullName");
//     chat.infoUser = infoUser;
//     // console.log(infoUser.fullName);
//   }

//   // console.log(chats);
//   //Lấy hết database
//   return res.status(200).json({
//     code: 200,
//     message: "success",
//   });
// };

// [GET]/chat/
module.exports.index = async (req, res) => {
  const userId = req.user.id;
  //SocketIO
  _io.once("connetion", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      //Luu
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      await chat.save();
    });
  });
  //End SocketIO

  //Lấy data từ database
  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
    // console.log(infoUser.fullName);
  }

  // console.log(chats);
  //Lấy hết database
  return res.status(200).json({
    code: 200,
    message: "success",
  });
};
