const HOUR = 60 * 60;
const MINUTE = 60;

const twoChar = (number: number): string =>
  Math.floor(number).toString().length === 1
    ? `0${Math.floor(number)}`
    : `${Math.floor(number)}`;

export const toTimeView = (sec: number) => {
  let secLeft = sec;
  const hr = Math.floor(sec / HOUR);
  secLeft = secLeft - hr * HOUR;
  const minute = Math.floor(secLeft / MINUTE);
  secLeft = secLeft - minute * MINUTE;
  if (hr && minute) {
    return `${hr}:${twoChar(minute)}:${twoChar(secLeft)}`;
  }
  if (hr && !minute) {
    return `${hr}:00:${twoChar(secLeft)}`;
  }
  if (minute) {
    return `${minute}:${twoChar(secLeft)}`;
  }
  return `0:${twoChar(secLeft)}`;
};
