// TypeScript file
class Player extends engine.DisplayObjectContainer {
    private _name: string;
    private _modeText: engine.TextField;
    private _body: engine.Bitmap;
    private _stateMachine: StateMachine;
    public mode: string;

    constructor(name: string) {
        super();

        this._name = name;

        this._body = new engine.Bitmap(engine.RES.getRes(name + "Idle"));

        this._modeText = new engine.TextField();
        this._stateMachine = new StateMachine();

        this._modeText.y = 30;
        this._modeText.text = "Now is playing";

        //this.mode = this._body.mode;

        this.addChild(this._body);
        this.addChild(this._modeText);

    }

    move(targetX: number[], targetY: number[]) {
        this._stateMachine.setState(new PlayerMoveState(this, targetX, targetY));
    }

    idle() {
        this._stateMachine.setState(new PlayerIdleState(this));
    }

    attack() {
        this._stateMachine.setState(new PlayerAttackState(this));
    }

    public get modeText(): engine.TextField {
        return this._modeText;
    }

    public get body(){
        return this._body;
    }

    public get name(){
        return this._name;
    }
}

/**
 * 状态机。currentState现在的状态，setState设置状态。先结束前一个状态，再把现在的状态赋值进来
 */
class StateMachine {
    _currentState: State;
    setState(s: State) {
        if (this._currentState) {
            this._currentState.onExit();
        }
        this._currentState = s;
        this._currentState.onEnter();
    }
}

/**
 * 状态接口，有两个方法。
 */
interface State {
    onEnter();
    onExit();
}

/**
 * 实现状态。_player为目前的人物，
 */
class PlayerState implements State {
    _player: Player;
    constructor(player: Player) {
        this._player = player;
    }

    onEnter() { }
    onExit() { }
}

class PlayerMoveState extends PlayerState {
    _targetX: number[];
    _targetY: number[];
    constructor(player: Player, targetX: number[], targetY: number[]) {
        super(player);
        this._targetX = targetX;
        this._targetY = targetY;
    }
    onEnter() {
        this._player.modeText.text = "Move";
        //this._player.body.reset();
        this._player.body.image.src = this._player.name + "Run";
        var tw = new engine.Tween(this._player.body);
        for (var i = 0; i < this._targetX.length; i++) {
            if (i == this._targetX.length - 1) {
                tw.to({ x: this._targetX[i], y: this._targetY[i] }, 100).call(this._player.idle, this._player);
                console.log("== - 1")
            } else {
                tw.to({ x: this._targetX[i], y: this._targetY[i] }, 100);
                console.log("else");
            }
        }
    }

    onExit() {

    }
}

class PlayerIdleState extends PlayerState {

    onEnter() {
        //this._player._body.gotoAndPlay("idle");
        // var body = new Body("Idle");
        //this._player.body.reset();
        //this._player.body.mode = "Idle";
        this._player.body.image.src = this._player.name + "Idle";
        this._player.modeText.text = "Now is idling";
    }
}

class PlayerAttackState extends PlayerState {
    onEnter() {
        //this._player.body.reset();
        //this._player.body.mode = "Attack";
         this._player.body.image.src = this._player.name + "Attack";
        this._player.modeText.text = "Attacking";
    }
}