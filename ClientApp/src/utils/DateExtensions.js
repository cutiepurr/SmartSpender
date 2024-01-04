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

/**
 * Convert date to the format suitable to input type="datetime-local"
 * @param {Date} date 
 */
const toDatetimeLocalInputDate = (date) => {
  if (date.toString() === "Invalid Date") return null;
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export {
    getPreviousMonth,
    getNextMonth,
    toDatetimeLocalInputDate,
};