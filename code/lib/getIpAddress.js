/**
 * 根据IP查询地址
 * @Author: xionglin
 * @Date: 2018-07-06 11:27:00
 * @Last Modified by: xionglin
 * @Last Modified time: 2019-03-19 10:49:01
 */
let request = require('request');

// 根据查询结果返回地址
function parseIpToAddress (response, body) {
  try {
    if (!response || response.statusCode !== 200) {
      return '中国';
    }
    let addrObj = JSON.parse(body);
    // 如果不存在数据
    if (addrObj.code !== 0 || !addrObj.data) {
      return '中国';
    }
    // 如果是内网ip   127.0.0.1
    if (addrObj.data.city === '内网IP') {
      return '中国';
    }
    // 如果是其他国家ip   56.23.52.41
    if (addrObj.data.region === 'XX' && addrObj.data.city === 'XX') {
      return addrObj.data.country;
    }
    // 如果是是直辖市，如北京   210.75.225.254
    if (addrObj.data.region === addrObj.data.city) {
      return addrObj.data.city + '市';
    }
    return addrObj.data.region + '省' + addrObj.data.city + '市';
  } catch (e) {
    console.error(e);
  }
  return '中国';
}

module.exports = (ip, callback) => {
  let p = new Promise((resolve, reject) => {
    // 根据ip查询地址
    request('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, { timeout: 3000 }, function (error, response, body) {
      let ipAddress;
      if (error) {
        ipAddress = '中国';
        if (!callback) {
          reject(error);
          return;
        }
      } else {
        ipAddress = parseIpToAddress(response, body);
      }
      callback && callback(error, ipAddress);
      resolve(ipAddress);
    });
  });
  return p;
};
