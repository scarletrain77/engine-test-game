class Monster extends engine.DisplayObjectContainer implements Observer {
    private static _id: number = 0;
    private _type: string;
    //private _body: NPCBody;
    private _body: engine.Bitmap;
    private _hp: number = 100;
    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
        this._type = "normal";
        this._body = new engine.Bitmap(engine.RES.getRes("QB"));
        Monster._id++;
        this._body.touchEnabled = true;

        this.addChild(this._body);
    }

    onAccept() { }

    onChange() { }

    onClick() {
        if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total > 0) {
            console.log("click, total>0")
            if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status == TaskStatus.DURING && TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total >= 0 && GameScene.getCurrentScene().userSystem.user.defaultHero.getFightPower() > this._hp) {
                TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total--;
                this.alpha = 0;
                console.log("total" + TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total);
            }
            if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total == 0) {
                TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status = TaskStatus.CAN_SUBMIT;
            }
            TaskService.getInstance().notify(TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()]);
        }
    }

}

class Monsters extends engine.DisplayObjectContainer {
    private _monsters: Array<Monster>;
    private _number: number;
    private addButton: Button;
    private subButton: Button;
    private _taskNumberString: string;

    constructor(monsters: Monster[], taskNumberString: string) {
        super();
        this._monsters = new Array<Monster>();

        this._monsters = monsters;

        this._number = 0;
        this._taskNumberString = taskNumberString;

        this.addButton = new Button(50, 100, "add");
        this.subButton = new Button(50, 200, "sub");
        this.addButton.addEventListener(engine.TouchEventsType.CLICK, this.onClickAdd, this);
        this.subButton.addEventListener(engine.TouchEventsType.CLICK, this.onClickSub, this);
        this.addChild(this.addButton);
        this.addChild(this.subButton);
    }

    private addMonster(monster: Monster) {
        this._monsters.push(monster);
        this._number++;
    }

    private get number() {
        return this._number;
    }

    private onClickAdd(): void {
        this._number++;
        console.log(this.number);
        if (TaskService.getInstance().taskList[this._taskNumberString].status == TaskStatus.DURING) {

        }
    }

    private onClickSub(): void {
        if (this._number > 0) {
            this._number--;
        }
        console.log(this.number);
    }
}