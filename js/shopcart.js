(function (doc, w) {

  var shopcart = {

    // 商品数据
    products: [
      //商品信息
      {
        img: 'https://c.vpimg1.com/upcb/2019/07/31/128/ias_156455196350111_320x153_90.jpg',
        name: 'A1',
        price: '70.00',
        count: 2
      },
      {
        img: 'https://c.vpimg1.com/upcb/2019/08/01/84/ias_156464280521053_320x153_90.jpg',
        name: 'GGT',
        price: '78.99',
        count: 1
      },
      {
        img: 'https://d.vpimg1.com/upcb/2019/07/29/101/ias_156439092392261_320x153_90.jpg',
        name: 'OOP',
        price: '54.32',
        count: 4
      },
      {
        img: 'https://c.vpimg1.com/upcb/2019/04/11/75/ias_155497589998250_320x153_90.jpg',
        name: 'GGB',
        price: '43.00',
        count: 1
      }
    ],

    //创建元素
    create: function (tagName) {
      //标签名称
      return doc.createElement(tagName);
    },

    //获取元素
    query: function (selector, parent) {
      return (parent !== undefined && parent.nodeType == 1 ? parent : doc).querySelectorAll(selector);
    },

    //绑定事件
    event: function (selector, type, fn) {
      //selector: css选择器
      //type: 事件类型
      //fn: 事件执行函数
      var elements = this.query(selector);

      for (var i = 0; i < elements.length; i++) {
        elements[i]['on' + type] = fn;
      }
    },

    //生成商品
    generatePoducts: function () {

      var shopcartProducts = this.query('.shopcart-products')[0];

      for (var i = 0; i < this.products.length; i++) {
        //创建div
        var item = this.create('div');
        item.className = 'item';

        var str = `<div><input class="simple" type="checkbox"></div>
        <div class="img" data-url="${this.products[i].img}">
          <img class="auto-img" src="${this.products[i].img}" alt="" />
        </div>
        <div class="name">${this.products[i].name}</div>
        <div>数量: <span class="decrease">-</span><input class="count" type="text" value="${this.products[i].count}" /><span class="increase">+</span></div>
        <div>单价: <span class="price">${this.products[i].price}</span></div>
        <div>商品总价: <span class="total">${(Math.round(this.products[i].price * 100) * this.products[i].count / 100).toFixed(2)}</span></div>
        <div><button class="del">删除</button></div>`;

        item.innerHTML = str;

        shopcartProducts.appendChild(item);
      }

    },

    //计算商品总价
    calcProductPrice: function (parent, count) {
       //获取当前商品单价
       var price = this.query('.price', parent)[0].textContent;
        
       //获取当前商品元素
       var total = this.query('.total', parent)[0];
       
       total.textContent = (Math.round(price * 100) * count / 100).toFixed(2);
    },

    //计算订单总价
    calcOrderPrice: function () {
      //获取所有单选复选框
      var simples = this.query('.simple');

      var total = 0;

      for (var i = 0; i < simples.length; i++) {
        //只有勾选才加入订单总价
        if (simples[i].checked) {
          //获取父元素
          var parent = simples[i].parentNode.parentNode;

          //获取商品总价
          var productPrice = this.query('.total', parent)[0].textContent;

          total = ((Math.round(total * 100) + Math.round(productPrice * 100)) / 100).toFixed(2);
        }
      }

      this.query('.all')[0].textContent = total;
    },

    //单选
    simple: function () {
      //计算订单总价
      this.calcOrderPrice();

      //只要有一个单选未勾选，全选不能勾选
      //全选
      var allselect = this.query('.allselect')[0];

      var simples = this.query('.simple');

      var alldel = this.query('.alldel')[0];
      
      for (var i = 0; i < simples.length; i++) {
        if (!simples[i].checked) {
          allselect.checked = false;
          alldel.disabled = true;
          return;
        }
      }

      //勾选全部勾选复选框
      allselect.checked = true;

      //启用全部删除按钮
      alldel.disabled = false;
    },

    //初始化
    init: function () {
      var self = this;

      //生成商品
      this.generatePoducts();

      //增加数量
      this.event('.increase', 'click', function () {
        //获取当前元素的父级元素
        var parent = this.parentNode.parentNode;
        
        //获取当前数量文本框
        var input = self.query('.count', parent)[0];
        
        //获取当前商品数量
        var count = input.value;

        //累加1
        input.value = ++count;


        //计算当前商品总价
        self.calcProductPrice(parent, count);

        //计算订单总价
        self.calcOrderPrice();
      });


       //减少数量
       this.event('.decrease', 'click', function () {
        //获取当前元素的父级元素
        var parent = this.parentNode.parentNode;
        
        //获取当前数量文本框
        var input = self.query('.count', parent)[0];
        
        //获取当前商品数量
        var count = input.value;

        //累减1
        input.value = count <= 1 ? 1 : --count;

        //计算当前商品总价
        self.calcProductPrice(parent, count);

        //计算订单总价
        self.calcOrderPrice();
      });

      //输入数量
      this.event('.count', 'input', function () {

        //获取当前输入数量
        var value = parseInt(this.value);

        this.value = isNaN(value) || value <= 0 ? 1 : value;
        
        var parent = this.parentNode.parentNode;
        //计算当前商品总价
        self.calcProductPrice(parent, this.value);

        //计算订单总价
        self.calcOrderPrice();
      })

      //全选
      this.event('.allselect', 'change', function () {
        //获取所有单选
        var simples = self.query('.simple');
        for (var i = 0; i < simples.length; i++) {
          simples[i].checked = this.checked;
        }

        //如果全选被勾选，则启用全部删除按钮
        self.query('.alldel')[0].disabled = !this.checked;

        //计算订单总价
        self.calcOrderPrice();
      })

      //单选
      this.event('.simple', 'change', function () {

        self.simple();
        
      })

      //删除单个商品
      this.event('.del', 'click', function () {
        //获取父级元素
        var parent = this.parentNode.parentNode;

        //移除父级元素
        parent.remove();

        var el = self.query('.item', '.shopcart-products');
        if (el.length == 0) {
          //如果没有商品
          self.query('.operate')[0].innerHTML = '购物车空空如也';
          return;
        }

        self.simple();
      })

      //删除全部
      this.event('.alldel', 'click', function () {
          self.query('.shopcart-products')[0].innerHTML = '';

          self.query('.operate')[0].innerHTML = '购物车空空如也';
      })

      //提交数据
      this.event('.commit', 'click', function () {
        //获取所有勾选的复选框
        var checkboxs = self.query('.simple:checked');

        if (checkboxs.length == 0) {
          return;
        }

        //保存所有商品信息
        var pros = [];

        var current = new Date();
        //生成订单编号
        var orderCode = current.getTime();
        self.query('.order-code')[0].textContent = orderCode;

        //订单日期
        var orderDate = formatDate(current, 'yyyy-MM-dd hh:mm:ss');
        self.query('.order-date')[0].textContent = orderDate;

        //获取products元素
        var products = self.query('.products')[0];

        //订单总价
        var orderTotal = 0;
        
        for (var i = 0; i < checkboxs.length; i++) {
          //获取当前复选框的父元素
          var parent = checkboxs[i].parentNode.parentNode;

          //保存商品信息
          var o = {};
          
          //获取图片
          o.img = self.query('.img', parent)[0].dataset.url;

          //获取商品名称
          o.name =  self.query('.name', parent)[0].textContent;

          //获取数量
          o.count = self.query('.count', parent)[0].value;

          //获取单价
          o.price = self.query('.price', parent)[0].textContent;

          //将当前商品数据加入到pros数组
          pros.push(o);


          //我的订单

          //订单总价
          orderTotal = ((Math.round(orderTotal * 100) + Math.round(o.price * 100) * o.count) / 100).toFixed(2);

          //创建元素
          var proItem = self.create('div');
          proItem.className = 'pro-item';

          //商品信息元素
          var str = `<div class="img">
              <img class="auto-img" src="${o.img}" alt="">
            </div>
            <div>${o.name}</div>
            <div>单价: <span class="price">${o.price}</span></div>
            <div>数量: <span class="count">${o.count}</span></div>
            <div>商品总价: <span class="count">${(Math.round(o.price * 100) * o.count / 100).toFixed(2)}</span></div>`;

            proItem.innerHTML = str;

            //将proItem添加到products
            products.appendChild(proItem);
        }

        self.query('.order-total')[0].textContent = orderTotal;

        console.log('pros ==> ', pros);

      })

    }
  };

  w.shopcart = shopcart;

})(document, window);