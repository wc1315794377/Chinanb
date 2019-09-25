+function (d, w) {

  function TagProducts() {
    this.type = null;
  }

  
  TagProducts.prototype = {

    //创建元素
    create: function (tagName) {
      return d.createElement(tagName);
    },

    //获取元素
    query: function (selector, parent) {
      return (parent !== undefined && parent.nodeType == 1 ? parent : d).querySelectorAll(selector);
    },

    //绑定事件
    event: function (selector, type, fn) {
      var elements = this.query(selector);

      for (var i = 0; i < elements.length; i++) {
        elements[i]['on' + type] = fn;
      }
    },

    //创建导航
    createNav: function (tagData) {
      var ul = this.create('ul');

      ul.className = 'nav-list';

      tagData.forEach((function (v, i) {
        
        var li = this.create('li');
        li.dataset.type = v.type;
        li.innerHTML = `<h4 class="${i == 0 ? 'active' : ''}">${v.title}</h4><p class="${i == 0 ? 'active' : ''}">${v.subTitle}</p>`;

        ul.appendChild(li);

      }).bind(this))

      this.query('.nav')[0].appendChild(ul);

      this.type = tagData[0].type;

    },

    //创建类型商品
    createTypePorducts: function (products) {

      var productUl = this.query('.products-list')[0];

      productUl.innerHTML = '';

      //获取当前商品类型数据
      var currentData = products[this.type];
      
      //创建文档片段
      var fragment = d.createDocumentFragment();

      for (var i = 0; i < currentData.length; i++) {
        var li = this.create('li');

        var str = `<div class="img">
            <img class="auto-img" src="${currentData[i].img}" />
          </div>
          <p class="title">${currentData[i].title}</p>
          <div class="info">
            <div class="price fl"><span class="pri">￥</span><span class="pr">${currentData[i].price}</span></div>
            <div class="fr tag ${currentData[i].isSubtag ? '' : 'not-has-tag'}">${currentData[i].subtag}</div>
            <div class="fr plus clearfix ${currentData[i].isPlus ? '' : 'not-has-plus'}"><span class="fl plus-price">￥${currentData[i].plusPrice}</span><span class="fl">plus</span></div>
          </div>`;

          li.innerHTML = str;

          fragment.appendChild(li);
      }

      productUl.appendChild(fragment);

    },

    //绑定事件
    addEvent: function (o) {

      //o.selector: css选择器
      //o.type: 事件类型
      //o.fn: 事件执行回调函数
      //o.isCapture: 是否捕获触发

      var listener = window.addEventListener ? 'addEventListener' : 'attachEvent';

      o.type = window.addEventListener ? o.type : 'on' + o.type;

      var elements = this.query(o.selector);

      for (var i = 0; i < elements.length; i++) {
        elements[i][listener](o.type, o.fn, o.isCapture);
      }

    },

    //移除激活类
    removeActive: function (selector) {
      var elements = this.query(selector);
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = '';
      }
    },

    //初始化
    init: function (tagData, products) {

      var self = this;

      this.createNav(tagData);
      this.createTypePorducts(products);

      this.addEvent({
        selector: '.nav-list>li',
        type: 'click',
        fn: function () {

          //如果切换的商品类型是一致时, 则拦截
          if (self.type == this.dataset.type) {
            return;
          }

          self.type = this.dataset.type;

          self.createTypePorducts(products);

          self.removeActive('.active');

          //激活当前的li的h4, p
          self.query('h4', this)[0].className = 'active';
          self.query('p', this)[0].className = 'active';


        }
      });
    }


  };

  w.TagProducts = TagProducts;

}(document, window);
