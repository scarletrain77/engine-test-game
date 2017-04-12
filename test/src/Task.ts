interface TaskCondition {
    onAccept(task: TaskConditionContext);
    onSubmit(task: TaskConditionContext);
}

interface TaskConditionContext {
    //current: number;
    // checkStatus():void;
    getCurrent(): number;
    setCurrent(value: number): void;
}


class Task implements TaskConditionContext {
    private _id: string;
    private _name: string;
    private _status: TaskStatus;
    private _desc: string;
    private _fromNpcId: string;
    private _toNpcId: string;
    private _current: number = 0;

    public total: number = -1;
    public condition: TaskCondition;

    constructor(id: string, name: string, desc: string, fromNpcId: string, toNpcId: string, condition: TaskCondition) {
        this._id = id;
        this._name = name;
        this._status = TaskStatus.ACCEPTABLE;
        this._desc = desc;
        this._fromNpcId = fromNpcId;
        this._toNpcId = toNpcId;

        this.condition = condition;

    }

    checkStatus() {
        /* if(this.current > this.total){
             console.warn();
         }*/
        if (this._status == TaskStatus.DURING
            && this._current >= this.total) {
            this._status = TaskStatus.CAN_SUBMIT;
        }
        //notify
        TaskService.getInstance().notify(this);
    }

    public onAccept() {
        this.condition.onAccept(this);
    }

    public getCurrent(): number {
        return this._current;
    }

    public setCurrent(value: number) {
        this._current = value;
        this.checkStatus();
    }

    public get current(): number {
        return this._current;
    }

    public set current(value: number) {
        this._current = value;
        this.checkStatus();
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get fromNpcId(): string {
        return this._fromNpcId;
    }

    public get toNpcId(): string {
        return this._toNpcId;
    }

    public get status(): TaskStatus {
        return this._status;
    }

    public get desc(): string {
        return this._desc;
    }

    public set status(value: TaskStatus) {
        this._status = value;
    }

    public set desc(d: string) {
        this._desc = d;
    }


}
/*
interface Object{
    assign(a:any, b:any);
}

interface Strategy{
    selector:Function;
}*/


class NPCTalkTaskCondition implements TaskCondition {
    public type = "Talk";
    onAccept(task: TaskConditionContext) {
        var current = 0;
        current++;
        task.setCurrent(current);
        //console.log("here");
        //   context.checkStatus();
    }

    /*onAccept(task:Task){
        task.current++;
        task.current = task.total;
    }*/

    onSubmit(task: TaskConditionContext) {

    }
}

class KillMonsterTaskCondition implements TaskCondition {
    public type = "Kill";
    private monsters:Monster[] =[];
    constructor(monster: Monster){
        this.monsters.push(monster);
    }
    onAccept(task: TaskConditionContext) {
        task.setCurrent(task.getCurrent());
    }

    onSubmit(task: TaskConditionContext) {

    }
}

class EquipmentGetTaskCondition implements TaskCondition {
    public type = "Get";
    onAccept(task: TaskConditionContext) {
        task.setCurrent(task.getCurrent());
    }

    onSubmit(task: TaskConditionContext) {

    }
}

class EquipmentsGetTaskButton extends engine.DisplayObjectContainer implements Observer {
    private _equipment: Equipment;
    private _jewel: Jewel;
    private _jewelBitmap: engine.Bitmap;
    constructor(x: number, y: number) {
        super();

        this._jewelBitmap = new engine.Bitmap();
        this._jewelBitmap.image = engine.RES.getRes("jewel_png");
        this._jewelBitmap.x = x;
        this._jewelBitmap.y = y;


        this.addChild(this._jewelBitmap);
        this.alpha = 1;

        this._jewelBitmap.touchEnabled = true;
        //this._jewelBitmap.addEventListener(engine.TouchEvent.TOUCH_TAP, this.onClick, this);
    }
    onChange() {

    }

    onClick() {
        console.log(TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status);
        if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status == TaskStatus.DURING && GameScene.getCurrentScene().userSystem.user.defaultHero.getFightPower() <= 125 && TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].condition.type == "Get") {
            GameScene.getCurrentScene().userSystem.user.defaultHero.addEquipment(new Equipment("C", 100, 100, 100));
             GameScene.getCurrentScene().userSystem.userPanel.updateUserinfo();
            TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status = TaskStatus.CAN_SUBMIT;
            this.alpha = 0;
        }
        console.log(TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status);
        TaskService.getInstance().notify(TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()]);
    }
}

class KillMonsterButton extends engine.DisplayObjectContainer implements Observer {
    private subButton: Button;

    constructor() {
        super();
        this.subButton = new Button(50, 100, "Sub");
        this.subButton.addEventListener(engine.TouchEventsType.TOUCH_TAP, this.onClick, this);
        this.subButton.touchEnabled = true;
        this.addChild(this.subButton);
    }

    onClick() {
        //>=1
        if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total > 0) {
            if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status == TaskStatus.DURING && TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total >= 0) {
                TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total--;
            }
            if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].total == 0) {
                TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status = TaskStatus.CAN_SUBMIT;
            }
            TaskService.getInstance().notify(TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()]);
        }
    }

    onChange() {

    }
}