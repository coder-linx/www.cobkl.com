/**
 * 模版过滤器
 * @Author: xionglin
 * @Date: 2018-07-04 11:37:47
 * @Last Modified by: xionglin
 * @Last Modified time: 2019-03-19 10:18:51
 */

let fn = require('./fn');
let artTemplate = require('express-art-template');

artTemplate.template.defaults.imports.dateFormat = (date, format) => {
  return fn.dateFormat(date, format);
};
artTemplate.template.defaults.imports.timestamp = (value) => {
  return value * 1000
};
artTemplate.template.defaults.imports.filterHTMLTag = fn.filterHTMLTag;
/**
 * 分页函数
 * @param total   总页数
 * @param pageNo  页数
 * @param pageSize  每页显示记录数
 * @param url  页面url前缀地址
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
 **/
artTemplate.template.defaults.imports.pagination = (total, pageNo, pageSize, url) => {
  // 总共分几页
  let totalPage = Math.ceil(total / pageSize);
  let tempStr = '';

  if (pageNo > 1) {
    tempStr += `<li>
      <a href="${url + '/' + '1'}" aria-label="Previous" title="首页">
        <span aria-hidden="true">首页</span>
      </a>
    </li>`;
    tempStr += `<li class="prev">
      <a href="${url + '/' + (pageNo - 1)}" aria-label="Previous" title="上一页">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;
  } else {
    tempStr += '<li><span aria-hidden="true">首页</span></li>';
    tempStr += '<li class="prev"><span aria-hidden="true">&laquo;</span></li>';
  }

  if (totalPage > 5) {
    if (pageNo <= 3) {
      for (let pageIndex = 1; pageIndex < 5 + 1; pageIndex++) {
        if (pageNo === pageIndex) {
          tempStr += '<li class="active"><a href="javascript:;">' + pageIndex + '</a></li>';
        } else {
          tempStr += '<li><a href="' + url + '/' + pageIndex + '">' + pageIndex + '</a></li>';
        }
      }
      tempStr += '<li class="hidden-xs"><span aria-hidden="true">…</span></li>';
    } else if (pageNo > 3 && pageNo <= totalPage - 3) {
      tempStr += '<li class="hidden-xs"><span aria-hidden="true">…</span></li>';
      for (let pageIndex = pageNo - 2; pageIndex < pageNo + 3; pageIndex++) {
        if (pageNo === pageIndex) {
          tempStr += '<li class="active"><a href="javascript:;">' + pageIndex + '</a></li>';
        } else {
          tempStr += '<li><a href="' + url + '/' + pageIndex + '">' + pageIndex + '</a></li>';
        }
      }
      tempStr += '<li class="hidden-xs"><span aria-hidden="true">…</span></li>';
    } else {
      tempStr += '<li class="hidden-xs"><span aria-hidden="true">…</span></li>';
      for (let pageIndex = totalPage - 4; pageIndex < totalPage + 1; pageIndex++) {
        if (pageNo === pageIndex) {
          tempStr += '<li class="active"><a href="javascript:;">' + pageIndex + '</a></li>';
        } else {
          tempStr += '<li><a href="' + url + '/' + pageIndex + '">' + pageIndex + '</a></li>';
        }
      }
    }
  } else {
    for (let pageIndex = 1; pageIndex < totalPage + 1; pageIndex++) {
      if (pageNo === pageIndex) {
        tempStr += '<li class="active"><a href="javascript:;">' + pageIndex + '</a></li>';
      } else {
        tempStr += '<li><a href="' + url + '/' + pageIndex + '">' + pageIndex + '</a></li>';
      }
    }
  }

  if (pageNo < totalPage) {
    tempStr += `<li class="next">
      <a href="${url + '/' + (pageNo + 1)}" aria-label="Next" title="下一页">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
    tempStr += `<li>
      <a href="${url + '/' + totalPage}" aria-label="Next" title="尾页">
        <span aria-hidden="true">尾页</span>
      </a>
    </li>`;
  } else {
    tempStr += '<li class="next"><span aria-hidden="true">&raquo;</span></li>';
    tempStr += '<li><span aria-hidden="true">尾页</span></li>';
  }

  return tempStr;
}

artTemplate.template.defaults.imports.floorFormat = (floorIndex) => {
  var floor = ['沙发', '板凳', '地板', '地下室', '下水道', '地下城市', '地核', '地心', '9重天'];
  if (floor[floorIndex]) {
    return floor[floorIndex];
  }
  return (floorIndex + 1) + ' #';
};

/**
 * 超过字符显示省略号
 * @param {String} content 截取内容
 * @param {Number} size 截取长度
 */
artTemplate.template.defaults.imports.ell = (content, size = 100) => {
  if (content.length > size) {
    return content.substring(0, size) + '...';
  }
  return content;
};
/**
 * 将日期显示为 N 之前
 * 如 1小时之前，1天之前，1周之前，1月之前
 * @param timestamp <number> Unix时间戳 秒为单位
 * @param rules <array> 规则参数，如 [ {min: 60s, text: '1分钟之前'}, {min: 60 * 60s, text: '1小时之前'} ]
 */
artTemplate.template.defaults.imports.dateFormatBeforeN = (timestamp, rules) => {
  return fn.dateFormatBeforeN(timestamp, rules);
}

module.exports = artTemplate;
