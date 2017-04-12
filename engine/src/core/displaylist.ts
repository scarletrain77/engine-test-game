namespace engine {


    export type MovieClipData = {
        name: string,
        frames: MovieClipFrameData[]
    }

    export type MovieClipFrameData = {
        "image": string
    }


    export interface Drawable {
        update();
    }

    export abstract class DisplayObject {
        type = "DisplayObject";

        x = 0;
        y = 0;
        scaleX = 1;
        scaleY = 1;
        rotation = 0;

        alpha = 1;
        globalAlpha = 1;

        localMatrix: Matrix;
        globalMatrix: Matrix;
        parent: DisplayObjectContainer;

        eventArray: TouchEvents[] = [];
        touchEnabled = false;

        constructor(type: string) {
            this.type = type;
            this.localMatrix = new Matrix();
            this.globalMatrix = new Matrix();
        }

        // 模板方法模式        
        update() {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
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

        addEventListener(eventType: TouchEventsType, func: Function, target: DisplayObject, capture?: boolean) {
            if (this.touchEnabled == true) {
                let e = new TouchEvents(eventType, func, target, capture);
                this.eventArray.push(e);
            }
        }

        abstract hitTest(x: number, y: number): DisplayObject;
    }


    export class Bitmap extends DisplayObject {
        image: HTMLImageElement;
        width = -1;
        height = -1;
        constructor(image?: HTMLImageElement) {
            super("Bitmap");
            if (image) {
                this.image = image;
                this.width = image.width;
                this.height = image.height;
            }
        }

        hitTest(x: number, y: number) {
            console.log("Bitmap");
            let rect = new Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.image.width;
            rect.height = this.image.height;
            if (rect.isPointInRectangle(new Point(x, y))) {
                let instance = TouchEventService.getInstance();
                instance.addPerformer(this);
                // instance.performerList.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }

    export class Shape extends DisplayObject {
        width = 0;
        height = 0;
        color = "000000";
        constructor() {
            super("Shape");
        }
        hitTest(x: number, y: number) {
            console.log(x, y)
            console.log("shape");
            let rect = new Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.width;
            rect.height = this.height;
            if (rect.isPointInRectangle(new Point(x, y))) {
                let instance = TouchEventService.getInstance();
                instance.addPerformer(this);
                // instance.performerList.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }


    var fonts = {
        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }
    }

    export class TextField extends DisplayObject {

        text: string = "";
        textColor: string = "#000000"
        textSize = 12;
        textFont = "Calibri";
        constructor() {
            super("TextField");
        }

        hitTest(x: number, y: number) {
            console.log("text");
            var rect = new Rectangle();
            rect.height = 20;
            var point = new Point(x, y);
            if (rect.isPointInRectangle(point)) {
                let instance = TouchEventService.getInstance();
                instance.addPerformer(this);
                //instance.performerList.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }

    export class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[] = [];

        public static instance: DisplayObjectContainer;

        public static getInstance(){
            if(DisplayObjectContainer.instance == null){
                DisplayObjectContainer.instance = new DisplayObjectContainer();
            }
            return DisplayObjectContainer.instance;
        }

        constructor() {
            super("DisplayObjectContainer");
        }



        update() {
            super.update();
            for (let drawable of this.children) {
                drawable.update();
            }
        }

        addChild(child: DisplayObject) {
            this.children.push(child);
            child.parent = this;
        }

        hitTest(x, y) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                let child = this.children[i];
                let point = new Point(x, y);
                let invertChildLocalMatrix = invertMatrix(child.localMatrix);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildLocalMatrix);
                let hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                if (hitTestResult) {
                    let instance = TouchEventService.getInstance();
                    instance.addPerformer(this);
                    // instance.performerList.push(this);
                    return hitTestResult;
                }
            }
            return null;
        }

    }


    export class MovieClip extends Bitmap {
        private advancedTime: number = 0;
        private static FRAME_TIME = 20;
        private static TOTAL_FRAME = 10;
        private currentFrameIndex: number;
        private data: MovieClipData;

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let url = frameData.image;
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }

}