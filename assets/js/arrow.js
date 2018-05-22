(function($){
    /**
     * 
     * @param {Object} canvasId string canvas的id
     * @param {Object} options.fullScreen boolean 是否充满全屏，默认true
     * @param {Object} options.arrowLength 箭的数量，默认6
     * @param {Object} options.origWidth 初始画布宽度，默认1920px
     * @param {Object} options.lemonImg 柠檬图片
     * @param {Object} options.arrowSImg 示例的小箭
     * @param {Object} options.arrowMImg 射出的大箭
     * @param {Object} options.arrowHImg 插入柠檬的箭
     * @param {Object} options.bowImg 插入柠檬的箭
     * @param {Object} options.winImg 插入柠檬的箭
     * @param {Object} options.loseImg 插入柠檬的箭
     * @param {Object} options.loseImg 插入柠檬的箭
     * 
     */

    $.fn.Archery = function(canvasId, options){

        var _default = {
            arrowLength: 6,
            fullScreen: true,
            origWidth: 1920,
            origHeight: 1080,
            range: [Math.PI*10/180, Math.PI*50/180, 
                    Math.PI*70/180, Math.PI*110/180,
                    Math.PI*125/180, Math.PI*165/180,
                    Math.PI*190/180, Math.PI*225/180,
                    Math.PI*250/180, Math.PI*290/180,
                    Math.PI*310/180, Math.PI*345/180]
        }

        $.extend(_default,options);

        var _this = this[0],
            that,
            stageCtx = _this.getContext("2d"),
            lemon,
            animateTimer,
            arrowM,
            arrowS,
            arrowH,
            occup,
            occupy,
            speed,
            accel,
            curAngel,
            count,
            wheelUpd,
            bowUpd,
            win,
            lose,
            begin,
            rule,
            postpone,
            arrowLength,
            handp,
            arrowA,
            range = _default.range;

            // stageCtx.translate(_this.width/2, _this.height/2);

        //初始化转盘画布
        var wheel = document.createElement("canvas");
        wheel.width = _this.width;
        wheel.height = _this.height;
        wheelCtx = wheel.getContext("2d");

        //初始化柠檬
        lemon = document.createElement("canvas");
        lemon.width = 488;
        lemon.height = 488;
        lemonCtx = lemon.getContext("2d");
        lemonCtx.drawImage(_default.lemonImg,0,0);

        //初始化箭h
        arrowH = document.createElement("canvas");
        arrowH.width = 214;
        arrowH.height = 51;
        arrowHCtx = arrowH.getContext("2d");
        arrowHCtx.drawImage(_default.arrowHImg,0,0);

        //初始化弓箭画布
        var offBow = document.createElement("canvas");
        offBow.width = _this.width;
        offBow.height = _this.height;
        offBowCtx = offBow.getContext("2d");
        // offBowCtx.drawImage(_default.bowImg,0,0);

        //初始化弓
        var bow = document.createElement("canvas");
        bow.width = 237;
        bow.height = 204;
        bowCtx = bow.getContext("2d");
        bowCtx.drawImage(_default.bowImg,0,0);

        //初始化箭m
        var arrowM = document.createElement("canvas");
        arrowM.width = 237;
        arrowM.height = 204;
        arrowMCtx = arrowM.getContext("2d");
        arrowMCtx.drawImage(_default.arrowMImg,0,0);

        //初始化箭s
        var arrowS = document.createElement("canvas");
        arrowS.width = 237;
        arrowS.height = 204;
        arrowSCtx = arrowS.getContext("2d");
        arrowSCtx.drawImage(_default.arrowSImg,0,0);

        //初始化箭hand
        var hand = document.createElement("canvas");
        hand.width = 237;
        hand.height = 204;
        handCtx = hand.getContext("2d");
        handCtx.drawImage(_default.handImg,0,0);

        //初始化text
        var text = [];
        for( var jj=0; jj<6; jj++){

            var tmpT = document.createElement("canvas");
            tmpT.width = _this.width;
            tmpT.height = _this.height;
            tmpTCtx = tmpT.getContext("2d");
            tmpTCtx.drawImage(_default["text"+jj],0,0);

            text.push(tmpT);
        }

        //初始化rules按钮
        var ruleC = document.createElement("canvas");
        ruleC.width = _this.width;
        ruleC.height = _this.height;
        ruleCtx = ruleC.getContext("2d");
        ruleCtx.drawImage(_default.ruleImg,0,0);

        //初始化rules text
        var ruleTC = document.createElement("canvas");
        ruleTC.width = _this.width;
        ruleTC.height = _this.height;
        ruleTCtx = ruleTC.getContext("2d");
        ruleTCtx.drawImage(_default.ruleTextImg,0,0);
        
        //初始化win画布
        var winC = document.createElement("canvas");
        winC.width = _this.width;
        winC.height = _this.height;
        winCtx = winC.getContext("2d");
        winCtx.drawImage(_default.winImg,0,0);

        //初始化lose画布
        var loseC = document.createElement("canvas");
        loseC.width = _this.width;
        loseC.height = _this.height;
        loseCtx = loseC.getContext("2d");
        loseCtx.drawImage(_default.loseImg,0,0);

        //初始化begin画布
        var beginC = document.createElement("canvas");
        beginC.width = _this.width;
        beginC.height = _this.height;
        beginCtx = beginC.getContext("2d");
        beginCtx.drawImage(_default.beginImg,0,0);
        beginCtx.drawImage(_default.logoImg,0,0);
        

        // if( _default.fullScreen ){
        //     var scaleX = window.innerWidth / _this.width ;
        //     var scaleY = window.innerHeight / _this.height;

        //     var scaleToFit = Math.min( scaleX, scaleY);

        //     _this.style.transformOrigin = "0 0";
        //     _this.style.transform = "scale(" + scaleToFit + ")";

        // }
        

        return {

            init: function(){

                // console.log("init");

                window.cancelAnimationFrame(animateTimer);
                that = this;

                //初始化参数
                occup = [];
                occupy = [ false, false, false, false, false, false];
                speed = Math.PI / 80;
                accel = 1;
                curAngel = 0;
                count = 0;
                wheelUpd = true;
                bowUpd = true;
                win = false;
                lose = false;
                begin = true;
                rule = false;
                postpone = 20;
                arrowLength = _default.arrowLength;
                handp = 70;
                arrowA = 0;
                
                $("#"+canvasId).off();

                $("#"+canvasId).on("touchstart", function(e){

                    // console.log("initclick");
                    // console.log(e);
                    var X = e.originalEvent.touches[0].pageX,
                        Y = e.originalEvent.touches[0].pageY;
    
                    if ( X > 763 && X < 1156 && Y > 844 && Y < 973 ){
    
                        that.play();
    
                    }
    
                });

                animateTimer = window.requestAnimationFrame(this.stageRender);

            },
            wheelUpdate: function() {
                
                // console.log("wheelUpdate");
                wheelCtx.save();

                //转移终点
                wheelCtx.translate(wheel.width/2, wheel.height/2 - 40);

                // 清除离屏画布
                wheelCtx.clearRect(-wheel.width/2, - ( wheel.height/2 - 40 ), wheel.width, wheel.height);
                
                wheelCtx.rotate(curAngel);

                wheelCtx.drawImage(lemon, -244, -244);
                
                for (var i = 0, l = occup.length; i < l; i++ ){
                    
                    wheelCtx.save();

                    wheelCtx.rotate(occup[i]);

                    wheelCtx.drawImage(arrowH, 244 - 90, -23);
                    
                    wheelCtx.restore();

                }

                wheelCtx.restore();

                if( !win && !lose ){

                    curAngel = ( curAngel + speed * accel ) % ( 2 * Math.PI ) ;

                }

            },
            play: function(){

                // console.log("play");

                begin = false;
                that = this;
                
                window.cancelAnimationFrame(animateTimer);

                animateTimer = window.requestAnimationFrame(this.stageRender);

                // console.log(this);

                $("#"+canvasId).off();

                $("#"+canvasId).on("touchstart", function(e){

                    // console.log("play");
                    // console.log(e);
                    var X = e.originalEvent.touches[0].pageX,
                        Y = e.originalEvent.touches[0].pageY;
    
                    if ( X > 845 && X < 1077 && Y > 886 && Y < 1080 ){
    
                        that.shoot();
    
                    } 

                    if ( X > 89 && X < 357 && Y > 948 && Y < 1029 ){
    
                        // that.shoot();
                        that.rule();
                        // console.log("rule");
    
                    } 
    
                });

            },
            shoot: function() {

                var absoAngel =  ( 2 * Math.PI - curAngel + Math.PI / 2 ) % (2 * Math.PI );

                var current = count;

                arrowLength--;

                // console.log( "shoot" );
                
                occup.push( absoAngel );

                
                // console.log(absoAngel);
                // console.log(range);

                for( var ii = 0; ii < 6; ii++ ){

                    if(  absoAngel > range[ii*2] 
                    && absoAngel <= range[ii*2 + 1]
                    && !occupy[ii] ){
                        
                        occupy[ii] = true;

                        count++;

                        if ( count == 6 ){

                            this.win();
                            break;
                        }

                        // console.log(count);
                        // console.log(occupy);

                    } else if ( absoAngel > range[ii*2] 
                                && absoAngel <= range[ii*2 + 1]
                                && occupy[ii] ) {

                                this.lose();
                                
                                break;

                                // console.log(count);
                                // console.log(occupy);

                    } 

                }

                if( current == count ){

                    this.lose();

                } 

                arrowA = 2;

            },
            bowUpdate: function(){

                offBowCtx.save();

                offBowCtx.clearRect(0, 0, offBow.width, offBow.height);

                offBowCtx.drawImage(bow, Math.floor( (_this.width - 237) / 2 ), _this.height - 204);

                offBowCtx.drawImage(ruleC, 0, 0); 

                if( arrowA == 0 ){

                    offBowCtx.drawImage(arrowM, Math.floor( (_this.width - 237) / 2 ) + 94, _this.height - 204);

                } else {

                    offBowCtx.drawImage(arrowM, Math.floor( (_this.width - 237) / 2 ) + 94, _this.height - 204 - 50*arrowA);

                    offBowCtx.drawImage(arrowM, Math.floor( (_this.width - 237) / 2 ) + 94, _this.height - 104 - 50*arrowA);

                    arrowA--;
                }

                // for( var i=0,l=_default.arrowLength; i<l; i++){
                for( var i=0,l=arrowLength; i < (l-1); i++){

                    offBowCtx.drawImage(arrowS, _this.width - 84 - 41*i , 60); 

                }

                for( var j=0; j < count; j++){

                    offBowCtx.drawImage(text[j], 0, 0); 

                }

                if( handp > 0 ){

                    offBowCtx.drawImage(hand, Math.floor( (_this.width - 237) / 2 ) + 75, _this.height - 300 + 2*handp); 

                    handp--;

                }


                offBowCtx.restore();

            },
            win: function() {

                win = true;
                that = this;

                $("#"+canvasId).off();

                $("#"+canvasId).on("touchstart", function(e){

                    // console.log("win");
                    
                    var X = e.originalEvent.touches[0].pageX,
                        Y = e.originalEvent.touches[0].pageY;
    
                    if ( X > 768 && X < 1123 && Y > 643 && Y < 740 ){
    
                        that.init();
    
                    }
    
                });

            },
            lose: function() {

                lose = true;
                that = this;

                // console.log("lose");

                $("#"+canvasId).off();

                $("#"+canvasId).on("touchstart", function(e){

                    // console.log("lose");
                    
                    var X = e.originalEvent.touches[0].pageX,
                        Y = e.originalEvent.touches[0].pageY;
    
                    if ( X > 795 && X < 1137 && Y > 702 && Y < 804 ){
    
                        that.init();
    
                    }
    
                });

            },
            rule: function() {

                rule = true;
                that = this;

                // console.log("rule text");

                $("#"+canvasId).off();

                $("#"+canvasId).on("touchstart", function(e){

                    // console.log("rule text");
                    // console.log(e);
                    
                    var X = e.originalEvent.touches[0].pageX,
                        Y = e.originalEvent.touches[0].pageY;
    
                    if ( X > 910 && X < 1058 && Y > 763 && Y < 829 ){
    
                        rule = false;
                        that.play();
    
                    }
    
                });

            },
            begin: function(){

                begin = false;

                that = this;
                
                animateTimer = window.requestAnimationFrame(this.stageRender);

            },
            stop: function(){

                window.cancelAnimationFrame(animateTimer);
                return "Stoped!";

            },
            stageRender: function() {
                // console.log(this.begin);

                stageCtx.clearRect(0, 0,  _this.width, _this.height);

                // if( stageUpdate ){

                    // stageUpdate();
                // }

                if( begin ){
                    
                    stageCtx.drawImage(beginC, 0, 0);

                    return;

                }

                if( wheelUpd ){
                    that.wheelUpdate();
                }
                stageCtx.drawImage(wheel, 0, 0);

                if( bowUpd ){
                    that.bowUpdate();
                }
                stageCtx.drawImage(offBow, 0, 0);

                // if( shootUpd ){

                //     // stageCtx.drawImage(offBow, Math.floor( (_this.width - 237) / 2 ), _this.height - 204);
                //     shootUpdate();

                // }
                // stageCtx.drawImage(shoot, 0, 0);

                if( rule ){
                    stageCtx.drawImage(ruleTC, 0, 0);
                }

                if( win ){
                    postpone--;
                    if( postpone < 0 ){
                        stageCtx.drawImage(winC, 0, 0);
                        // postpone++;
                        that.stop();
                    }
                }

                if( lose ){
                    postpone--;
                    if( postpone < 0 ){
                        stageCtx.drawImage(loseC, 0, 0);
                        // postpone++;
                        that.stop();
                    }
                }

                // console.log(that);
                animateTimer = window.requestAnimationFrame(that.stageRender);
                
            }

        }

    }

})(jQuery)