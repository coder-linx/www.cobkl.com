/**
 * 页面链接地址
 * @Author: xionglin
 * @Date: 2018-06-26 16:03:38
 * @Last Modified by: xionglin
 * @Last Modified time: 2019-07-05 09:45:19
 */

module.exports = {
  host: process.env.NODE_ENV === 'production' ? 'https://www.cobkl.com' : 'http://localhost:3000',
  // CND资源
  CDN: {
    iconfont: {
      js: 'https://at.alicdn.com/t/font_769452_ens8hx4ggq.js'
    },
    jquery: {
      js: 'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js'
    },
    bootstrap: {
      css: 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css',
      js: 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js'
    },
    moment: {
      js: 'https://cdn.jsdelivr.net/combine/npm/moment@2.22.2,npm/moment@2.22.2/locale/zh-cn.min.js'
    },
    bootstrapDatetimepicker: {
      css: 'https://cdn.jsdelivr.net/npm/eonasdan-bootstrap-datetimepicker@4.17.47/build/css/bootstrap-datetimepicker.min.css',
      js: 'https://cdn.jsdelivr.net/npm/eonasdan-bootstrap-datetimepicker@4.17.47/build/js/bootstrap-datetimepicker.min.js'
    },
    bootstrapSelect: {
      css: 'https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.2/dist/css/bootstrap-select.min.css',
      js: 'https://cdn.jsdelivr.net/combine/npm/bootstrap-select@1.13.2,npm/bootstrap-select@1.13.2/js/i18n/defaults-zh_CN.min.js'
    },
    echarts: {
      js: 'https://cdn.jsdelivr.net/npm/echarts@4.2.0-rc.1/dist/echarts.min.js'
    }
  },
  // 静态文件虚拟目录
  static: '/public',
  index: '/',
  baoliao: {
    index: '/tucao',
    captcha: '/captcha'
  },
  new: {
    index: '/new'
  },
  details: {
    index: '/details',
    captcha: '/captcha',
    comment: '/comment',
    like: '/like',
    commentLike: '/comment/like'
  },
  advice: {
    index: '/advice',
    captcha: '/captcha'
  },
  about: {
    index: '/about'
  },
  search: {
    index: '/s'
  },
  admin: {
    index: '/admin',
    login: {
      index: '/login',
      captcha: '/captcha'
    },
    home: {
      index: '/index'
    },
    company: {
      index: '/company',
      // 详情
      details: '/details',
      // 编辑
      edit: '/edit',
      // 变为已读
      read: '/read',
      // 删除
      delete: '/delete',
      // 恢复
      recovery: '/recovery',
      // 添加
      add: '/add'
    }
  },
  upload: {
    index: '/upload'
  }
};
