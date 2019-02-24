/**
 * 轮询公用库，仅限jquery版使用！
 * @param {[type]} taskId    [进入轮询框架的任务id, required]
 * @param {[type]} key       [附加参数key，可以为空, not required]
 * @param {[type]} serverUrl [轮询url, required]
 * @param {[type]} options   [轮询过程的配置项：delay[轮询间隔]、delayGaps[轮询递增毫秒数]、retryLimit[发送错误时的尝试总次数]、retryAfter[发送错误时第一次重试的时间间隔]、retryGaps[发送错误时重试请求递增毫秒数]]
 */
function AjaxPolling(taskId, key, serverUrl, options) {
    this.taskId = taskId;
    this.key = key;
    this.serverUrl = serverUrl;
    this.useProgressBar = false;
    this.onError = function (xhr, retryCount) {};
    this.onSuccess = function (data) {};
    this.everyPolling = function (data) {
        if(this.useProgressBar){ this.changeProgressBar(data); }
    };

    this.pollingCount = 0; // 当前正常轮询的总次数，初始值：0
    this.pollingDelay = options.delay || 1000; // 正常轮询时，请求延迟毫秒数，默认：1000毫秒
    this.delayGaps = options.delayGaps || 0; // 轮询请求间隔递增毫秒数，默认：0毫秒（建议不要超过1000）

    this.retryCount = 0; // 发生错误时，当前已重试的次数，初始值：0
    this.retryLimit = options.retryLimit || 10; // 当发生错误时请求的最大次数，默认：10次
    this.retryAfter = options.retryAfter || 1000; //第一次发送请求毫秒数，默认：1000毫秒
    this.retryGaps = options.retryGaps || 300; // 发送请求的递增毫秒数,默认：300毫秒

}

AjaxPolling.prototype = {
    callServer : function() {
        var p = this;
        $.ajax({
            type:"get", // 为提高效率，默认为get请求
            url: this.serverUrl,
            cache: false,
            dataType:"json",
            data:{taskId : this.taskId, key : this.key, tt: new Date().getTime()},
            error: function(xhr,textstatus,errothown){
                // 即时轮询出现了异常，仍然发出请求
                if(parseInt(xhr.status,10)>=500){
                        p.retryCount++;
                        p.onError(xhr, p.retryCount);
                        if (p.retryCount <= p.retryLimit) {
                            //try again
                            var _this = this; // this 指ajax
                           p.setTimeout = window.setTimeout(function(){$.ajax(_this);}, (p.retryAfter+p.retryGaps*p.retryCount));
                            return;
                        } 

                        return;
                    }

            },
            success: function(data){
                p.pollingCount++;
                clearTimeout(p.setTimeout);
                p.everyPolling(data);
                if(data.state == 'success') {
                    p.pollingCount = 0; // 恢复初始值
                    // 直接回调 
                    p.onSuccess(data);
                }
                if (data.state == 'wait' || data.state == 'update') {
                     var _this = this; // this 指ajax
                    p.setTimeout = window.setTimeout(function(){$.ajax(_this)}, (p.pollingDelay+p.delayGaps*p.pollingCount));
                    return;
                }
                if (data.state == 'cancel') {
                    return p.onCancel && p.onCancel(data);
                }
                if (data.state == 'exception') {
                    return p.onException && p.onException(data);

                }
                // console.log('error:服务没有正确返回结果');
                return;
               
            }
        });
    },
    start : function() {
            if(this.useProgressBar){ this.progressBar(this.taskId); }
            this.callServer();
    },
    // 初始化进度条（注：样式可能依赖jquery-ui.css或者boorstarp样式）
    progressBar : function(taskId) {
        var html = '<div class="progress active">'
             +   '<div class="progress-bar ch-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">'
             +    '</div>'
             + '</div>';

        $("#" + taskId).addClass("progress").html(html);
    },
    changeProgressBar : function(data) {
        // toPercent为闭包函数：转换百分比；避免污染原生函数
        function toPercent(n){  return (Math.round(n * 10000)/100).toFixed(0) + '%'; }
        var progressWidth = toPercent(data.percent/100);
        $("#" + data.taskId).find("div.progress-bar").width(progressWidth).html(progressWidth);
    }

};
