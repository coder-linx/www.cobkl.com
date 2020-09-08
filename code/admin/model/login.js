/**
 * 最新吐槽数据模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-07-26 16:13:14
 */
let DBConfig = require('../../db/DBConfig');
var db = require('../../db/db.js');

// 查询用户
function selectUser (user, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT password FROM ' + DBConfig.tablePrefix + 'admin WHERE user = ? ORDER BY id DESC LIMIT 0,1';
    let connection = db.connection();
    connection.query(sqlString, [user], (error, results, fields) => {
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
// 记录登录日志
function log (info, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'admin_log SET ?';
    let connection = db.connection();
    let project = {
      user: info.user,
      password: info.password,
      success: info.success,
      ip: info.ip,
      createtime: parseInt((new Date()).getTime() / 1000)
    };
    connection.query(sqlString, project, (error, results, fields) => {
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
module.exports = {
  selectUser,
  log
};
