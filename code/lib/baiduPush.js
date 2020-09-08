/**
 * 主动推送百度蜘蛛
 * @Author: xionglin
 * @Date: 2018-08-24 10:45:48
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-08-24 16:03:23
 */

let request = require('request');

function push (links) {
  if (Array.isArray(links)) {
    links = links.join('\n');
  }
  let api = 'http://data.zz.baidu.com/urls?site=https://www.cobkl.com&token=xZwSh7sv1dfny3wy';
  request({
    method: 'POST',
    url: api,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: links
  }, (err, httpResponse, body) => {
    if (err) {
      console.error('baidu push error: ' + links + '; info: ' + err);
      return;
    }
    if (httpResponse.statusCode === 200) {
      console.log('baidu push success: ' + links + '; info: ' + body);
    } else {
      console.error('baidu push error:  ' + links + '; info: ' + body);
    }
  })
}

module.exports = push;
