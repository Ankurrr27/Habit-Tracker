export const getUTCStartOfDay = (date = new Date()) => {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));
};

export const getUTCEndOfDay = (date = new Date()) => {
  const start = getUTCStartOfDay(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return end;
};

export const getUTCDayKey = (date = new Date()) => {
  const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return dayMap[date.getUTCDay()];
};
