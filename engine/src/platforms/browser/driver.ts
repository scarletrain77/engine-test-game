namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = engine.DisplayObjectContainer.getInstance();
        let context2D = canvas.getContext("2d");
        
        let renderer = new CanvasRenderer(stage, context2D);
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            renderer.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        let hitResult: DisplayObject;
        let currentX: number;
        let currentY: number;
        let lastX: number;
        let lastY: number;
        let isMouseDown = false;

        window.onmousedown = (e) => {
            isMouseDown = true;
            let targetArray = TouchEventService.getInstance().performerList;
            TouchEventService.getInstance().splicePerformer(0, TouchEventService.getInstance().performerList.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
        }

        window.onmousemove = (e) => {
            let performerList = TouchEventService.getInstance().performerList;
            lastX = currentX;
            lastY = currentY;
            currentX = e.offsetX;
            currentY = e.offsetY;
            if (isMouseDown) {
                for (let i = 0; i < performerList.length; i++) {
                    for (let x of performerList[i].eventArray) {
                        if (x.type == TouchEventsType.MOUSEDOWN && x.capture == true) {
                            x.func(e);
                        }
                    }
                }
                for (let i = performerList.length - 1; i >= 0; i--) {
                    for (let x of performerList[i].eventArray) {
                        if (x.type == TouchEventsType.MOUSEMOVE && x.capture == false) {
                            x.func(e);
                        }
                    }
                }
            }
        }
        window.onmouseup = (e) => {
            isMouseDown = false;
            let performerList = TouchEventService.getInstance().performerList;
            performerList.splice(0, performerList.length);
            let newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (let i = 0; i < performerList.length; i++) {
                for (let x of performerList[i].eventArray) {
                    if (x.type == TouchEventsType.CLICK && newHitRusult == hitResult && x.capture == true) {
                        x.func(e);
                    }
                }
            }
            for (let i = performerList.length - 1; i >= 0; i--) {
                for (let x of performerList[i].eventArray) {
                    if (x.type == TouchEventsType.CLICK && newHitRusult == hitResult && x.capture == false) {
                        x.func(e);
                    }
                }
            }
        }

        return stage;

    }

    class CanvasRenderer {

        constructor(private stage: DisplayObjectContainer, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(container: DisplayObjectContainer) {
            for (let child of container.children) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

                if (child.type == "Bitmap") {
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child as DisplayObjectContainer);
                } else if (child.type == "Shape") {
                    this.renderShape(child as Shape);
                }
            }
        }

        renderBitmap(bitmap: Bitmap) {
            this.context2D.drawImage(bitmap.image, 0, 0);
        }

        renderTextField(textField: TextField) {
            this.context2D.fillStyle = textField.textColor.toLocaleUpperCase();
            this.context2D.font = textField.textSize.toString() + "pt " + textField.textFont;
            this.context2D.fillText(textField.text, 0, 0);
        }

        renderShape(shape: Shape) {
            this.context2D.fillStyle = shape.color.toLocaleUpperCase();
            this.context2D.fillRect(0, 0, shape.width, shape.height);
        }
    }



}




