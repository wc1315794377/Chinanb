//添加留言
function AddMessage() {

  //标记留言板的状态
  this.status = false;

  //保存留言实例
  this.message = [];

  //查看留言标记
  this.index = null;

  //添加留言或者编辑留言
  this.isAdd = true;

  //记录编辑的留言
  this.editIndex = null;
}

//获取元素
AddMessage.prototype.elements = function (selector, parent) {
  return (parent !== undefined && parent.nodeType == 1 ? parent : document).querySelectorAll(selector);
}

//显示或者隐藏元素
AddMessage.prototype.toggle = function (selector, status) {
  var elements = this.elements(selector);

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = status;
  }
}

//绑定事件
AddMessage.prototype.addEvent = function (selector, type, fn) {
  var elements = this.elements(selector);

  for (var i = 0; i < elements.length; i++) {
    elements[i]['on' + type] = fn;
  }
}

//创建元素
AddMessage.prototype.create = function (tagName) {
  return document.createElement(tagName)
}

//清空元素的内容
AddMessage.prototype.clear = function (selector) {
  var elements = this.elements(selector);

  for (var i = 0; i < elements.length; i++) {
    elements[i].value = '';
  }
}

//生成留言面板
AddMessage.prototype.generateWrite = function (message) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < message.length; i++) {
    //生成留言面板
    var item = this.create('div');
    item.className = 'item';

    var str = `<div class="t">
        <span class="write-date">${message[i].writeDate}</span>
        <span class="read">阅读次数：<span class="read-count">${message[i].readCount}</span></span>
      </div>
      <div class="title">标题：<span class="write-title">${message[i].writeTitle}</span></div>
      <div class="b">
        <div class="l">
          <div class="name one-text"><span class="writer-name">${message[i].writer}</span>说：</div>
          <div class="content one-text write-content">${message[i].writeContent}</div>
        </div>
        <div class="r">
          <span class="readed" data-index="${i}">查看</span>
          <span class="edited" data-index="${i}">编辑</span>
          <span class="removed" data-index="${i}">删除</span>
        </div>
      </div>`;

    item.innerHTML = str;

    //查看留言
    this.read('.readed', item);

    //删除留言
    this.remove('.removed', item);

    //编辑留言
    this.edit('.edited', item);

    fragment.appendChild(item);
  }

  this.elements('.right')[0].appendChild(fragment);
}

//查看留言
AddMessage.prototype.read = function (selector, item) {
  var self = this;

  var element = this.elements(selector, item)[0];

  element.onclick = function () {

    //获取当前的留言信息
    var currentMessage = self.message[this.dataset.index];

    console.log('currentMessage ==> ', currentMessage);

    //如果当前是查看状态, 直接拦截, 已查看为1, 未查看为0
    if (currentMessage.readStatus == 1) {
      return;
    }

    //当前留言查看状态
    currentMessage.readStatus = 1;

    //修改上一次查看留言的标记
    if (self.index != null) {
      self.message[self.index].readStatus = 0;
    }
   
    self.toggle('.add-edit', 'none');
    self.toggle('.reading', 'block');
    self.status = false;

    //修改当前查看留言的标记
    self.index = this.dataset.index;
    
    currentMessage.readCount++;

    //显示留言信息
    for (var key in currentMessage) {
      if (key == 'readCount' || key == 'readStatus') {
        continue;
      }

      self.elements('#' + key)[0].textContent = currentMessage[key];
    }

    var parent = this.parentNode.parentNode.parentNode;
    self.elements('.read-count', parent)[0].textContent = currentMessage.readCount;

    //修改本地存储数据的阅读次数
    var localMsg = JSON.parse(localStorage.getItem('message'));
    localMsg[this.dataset.index].readCount = currentMessage.readCount;

    localStorage.setItem('message', JSON.stringify(localMsg));

    console.log('self.index ==> ', self.index);

  }
}

