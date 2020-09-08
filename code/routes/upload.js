let fs = require('fs');
let express = require('express');
let router = express.Router();
let multer = require('multer');
let path = require('path');
let dateFormat = require('../lib/fn').dateFormat;

let getImagePath = function () {
  const date = new Date();
  return dateFormat(date, 'yyyyMMdd');
};

let getImageName = function () {
  const date = new Date();
  const rand = Math.floor(Math.random() * 100000) + '';
  return dateFormat(date, 'yyyyMMdd_hhmmss') + '_' + rand;
};

// 配置diskStorage来控制文件存储的位置以及文件名字等
let storage = multer.diskStorage({
  // 确定图片存储的位置
  destination: function (req, file, cb) {
    // https://www.cobkl.com/public/upload/20190705/20190705_092426_99870.jpg
    const uploadFolder = path.join(__dirname, `../public/upload/${getImagePath()}`); // 保存上传文件的目录
    try {
      fs.accessSync(uploadFolder);
    } catch (error) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder);
  },
  // 确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
  filename: function (req, file, cb) {
    // 获取文件扩展名
    let ext = path.extname(file.originalname);
    cb(null, getImageName() + ext);
  }
});

let fileFilter = function (req, file, cb) {
  // 这个函数应该调用 `cb` 用boolean值来，指示是否应接受该文件
  if (/^image\/.+$/.test(file.mimetype)) {
    // 接受这个文件，使用`true`，像这样:
    cb(null, true);
    return;
  }
  // 拒绝这个文件，使用`false`，像这样:
  cb(null, false);
};

let upload = multer({
  storage,
  fileFilter,
  // 参考文档：https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
  limits: {
    fields: 0,
    fieldSize: 0,
    // 将图片大小限制为 0.5M
    fileSize: 1 * 1024 * 1024,
    // 文件最大数量
    files: 5,
    parts: 5,
    // 键值对最大组数
    headerPairs: 5
  }
}).array('uploadImageName', 10);

router.post('/', (req, res, next) => {
  try {
    upload(req, res, function (err) {
      try {
        if (err instanceof multer.MulterError || err) {
          console.log(err);
          // 发生错误
          res.json({
            code: '120',
            desc: '图片上传失败',
            errno: 1
          });
          return;
        }
        // 根据文件绝对路径，转为相对路径
        let imgUrl = [];
        if (req.files && Array.isArray(req.files)) {
          req.files.forEach((file) => {
            imgUrl.push(('\\' + path.relative(path.join(__dirname, '../'), file.path)).replace(/\\/g, '/'));
          });
        } else if (req.file) {
          imgUrl.push(('\\' + path.relative(path.join(__dirname, '../'), req.file.path)).replace(/\\/g, '/'));
        }
        res.json({
          code: '100',
          desc: '成功',
          // errno 即错误代码，0 表示没有错误。
          //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
          errno: 0,
          // data 是一个数组，返回若干图片的线上地址
          data: imgUrl
        });
      } catch (e) {
        console.error(e);
        res.json({
          code: '120',
          desc: '图片上传失败',
          errno: 1
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.json({
      code: '120',
      desc: '图片上传失败',
      errno: 1
    });
  }
});

module.exports = router;
