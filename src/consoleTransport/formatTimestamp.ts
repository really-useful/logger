/** ISO-8601 style timestamp formatting */
export default function formatTimestamp(useUtc: boolean, date = new Date()) {
  const [yr, mo, day, hr, min, sec, milli] = (useUtc && [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  ]) || [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];

  const yrStr = yr.toString();
  const moStr = mo.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const hrStr = hr.toString().padStart(2, '0');
  const minStr = min.toString().padStart(2, '0');
  const secStr = sec.toString().padStart(2, '0');
  const milliStr = milli.toString().padStart(3, '0');

  let result = `${yrStr}-${moStr}-${dayStr} ${hrStr}:${minStr}:${secStr}.${milliStr}`;

  return result;
}
