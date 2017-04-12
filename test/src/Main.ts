/*class Main extends engine.DisplayObjectContainer {

    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }


    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }


    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;


    private createGameScene(): void {*/
        var sky: engine.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        //TileMapSuccess
        //this.addChild(new TileMap());
        //TaskSystem without UserPanel
        //this.addChild(new TaskSystem());
        //this.addChild(new UserSystem());


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

        /*var button = new Button(100, 100, "add");
        button.addEventListener(engine.TouchEventsType.TOUCH_TAP, (e) => {
            console.log("add");
            GameScene.getCurrentScene().userSystem.user.defaultHero.addEquipment(new Equipment("C", 100, 100, 100));
            GameScene.getCurrentScene().userSystem.userPanel.updateUserinfo();
        }, this);
        this.addChild(button);

        list.addCommand(new WalkCommand(1, 1));
        list.addCommand(new FightCommand());
        list.addCommand(new WalkCommand(3, 3));
        list.addCommand(new TalkCommand());
        list.addCommand(new WalkCommand(5, 5));*/


        /*egret.setTimeout(function () {
            list.cancel();
            list.addCommand(new WalkCommand(5, 5))
            list.execute();

        }, this, 600)*//*
    }


    private createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

*/
