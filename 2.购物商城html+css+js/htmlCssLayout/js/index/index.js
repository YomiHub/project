window.onload = function() {
    MV.app.toInput();  //搜索框内容的变化
    MV.app.tochangeImg();  //轮播器
    MV.app.toselect();
    MV.app.toRun();
}

var MV = {}; //命名空间

MV.app = {}; //应用

//搜索框内容的变化
MV.app.toInput = function() {
    var inputOne = document.getElementById('searchOne');
    var inputTwo = document.getElementById('searchTwo');

    MV.ui.textChange(inputOne, 'Search website');
    MV.ui.textChange(inputTwo, 'Search website');
}

 
MV.app.tochangeImg = function() {
    var Oad = document.getElementById('contentAd');
    var aLi = Oad.getElementsByTagName('li');
    var isNow = 0;

    var prevBg = MV.tools.getClass(Oad, 'prevBg')[0];
    var nextBg = MV.tools.getClass(Oad, 'nextBg')[0];
    var prev = MV.tools.getClass(Oad, 'prev')[0];
    var next = MV.tools.getClass(Oad, 'next')[0];

    var timer = setInterval(autoPlay, 3000);

    prevBg.onmouseover = prev.onmouseover = function() {
        overChange(prev);
    }

    prevBg.onmouseout = prev.onmouseout = function() {
        outChange(prev)
    }

    nextBg.onmouseover = next.onmouseover = function() {
        overChange(next);
    }

    nextBg.onmouseout = next.onmouseout = function() {
        outChange(next)
    }

    prev.onclick = function() {
        autoPlayPre();
    }


    next.onclick = function() {
        autoPlay();
    }

    function autoPlay() {
        if (isNow == aLi.length - 1) {
            isNow = 0;
        } else {
            isNow++;
        }

        for (var i = 0; i < aLi.length; i++) {
            MV.ui.fadeOut(aLi[i]);
        }

        MV.ui.fadeIn(aLi[isNow]);
    }

    function autoPlayPre() {
        if (isNow == 0) {
            isNow = aLi.length - 1;
        } else {
            isNow--;
        }

        for (var i = 0; i < aLi.length; i++) {
            MV.ui.fadeOut(aLi[i]);
        }

        MV.ui.fadeIn(aLi[isNow]);
    }

    function overChange(elm) {
        clearInterval(timer);
        elm.style.display = 'block';
    }

    function outChange(elm) {
        clearInterval(timer);
        elm.style.display = 'none';
        timer = setInterval(autoPlay, 3000);
    }

}

//下拉选择框
MV.app.toselect = function() {
    var mainRight = document.getElementById('mainRight');
    var oRightTop = MV.tools.getClass(mainRight, 'rightTop')[0];
    var aDd = oRightTop.getElementsByTagName('dd');
    var aUl = oRightTop.getElementsByTagName('ul');
    var aH2 = oRightTop.getElementsByTagName('h2');

    for (var i = 0; i < aDd.length; i++) {
        aDd[i].index = i;

        aDd[i].onclick = function(ev) {
            var that = this;
            var ev = ev || window.event; //需要获取和事件相关的信息时使用

            for (var i = 0; i < aUl.length; i++) {
                aUl[i].style.display = 'none';
            }

            aUl[this.index].style.display = 'block';

            document.onclick = function() {
                aUl[that.index].style.display = 'none';
            }

            ev.cancelBubble = true; //阻止冒泡事件
        }
    }

    for (var i = 0; i < aUl.length; i++) {
        aUl[i].index = i;
        (function(ul) {
            var aLi = ul.getElementsByTagName('li');

            for (var i = 0; i < aLi.length; i++) {
                aLi[i].onmouseover = function() {
                    this.className = 'active';
                }

                aLi[i].onmouseout = function() {
                    this.className = '';
                }

                aLi[i].onclick = function(ev) {
                    var ev = ev || window.event;

                    aH2[this.parentNode.index].innerHTML = this.innerHTML;

                    ev.cancelBubble = true;
                    this.parentNode.style.display = 'none';
                }
            }

        })(aUl[i]) //使用闭包，读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中
    }
}

MV.app.toRun = function() {
    var OlistWrapRight = document.getElementById('listWrapRight');
    var Oul = OlistWrapRight.getElementsByTagName('ul')[0];
    var aLi = OlistWrapRight.getElementsByTagName('li');

    var Oprev = MV.tools.getClass(OlistWrapRight, 'prev')[0];
    var Onext = MV.tools.getClass(OlistWrapRight, 'next')[0];
    var iNow = 0;

    Oul.innerHTML += Oul.innerHTML;
    Oul.style.width = aLi.length * aLi[0].offsetWidth + 'px';

    Oprev.onclick = function() {
        if (iNow == 0) {
            iNow = aLi.length / 2;
            Oul.style.left = -(aLi.length / 2) * aLi[0].offsetWidth + 'px';
        }
        MV.ui.moveLeft(Oul, -iNow * aLi[0].offsetWidth, -(iNow - 1) * aLi[0].offsetWidth)
        iNow--;
    }

    Onext.onclick = function() {
        if (iNow == aLi.length / 2) {
            iNow = 0;
            Oul.style.left = 0;
        }

        MV.ui.moveLeft(Oul, -iNow * aLi[0].offsetWidth, -(iNow + 1) * aLi[0].offsetWidth)
        iNow++;
    }

}

MV.ui = {}; //组件

//点击输入框，清除、显示默认的value
MV.ui.textChange = function(obj, str) {
    obj.onfocus = function() {
        if (this.value == str) {
            this.value = '';
        }
    }

    obj.onblur = function() {
        if (this.value == '') {
            this.value = str;
        }
    }
}

//控制元素淡入的效果
MV.ui.fadeIn = function(obj) {
    var opc = MV.tools.getStyle(obj, 'opacity');
    if (opc == 1) {
        return false; //有些元素本身的透明度就是1，不需要改变
    }

    var value = 0;

    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var speed = 5;

        if (value == 100) {
            clearInterval(obj.timer);
        } else {
            value += speed;
            obj.style.opacity = value / 100;
            obj.style.filter = 'alpha(opacity=' + value + ')';
        }
    }, 30)
}


//控制元素淡出的效果
MV.ui.fadeOut = function(obj) {
    var opc = MV.tools.getStyle(obj, 'opacity');
    if (opc == 0) {
        return false;
    }

    var value = 100;

    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var speed = 5;

        if (value == 0) {
            clearInterval(obj.timer);
        } else {
            value -= speed;
            obj.style.opacity = value / 100;
            obj.style.filter = 'alpha(opacity=' + value + ')';
        }
    }, 30)
}

//通过设置left让元素向左运动
MV.ui.moveLeft = function(obj, old, now) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var speed = (now - old) / 10;

        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //为达到目标点，需要进行取整 

        if (now == old) {
            clearInterval(obj.timer);
        } else {
            old += speed;
            obj.style.left = old + 'px';
        }
    }, 30)

}

MV.tools = {};

//通过class获取元素，并且兼容
MV.tools.getClass = function(oParent, classN) {
    aEle = oParent.getElementsByTagName('*');
    var arr = [];

    for (var i = 0; i < aEle.length; i++) {
        if (aEle[i].className == classN) {
            arr.push(aEle[i]);
        }
    }
    return arr;
}

//获取元素的样式
MV.tools.getStyle = function(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}