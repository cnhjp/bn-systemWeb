/**
 * 设置浏览器title
 * @param {string} title - title
 */
export function changePageTitle(title) {
  document.title = title;
}

/**
 * 生成指定最小值和最大值之间的随机整数。
 * @param {number} min - 最小值（包含）。
 * @param {number} max - 最大值（不包含）。
 * @returns {number} 介于 min（包含）和 max（不包含）之间的随机整数。
 */
export function generateRandom(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

/**
 * 生成请求标识
 * 格式：origin+system+timestamp+n+(六位随机数)
 * origin：w:网页端,m:移动端,i:internal
 * system：c=client,t=tenant,s=sa,a=activeScreen,d=dataScreen,u=unknown
 */
export function generateRequestId() {
  const origin = "w";
  const system = "t";
  const date = new Date();
  const timestamp = date.format("yyyyMMddHHmmss") + date.getMilliseconds();
  const random = generateRandom(100000, 1000000);
  return `${origin}${system}${timestamp}n${random}`;
}
