/**
 * 意见建议模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-07-10 10:44:08
 */
let DBConfig = require('../db/DBConfig');
var db = require('../db/db.js');

function appendAdvice (param, callback) {
  let project = {
    content: param.content,
    contact: param.contact,
    ip: param.ip,
    ipAddress: param.ipAddress,
    createtime: parseInt((new Date()).getTime() / 1000)
  };
  let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'advice SET ?';
  let connection = db.connection();
  connection.query(sqlString, project, function (error, results, fields) {
    callback && callback(error, results, fields);
  });
  db.close(connection);
}

module.exports = {
  appendAdvice
};
