export function thinkTime(minSeconds = 1, maxSeconds = 3) {
  const min = minSeconds * 1000;
  const max = maxSeconds * 1000;
  return (Math.random() * (max - min) + min) / 1000;
}
