const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user_id: String,
    userName: String,
    comment: String,
    project_id: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema, "comment");
module.exports = Comment;
