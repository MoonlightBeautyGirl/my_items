//获取元素的表象样式
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj, false)[attr];
}
//运动函数
function Animation(dom, attr, fn) {
    //清除已有计时器
    clearInterval(dom.timer);
    //绑定计时器
    dom.timer = setInterval(function () {
        //遍历样式
        var isStop = true;
        for (var key in attr) {
            //判断是否为不透明度,获取每帧起点
            if (key == 'opacity') {
                var start = parseFloat(getStyle(dom, key)) * 100;
                var end = attr[key] * 100;
            } else {
                var start = parseFloat(getStyle(dom, key));
                var end = attr[key];
            }
            //计算每帧改变的大小
            var len = (end - start) / 8 > 0 ? Math.ceil((end - start) / 20) : Math.floor((end - start) / 20);
            //临界判断
            if (start != attr[key]) {
                //赋值操作
                if (key == 'opacity') {
                    isStop = false;
                    dom.style[key] = (start += len) / 100;
                } else {
                    isStop = false;
                    dom.style[key] = (start += len) + 'px';
                }
            }
        }
        if (isStop == true) {
            //停止动画
            clearInterval(dom.timer);
            //判断是否执行回调函数
            if (fn) {
                fn()
            }
        }
    }, 10)
}
