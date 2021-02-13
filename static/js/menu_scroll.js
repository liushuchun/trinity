function getEle(sExp, oParent){
            var aResult=[];
            var i=0;
            oParent || (oParent=document);
            if(oParent instanceof Array)
            {
                for(i=0;i<oParent.length;i++)aResult=aResult.concat(getEle(sExp, oParent[i]));
            }
            else if(typeof sExp=='object')
            {
                if(sExp instanceof Array)
                {
                    return sExp;
                }
                else
                {
                    return [sExp];
                }
            }
            else
            {
                if(/,/.test(sExp))
                {
                    var arr=sExp.split(/,+/);
                    for(i=0;i<arr.length;i++)aResult=aResult.concat(getEle(arr[i], oParent));
                }
                else if(/[ >]/.test(sExp))
                {
                    var aParent=[];
                    var aChild=[];
                    
                    var arr=sExp.split(/[ >]+/);
                    
                    aChild=[oParent];
                    
                    for(i=0;i<arr.length;i++)
                    {
                        aParent=aChild;
                        aChild=[];
                        for(j=0;j<aParent.length;j++)
                        {
                            aChild=aChild.concat(getEle(arr[i], aParent[j]));
                        }
                    }
                    
                    aResult=aChild;
                }
                else
                {
                    switch(sExp.charAt(0))
                    {
                        case '#':
                            return [document.getElementById(sExp.substring(1))];
                        case '.':
                            return getByClass(oParent, sExp.substring(1));
                        default:
                            // return [].append(oParent.getElementsByTagName(sExp));
                    }
                }
            }

            return aResult;
        }
        function getByClass(oParent, sClass)
        {
            var aEle=oParent.getElementsByTagName('*');
            var re=new RegExp('\\b'+sClass+'\\b', 'i');
            var aResult=[];
            
            for(var i=0;i<aEle.length;i++)
            {
                if(re.test(aEle[i].className))
                {
                    aResult.push(aEle[i]);
                }
            }
            
            return aResult;
        }
        flex=function (obj, cur, target, fnDo, fnEnd, fs, ms){
            var MAX_SPEED=16;
            
            if(!fs)fs=6;
            if(!ms)ms=0.75;
            var now={};
            var x=0;    //0-100
            
            if(!obj.__flex_v)obj.__flex_v=0;
            
            if(!obj.__last_timer)obj.__last_timer=0;
            var t=new Date().getTime();
            if(t-obj.__last_timer>20)
            {
                fnMove();
                obj.__last_timer=t;
            }
            
            clearInterval(obj.timer);
            obj.timer=setInterval(fnMove, 20);
            
            function fnMove(){
                obj.__flex_v+=(100-x)/fs;
                obj.__flex_v*=ms;

                if(Math.abs(obj.__flex_v)>MAX_SPEED)obj.__flex_v=obj.__flex_v>0?MAX_SPEED:-MAX_SPEED;
                
                x+=obj.__flex_v;
                
                for(var i in cur)
                {
                    now[i]=(target[i]-cur[i])*x/100+cur[i];
                }
                
                
                if(fnDo)fnDo.call(obj, now);
                
                if(Math.abs(obj.__flex_v)<1 && Math.abs(100-x)<1)
                {
                    clearInterval(obj.timer);
                    if(fnEnd)fnEnd.call(obj, target);
                    obj.__flex_v=0;
                }
            }
        };
        window.onload = function(){
            var aLi=document.getElementById('menu_item').getElementsByTagName('ul')[0].getElementsByTagName('li');;
            var oDiv=document.getElementById('menu_line');
            var timer=null;
            
            var initLeft=oDiv.offsetLeft;
            
            for(var i=0;i<aLi.length;i++)
            {
                aLi[i].onmouseover=function ()
                {   
                    clearTimeout(timer);
                    flex(oDiv, {left: oDiv.offsetLeft}, {left: this.offsetLeft}, function (now){
                        oDiv.style.left=Math.round(now.left+8)+'px';
                    });
                    //oDiv.style.left=this.offsetLeft-3+'px';
                };
                aLi[i].onmouseout=function ()
                {
                    clearTimeout(timer);
                    timer=setTimeout(function (){
                        flex(oDiv, {left: oDiv.offsetLeft}, {left: initLeft}, function (now){
                            oDiv.style.left=Math.round(now.left)+'px';
                        });
                    }, 100);
                };
            }
        }