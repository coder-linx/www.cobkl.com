/**
 * 防止XSS攻击
 * @Author: xionglin
 * @Date: 2018-07-02 11:12:15
 * @Last Modified by: xionglin
 * @Last Modified time: 2018-07-06 10:57:31
 */

let xss = require('xss');
let myxss = new xss.FilterXSS({
  whiteList: {
    a: ['style', 'target', 'href', 'title'],
    abbr: ['style', 'title'],
    address: ['style'],
    area: ['style', 'shape', 'coords', 'href', 'alt'],
    article: ['style'],
    aside: ['style'],
    b: ['style'],
    bdi: ['style', 'dir'],
    bdo: ['style', 'dir'],
    big: ['style'],
    blockquote: ['style', 'cite'],
    br: ['style'],
    caption: ['style'],
    center: ['style'],
    cite: ['style'],
    code: ['style'],
    col: ['style', 'align', 'valign', 'span', 'width'],
    colgroup: ['style', 'align', 'valign', 'span', 'width'],
    dd: ['style'],
    del: ['style', 'datetime'],
    details: ['style', 'open'],
    div: ['style'],
    dl: ['style'],
    dt: ['style'],
    em: ['style'],
    font: ['style', 'color', 'size', 'face'],
    footer: ['style'],
    // h1: ['style'],
    // h2: ['style'],
    // h3: ['style'],
    // h4: ['style'],
    // h5: ['style'],
    // h6: ['style'],
    header: ['style'],
    hr: ['style'],
    i: ['style'],
    img: ['style', 'src', 'alt', 'title', 'width', 'height'],
    ins: ['style', 'datetime'],
    li: ['style'],
    mark: ['style'],
    nav: ['style'],
    ol: ['style'],
    p: ['style'],
    pre: ['style'],
    s: ['style'],
    section: ['style'],
    small: ['style'],
    span: ['style'],
    sub: ['style'],
    sup: ['style'],
    strong: ['style'],
    table: ['style', 'width', 'border', 'align', 'valign'],
    tbody: ['style', 'align', 'valign'],
    td: ['style', 'width', 'rowspan', 'colspan', 'align', 'valign'],
    tfoot: ['style', 'align', 'valign'],
    th: ['style', 'width', 'rowspan', 'colspan', 'align', 'valign'],
    thead: ['style', 'align', 'valign'],
    tr: ['style', 'rowspan', 'align', 'valign'],
    tt: ['style'],
    u: ['style'],
    ul: ['style']
  },
  css: {
    whiteList: {
      'font-weight': true,
      'font-size': true,
      'font-family': true,
      'font-style': true,
      'text-decoration': true,
      'text-decoration-line': true,
      'color': true,
      'background-color': true,
      'text-align': true
    }
  }
});

module.exports = (html) => {
  return myxss.process(html);
};
