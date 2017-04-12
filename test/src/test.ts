var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);
var bitmap = new engine.Bitmap();
var text = new engine.TextField();
text.text = "hello~";
text.textSize = 200;
text.y = 100;
stage.addChild(text);

let image = document.createElement("img");
image.src = "Resource/QB.png";
bitmap.image = image;
let speed = 10;
stage.addChild(bitmap);
bitmap.addEventListener(engine.TouchEventsType.MOUSEDOWN, (e) => {
    alert("bitmap");
}, bitmap, false);

var shape = new engine.Shape();
shape.width = 100;
shape.height = 100;
shape.y = 200;
shape.touchEnabled = true;
shape.addEventListener(engine.TouchEventsType.CLICK, (e) => {
    alert("touch");
}, shape, false);
stage.addChild(shape);

engine.Ticker.getInstance().register((deltaTime) => {
    bitmap.x += 1;
});

var scene = new GameScene();
GameScene.replaceScene(scene);
this.addChild(scene);

var list = new CommandList();
GameScene.getCurrentScene().userSystem.tileMap.addEventListener(engine.TouchEventsType.TOUCH_TAP, (e) => {
    if (GameScene.getCurrentScene().userSystem.NPC_0.getDialogPanelState() == false) {
        list.addCommand(new WalkCommand(e.stageX, e.stageY));
        list.execute();
    }
}, this);

GameScene.getCurrentScene().userSystem.NPC_0.addEventListener(engine.TouchEventsType.TOUCH_TAP, (e) => {
    UserSystem.currentNPC = GameScene.getCurrentScene().userSystem.NPC_0;
    list.addCommand(new WalkCommand(e.stageX, e.stageY));
    list.addCommand(new TalkCommand());
    list.execute();
}, this);

GameScene.getCurrentScene().userSystem.NPC_1.addEventListener(engine.TouchEventsType.TOUCH_TAP, (e) => {
    UserSystem.currentNPC = GameScene.getCurrentScene().userSystem.NPC_1;
    list.addCommand(new WalkCommand(e.stageX, e.stageY));
    list.addCommand(new TalkCommand());
    list.execute();
}, this);

GameScene.getCurrentScene().userSystem.monster.addEventListener(engine.TouchEventsType.TOUCH_TAP, (e) => {
    list.addCommand(new WalkCommand(e.stageX, e.stageY));
    list.addCommand(new FightCommand());
    list.execute();
}, this);

GameScene.getCurrentScene().userSystem.equipmentButton.addEventListener(engine.TouchEventsType.TOUCH_TAP, (e) => {
    list.addCommand(new WalkCommand(e.stageX, e.stageY));
    list.addCommand(new EquipmentCommand());
    list.execute();
}, this);
