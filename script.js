/* 所有注释均为本人为加深理解而手打，非ai生产 */
//通过document.querySelector()方法获取对应HTML元素，并将它们存储在变量中以便后续使用
const form = document.querySelector("#messageForm");
const nicknameInput = document.querySelector("#nickname");
const messageInput = document.querySelector("#message");
const messageList = document.querySelector("#messageList");
const clearButton = document.querySelector("#clearMessages");
const messageCount = document.querySelector("#messageCount");
const storageKey = "fzuMessages";
//storageKey 作为存储留言的键

function getMessages() {  
  const savedMessages = localStorage.getItem(storageKey); //通过 localStorage.getItem() 获取本地留言数据
  return savedMessages ? JSON.parse(savedMessages) : [];  //若有数据则返回JSON.parse() 转化后的数组，若无则返回空数组
}

function saveMessages(messages) {
  localStorage.setItem(storageKey, JSON.stringify(messages)); 
}
//通过 localStorage.setItem() 保存留言数据，JSON.stringify() 将数组转化为字符串（localStorage 只支持保存字符串）

function renderMessages() {
  const messages = getMessages(); //获取留言
  messageList.innerHTML = "";     //清空留言列表
  messageCount.textContent = `${messages.length} 条`; //更新留言数量

  if (messages.length === 0) {    //无留言状态提示
    messageList.innerHTML = '<li class="empty-tip">暂无留言，快来留下第一条吧！</li>';
    return;
  }

  messages.forEach(function (item, index) {   //遍历留言数组，创建对应的HTML元素并添加到留言列表中进行显示
    const li = document.createElement("li");
    const meta = document.createElement("div");
    const messageBody = document.createElement("div");
    const name = document.createElement("span");
    const time = document.createElement("span");
    const content = document.createElement("p");
    const deleteButton = document.createElement("button");
    //通过document.createElement() 创建新的HTML元素，代替直接拼接HTML字符串，方便后续使用

    li.className = "message-item";
    meta.className = "message-meta";
    messageBody.className = "message-body";
    name.textContent = item.nickname;
    time.textContent = item.time;
    content.textContent = item.content;
    deleteButton.className = "delete-message";
    deleteButton.type = "button";
    deleteButton.textContent = "删除";
    deleteButton.dataset.index = index;

    meta.append(name, time);
    messageBody.append(content, deleteButton);
    li.append(meta, messageBody);

    messageList.prepend(li);
  });
}

form.addEventListener("submit", function (event) {  //触发“submit”事件时触发eventListener
  event.preventDefault();     //阻止表单默认提交行为，避免页面刷新

  const nickname = nicknameInput.value.trim();  //获取值，并用 .trim() 去除首尾空格
  const content = messageInput.value.trim();

  if (nickname === "" || content === "") {
    alert("请先填写昵称和留言内容。");
    return;
  }

  const messages = getMessages(); //获取本地留言
  const newMessage = {            //留言对象结构
    nickname: nickname,
    content: content,
    time: new Date().toLocaleString()   //new Date().toLocaleString() 获取当前时间并格式化
  };

  messages.push(newMessage);    //将新留言添加到留言数组中
  saveMessages(messages);       //将新留言数组保存到本地留言
  renderMessages();             //更新渲染留言列表显示
  form.reset();                 //重置表单

  alert("留言成功，点此返回");
});

clearButton.addEventListener("click", function () {   //触发“click”事件时触发回调函数
  const confirmed = confirm("确定要清空所有留言吗？");

  if (confirmed) {
    localStorage.removeItem(storageKey);    //清空本地存储的留言
    renderMessages();                       //更新渲染留言列表显示（空状态）
  }
});

messageList.addEventListener("click", function (event) {  //触发“click”事件时触发eventListener
  if (!event.target.classList.contains("delete-message")) {   //检测是否点击删除按钮
    return;
  }

  const index = Number(event.target.dataset.index);   //获取要删除的留言索引
  const messages = getMessages();

  messages.splice(index, 1);                          //删除指定索引的留言
  saveMessages(messages);                             //将更新后的留言数组保存到本地
  renderMessages();
});

renderMessages();
