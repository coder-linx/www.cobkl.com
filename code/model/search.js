/**
 * 最新吐槽数据模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-10-10 16:21:12
 */
let DBConfig = require('../db/DBConfig');
var db = require('../db/db.js');

function selectList (param, callback) {
  let p = new Promise((resolve, reject) => {
    let column = param.isSearchCity ? 'address' : 'name';
    let wd = param.isSearchCity ? param.wd : '%' + param.wd + '%';
    let sqlString = 'SELECT id, uuid, name, address, job, reason, content, agree, oppose, ipAddress, author, createtime FROM ' + DBConfig.tablePrefix + 'company WHERE isdelete = 0 AND ' + column + ' LIKE ? ORDER BY createtime DESC LIMIT ?,?';
    let connection = db.connection();
    connection.query(sqlString, [wd, param.index, param.size], (error, results, fields) => {
      callback && callback(error, results, fields);
      if (error) {
        reject(error);
        return false;
      }
      resolve(results);
    });
    db.close(connection);
  });
  return p;
}
function count (param, callback) {
  let p = new Promise((resolve, reject) => {
    let column = param.isSearchCity ? 'address' : 'name';
    let wd = param.isSearchCity ? param.wd : '%' + param.wd + '%';
    let sqlString = 'SELECT COUNT(*) as total FROM ' + DBConfig.tablePrefix + 'company WHERE isdelete = 0 AND ' + column + ' LIKE ?';
    let connection = db.connection();
    connection.query(sqlString, [wd], (error, results, fields) => {
      callback && callback(error, results, fields);
      if (error) {
        console.error(error);
        // 如果查询失败，不需要返回错误，直接返回total总数为0
        resolve([{ total: 0 }]);
        return false;
      }
      resolve(results);
    });
    db.close(connection);
  });
  return p;
}
module.exports = {
  selectList,
  count
};
