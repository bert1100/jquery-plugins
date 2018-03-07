##  ajax轮询公用库

这是chsi自定义的一个ajax轮询公用库，可实现简便易行的轮询预期；它仍然属于short-time 轮询，性能可能仍然比不上长轮询／websocket，但它相对更易实现和配置。

### 特性 feature：

- 支持进度条（依赖后台返回数据结构）
- 自动降低请求频率
- 发送错误时自动重试



### 依赖 dependence：

- Jquery

  ​

### 数据结构

返回的数据结构共5种：

1. success（任务成功） 

2. wait（任务尚未完成）  

3. update（任务刚刚完成） 

4. cancel（任务被取消） 

5. exception（任务被挂起，无法完成）

   ​

### 用法 usage：

 * 轮询公用库，仅限jquery版使用！
 * @param {[type]} taskId    [taskid: 轮询任务id号]
 * @param {[type]} key       [轮询签名校验key]
 * @param {[type]} serverUrl [轮询url]
 * @param {[type]} options[配置项]



#### options配置项：object对象

{

​	"useProgressBar":false，// 是否使用进度条，默认：false

​	delay : 1000， // 正常轮询时，请求延迟毫秒数，默认：1000毫秒

​	delayGaps : 0， // 轮询请求间隔递增毫秒数，默认：0毫秒（建议不要超过1000，否则进度条反应慢，影响用户体验，）

​	retryLimit ： 10， // 当发生错误时请求的最大次数，默认：10次

​	retryAfter ： 1000，//发生错误时，第一次请求毫秒数，默认：1000毫秒

​	retryGaps ：300  // 发生错误时，发送请求的递增毫秒数,默认：300毫秒

}



#### 实例方法methods：

onSuccess：function (data) {};

当轮询结果成功时，回调函数，data为轮询结果对象

onError: function (xhr, retryCount) {};

当轮询每次发生错误时的回调函数，xhr为ajax的对象，retryCount为当前请求重试的次数

everyPolling: function (data) {}

当每次正常轮询返回时的回调函数，可用此重写进度条。



#### 实例：

```javascript


// 用法1（使用进度条）:
var polling = new AjaxPolling('SDFAFAEIWE2', 'key', '/polling/ajax.action',{"useProgressBar":true}); 
// 设置当轮询完成并结束时回调
polling.onSuccess = function(data){
    // console.log(data)
    alert('轮询完成');
}
polling.start();



// 用法2(自定义):
var polling = new AjaxPolling('SDFAFAEIWE2', 'key', '/polling/ajax.action',{}); 

// 当轮询完成并结束时回调
polling.onSuccess = function(data){
    // console.log(data)
    alert('轮询完成');
}

// 当轮询发生错误时UI的回调（注：程序会仍然尝试发出轮询请求）
polling.onError = function(xhr, retryCount){
     window.alert("网络服务可能异常，正在第"+ retryCount + "次重试...");
}

polling.start();
```





---

###  进入轮询框架

```flow
st=>start: 发起请求
op=>operation: 等待返回(6000ms超时)
cond=>condition: 是否为对象
lx=>operation: 获取结果length
resole=>condition: 是否为16位
taskid=>operation: 将16位字符串作为taskID
lunxun=>inputoutput: 进入轮询框架（见下图）
err=>operation: 浏览器error（304）
logout=>operation: 登录失败，重新登录
e=>end: 执行回调函数

st->op->cond
cond(no)->lx
cond(yes)->e
lx->resole
resole(yes)->taskid
taskid->lunxun
resole(no)->err
err->logout


```

### 轮询框架示意图

---

```flow
lx-start=>start: 向轮询接口发起请求
lx-res=>operation: 正常响应200（格式json）|past
lx-limit=>inputoutput: 最多20次，宣告超时重试|past
lx-cond=>condition: 状态是否为success
lx-wait=>condition: 状态是否为wait|循环20次
lx-waiting=>subroutine: 等待1000+n 毫秒，重新轮询
lx-end=>end: 使用taskid向原接口发起结果请求

lx-start->lx-limit->lx-res->lx-cond
lx-cond(yes)->lx-end
lx-cond(no)->lx-wait
lx-wait(yes)->lx-waiting(right)->lx-res


```



必要条件：

1. 轮询框架须及时响应，时刻返回状态码200，否则轮询将失去作用。
2. 原接口须较高的并发能力和计算能力，每条任务需20秒内完成，且当使用taskid取结果时，应及时反馈结果。

