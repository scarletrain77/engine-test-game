class NumberToString {
    public static numberToString(num: number): string {
        if (num >= 0 && num < 10) {
            return '00' + num.toString();
        } else if (num >= 10 && num < 100) {
            return '0' + num.toString();
        } else if (num >= 100) {
            return num.toString();
        }
    }
}


class PictureMiddle {
    public static putPictureMiddle(pic: engine.Bitmap) {
        pic.x = 320 - pic.width / 2;
        pic.y = 568 - pic.height / 2;
    }
}


class BitmapBody extends engine.DisplayObjectContainer {
    private _body: engine.Bitmap;
    constructor(name: string, width?: number, height?: number, targetX?: number, targetY?: number, targetAlpha?: number) {
        super();
        this._body = new engine.Bitmap();
        this._body.image = engine.RES.getRes(name);
        if (width != 0 && height != 0) {
            this._body.width = width;
            this._body.height = height;
        }
        this.x = targetX;
        this.y = targetY;
        this.alpha = targetAlpha;
    }
}