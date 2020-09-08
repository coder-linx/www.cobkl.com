/**
 * 工具函数
 * @Author: xionglin
 * @Date: 2018-07-04 12:06:29
 * @Last Modified by: xionglin
 * @Last Modified time: 2019-03-19 10:26:45
 */

let fn = {
  /**
   * 格式化日期
   * @param date 日期对象 | Unix时间戳  毫秒单位
   * @param fmt  yyyy-MM-dd hh:mm:ss
   **/
  dateFormat (date, fmt) {
    if (typeof date === 'number') {
      date = new Date(date);
    }
    var o = {
      // 月份
      'M+': date.getMonth() + 1,
      // 日
      'd+': date.getDate(),
      // 小时
      'h+': date.getHours(),
      // 分
      'm+': date.getMinutes(),
      // 秒
      's+': date.getSeconds(),
      // 季度
      'q+': Math.floor((date.getMonth() + 3) / 3),
      // 毫秒
      'S': date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  },
  filterHTMLTag (msg) {
    msg = msg.replace(/<\/?[^>]*>/g, ''); // 去除HTML Tag
    msg = msg.trim(); // 去除行尾空格
    return msg;
  },
  /**
   * 将日期显示为 N 之前
   * 如 1小时之前，1天之前，1周之前，1月之前
   * @param timestamp <number> Unix时间戳
   * @param rules <array> 规则参数，如 [ {min: 60s, text: '1分钟之前'}, {min: 60 * 60s, text: '1小时之前'} ]
   */
  dateFormatBeforeN (timestamp, rules) {
    const now = parseInt(Date.now() / 1000);
    const diff = Math.abs(now - timestamp);
    const defaultRules = [
      { min: 3 * 12 * 31 * 24 * 60 * 60, text: '3年之前' },
      { min: 2 * 12 * 31 * 24 * 60 * 60, text: '2年之前' },
      { min: 12 * 31 * 24 * 60 * 60, text: '1年之前' },
      { min: 8 * 31 * 24 * 60 * 60, text: '8个月之前' },
      { min: 4 * 31 * 24 * 60 * 60, text: '4个月之前' },
      { min: 2 * 31 * 24 * 60 * 60, text: '2个月之前' },
      { min: 31 * 24 * 60 * 60, text: '1个月之前' },
      { min: 20 * 24 * 60 * 60, text: '20天之前' },
      { min: 10 * 24 * 60 * 60, text: '10天之前' },
      { min: 5 * 24 * 60 * 60, text: '5天之前' },
      { min: 2 * 24 * 60 * 60, text: '2天之前' },
      { min: 24 * 60 * 60, text: '1天之前' },
      { min: 10 * 60 * 60, text: '10小时之前' },
      { min: 5 * 60 * 60, text: '5小时之前' },
      { min: 2 * 60 * 60, text: '2小时之前' },
      { min: 60 * 60, text: '1小时之前' },
      { min: 30 * 60, text: '30分钟之前' },
      { min: 10 * 60, text: '10分钟之前' },
      { min: 60, text: '1分钟之前' },
      { min: 0, text: '1秒钟之前' }
    ];

    if (!rules) {
      rules = defaultRules;
    }
    try {
      const result = rules.find((rule) => {
        if (diff > rule.min) {
          return true;
        }
      });
      if (result) {
        return result.text;
      }
      return '1秒钟之前';
    } catch (e) {
      return '1年之前'
    }
  }
};

module.exports = fn;