//删除留言
AddMessage.prototype.remove = function (selector, item) {

  var self = this;

  var element = this.elements(selector, item)[0];

  element.onclick = function () {
    this.parentNode.parentNode.parentNode.remove();

    console.log(self.message[this.dataset.index]);

    // return;

    if (self.message[this.dataset.index].readStatus == 1) {
      console.log('come');
      self.toggle('.reading', 'none');
    }

    //删除留言实例
    self.message.splice(this.dataset.index, 1);

    localStorage.setItem('message', JSON.stringify(self.message));

    if (self.message.length == 0) {
      self.index = null;
    }

  }

}

//编辑留言
AddMessage.prototype.edit = function (selector, item) {
  var self = this;

  var element = this.elements(selector, item)[0];

  element.onclick = function () {
    self.isAdd = false;

    //修改编辑留言的下标
    self.editIndex = this.dataset.index;

    //获取当前编辑留言数据
    var currentMsg = self.message[this.dataset.index];
    console.log('currentMsg ==> ', currentMsg);

    self.toggle('.add-edit', 'block');
    self.toggle('.reading', 'none');

    var w1 = self.elements('.w1');

    //设置表单控件的值
    for (var i = 0; i < w1.length; i++) {
      var name = w1[i].getAttribute('name');

      if (name != 'writeContent') {
        w1[i].readOnly = true;
      }
      w1[i].value = currentMsg[name];
    }


  }

}

//初始化
AddMessage.prototype.init = function () {
  var self = this;

  //获取本地存储留言实例
  var localMsg = localStorage.getItem('message');
  localMsg = localMsg ? JSON.parse(localMsg) : [];

  this.message = localMsg.concat();

  //生成留言面板
  this.generateWrite(this.message);

  this.addEvent('.add', 'click', function () {

    //如果当前留言本为显示或者当前留言是编辑，则拦截
    if (self.status || !self.isAdd) {
      return;
    }

    console.log('aaa');

    self.toggle('.reading', 'none');
    self.toggle('.add-edit', 'block');
    self.status = true;
    self.isAdd = true;

    self.elements('.writer-name')[0].readOnly = false;
    self.elements('.write-title')[0].readOnly = false;
  });

  this.addEvent('.submit', 'click', function () {

    //获取留言者
    var writer = self.elements('.writer-name')[0].value;

    //获取留言标题
    var writeTitle = self.elements('.write-title')[0].value;

    //获取留言内容
    var writeContent = self.elements('.write-content')[0].value;

    //时间
    var writeDate = new Date().format('yyyy-MM-dd hh:mm:ss');

    if (self.isAdd) {
      //创建一个留言实例
      var message = new Message({
        writer: writer,
        writeTitle: writeTitle,
        writeContent: writeContent,
        writeDate: writeDate
      });

      //保存当前留言实例
      self.message.unshift(message);

      //生成留言面板
      self.elements('.right')[0].innerHTML = '';
      self.generateWrite(self.message);

      //获取本地存储的留言信息
      var localMessage = localStorage.getItem('message');

      localMessage = localMessage ? JSON.parse(localMessage) : [];
      
      //将留言信息保存在本地存储
      localMessage.unshift(message);

      localStorage.setItem('message', JSON.stringify(localMessage));

    } else {
      
      //修改当前编辑的留言信息
      var thisMsg = self.message[self.editIndex];
      thisMsg.writeContent = writeContent;
      thisMsg.writeDate = writeDate;

      //写入本地存储
      localStorage.setItem('message', JSON.stringify(self.message));

      //获取编辑选项的元素
      var editItem = self.elements('.item')[self.editIndex];
      console.log('editItem ==> ', editItem);

      self.elements('.write-date', editItem)[0].textContent = writeDate;
      self.elements('.write-content', editItem)[0].textContent = writeContent;

      self.editIndex = null;
    }

    self.status = false;
    self.toggle('.add-edit', 'none');
    self.clear('.w1');

    

  })

}


//留言构造函数
function Message(o) {
  //留言者
  this.writer = o.writer;

  //留言标题
  this.writeTitle = o.writeTitle;

  //留言内容
  this.writeContent = o.writeContent;

  //留言日期
  this.writeDate = o.writeDate;

  //查看(阅读)次数
  this.readCount = 0;

  //查看状态
  this.readStatus = 0;
}