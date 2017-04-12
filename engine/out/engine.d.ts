declare namespace engine {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        isPointInRectangle(point: Point): boolean;
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine {
    namespace RES {
        function getRes(path: string): HTMLImageElement;
        function loadConfig(callback: (completedImages) => void): void;
    }
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    function setTimeout(func: Function, delayTime: number): void;
    function setInterval(func: Function, delayTime: number): number;
    function clearInterval(key: number): void;
    class Ticker {
        private static instance;
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): number;
        unregister(input: Ticker_Listener_Type | number): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    interface Drawable {
        update(): any;
    }
    abstract class DisplayObject {
        type: string;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        alpha: number;
        globalAlpha: number;
        localMatrix: Matrix;
        globalMatrix: Matrix;
        parent: DisplayObjectContainer;
        eventArray: TouchEvents[];
        touchEnabled: boolean;
        constructor(type: string);
        update(): void;
        addEventListener(eventType: TouchEventsType, func: Function, target: DisplayObject, capture?: boolean): void;
        abstract hitTest(x: number, y: number): DisplayObject;
    }
    class Bitmap extends DisplayObject {
        image: HTMLImageElement;
        width: number;
        height: number;
        constructor(image?: HTMLImageElement);
        hitTest(x: number, y: number): this;
    }
    class Shape extends DisplayObject {
        width: number;
        height: number;
        color: string;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class TextField extends DisplayObject {
        text: string;
        textColor: string;
        textSize: number;
        textFont: string;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[];
        static instance: DisplayObjectContainer;
        static getInstance(): DisplayObjectContainer;
        constructor();
        update(): void;
        addChild(child: DisplayObject): void;
        hitTest(x: any, y: any): DisplayObject;
    }
    class MovieClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private static TOTAL_FRAME;
        private currentFrameIndex;
        private data;
        constructor(data: MovieClipData);
        ticker: (deltaTime: any) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: MovieClipData): void;
    }
}
declare namespace engine {
    enum TouchEventsType {
        MOUSEDOWN = 0,
        MOUSEUP = 1,
        CLICK = 2,
        MOUSEMOVE = 3,
        TOUCH_TAP = 4,
    }
    class TouchEventService {
        private _performerList;
        static instance: TouchEventService;
        static getInstance(): TouchEventService;
        addPerformer(performer: DisplayObject): void;
        splicePerformer(staNum: number, endNum: number): void;
        readonly performerList: DisplayObject[];
    }
    class TouchEvents {
        type: TouchEventsType;
        func: Function;
        target: DisplayObject;
        capture: boolean;
        constructor(type: TouchEventsType, func: Function, target: DisplayObject, capture: boolean);
    }
}
declare namespace engine {
    class Tween {
        private target;
        private onChange;
        private onFinish;
        private static tweens;
        private moving;
        private static getTweens();
        static removeTweens(target: DisplayObject): boolean;
        constructor(target: DisplayObject, properties?: {
            onChange?: Function;
            onFinish?: Function;
        });
        to(toTarget: any, time: number): void;
        private move(attribute, toTarget, time);
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}
