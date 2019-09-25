function formatDate(date, format) {
  //获取年份
  var year = String(date.getFullYear()); //2019
  if (/(y+)/.test(format)) {
    var yearContent = RegExp.$1;
    console.log('yearContent ==> ', yearContent);
    //替换年份
    format = format.replace(yearContent, year.slice(-yearContent.length));
  }

  //替换月日时分秒
  var obj = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (var key in obj) {
    var reg = new RegExp('(' + key +'+)');
    // console.log('reg ==> ', reg);

    if (reg.test(format)) {
      var content = RegExp.$1;
      // console.log('content ==> ', content);

      format = format.replace(content, obj[key] >= 10 ? obj[key] : content.length <= 1 ? obj[key] : '0' + obj[key]);
    }
  }



  return format;
}