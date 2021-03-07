
(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);
(function($) {
    $.extend({
        Request: function(m) {
            var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
            return sValue ? sValue[1] : sValue;
        },
        UrlUpdateParams: function(url, name, value) {
            var r = url;
            if (r != null && r != 'undefined' && r != "") {
                value = encodeURIComponent(value);
                var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
                var tmp = name + "=" + value;
                if (url.match(reg) != null) {
                    r = url.replace(eval(reg), tmp);
                } else {
                    if (url.match("[\?]")) {
                        r = url + "&" + tmp;
                    } else {
                        r = url + "?" + tmp;
                    }
                }
            }
            return r;
        }

    });
})(jQuery);
/*jshint eqnull:true */
/*!
 * jQuery Cookie Plugin v1.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($, document) {

    var pluses = /\+/g;
    function raw(s) {
        return s;
    }
    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value == null)) {
            options = $.extend({}, $.cookie.defaults, options);

            if (value == null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || $.cookie.defaults || {};
        var decode = options.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
            if (decode(parts.shift()) === key) {
                return decode(parts.join('='));
            }
        }
        return null;
    };

    $.cookie.defaults = {};

})(jQuery, document);
var lcApp = {
        init:function(){
            // this.home();
            
            this.menu();
            this.isMobile();

            this.service();
            this.news();
            $('.lc-close-btn').on('click',function(){
                $(this).parent().prev().trigger('click');
            });
            $('.lan-en').off('click').on('click',function(){
                
                var origin = window.location.origin;
                var getHerf = window.location.href;
                var href = origin + $(this).data('href');
                var id = $.getUrlParam('id') ;
                if((getHerf.indexOf('detail.html')>0) && ($.getUrlParam('id') !='undefined')){
                    href +='?id='+id;
                }
                var lan = $(this).data('lan');
                $.cookie('language',lan,{path:'/'})
                // var newHref = $.UrlUpdateParams(href, "language",'setting');
                window.location = href;
            });
        },
        browser:{
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                return {//移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/)||u.indexOf('iPad') > -1, //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        },
        isMobile:function(){

            var wh = document.documentElement.clientWidth;
            var href = window.location.href;
            var hah = 'Trinity.cn';
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                if(wh<760){
                    if(href.indexOf(hah)>=0){
                        window.location.href = href.replace(hah,hah+'/mob')
                    }
                }
            }
            // lcApp.location()
            // if(lcApp.location() == 'other'){
            //     if(href.indexOf('/mob/')>=0){
            //         window.location.href = href.replace(hah,hah+'/mob/en');
            //     }else{
            //         window.location.href = href.replace(hah,hah+'/en');
            //     }
            // }
            
            if(this.browser.versions.iPad){
                $('.home-body-item .h-btn-d').hide();
            }
        },
        location:function(){
            var lan = $.cookie('language');
            var loc = 'china';
            if(lan){
                if(lan =='zh'){
                    loc = 'china';
                }else{
                    loc = 'other';
                }
                autoUrl();
            }else{
                // $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
                //     if (remote_ip_info.ret == '1') {
                //         if(remote_ip_info.country == '中国'){
                //             loc = 'china';
                //         }else{
                //             loc = 'other';
                //         }
                //     }
                //     autoUrl();
                // });
            }
            
            
            
            function autoUrl(){
                var href = window.location.href;
                var hah = 'Trinity.cn';
                if(href.indexOf(hah)>=0 ){
                    if(loc == 'other' && href.indexOf('/en/')<0 ){
                        if(href.indexOf('/mob/')>=0){
                            window.location.href = href.replace(hah,hah+'/mob/en');
                        }else{
                            window.location.href = href.replace(hah,hah+'/en');
                        }
                    }else if(loc != 'other' && href.indexOf('/en/')>=0){
                        window.location.href = href.replace('/en/','/');
                    }
                }
            }
        },
        menu:function(){
            $(window).scroll(function(){
                var top = $(document).scrollTop();
                if(top>90){
                    $('.header').eq(0).addClass('anima')
                }else{
                    $('.header').eq(0).removeClass('anima')
                }
            })
            
        },
        home:function(){
        },
        service:function(){
            if(!$('.tab-box-list').length) return;

            if(!window.applicationCache){
                $('.lc-column-section-title').on('click',function(){
                    var _this = $(this);
                    var slideBox = $(this).parent().next('.slide-text-box');

                    _this.parents('li').siblings().find('.slide-text-box').hide();
                    slideBox.css({
                        position:'static',
                        zIndex:'8'
                    });
                    if(slideBox.css('visibility') == 'hidden'){
                        slideBox.css('visibility','inherit');
                        slideBox.slideDown();
                    }else{
                        slideBox.slideUp(function(){
                            slideBox.css('visibility','hidden');
                        });
                    }
                    //$(this).parent().next('.slide-text-box').slideToggle();
                });
            }
            $('.tab-box-list').find('h4').off('click').on('click',function(){
                var that = $(this);
                var slideBox = that.next('.tab-box-list-text');
                var slib = that.parent().siblings();

                var li = that.parent('li');
                if(slideBox.length){
                    if(li.hasClass('active')){
                        li.removeClass('active');
                    }else{
                        slib.each(function(i,index){
                            if($(index).hasClass('active')){
                                $(index).find('h4').trigger('click');
                            }
                        });
                        
                        li.addClass('active');
                    }
                    slideBox.slideToggle();
                }
                return false;
            });
        },
        news:function(){
            // var swiper = new Swiper('.swiper-container', {
            //     pagination: '.news_list_title',
            //     paginationClickable: true,
            //     paginationBulletRender: function (index, className) {
            //         console.log(index,className)
            //         var tabArry = ['萃领研究','萃领快讯','萃领动态']
            //         return '<li class="' + className + '">' + tabArry[index] + '</li>';
            //     }
            // });
            if(!$('.news_list_title').length) return;
            $('.news_list_title li').on('click',function(){
                var _this = $(this),
                    index = _this.index();
                _this.addClass('current').siblings().removeClass('current');
                $('.tab-content').hide();
                $('.tab-content').eq(index).fadeIn(300);
                return false;
            });
            $('.news-item-head').hover(function(){
                var _this = $(this);
                _this.parent().addClass('hover');
            },function(){
                var _this = $(this);
                _this.parent().removeClass('hover');
            })
        }
    }
$(function(){
    lcApp.init();
})
    

