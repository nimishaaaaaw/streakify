const calculateStreak = (
  frequency,
  lastCompletedDate,
  currentStreak,
  longestStreak,
  today
) => {
  let isSamePeriod = false;
  let isPreviousPeriod = false;

  const normalize = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  if (!lastCompletedDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      lastCompletedDate: today,
    };
  }

  const lastDate = normalize(lastCompletedDate);
  today = normalize(today);

  // ================= DAILY =================
  if (frequency === "daily") {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    isSamePeriod = lastDate.getTime() === today.getTime();
    isPreviousPeriod = lastDate.getTime() === yesterday.getTime();
  }

  // ================= WEEKLY =================
  if (frequency === "weekly") {
    const getWeek = (date) => {
      const firstDay = new Date(date.getFullYear(), 0, 1);
      return Math.ceil(
        ((date - firstDay) / 86400000 + firstDay.getDay() + 1) / 7
      );
    };

    const currentWeek = getWeek(today);
    const lastWeek = getWeek(lastDate);

    isSamePeriod =
      currentWeek === lastWeek &&
      today.getFullYear() === lastDate.getFullYear();

    isPreviousPeriod =
      currentWeek - lastWeek === 1 &&
      today.getFullYear() === lastDate.getFullYear();
  }

  // ================= MONTHLY =================
  if (frequency === "monthly") {
    isSamePeriod =
      today.getMonth() === lastDate.getMonth() &&
      today.getFullYear() === lastDate.getFullYear();

    const previousMonth =
      today.getMonth() === 0 ? 11 : today.getMonth() - 1;

    const previousYear =
      today.getMonth() === 0
        ? today.getFullYear() - 1
        : today.getFullYear();

    isPreviousPeriod =
      lastDate.getMonth() === previousMonth &&
      lastDate.getFullYear() === previousYear;
  }

  // ================= STREAK LOGIC =================
  if (isSamePeriod) {
    return {
      currentStreak,
      longestStreak,
      lastCompletedDate,
    };
  }

  if (isPreviousPeriod) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }

  longestStreak = Math.max(currentStreak, longestStreak);

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate: today,
  };
};

module.exports = { calculateStreak };