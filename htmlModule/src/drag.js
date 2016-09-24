/************适用于手机端与PC的滑动框架drag.js***********/
//构造器
function Drag(id, opt) {
    /*****初始化参数******/
    opt = opt ? opt : {};
    this.dragBox = document.getElementById(id);
    this.setWid = opt.width;
    this.setHei = opt.height;
    //函数调用
    this.init();
    //判断是否存在第二个参数
    (this.setWid || this.setHei) ? this.viewSet(): this.viewSet(true);
    this.sizeChange();
    this.bind();
}
//添加原型方法
Drag.prototype = {
    /*****初始化函数，获取窗口尺寸及相关数据*****/
    init: function() {
        //初始化浏览器窗口尺寸
        this.windowW = this.setWid || (window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth);
        this.windowH = this.setHei || (window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight);
        //初始化滑动主体
        //兼容DOM
        if (this.dragBox.children) { //chrome,FF,IE9++
            this.dragBody = this.dragBox.children[0];
            this.cell = this.dragBody.children;
        } else { //IE8--
            //判断滑块父元素的第一的子节点是否为空白节点，是则移除
            this.dragBox.childNodes[0] == 3 && /\s/.test(this.dragBox.childNodes[0]) ? this.dragBox.removeChild(this.dragBox.childNodes[0]) : null;
            //获取滑块
            this.dragBody = this.dragBox.childNodes[0];
            //获取滑块子元素并过滤空白节点
            for (var i = 0; i < this.dragBody.childNodes.length; i++) {
                var node = this.dragBody.childNodes[i];
                if (node.nodeType == 3 && /\s/.test(node)) {
                    this.dragBody.removeChild(node)
                }
            }
            this.cell = this.dragBody.childNodes;
        }
        //初始化里程
        this.index = 0;
    },
    /*****设置元素样式*****/
    viewSet: function(flag) { //flag 表示是否设置body为超出隐藏
        //缓存对象及属性
        var dragBox = this.dragBox;
        var dragBody = this.dragBody;
        var cell = this.cell;
        var bW = this.windowW;
        var bH = this.windowH;
        //设置样式
        flag ? document.body.style.overflow = "hidden" : null;
        dragBox.style.cssText = "width:" + bW + "px;height:" + bH + "px;position:relative;overflow:hidden;";
        dragBody.style.cssText = "width:" + bW + "px;position:absolute;left:0;top:0;list-style:none;margin:0;padding:0;";
        for (var i = 0; i < cell.length; i++) {
            cell[i].style.width = bW + "px";
            cell[i].style.height = bH + "px";
        }
    },
    /*****浏览器窗口发生改变时重置样式和相关数据*****/
    sizeChange: function() {
        var self = this;
        if (window.addEventListener) { //非低版本IE
            window.addEventListener('resize', function() {
                //浏览器大小发生变化重置窗口尺寸
                if (!self.setWid && self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                } else if (self.setWid && !self.setHei) {
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                } else if (!self.setWid && !self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                }
                //重置元素样式
                self.viewSet()
            }, false);
            window.addEventListener('orientationchange', function() {
                console.log(!self.setWid == true)
                    //浏览器大小发生变化重置窗口尺寸
                if (!self.setWid && self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                } else if (self.setWid && !self.setHei) {
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                } else if (!self.setWid && !self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                }
                //重置元素样式
                self.viewSet()
            }, false);
        } else { //低版本IE
            window.attachEvent('onresize', function() {
                //浏览器大小发生变化重置窗口尺寸
                if (!self.setWid && self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                } else if (self.setWid && !self.setHei) {
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                } else if (!self.setWid && !self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                }
                //重置元素样式
                self.viewSet()
            });
            window.attachEvent('onorientationchange', function() {
                //浏览器大小发生变化重置窗口尺寸
                if (!self.setWid && self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                } else if (self.setWid && !self.setHei) {
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                } else if (!self.setWid && !self.setHei) {
                    self.windowW = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
                    self.windowH = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
                }
                //重置元素样式
                self.viewSet()
            });
        }
    },
    /**********绑定鼠标事件**********/
    mouseBind: function() {
        var dragBox = this.dragBox;
        var dragBody = this.dragBody;
        var cell = this.cell;
        var bH = this.windowH;
        var self = this;
        /************鼠标拖拽效果*************/
        (function() {
            //开始拖拽
            var startDrag = function(event) {
                    //兼容时间对象
                    var e = event || window.event;
                    //阻止浏览器默认行为
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    //获取初始位置和时间
                    self.startY = e.clientY + self.index * bH;
                    self.startTime = new Date() * 1;
                    //绑定鼠标移动事件
                    dragBox.onmousemove = moveDrag;
                }
                //正在拖拽
            var moveDrag = function(event) {
                    //兼容时间对象
                    var e = event || window.event;
                    //阻止浏览器默认行为
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    //实时获取鼠标位置
                    self.endY = e.clientY - self.startY;

                    //滑块跟随
                    dragBody.style.top = self.endY + 'px';
                }
                //拖拽结束
            var endDrag = function(event) {
                    //兼容时间对象
                    var e = event || window.event;
                    //阻止浏览器默认行为
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    //计算鼠标位移,计算时间,设置行为
                    var shift = self.endY + self.index * bH;
                    var endTime = new Date() * 1 - self.startTime;
                    var scaleH = self.windowH / 20;
                    //执行翻页动画效果
                    if (endTime < 800) {
                        if (shift <= -100) {
                            self.go(1)
                        } else if (shift >= 100) {
                            self.go(-1)
                        } else {
                            self.go(0)
                        }
                    } else {
                        if (shift <= -scaleH) {
                            self.go(1)
                        } else if (shift >= scaleH) {
                            self.go(-1)
                        } else {
                            self.go(0)
                        }
                    }
                    //清除鼠标移动时间
                    dragBox.onmousemove = null;
                }
                //绑定开始，结束事件
            dragBox.onmousedown = startDrag;
            dragBox.onmouseup = endDrag;
        }());
        /*************鼠标中轮事件****************/
        (function() {
            //中轮滚动方向参数设置
            var scroDown = 0;
            var scroUp = 0;
            //中轮事件回调函数
            var scroFun = function(event) {
                var e = event || window.event;
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                if (e.wheelDelta) {
                    if (e.wheelDelta < 0) {
                        scroDown += 1;
                        if (scroDown % 10 == 0) {
                            self.go(1)
                            scroDown = 0;
                        }

                    } else if (e.wheelDelta > 0) {
                        scroUp += 1;
                        if (scroUp % 10 == 0) {
                            self.go(-1);
                            scroUp = 0;
                        }
                    }
                } else if (e.detail) {
                    if (e.detail > 0) {
                        scroDown += 1;
                        if (scroDown % 10 == 0) {
                            self.go(1)
                            scroDown = 0;
                        }
                    } else if (e.detail < 0) {
                        scroUp += 1;
                        if (scroUp % 10 == 0) {
                            self.go(-1);
                            scroUp = 0;
                        }
                    }
                }
            }
            //IE，chrome
            dragBox.onmousewheel = document.onmousewheel = scroFun;
            //FF
		    dragBox.addEventListener?dragBox.addEventListener('DOMMouseScroll', scroFun, false):null;
        }())
    },
    /**********兼容移动端，绑定手指事件************/
    touchBind: function() {
        var dragBox = this.dragBox;
        var dragBody = this.dragBody;
        var cell = this.cell;
        var bH = this.windowH;
        var self = this;
        //开始拖拽
        var startDrag = function(event) {
                //兼容时间对象
                var e = event || window.event;
                //阻止浏览器默认行为
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                //获取初始位置和时间
                self.startY = e.touches[0].pageY + self.index * bH;
                self.startTime = new Date() * 1;
            }
            //正在拖拽
        var moveDrag = function(event) {
                //兼容时间对象
                var e = event || window.event;
                //阻止浏览器默认行为
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                //实时获取鼠标位置
                self.endY = e.touches[0].pageY - self.startY;
                //滑块跟随
                dragBody.style.top = self.endY + 'px';
            }
            //拖拽结束
        var endDrag = function(event) {
                //兼容时间对象
                var e = event || window.event;
                //阻止浏览器默认行为
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                //计算鼠标位移,计算时间,设置行为
                var shift = self.endY + self.index * bH;
                var endTime = new Date() * 1 - self.startTime;
                var scaleH = self.windowH / 20;
                //执行翻页动画效果
                if (endTime < 800) {
                    if (shift <= -60) {
                        self.go(1)
                    } else if (shift >= 60) {
                        self.go(-1)
                    } else {
                        self.go(0)
                    }
                } else {
                    if (shift <= -scaleH) {
                        self.go(1)
                    } else if (shift >= scaleH) {
                        self.go(-1)
                    } else {
                        self.go(0)
                    }
                }
            }
            //绑定开始,移动,结束事件
        dragBox.addEventListener('touchstart', startDrag, false);
        dragBox.addEventListener('touchmove', moveDrag, false);
        dragBox.addEventListener('touchend', endDrag, false);
    },
    /************滑块位置处理函数************/
    go: function(n) {
        var cIndex = this.index;
        var bH = this.windowH;
        var len = this.cell.length;
        var dragBody = this.dragBody;
        var drops = this.dropBox.childNodes;
        //改变index
        cIndex = cIndex + n;
        //判断临界点
        if (cIndex < 0) {
            cIndex = 0;
        } else if (cIndex > len - 1) {
            cIndex = len - 1;
        }
        this.index = cIndex;
        //添加动画效果
        Animation(dragBody, {
            top: -cIndex * bH
        })
        //焦点高亮
        for(var i = 0;i < len;i++){
            drops[i].style.background ='#afabac';
        }
        drops[cIndex].style.background = '#04f793';
    },
    /**************判断是否为移动端，绑定对应事件*****************/
    bind: function() {
        //判断是否为移动端
        function isMob() {
            var userAgentInfo = window.navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = false;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        //选择执行的事件
        if(isMob()){
            this.touchBind();
            this.drop();
        }else {
            this.drop();
            this.dropBind();
            this.mouseBind();
        }
    },
    /*******创建右侧小焦点*******/
    drop:function(){
        if(this.isDrop==false){
            return false;
        }else {
            var dragBox = this.dragBox;
            var len = this.cell.length;
            //创建焦点容器及设置其样式
            this.dropBox = document.createElement('ul');
            this.dropBox.style.cssText = "position:absolute;right:10px;top:50%;margin-top:"+(15*len/2)*-1+"px";
            //创建焦点
            for(var i = 0;i < len;i++){
                var oDrop = document.createElement('li');
                oDrop.inx = i;
                oDrop.style.cssText = "width:10px;height:10px;list-style:none;background:#afabac;margin-bottom:5px;border-radius:50%;";
                oDrop.inx==0?oDrop.style.background = '#04f793':null;
                this.dropBox.appendChild(oDrop);
            }
            //元素插入
            dragBox.appendChild(this.dropBox)
        }
    },
    /*********焦点点击事件********/
    dropBind:function(){
        var self = this;
        var dropBox = self.dropBox;
        var dragBody = self.dragBody;
        var bH = self.windowH;
        dropBox.onclick = function(event){
            var e = event||window.event;
            e.stopPropagation?e.stopPropagation():e.cancelBubble = true;
            for(var i = 0;i < this.childNodes.length;i++){
                this.childNodes[i].style.background ='#afabac';
            }
            e.target.style.background = '#04f793';
            var cIndex = e.target.inx;
            Animation(dragBody,{top:-cIndex*bH});
            self.index = cIndex;
        }
    }
}
