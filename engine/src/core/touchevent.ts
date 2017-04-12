namespace engine {
    export enum TouchEventsType {
        MOUSEDOWN,
        MOUSEUP,
        CLICK,
        MOUSEMOVE,
        TOUCH_TAP
    }

    export class TouchEventService {
        private _performerList: DisplayObject[] = [];
        public static instance: TouchEventService;
        public static getInstance() {
            if (TouchEventService.instance == null) {
                TouchEventService.instance = new TouchEventService();
            }
            return TouchEventService.instance;
        }

        addPerformer(performer: DisplayObject){
            this._performerList.push(performer);
        }

        splicePerformer(staNum: number, endNum: number){
            this._performerList.splice(staNum, endNum);
        }

        get performerList(){
            return this._performerList;
        }
    }

    export class TouchEvents {
        type = TouchEventsType.CLICK;
        func: Function;
        target: DisplayObject;
        capture = false;

        constructor(type: TouchEventsType, func: Function, target: DisplayObject, capture: boolean) {
            this.type = type;
            this.func = func;
            this.target = target;
            this.capture = capture || false;
        }
    }
}

