var Util = {
    /**
     * 
     * 函数用于加载多个图片，urls为一个对象{ 图像名：图像url}，
     * images为一个对象，函数执行完成后images中存储{ 图像名：图像对象}
     * @param {Object} obj { urls, images } 
     * @returns 返回一个promise数组
     * 
     */
    preloadImg: function( urls, images ){

        var pr = [];

        if( typeof urls !== "object" || urls === null || urls === undefined ){
            return;
        }

        if( typeof images !== "object"){
            images = {};
        }

        for ( key in urls ){
            var p = loadImg( urls[key], key )
                    .then(function(argu){
                        images[argu[1]] = argu[0];
                    })
                    .catch(function(err){throw new Error(err);});
            pr.push(p);
        }

        return pr;

        function loadImg(url, key){
            return new Promise(function(resolve, reject){
                var img = new Image();
                img.src = url;
                img.onload = function(){

                    resolve([img, key]);

                }
            });
        }

    },
    //获取当前时间
    getCurentTime: function(){
        var now = new Date();
    
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
    
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
    
        var clock = year + "-";
    
        if(month < 10)
            clock += "0";
    
        clock += month + "-";
    
        if(day < 10)
            clock += "0";
        
        clock += day + " ";
    
        if(hh < 10)
            clock += "0";
        
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
    },
    getUrlVars: function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(decodeURIComponent(hash[0].toLowerCase())); //parameter names will always be queried in lowercase
            vars[hash[0].toLowerCase()] = decodeURIComponent(hash[1]);
        }
        return vars;
    },
    getBrowseInfo: function(){ 
        var browser = { 
                msie: false, firefox: false, opera: false, safari: false, 
                chrome: false, netscape: false, appname: 'unknown', version: 0 
            }, 
            userAgent = window.navigator.userAgent.toLowerCase(); 
        if ( /(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test( userAgent ) ){ 
            browser[RegExp.$1] = true; 
            browser.appname = RegExp.$1; 
            browser.version = RegExp.$2; 
        } else if ( /version\D+(\d[\d.]*).*safari/.test( userAgent ) ){ // safari 
            browser.safari = true; 
            browser.appname = 'safari'; 
            browser.version = RegExp.$2; 
        } 
        return browser.appname + browser.version; 
    } 
}