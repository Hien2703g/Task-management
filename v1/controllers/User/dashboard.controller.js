const Task = require("../../models/task.model");
const Project = require("../../models/project.model");

module.exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id; // lấy từ middleware auth

    // Tổng số task
    const totalTasks = await Task.countDocuments({
      deleted: false,
      createdBy: userId,
    });
    // Task pending
    const pendingTasks = await Task.countDocuments({
      status: "pending",
      deleted: false,
    });
    // Task hoàn thành
    const doneTasks = await Task.countDocuments({
      status: "done",
      deleted: false,
    });
    // Productivity %
    const productivity =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    // Task distribution cho chart
    const taskDistribution = await Task.aggregate([
      {
        $match: { deleted: false },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const chartData = {
      pending: 0,
      in_progress: 0,
      done: 0,
    };
    taskDistribution.forEach((item) => {
      chartData[item._id] = item.count;
    });
    // End Tasks

    //Project.
    // Tổng số Project
    const totalProjects = await Project.countDocuments({
      deleted: false,
      $or: [{ createdBy: userId }, { listUser: userId }],
    });
    // Projects pending
    const pendingProjetcs = await Project.countDocuments({
      status: "pending",
      deleted: false,
    });
    // project của team (task assign cho user hiện tại)
    const teamProjects = await Project.countDocuments({
      listUser: userId,
      deleted: false,
    });
    // Project hoàn thành
    const doneProjects = await Project.countDocuments({
      status: "done",
      deleted: false,
    });
    // Productivity %
    const productivityProject =
      totalProjects === 0
        ? 0
        : Math.round((doneProjects / totalProjects) * 100);
    // Project distribution cho chart
    const projectDistribution = await Project.aggregate([
      {
        $match: { deleted: false },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const chartData2 = {
      pending: 0,
      in_progress: 0,
      done: 0,
    };
    projectDistribution.forEach((item) => {
      chartData2[item._id] = item.count;
    });
    // End Project
    return res.status(200).json({
      code: 200,
      tasks: {
        totalTasks,
        pendingTasks,
        productivity,
        chartData,
      },
      projects: {
        totalProjects,
        pendingProjetcs,
        teamProjects,
        productivityProject,
        chartData2,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
