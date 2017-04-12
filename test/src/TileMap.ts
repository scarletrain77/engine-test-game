// TypeScript file
class TileMap extends engine.DisplayObjectContainer {
    //UserSystem
    /*private _userSystem: UserSystem;
    private _user: User;*/

    //TileMap
    private _block: engine.Bitmap;
    private _tileConfig: Array<TileData>;
    private _tiles: Tile[] = [];
    //地图行列数
    private _column: number = 10;
    private _row: number = 10;
    //移动坐标的数组
    private _moveX: number[];
    private _moveY: number[];

    private _user: User;
    private _userPanel: UserPanel;


    constructor(user: User, userPanel: UserPanel) {
        super();

        this._user = user;
        this._userPanel = userPanel;

        var nowConfig: number = 0;
        this._tileConfig = new Array<TileData>();
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (i == 0 || j == 0 || j == 9 || i == 9 || ((i == 4 || i == 5) && j < 6) || ((i == 3 || i == 6) && j >3 && j<6)) {
                    this._tileConfig[nowConfig] = new TileData(false, "block_jpg", i, j);
                } else {
                    this._tileConfig[nowConfig] = new TileData(true, "road_jpg", i, j);
                }
                this._tiles[nowConfig] = new Tile(this._tileConfig[nowConfig]);
                this._tiles[nowConfig].touchEnabled = true;
                this.addChild(this._tiles[nowConfig]);
                nowConfig++;
            }
        }




        /*this._userSystem = new UserSystem();
        this._user = this._userSystem.user;
        this._user.defaultHero.player.idle();
        this.addChild(this._user.defaultHero.player);
        this.addChild(this._userSystem);*/

        this._user.defaultHero.player.idle();
        //this.addChild(this._user.defaultHero.player);

        //TouchEvent
        /*this.addEventListener(engine.TouchEvent.TOUCH_TAP, (e) => {
            this.moveTo(e.stageX, e.stageY);
        }, this);*/
    }

    public moveTo(x: number, y: number): void {
        if (this._userPanel.isShowing == false) {
            this._moveX = new Array();
            this._moveY = new Array();
            this.findPathForNode(x, y);
        }
        //console.log("point:x:" + x + "y:" + y);
    }

    public get NPCs(): NPC[] {
        var npcs: NPC[] = [];
        return npcs;
    }

    private findPathForNode(touchX: number, touchY: number) {
        //var playerX: number = Math.floor(this._player._body.x / Tile.TILE_SIZE);
        //var playerY: number = Math.floor(this._player._body.y / Tile.TILE_SIZE);
        var playerX: number = Math.floor(this._user.defaultHero.player.body.x / Tile.TILE_SIZE);
        var playerY: number = Math.floor(this._user.defaultHero.player.body.y / Tile.TILE_SIZE);
        var gridX: number = Math.floor(touchX / Tile.TILE_SIZE);
        var gridY: number = Math.floor(touchY / Tile.TILE_SIZE);
        var astar = new AStar();
        var grid = new Grid(this._column, this._row, this._tileConfig);
        grid.setStartNode(playerX, playerY);
        grid.setEndNode(gridX, gridY);
        if (astar.findPath(grid)) {
            //var alphax = 1;
            for (var i = 0; i < astar.path.length; i++) {
                var targetX: number = astar.path[i].x * Tile.TILE_SIZE + Tile.TILE_SIZE / 2 ;
                var targetY: number = astar.path[i].y * Tile.TILE_SIZE + Tile.TILE_SIZE / 2;
                this._moveX[i] = targetX;
                this._moveY[i] = targetY;
            }
            this._user.defaultHero.player.move(this._moveX, this._moveY);
        }


    }


}

class Tile extends engine.DisplayObjectContainer {
    //地图的大小
    public static TILE_SIZE = 64;
    data: TileData;
    constructor(data: TileData) {
        super();
        this.data = data;
        var bitmap = new engine.Bitmap();
        this.addChild(bitmap);
        bitmap.image = engine.RES.getRes(data.image);
        bitmap.height = Tile.TILE_SIZE;
        bitmap.width = Tile.TILE_SIZE;
        bitmap.x = data.x * Tile.TILE_SIZE;
        bitmap.y = data.y * Tile.TILE_SIZE;
    }
}

class TileData extends engine.DisplayObjectContainer {
    public walkable: boolean;
    public image: string;
    constructor(walkable: boolean, image: string, x: number, y: number) {
        super();
        this.walkable = walkable;
        this.image = image;
        this.x = x;
        this.y = y;
    }
}
