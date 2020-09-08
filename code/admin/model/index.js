/**
 * 最新吐槽数据模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-08-01 15:47:13
 */
let DBConfig = require('../../db/DBConfig');
var db = require('../../db/db.js');

// 查询最新吐槽
function selectNewCompany (callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT id, name, address, reason, content, ipAddress, createtime FROM ' + DBConfig.tablePrefix + 'company WHERE isread=0 ORDER BY createtime DESC LIMIT 0,10';
    let connection = db.connection();
    connection.query(sqlString, (error, results, fields) => {
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

// 查询最新评论
function selectNewComment (callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT a.id AS id, a.content, companyid, b.name AS company, city as ipAddress, a.createtime as createtime FROM ' + DBConfig.tablePrefix + 'comment a INNER JOIN ' + DBConfig.tablePrefix + 'company b ON a.companyid = b.id WHERE a.isread=0 ORDER BY a.createtime DESC LIMIT 0,10';
    let connection = db.connection();
    connection.query(sqlString, (error, results, fields) => {
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
  selectNewCompany,
  selectNewComment
};
