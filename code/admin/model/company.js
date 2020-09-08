/**
 * 最新吐槽数据模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-10-09 10:39:21
 */
let DBConfig = require('../../db/DBConfig');
let db = require('../../db/db.js');
let ids = require('../../config/secret').ids;
let Hashids = require('hashids');

function selectList (index, size, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT id, name, address, job, reason, content, agree, oppose, ipAddress, author, createtime, isread, isdelete FROM ' + DBConfig.tablePrefix + 'company ORDER BY createtime DESC LIMIT ?,?';
    let connection = db.connection();
    connection.query(sqlString, [index, size], (error, results, fields) => {
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

// 查询总数
function count (callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT COUNT(*) as total FROM ' + DBConfig.tablePrefix + 'company';
    let connection = db.connection();
    connection.query(sqlString, (error, results, fields) => {
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

// 编辑吐槽
function updateCompany (id, data, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET ? WHERE id = ?';
    let connection = db.connection();
    connection.query(sqlString, [data, id], (error, results, fields) => {
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

// 新增吐槽
function appendCompany (data, callback) {
  let hashids = new Hashids(ids);
  let time = Date.now();
  data.uuid = hashids.encode(time);
  data.createtime = parseInt(time / 1000);
  let p = new Promise((resolve, reject) => {
    let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'company SET ?';
    let connection = db.connection();
    connection.query(sqlString, data, (error, results, fields) => {
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

// 查询详情
function selectDetails (id, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT * FROM ' + DBConfig.tablePrefix + 'company WHERE id = ?';
    let connection = db.connection();
    connection.query(sqlString, [id], (error, results, fields) => {
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

// 删除吐槽
function deleteCompany (id, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET isdelete=1 WHERE id = ?';
    let connection = db.connection();
    if (Array.isArray(id)) {
      sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET isdelete=1 WHERE id in (?)';
    }
    connection.query(sqlString, [id], (error, results, fields) => {
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

// 恢复吐槽
function recoveryCompany (id, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET isdelete=0 WHERE id = ?';
    let connection = db.connection();
    if (Array.isArray(id)) {
      sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET isdelete=0 WHERE id in (?)';
    }
    connection.query(sqlString, [id], (error, results, fields) => {
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

// 将数据变为已读
function readCompany (id, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET isread=1 WHERE id = ?';
    let connection = db.connection();
    if (Array.isArray(id)) {
      sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET isread=1 WHERE id in (?)';
    }
    connection.query(sqlString, [id], (error, results, fields) => {
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
  selectList,
  selectDetails,
  deleteCompany,
  recoveryCompany,
  readCompany,
  updateCompany,
  appendCompany,
  count
};
