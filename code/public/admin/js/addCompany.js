!function(a){for(var t="",e=window.cityList,o=0;o<e.length;o++){var i=e[o];t+='<option value="'+i+'">'+i+"</option>"}var n=a("#js_city_select").html(t).selectpicker("render");n.selectpicker("val",n.data("value")),a(".js_form_datetime").datetimepicker({format:"YYYY-MM-DD HH:mm:ss"});var s=window.common,r=new window.wangEditor("#js_details_editor");r.customConfig.menus=["bold","fontSize","fontName","italic","underline","strikeThrough","foreColor","backColor","link","list","justify","quote","emoticon","image","table","undo","redo"],r.customConfig.zIndex=2,r.customConfig.emotions=window.emotions||!1,r.customConfig.uploadImgServer="/upload",r.customConfig.uploadImgMaxSize=1048576,r.customConfig.uploadImgMaxLength=5,r.customConfig.uploadImgTimeout=6e4,r.customConfig.uploadFileName="uploadImageName",r.customConfig.customAlert=function(t){s.toast(t)},r.create(),a("#js_edit_form").on("submit",function(t){t.preventDefault();var e=a(this).serializeArray(),o=(r.txt.html()||"").trim();""===r.txt.text().trim()&&(o=""),e.push({name:"content",value:o}),s.loading("show");var i=a(this).data("url");return a.ajax({url:i,type:"POST",dataType:"JSON",headers:{"Content-Type":"application/json"},data:JSON.stringify({data:e})}).done(function(t){"100"===t.code?(s.toast("操作成功"),a("#js_edit_form").get(0).reset(),a("#js_city_select").selectpicker("val",""),r.txt.clear()):s.toast(t.desc)}).fail(function(t){0!==t.readyState&&s.toast("接口请求失败: "+(t.status||-1))}).always(function(){s.loading("hide")}),!1})}(window.jQuery);