(function(){
// 配置显示内容
var _notice_t='您的浏览器版本太低了，无法使用本网站的所有功能。请升级到最新版浏览器，推荐下载使用浏览器IE9+、Firefox、Chrome等。';
var noticeTopDiv = document.createElement("div");
noticeTopDiv.id="browserinspect";
noticeTopDiv.className="browserinspect";
// 配置样式
var _oticestyle = "<style>.browserinspect {position:absolute;position:fixed;z-index:111111;\
width:100%; top:0px; left:0px; display:none;\
border-bottom:1px solid #A29330;\
background:#FDF2AB no-repeat 13px center url(https://t1.chei.com.cn/common/ch/browser/images/dialog-warning.png);\
text-align:left; \
font: 13px Arial,sans-serif;color:#000;}\
.browserinspect div { padding:5px 36px 5px 40px; }\
.browserinspect>div>a,.browserinspect>div>a:visited{color:#E25600; text-decoration: underline;}\
#browserinspectclose{position:absolute;right:6px;top:5px;height:18px;width:20px;font:18px bold;padding:0; line-height:18px; }\
#browserinspecta{display:block; cursor:pointer; text-align:center; color:#333;}\
#browserinspecta:hover{ background:#ead9a8; text-decoration:none;}\
#browserinspectcc{display:block;position:absolute; top:-99999px;}</style>";
noticeTopDiv.innerHTML= '<div>' + _notice_t + '<div id="browserinspectclose"><a id="browserinspecta"><span id="browserinspectcc">Close</span><span aria-hiden="true">&times;</span></a></div></div>'+_oticestyle;
document.body.insertBefore(noticeTopDiv,document.body.firstChild);

var hm=document.getElementsByTagName("html")[0]||document.body;
var bodymt = hm.style.marginTop;
hm.style.marginTop = (noticeTopDiv.clientHeight)+"px";

// binding 关闭事件
(function() {
            document.getElementById("browserinspecta").onclick = function(e) {
                e = e || window.event;
                if (e.stopPropagation) e.stopPropagation();
                else e.cancelBubble = true;
                noticeTopDiv.style.display = "none";
                hm.style.marginTop = bodymt;
                return true;
            };
})();

if(!!!Function.bind){  // 判断是否是支持ES 5 特性的现代浏览器
//document.getElementById("noticeTopDiv").style.display="block";
  noticeTopDiv.style.display = "block"; 
  console.log("THE ECMAScript 5 Features  IS NOT SUPPORTED!");
}

})();
