class EventEmitter {
    constructor(){}
    addObserver(observer: Observer){}
    notify(task: Task){}
}

class SceneService extends EventEmitter {
    private static instance;
    private static count: number = 0;
    private observerList: Observer[] = [];
    private taskList: {
        [index: string]: Task
    } = {
        //"001":new Task("001", "a", "001", "002"),
        //"002":new Task("002", "b", "003", "004")
    };

    constructor() {
        super();
        SceneService.count++;
        if (SceneService.count > 1) {
            throw "singleton";
        }
    }
    notify(task: Task) {
        for (var observer of this.observerList) {
            observer.onChange(task);
        }
    }
}

class TaskService extends EventEmitter {
    private static instance;
    private static count: number = 0;
    private observerList: Observer[] = [];
    private taskList: {
        [index: string]: Task
    } = {};
    private _currentTask:number = 0;
    private _taskAllNumber:number = 0;

    constructor() {
        super();
        TaskService.count++;
        if (TaskService.count > 1) {
            throw "singleton";
        }
    }

    addObserver(a: Observer) {
        this.observerList.push(a);
    }

    notify(task: Task) {
        for (var observer of this.observerList) {
            observer.onChange(task);
        }
    }

    public static getInstance() {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }

    /*public getTaskByCustomStrategy(strategy:Strategy){
        return strategy.selector(this.taskList);
    }*/
    public getTaskByCustomRule(rule: Function): Task {
        //var clone = Object.assign({}, this.taskList);
        //return rule(clone);
        /*var canvas:HTMLCanvasElement;
        var context = canvas.getContext("2d");*/
        return rule(this.taskList);
    }

    public getCurrentId():string{
        return NumberToString.numberToString(this._currentTask);
        //return "00" + this._currentTask.toString();
    }

    public getNextId():string{
        //var temp = this._currentTask + 1;
        //console.log("a:" + "00" + temp.toString() + "b" + NumberToString.numberToString(temp));
        return NumberToString.numberToString(this._currentTask + 1);
    }

    public submit(id: string): ErrorCode {
        if (!id) {
            return ErrorCode.ERROR_TASK;
        }
        let task = this.taskList[id];
        if (!task) {
            return ErrorCode.SUCCESS;
        }
        console.log("submit" + id);
        if (task.status == TaskStatus.CAN_SUBMIT) {
            task.status = TaskStatus.SUBMITTED;
            task.onAccept();
            this.notify(task);
            if(parseInt(task.id)< this.taskAllNumber - 1){
                this._currentTask++;
                this.taskList[this.getCurrentId()].status = TaskStatus.ACCEPTABLE;
            }
            return ErrorCode.SUCCESS;
        } else {
            return ErrorCode.ERROR_TASK;
        }
    }

    public accept(id: string) {
        var temp: Task = this.taskList[id];
        if (temp.status == TaskStatus.ACCEPTABLE) {
            temp.status = TaskStatus.DURING;
        }
        this.notify(temp);
        /*if (!id) {
            return ErrorCode.ERROR_TASK;
        }
        let task = this.taskList[id];
        if (!task) {
            return ErrorCode.SUCCESS;
        }
        console.log("accept" + id);
        if (task.status == TaskStatus.CAN_SUBMIT) {
            task.status = TaskStatus.SUBMITTED;
            this.notify(task);
            return ErrorCode.SUCCESS;
        } else {
            return ErrorCode.ERROR_TASK;
        }*/
    }

    public addTask(task: Task) {
        // var a = this.taskList["111"];
        this.taskList[task.id] = task;
        this._taskAllNumber++;
    }

    public get taskAllNumber(){
        return this._taskAllNumber;
    }

    public getTask(num:number):Task{
        //var temp: string = "00" + num.toString();
        //console.log("temp:" + temp + ", function" + NumberToString.numberToString(num))
        return this.taskList[NumberToString.numberToString(num)];
    }

}

