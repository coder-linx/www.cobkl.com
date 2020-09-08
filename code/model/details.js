/**
 * 详情页数据模型
 * @Author: xionglin
 * @Date: 2018-07-02 11:23:09
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-10-09 14:31:47
 */
let DBConfig = require('../db/DBConfig');
var db = require('../db/db.js');

// 查询详情
function selectDetails (id, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT id, uuid, name, address, job, reason, content, agree, oppose, ipAddress, author, createtime FROM ' + DBConfig.tablePrefix + 'company WHERE id = ? AND isdelete = 0';
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

// 查询详情
function selectDetailsByUuid (uuid, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT id, uuid, name, address, job, reason, content, agree, oppose, ipAddress, author, createtime FROM ' + DBConfig.tablePrefix + 'company WHERE uuid = ? AND isdelete = 0';
    let connection = db.connection();
    connection.query(sqlString, [uuid], (error, results, fields) => {
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

// 添加评论
function insertComment (param, callback) {
  let p = new Promise((resolve, reject) => {
    let project = {
      companyid: param.id,
      content: param.comment,
      ip: param.ip,
      city: param.ipAddress,
      createtime: parseInt((new Date()).getTime() / 1000)
    };
    let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'comment SET ?';
    let connection = db.connection();
    connection.query(sqlString, project, function (error, results, fields) {
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

// 文章查询评论
function selectComment (id, index, size, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT id, content, city, agree, oppose, createtime FROM ' + DBConfig.tablePrefix + 'comment WHERE isdelete = 0 AND companyid = ? ORDER BY createtime DESC LIMIT ?,?';
    let connection = db.connection();
    connection.query(sqlString, [id, index, size], (error, results, fields) => {
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

// 查询评论总条数
function countComment (id, callback) {
  let p = new Promise((resolve, reject) => {
    let sqlString = 'SELECT COUNT(*) as total FROM ' + DBConfig.tablePrefix + 'comment WHERE isdelete = 0 AND companyid = ?';
    let connection = db.connection();
    connection.query(sqlString, [id], (error, results, fields) => {
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

// 查询是否对文章点过赞
function selectLikeDetailsData (param, callback) {
  let sqlString = 'SELECT id FROM ' + DBConfig.tablePrefix + 'company_like_data WHERE companyid = ? AND ip=? AND data=?';
  let connection = db.connection();
  connection.query(sqlString, [param.id, param.ip, param.data], (error, results, fields) => {
    callback && callback(error, results, fields);
  });
  db.close(connection);
}

// 文章点赞
function likeDetails (param, callback) {
  let project = {
    companyid: param.id,
    ip: param.ip,
    data: param.data,
    createtime: parseInt((new Date()).getTime() / 1000)
  };
  let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'company_like_data SET ?';
  let connection = db.connection();
  connection.query(sqlString, project, function (error, results, fields) {
    if (error) {
      callback && callback(error, results, fields);
      return false;
    }
    let sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET agree=agree+1 WHERE id = ?';
    if (param.data === 0) {
      sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'company SET oppose=oppose+1 WHERE id = ?';
    }
    let connection = db.connection();
    connection.query(sqlString, [param.id], function (error, results, fields) {
      callback && callback(error, results, fields);
    });
    db.close(connection);
  });
  db.close(connection);
}

// 查询是否对评论点过赞
function selectLikeCommentData (param, callback) {
  let sqlString = 'SELECT id FROM ' + DBConfig.tablePrefix + 'comment_like_data WHERE commentid = ? AND ip=? AND data=?';
  let connection = db.connection();
  connection.query(sqlString, [param.id, param.ip, param.data], (error, results, fields) => {
    callback && callback(error, results, fields);
  });
  db.close(connection);
}

// 评论点赞
function likeComment (param, callback) {
  let project = {
    commentid: param.id,
    ip: param.ip,
    data: param.data,
    createtime: parseInt((new Date()).getTime() / 1000)
  };
  let sqlString = 'INSERT INTO ' + DBConfig.tablePrefix + 'comment_like_data SET ?';
  let connection = db.connection();
  connection.query(sqlString, project, function (error, results, fields) {
    if (error) {
      callback && callback(error, results, fields);
      return false;
    }
    let sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'comment SET agree=agree+1 WHERE id = ?';
    if (param.data === 0) {
      sqlString = 'UPDATE ' + DBConfig.tablePrefix + 'comment SET oppose=oppose+1 WHERE id = ?';
    }
    let connection = db.connection();
    connection.query(sqlString, [param.id], function (error, results, fields) {
      callback && callback(error, results, fields);
    });
    db.close(connection);
  });
  db.close(connection);
}

module.exports = {
  selectDetails,
  selectDetailsByUuid,
  likeDetails,
  selectLikeDetailsData,
  insertComment,
  selectComment,
  countComment,
  selectLikeCommentData,
  likeComment
};
