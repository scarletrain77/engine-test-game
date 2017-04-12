var engine;
(function (engine) {
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    engine.Point = Point;
    class Rectangle {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
        }
        isPointInRectangle(point) {
            let rect = this;
            if (point.x < rect.width + rect.x &&
                point.y < rect.height + rect.y &&
                point.x > rect.x &&
                point.y > rect.y) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    engine.Rectangle = Rectangle;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    engine.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    engine.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    engine.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    class Matrix {
        constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        toString() {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        }
        updateFromDisplayObject(x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        }
    }
    engine.Matrix = Matrix;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var RES;
    (function (RES) {
        var config = new Array();
        var RESOURCE_PATH = "././Resources/";
        function getRes(path) {
            let image = document.createElement("img");
            image.src = RESOURCE_PATH + path;
            if (onload) {
            }
            return image;
            /* return new Promise(function (resolve, reject) {
                 var result = new Image();
                 result.src = RESOURCE_PATH + path;
                 result.onload = () => {
                     resolve(result);
                 }
             });*/
        }
        RES.getRes = getRes;
        //config配置文件，没有实在图片
        //images：加载好的图片
        //image：当前正在加载的图片
        function loadConfig(callback) {
            var images = [];
            var i = 0;
            config.forEach((imageConfig) => {
                var image = new Image();
                image.width = imageConfig.width;
                image.height = imageConfig.height;
                image.name = imageConfig.texture;
                image.onload = () => {
                    i++;
                    images.push(image);
                    if (i == config.length - 1) {
                        callback(images);
                    }
                };
            });
        }
        RES.loadConfig = loadConfig;
    })(RES = engine.RES || (engine.RES = {}));
    class ResourcesData {
        constructor(texture, width, height) {
            this.width = -1;
            this.height = -1;
            this.texture = texture;
            if (width && height) {
                this.width = width;
                this.height = height;
            }
        }
    }
    var imageJason = {
        "image": [
            {
                "name": "senpai.png",
                "width": 10,
                "height": 10
            }
        ]
    };
})(engine || (engine = {}));
var engine;
(function (engine) {
    function setTimeout(func, delayTime) {
        var ticker = Ticker.getInstance();
        var passedTime = 0;
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func();
                ticker.unregister(delayFunc);
            }
        };
        ticker.register(delayFunc);
    }
    engine.setTimeout = setTimeout;
    function setInterval(func, delayTime) {
        var passedTime = 0;
        var ticker = Ticker.getInstance();
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func();
                passedTime -= delayTime;
            }
        };
        return ticker.register(delayFunc);
    }
    engine.setInterval = setInterval;
    function clearInterval(key) {
        Ticker.getInstance().unregister(key);
    }
    engine.clearInterval = clearInterval;
    class Ticker {
        constructor() {
            this.listeners = [];
        }
        static getInstance() {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }
        register(listener) {
            this.listeners.push(listener);
            return this.listeners.indexOf(listener);
        }
        unregister(input) {
            if (input instanceof Number) {
                this.listeners.splice(input, 1);
            }
            else {
                var index = this.listeners.indexOf(input);
                this.listeners.splice(index, 1);
            }
        }
        notify(deltaTime) {
            for (let listener of this.listeners) {
                listener(deltaTime);
            }
        }
    }
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    class DisplayObject {
        constructor(type) {
            this.type = "DisplayObject";
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.alpha = 1;
            this.globalAlpha = 1;
            this.eventArray = [];
            this.touchEnabled = false;
            this.type = type;
            this.localMatrix = new engine.Matrix();
            this.globalMatrix = new engine.Matrix();
        }
        // 模板方法模式        
        update() {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = engine.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = this.localMatrix;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
            }
            else {
                this.globalAlpha = this.alpha;
            }
        }
        addEventListener(eventType, func, target, capture) {
            if (this.touchEnabled == true) {
                let e = new engine.TouchEvents(eventType, func, target, capture);
                this.eventArray.push(e);
            }
        }
    }
    engine.DisplayObject = DisplayObject;
    class Bitmap extends DisplayObject {
        constructor(image) {
            super("Bitmap");
            this.width = -1;
            this.height = -1;
            if (image) {
                this.image = image;
                this.width = image.width;
                this.height = image.height;
            }
        }
        hitTest(x, y) {
            console.log("Bitmap");
            let rect = new engine.Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.image.width;
            rect.height = this.image.height;
            if (rect.isPointInRectangle(new engine.Point(x, y))) {
                let instance = engine.TouchEventService.getInstance();
                instance.addPerformer(this);
                // instance.performerList.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }
    engine.Bitmap = Bitmap;
    class Shape extends DisplayObject {
        constructor() {
            super("Shape");
            this.width = 0;
            this.height = 0;
            this.color = "000000";
        }
        hitTest(x, y) {
            console.log(x, y);
            console.log("shape");
            let rect = new engine.Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.width;
            rect.height = this.height;
            if (rect.isPointInRectangle(new engine.Point(x, y))) {
                let instance = engine.TouchEventService.getInstance();
                instance.addPerformer(this);
                // instance.performerList.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }
    engine.Shape = Shape;
    var fonts = {
        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }
    };
    class TextField extends DisplayObject {
        constructor() {
            super("TextField");
            this.text = "";
            this.textColor = "#000000";
            this.textSize = 12;
            this.textFont = "Calibri";
        }
        hitTest(x, y) {
            console.log("text");
            var rect = new engine.Rectangle();
            rect.height = 20;
            var point = new engine.Point(x, y);
            if (rect.isPointInRectangle(point)) {
                let instance = engine.TouchEventService.getInstance();
                instance.addPerformer(this);
                //instance.performerList.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }
    engine.TextField = TextField;
    class DisplayObjectContainer extends DisplayObject {
        constructor() {
            super("DisplayObjectContainer");
            this.children = [];
        }
        static getInstance() {
            if (DisplayObjectContainer.instance == null) {
                DisplayObjectContainer.instance = new DisplayObjectContainer();
            }
            return DisplayObjectContainer.instance;
        }
        update() {
            super.update();
            for (let drawable of this.children) {
                drawable.update();
            }
        }
        addChild(child) {
            this.children.push(child);
            child.parent = this;
        }
        hitTest(x, y) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                let child = this.children[i];
                let point = new engine.Point(x, y);
                let invertChildLocalMatrix = engine.invertMatrix(child.localMatrix);
                let pointBaseOnChild = engine.pointAppendMatrix(point, invertChildLocalMatrix);
                let hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                if (hitTestResult) {
                    let instance = engine.TouchEventService.getInstance();
                    instance.addPerformer(this);
                    // instance.performerList.push(this);
                    return hitTestResult;
                }
            }
            return null;
        }
    }
    engine.DisplayObjectContainer = DisplayObjectContainer;
    class MovieClip extends Bitmap {
        constructor(data) {
            super();
            this.advancedTime = 0;
            this.ticker = (deltaTime) => {
                // this.removeChild();
                this.advancedTime += deltaTime;
                if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                    this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
                }
                this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);
                let data = this.data;
                let frameData = data.frames[this.currentFrameIndex];
                let url = frameData.image;
            };
            this.setMovieClipData(data);
            this.play();
        }
        play() {
            engine.Ticker.getInstance().register(this.ticker);
        }
        stop() {
            engine.Ticker.getInstance().unregister(this.ticker);
        }
        setMovieClipData(data) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 
        }
    }
    MovieClip.FRAME_TIME = 20;
    MovieClip.TOTAL_FRAME = 10;
    engine.MovieClip = MovieClip;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var TouchEventsType;
    (function (TouchEventsType) {
        TouchEventsType[TouchEventsType["MOUSEDOWN"] = 0] = "MOUSEDOWN";
        TouchEventsType[TouchEventsType["MOUSEUP"] = 1] = "MOUSEUP";
        TouchEventsType[TouchEventsType["CLICK"] = 2] = "CLICK";
        TouchEventsType[TouchEventsType["MOUSEMOVE"] = 3] = "MOUSEMOVE";
        TouchEventsType[TouchEventsType["TOUCH_TAP"] = 4] = "TOUCH_TAP";
    })(TouchEventsType = engine.TouchEventsType || (engine.TouchEventsType = {}));
    class TouchEventService {
        constructor() {
            this._performerList = [];
        }
        static getInstance() {
            if (TouchEventService.instance == null) {
                TouchEventService.instance = new TouchEventService();
            }
            return TouchEventService.instance;
        }
        addPerformer(performer) {
            this._performerList.push(performer);
        }
        splicePerformer(staNum, endNum) {
            this._performerList.splice(staNum, endNum);
        }
        get performerList() {
            return this._performerList;
        }
    }
    engine.TouchEventService = TouchEventService;
    class TouchEvents {
        constructor(type, func, target, capture) {
            this.type = TouchEventsType.CLICK;
            this.capture = false;
            this.type = type;
            this.func = func;
            this.target = target;
            this.capture = capture || false;
        }
    }
    engine.TouchEvents = TouchEvents;
})(engine || (engine = {}));
//tween实在不会直接复制了孟彦宁的作业
var engine;
(function (engine) {
    class Tween {
        constructor(target, properties) {
            this.moving = [];
            this.target = target;
            if (properties) {
                this.onChange = properties.onChange || null;
                this.onFinish = properties.onFinish || null;
            }
            Tween.getTweens().set(target, this);
        }
        static getTweens() {
            if (Tween.tweens == null)
                Tween.tweens = new Map();
            return Tween.tweens;
        }
        static removeTweens(target) {
            delete Tween.getTweens().get(target);
            return Tween.getTweens().delete(target);
        }
        to(toTarget, time) {
            for (var attribute in toTarget) {
                if (this.target[attribute] != undefined) {
                    //check是否有在动
                    for (var i = 0; i < this.moving.length; i++) {
                        var current = this.moving[i];
                        if (current.attribute == attribute) {
                            //Ticker.getInstance().unregister();
                        }
                    }
                    //move
                    var key = this.move(attribute, toTarget, time);
                    //record
                    //this.moving.push({ attribute: attribute, key: key });
                }
            }
        }
        move(attribute, toTarget, time) {
            var originValue = this.target[attribute];
            var targetValue = toTarget[attribute];
            var speed = (targetValue - originValue) / time;
            var key = engine.setInterval((deltaTime) => {
                originValue += (speed * deltaTime);
                this.target[attribute] = originValue;
                if (this.onChange)
                    this.onChange();
            }, 1000 / 1000);
            engine.setTimeout(() => {
                //Ticker.getInstance().unregister(key);
                if (this.onFinish)
                    this.onFinish();
            }, time);
            //return key;
        }
    }
    engine.Tween = Tween;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = (canvas) => {
        var stage = engine.DisplayObjectContainer.getInstance();
        let context2D = canvas.getContext("2d");
        let renderer = new CanvasRenderer(stage, context2D);
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            renderer.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        let hitResult;
        let currentX;
        let currentY;
        let lastX;
        let lastY;
        let isMouseDown = false;
        window.onmousedown = (e) => {
            isMouseDown = true;
            let targetArray = engine.TouchEventService.getInstance().performerList;
            engine.TouchEventService.getInstance().splicePerformer(0, engine.TouchEventService.getInstance().performerList.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
        };
        window.onmousemove = (e) => {
            let performerList = engine.TouchEventService.getInstance().performerList;
            lastX = currentX;
            lastY = currentY;
            currentX = e.offsetX;
            currentY = e.offsetY;
            if (isMouseDown) {
                for (let i = 0; i < performerList.length; i++) {
                    for (let x of performerList[i].eventArray) {
                        if (x.type == engine.TouchEventsType.MOUSEDOWN && x.capture == true) {
                            x.func(e);
                        }
                    }
                }
                for (let i = performerList.length - 1; i >= 0; i--) {
                    for (let x of performerList[i].eventArray) {
                        if (x.type == engine.TouchEventsType.MOUSEMOVE && x.capture == false) {
                            x.func(e);
                        }
                    }
                }
            }
        };
        window.onmouseup = (e) => {
            isMouseDown = false;
            let performerList = engine.TouchEventService.getInstance().performerList;
            performerList.splice(0, performerList.length);
            let newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (let i = 0; i < performerList.length; i++) {
                for (let x of performerList[i].eventArray) {
                    if (x.type == engine.TouchEventsType.CLICK && newHitRusult == hitResult && x.capture == true) {
                        x.func(e);
                    }
                }
            }
            for (let i = performerList.length - 1; i >= 0; i--) {
                for (let x of performerList[i].eventArray) {
                    if (x.type == engine.TouchEventsType.CLICK && newHitRusult == hitResult && x.capture == false) {
                        x.func(e);
                    }
                }
            }
        };
        return stage;
    };
    class CanvasRenderer {
        constructor(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }
        renderContainer(container) {
            for (let child of container.children) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child);
                }
                else if (child.type == "Shape") {
                    this.renderShape(child);
                }
            }
        }
        renderBitmap(bitmap) {
            this.context2D.drawImage(bitmap.image, 0, 0);
        }
        renderTextField(textField) {
            this.context2D.fillStyle = textField.textColor.toLocaleUpperCase();
            this.context2D.font = textField.textSize.toString() + "pt " + textField.textFont;
            this.context2D.fillText(textField.text, 0, 0);
        }
        renderShape(shape) {
            this.context2D.fillStyle = shape.color.toLocaleUpperCase();
            this.context2D.fillRect(0, 0, shape.width, shape.height);
        }
    }
})(engine || (engine = {}));
