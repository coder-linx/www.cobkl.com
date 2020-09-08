/**
 * 吐槽数据模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-10-09 10:34:25
 */
let DBConfig = require('../db/DBConfig');
let db = require('../db/db.js');
let ids = require('../config/secret').ids;
let Hashids = require('hashids');

function appendCompany (param, callback) {
  let hashids = new Hashids(ids);
  let time = Date.now();
  let project = {
    uuid: hashids.encode(time),
    name: param.name,
    address: param.address,
    job: param.job,
    contact: param.contact,
    reason: param.reason,
    content: param.content,
    ip: param.ip,
    ipAddress: param.ipAddress,
    createtime: parseInt(time / 1000)
  };
  let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'company SET ?';
  let connection = db.connection();
  connection.query(sqlString, project, function (error, results, fields) {
    callback && callback(error, results, fields);
  });
  db.close(connection);
}

module.exports = {
  appendCompany
};
