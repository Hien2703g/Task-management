const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    project_id: String,
    name: String,
    description: String,
    isActive: { type: Boolean, default: false },
    memberCount: Number,
    leader: String,
    manager: String,
    listUser: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema, "teams");

module.exports = Team;
