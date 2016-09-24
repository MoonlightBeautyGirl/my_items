function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj, false)[attr];
}
function Animation(dom,attr,times,fn) {
    if(dom.timer){
        clearInterval(dom.timer);
    }
    var _obj = {};
    var times =Math.floor(times/90) || 5;
    for(var key in attr){
        if(key=='opacity'){
            _obj[key] = parseFloat(getStyle(dom,key))*100;
        }else {
            _obj[key] = parseInt(getStyle(dom,key));
        }
    }
    dom.deg = -90;
    dom.timer = setInterval(function() {
        for(var key in attr){
            if (key=='opacity') {
                var end =Math.round(Math.cos(dom.deg * Math.PI / 180) * (attr[key]*100-_obj[key])) ;
                dom.style[key] = (_obj[key] + end)/100;
            }else {
                var end =Math.round(Math.cos(dom.deg * Math.PI / 180) * (attr[key]-_obj[key])) ;
                dom.style[key] = _obj[key] + end + 'px';
            }
        }
        dom.deg += 1;
        if (dom.deg == 0) {
            clearInterval(dom.timer);
            if(fn){
                fn()
            }
        }
    }, times);
}
