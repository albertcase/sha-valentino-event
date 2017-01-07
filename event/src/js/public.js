/*
*   public.js
*/


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var shareArr = {
    "_title": '探索ROSSO VALENTINO系列', //分享标题
    "_desc": "探索ROSSO VALENTINO系列",    // 分享朋友圈的描述
    "_desc_friend": "纯粹优雅，柔美璀璨。独特之作，为您呈现。",    // 分享好友的描述
    "_link": window.location.host + "/event",    //分享的连接
    "_imgUrl": "http://" + window.location.host + "/event/asset/img/share.jpg",   //分享的图片
    "_url": encodeURIComponent(window.location)//encodeURIComponent(window.location.href.split("#")[0]) //.replace('http%3A%2F%2F','')
};

var pfun = {
    init: function(){
        var self = this;
        self.wxshareFun();
    },
    loadFn: function(arr , fn , fn2){
        var loader = new PxLoader();
            for( var i = 0 ; i < arr.length; i ++)
            {
                loader.addImage(arr[i]);
            };
            
            loader.addProgressListener(function(e) {
                    var percent = Math.round( e.completedCount / e.totalCount * 100 );
                    if(fn2) fn2(percent)
            }); 
            
            
            loader.addCompletionListener( function(){
                if(fn) fn();    
            });
            loader.start(); 
    },
    formErrorTips: function(alertNodeContext){  //错误提示弹层
        var alertInt;
        clearTimeout(alertInt);
        if($(".alertNode").length > 0){
            $(".alertNode").html(alertNodeContext);
        }else{
            var alertNode = document.createElement("div");
                alertNode.setAttribute("class","alertNode");
                alertNode.innerHTML = alertNodeContext;
                document.body.appendChild(alertNode);

        }
        alertInt = setTimeout(function(){
            $(".alertNode").remove();
        },3000);
    },
    wechatFun: function(_appId, _timestamp, _nonceStr, _signature){  //分享函数
        wx.config({
            debug: false,
            appId: _appId,
            timestamp: _timestamp,
            nonceStr: _nonceStr,
            signature: _signature,
            jsApiList: [
                // 所有要调用的 API 都要加到这个列表中
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow'
            ]
        });

        this.wxshareFun();
    },
    wxshareFun: function(){  //分享信息重置函数
        var self = this;
        // 调试 /wechat?debug=1
        wx.ready(function () {
            // 在这里调用 API
            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口

            wx.onMenuShareAppMessage({
                title: shareArr._title,
                desc: shareArr._desc_friend,
                link: shareArr._link,
                imgUrl: shareArr._imgUrl,
                success: function (res) {
                    // _hmt.push(['_trackEvent', 'share', 'ShareAppMessage']);
                    //  alert('已分享');
                },
                cancel: function (res) {
                    //  alert('已取消');
                },
                fail: function (res) {
                    //  alert(JSON.stringify(res));
                }
            });


            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口

            wx.onMenuShareTimeline({
                title: shareArr._desc,
                link: shareArr._link,
                imgUrl: shareArr._imgUrl,

                success: function (res) {
                    // _hmt.push(['_trackEvent', 'share', 'ShareTimeline']);
                    // alert('已分享');
                },
                cancel: function (res) {
                    //  alert('已取消');
                },
                fail: function (res) {
                    //   alert(JSON.stringify(res));
                }
            });
        }); //end of wx.ready
    },
    ajaxFun: function(ajaxType, ajaxUrl, ajaxData, ajaxDataType, ajaxCallback){
       $.ajax({
            type: ajaxType,
            url: ajaxUrl,
            data: ajaxData,
            dataType: ajaxDataType
        }).done(function(data){
            ajaxCallback(data)
        })
        
        // ajaxFun("GET", "/weixin/jssdk", jssdkPushData, "json", jssdkCallback);

        // function jssdkCallback(data){
        //     wechatShare(data.appid, data.time, data.noncestr, data.sign);
        // }  
    },
    loadingFnDoing: function(allAmg, loadCallback){
        pfun.loadFn(allAmg , function (){

            $("img").each(function(){ 
                $(this).attr("src",$(this).attr("sourcesrc"));
            })
            
            loadCallback();
            
        } , function (p){
            //$(".loading em").html(p);
            console.log(p);
        });
    },
    overscroll: function(el){
        el.addEventListener('touchstart', function() {
            var top = el.scrollTop
              , totalScroll = el.scrollHeight
              , currentScroll = top + el.offsetHeight
            //If we're at the top or the bottom of the containers
            //scroll, push up or down one pixel.
            //
            //this prevents the scroll from "passing through" to
            //the body.
            if(top === 0) {
              el.scrollTop = 1
            } else if(currentScroll === totalScroll) {
              el.scrollTop = top - 1
            }
        })
        el.addEventListener('touchmove', function(evt) {
            //if the content is actually scrollable, i.e. the content is long enough
            //that scrolling can occur
            if(el.offsetHeight < el.scrollHeight)
              evt._isScroller = true
        })
    },
    getCookie: function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return null;
    },
    delCookie: function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval= this.getCookie(name);
        if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    },
    setCookie: function(name,value,time){
        var d = new Date();
        d.setTime(d.getTime() + (time*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    },
    getQueryString: function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return unescape(r[2]); return null;
    }

}


document.body.addEventListener('touchmove', function(evt) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    if(!evt._isScroller) {
        evt.preventDefault()
    }
});


