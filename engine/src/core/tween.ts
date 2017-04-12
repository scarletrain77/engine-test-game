//tween实在不会直接复制了孟彦宁的作业
namespace engine {
    export class Tween {
        private target: DisplayObject;
        private onChange: Function;
        private onFinish: Function;
        private static tweens: Map<DisplayObject, Tween>;
        private moving: { attribute: string, key: string }[] = [];

        private static getTweens(): Map<DisplayObject, Tween> {
            if (Tween.tweens == null)
                Tween.tweens = new Map<DisplayObject, Tween>();
            return Tween.tweens;
        }
        static removeTweens(target: DisplayObject): boolean {
            delete Tween.getTweens().get(target);
            return Tween.getTweens().delete(target);
        }

        constructor(target: DisplayObject, properties?: { onChange?: Function, onFinish?: Function }) {
            this.target = target;
            if (properties) {
                this.onChange = properties.onChange || null;
                this.onFinish = properties.onFinish || null;
            }
            Tween.getTweens().set(target, this);
        }

        to(toTarget: any, time: number) {
            for (var attribute in toTarget) {//attribute: x, y, ...
                if (this.target[attribute] != undefined) {//if target has attribute
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

        private move(attribute: string, toTarget: any, time: number){
            var originValue = this.target[attribute];
            var targetValue = toTarget[attribute];
            var speed = (targetValue - originValue) / time;
            var key = setInterval((deltaTime) => {
                originValue += (speed * deltaTime);
                this.target[attribute] = originValue;
                if (this.onChange)
                    this.onChange();
            }, 1000 / 1000);
            setTimeout(() => {
                //Ticker.getInstance().unregister(key);
                if (this.onFinish)
                    this.onFinish();
            }, time);
            //return key;
        }
    }
}