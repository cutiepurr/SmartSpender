const getPreviousMonth = (year, month) => {
  if (month === 1) {
    month = 12;
    year--;
  } else month--;
  return [year, month];
};

const getNextMonth = (year, month) => {
  if (month === 12) {
    month = 1;
    year++;
  } else month++;
  return [year, month];
};

const getDatePreviousMonth = (date) => {
  var month = date.getMonth();
  var year = date.getFullYear();

  [year, month] = getPreviousMonth(year, month+1);
  return new Date(year, month-1);
};

const getDateNextMonth = (date) => {
  var month = date.getMonth();
  var year = date.getFullYear();

  [year, month] = getNextMonth(year, month+1);
  return new Date(year, month-1);
};

/**
 * Convert date to the format suitable to input type="datetime-local"
 * @param {Date} date 
 */
const toDatetimeLocalInputDate = (date) => {
  if (date.toString() === "Invalid Date") return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export {
    getPreviousMonth,
    getNextMonth,
    toDatetimeLocalInputDate,
    getDatePreviousMonth,
    getDateNextMonth,
};