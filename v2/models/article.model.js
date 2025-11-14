const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema(
  {
    account_id: String,
    title: String,
    content: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    position: Number,
    deletedAt: Date,
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema, "article");

module.exports = Article;
