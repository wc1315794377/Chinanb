(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    //写法不错
    var flexible = lib.flexible || (lib.flexible = {});
 
    if (metaEl) {
     console.warn('将根据已有的meta标签来设置缩放比例');
     //获取初始缩放比例
     var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
     if (match) {
      scale = parseFloat(match[1]); //取整
      dpr = parseInt(1 / scale); //1
     }
    } else if (flexibleEl) {
     var content = flexibleEl.getAttribute('content');
     if (content) {
      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
      if (initialDpr) {
       dpr = parseFloat(initialDpr[1]);
       scale = parseFloat((1 / dpr).toFixed(2));
      }
      if (maximumDpr) {
       dpr = parseFloat(maximumDpr[1]);
       scale = parseFloat((1 / dpr).toFixed(2));
      }
     }
    }
 
    if (!dpr && !scale) {
     //检测的当前设备的版本
     var isAndroid = win.navigator.appVersion.match(/android/gi);
     var isIPhone = win.navigator.appVersion.match(/iphone/gi);
     //window.devicePixelRatio 该属性返回当前显示设备的物理像素分辨率与css像素分辨率的比值，该值也可以被解释为像素大小的比例
     //简单来说就是一个css像素的大象相对于一个物理像素大小的比值
     //可以通过重写window.devicePixelRatio来更改此属性，例如window.devicePixelRatio=2;
     //dpr css/物理 比例
     //scale 缩放比例
     var devicePixelRatio = win.devicePixelRatio;
     if (isIPhone) {
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
       dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
       dpr = 2;
      } else {
       dpr = 1;
      }
     } else {
      // 其他设备下，仍旧使用1倍的方案
      dpr = 1;
     }
     scale = 1 / dpr;
    }
 
    docEl.setAttribute('data-dpr', dpr);
    //判断页面是否存在 metaEl
    if (!metaEl) {
     metaEl = doc.createElement('meta');
     metaEl.setAttribute('name', 'viewport');
     metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
     if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
     } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
     }
    }
 
    function refreshRem() {
     var width = docEl.getBoundingClientRect().width;
     //getBoundingClientRect
     //返回一个DOMRect对象，包含一组矩形的集合，该集合内是与该元素相关的css边框集合
     /*
     * DOMRect
     * bottom:8
     * height:8
     * left:0
     * right:520
     * top:0
     * width:520
     * x:0
     * y:0
     * */
     if (width / dpr > 540) {
      width = 540 * dpr;
     }
     //阿里的布局方案默认将屏幕分成十份，当然，如果愿意我们可以对其进行更改
     var rem = width / 10;
     docEl.style.fontSize = rem + 'px';
     flexible.rem = win.rem = rem;
    }
    // resize 在设备宽度发生改变时触发
    win.addEventListener('resize', function () {
     clearTimeout(tid);
     tid = setTimeout(refreshRem, 300);
    }, false);
    //pageshow firefox/open的一个事件，在chrome中不会触发
    //在页面后退时静态资源会直接重缓存中读取
    win.addEventListener('pageshow', function (e) {
     if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
     }
    }, false);
    //document.readyState 描述文档的加载状态
    /*
    * loding 文档仍然在加载中
    * interactive 文档已经加载完成并已经被解析，但是图像，框架之类的资源仍然在加载中
    * complete 说有资源都已经加载完成，load事件即将被触发
    * 在状态改变时document.readyState事件将被触发
    * */
    if (doc.readyState === 'complete') {
     doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
     //DOMContentLoaded 在文档加载完成后触发，不会等待图像，框架等资源，参考$(function(){}) / $.ready()
     doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = 12 * dpr + 'px';
     }, false);
    }
 
 
    refreshRem();
 
    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    //rem 2 px  转化方法
    flexible.rem2px = function (d) {
     var val = parseFloat(d) * this.rem;
     if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
     }
     return val;
    }
    //px 2 rem  转化方法
    flexible.px2rem = function (d) {
     var val = parseFloat(d) / this.rem;
     if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
     }
     return val;
    }
 
   })(window, window['lib'] || (window['lib'] = {}));