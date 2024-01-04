const getPreviousMonth = (year, month) => {
  if (month == 1) {
    month = 12;
    year--;
  } else month--;
  return [year, month];
};

const getNextMonth = (year, month) => {
  if (month == 12) {
    month = 1;
    year++;
  } else month++;
  return [year, month];
};

export {
    getPreviousMonth,
    getNextMonth
};