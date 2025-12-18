const PRIORITY_SCORE = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * @param {Array} tasks - danh sách task từ DB
 * @param {Object} options
 * @param {number} options.startHour - giờ bắt đầu làm việc
 * @param {number} options.workHoursPerDay - số giờ làm / ngày
 */
function suggestSchedule(tasks, { startHour = 8, workHoursPerDay = 8 } = {}) {
  const END_HOUR = startHour + workHoursPerDay;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // SORT TASK
  tasks.sort((a, b) => {
    // Ưu tiên task đang làm
    if (a.status === "doing" && b.status !== "doing") return -1;
    if (a.status !== "doing" && b.status === "doing") return 1;

    // Deadline gần trước
    if (a.timeFinish && b.timeFinish) {
      const diff = new Date(a.timeFinish) - new Date(b.timeFinish);
      if (diff !== 0) return diff;
    }

    // Priority cao trước
    return (
      (PRIORITY_SCORE[b.priority] || 0) - (PRIORITY_SCORE[a.priority] || 0)
    );
  });

  let schedule = [];
  let currentDate = new Date(today);
  let currentHour = startHour;

  for (const task of tasks) {
    let remaining = task.estimatedHours || 1;

    while (remaining > 0) {
      // Hết giờ làm → sang ngày mới
      if (currentHour >= END_HOUR) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentHour = startHour;
      }

      const freeHours = END_HOUR - currentHour;
      const usedHours = Math.min(freeHours, remaining);

      const start = new Date(currentDate);
      start.setHours(currentHour, 0, 0, 0);

      const end = new Date(start);
      end.setHours(end.getHours() + usedHours);

      schedule.push({
        taskId: task._id,
        title: task.title,
        date: start.toISOString().slice(0, 10),
        startTime: start,
        endTime: end,
      });

      currentHour += usedHours;
      remaining -= usedHours;
    }
  }

  return schedule;
}

module.exports = {
  suggestSchedule,
};
