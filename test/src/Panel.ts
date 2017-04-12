class Button extends engine.DisplayObjectContainer {
    private _body: engine.Shape;
    private _name: engine.TextField;

    constructor(x: number, y: number, name: string) {
        super();

        this.x = x;
        this.y = y;

        var widthRec = 300;
        var heightRec = 200;

        this._body = new engine.Shape();
        this._body.color = "66ccff";
        this._body.x = widthRec / 4;
        this._body.y = heightRec * 3 / 4;
        this._body.width = widthRec / 2;
        this._body.height = heightRec / 4;

        this._name = new engine.TextField();
        this._name.text = name;
        this._name.textColor = "000000";
        this._name.x = widthRec / 4 + 35;
        this._name.y = heightRec * 3 / 4 + 10;

        this.addChild(this._body);
        this.addChild(this._name);

        this.touchEnabled = true;
    }
}

class TaskPanel extends engine.DisplayObjectContainer implements Observer {

    private _body: engine.Shape;
    private _taskText: engine.TextField;
    //private _taskListText: engine.TextField;
    private _taskTextList: engine.TextField[] = [];
    private _statusTextList: {
        [index: string]: engine.TextField
    } = {};
    private _statusText: engine.TextField;
    //private _statusListText: engine.TextField;

    private _taskListX: number;
    private _taskListY: number;
    private _blankHeight: number = 30;

    constructor(x: number, y: number) {
        super();

        var panelWidth = 640;
        var panelHeight = 436;

        this.x = x;
        this.y = y;
        this._body = new engine.Shape();
        this._body.color = "000000"
        this._body.alpha = 0.5;
        this._body.width = panelWidth;
        this._body.height =  panelHeight;

        this.addChild(this._body);

        //两个表头
        this._taskText = new engine.TextField();
        this._taskText.text = "Task";
        this._taskText.textColor = "FFFFFF";
        this._taskText.x = 0;
        this._taskText.y = 0;

        this._statusText = new engine.TextField();
        this._statusText.text = "Status";
        this._statusText.textColor = "FFFFFF";
        this._statusText.x = panelWidth * 3 / 4;
        this._statusText.y = 0;

        this.addChild(this._taskText);
        this.addChild(this._statusText);

        /*this._taskListText = new engine.TextField();
        this._taskListText.text = "";
        this._taskListText.textColor = 0x000000;
        this._taskListText.x = this._taskText.x;
        this._taskListText.y = this._taskText.y + this._blankHeight;

        this._statusListText = new engine.TextField();
        this._statusListText.text = "";
        this._statusListText.textColor = 0x000000;
        this._statusListText.x = this._statusText.x;
        this._statusListText.y = this._statusText.y + this._blankHeight;
        
        this.addChild(this._taskListText);
        this.addChild(this._statusListText);
        */



        //任务状态列表
        var tempY: number = this._taskText.y;
        for (var i = 0; i < TaskService.getInstance().taskAllNumber; i++) {
            var taskTemp = new engine.TextField();
            var statusTemp = new engine.TextField();
            taskTemp.text = TaskService.getInstance().getTask(i).desc;
            taskTemp.textColor = "FFFFFF";
            taskTemp.x = this._taskText.x;
            tempY += this._blankHeight;
            taskTemp.y = tempY;
            this._taskTextList.push(taskTemp);
            this.addChild(this._taskTextList[i]);

            statusTemp.text = TaskService.getInstance().getTask(i).status;
            statusTemp.textColor = "FFFFFF";
            statusTemp.x = this._statusText.x;
            statusTemp.y = tempY;
            this._statusTextList["00" + i] = statusTemp;
            this.addChild(this._statusTextList["00" + i]);
        }

    }

    onChange(task: Task) {
        //this.setTaskList(1, task.desc);
        //this._taskListText.text = task.desc;
        this._statusTextList[task.id].text = task.status.toString();
        //this._statusListText.text = task.status.toString();
        console.log("Panel onChange" + task.name + task.status.toString());
    }
}

class DialogPanel extends engine.DisplayObjectContainer {
    private _button: engine.Shape;
    private _buttonText: engine.TextField;
    private _body: engine.Shape;
    private _taskText: engine.TextField;
    public isShowing: boolean = false;

    constructor(taskString: string) {
        super();

        var widthRec = 300;
        var heightRec = 200;

        this._body = new engine.Shape();
        this._body.color = "000000";
        this._body.width = widthRec;
        this._body.height = heightRec;

        this._button = new engine.Shape();
        this._button.color = "FFF4C1";
        this._button.x = widthRec / 4;
        this._button.y = heightRec * 3 / 4;
        this._button.width =  widthRec / 2;
        this._button.height =  heightRec / 4;

        this._buttonText = new engine.TextField();
        this._buttonText.text = "Press";
        this._buttonText.textColor = "000000";
        this._buttonText.x = widthRec / 4 + 35;
        this._buttonText.y = heightRec * 3 / 4 + 10;

        this._taskText = new engine.TextField();
        this._taskText.text = taskString;
        this._taskText.textColor = "FFFFFF";
        this._taskText.x = 0;
        this._taskText.y = 0;

        this.alpha = 0;

        this.addChild(this._body);
        this.addChild(this._button);
        this.addChild(this._buttonText);
        this.addChild(this._taskText);

        this._button.touchEnabled = true;
        this._button.addEventListener(engine.TouchEventsType.TOUCH_TAP, this.onClick, this);
    }

    public panelFadeIn(): void {
        var tw: engine.Tween = engine.Tween.get(this);
        tw.to({ "alpha": 1 }, 500);
        this.isShowing = true;
    }

    public panelFadeOut(): void {
        var tw: engine.Tween = engine.Tween.get(this);
        tw.to({ "alpha": 0 }, 500);
        this.isShowing = false;
    }

    private onClick(): void {
        this.panelFadeOut();
        if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status == TaskStatus.ACCEPTABLE) {
            TaskService.getInstance().accept(TaskService.getInstance().getCurrentId());
        } else if (TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()].status == TaskStatus.CAN_SUBMIT) {
            TaskService.getInstance().submit(TaskService.getInstance().getCurrentId());
            //TaskService.getInstance().notify(TaskService.getInstance().taskList[TaskService.getInstance().getNextId()]);
        } else {
            console.log("no taskStatus");
        }
        this.panelFadeOut();
        TaskService.getInstance().notify(TaskService.getInstance().taskList[TaskService.getInstance().getCurrentId()]);
    }
}
