class AStar {
    private _open: Array<any>;
    private _closed: Array<any>;
    private _grid: Grid;
    private _endNode: NodeNew;
    private _startNode: NodeNew;
    private _path: Array<any>;
    //private _heuristic:Function = manhattan;
    //private _heuristic:Function = eucldian;
    private _heuristic: Function;
    private _straightCost: number;
    private _diagCost: number;

    constructor() {
        this._closed = new Array();
        this._open = new Array();
        this._path = new Array();
        this._heuristic = this.manhattan;
        this._straightCost = 1.0;
        this._diagCost = Math.SQRT2;
    }

    public findPath(grid: Grid): boolean {
        this._grid = grid;
        this._open = new Array();
        this._closed = new Array();

        this._startNode = this._grid.getStartNode();
        this._endNode = this._grid.getEndNode();

        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;

        return this.search();
    }

    public search(): boolean {
        var node: NodeNew = this._startNode;
        while (node != this._endNode) {
            var startX: number = Math.max(0, node.x - 1);
            var endX: number = Math.min(this._grid.getNumCols() - 1, node.x + 1);
            var startY: number = Math.max(0, node.y - 1);
            var endY: number = Math.min(this._grid.getNumRows() - 1, node.y + 1);

            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test: NodeNew = this._grid.getNode(i, j);
                    if (test == node || !test.walkable)
                        //if (test == node || !test.walkable || !this._grid.getNode(node.x, test.y).walkable || !this._grid.getNode(test.x, node.y).walkable)
                        continue;
                    var cost: number = this._straightCost;
                    if (!((node.x == test.x) || node.y == test.y)) {
                        cost = this._diagCost;
                    }
                    var g: number = node.g + cost;
                    var h: number = this._heuristic(test);
                    var f: number = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    } else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.push(test);
                    }
                }
            }
            this._closed.push(node);
            if (this._open.length == 0) {
                alert("no path found");
                //trace
                return false;
            }
            //书上为_open.sortOn("f", Array.NUMERIC)，即对f进行排序
            this._open.sort(function (a, b) {
                return a.f - b.f;
            });
            node = this._open.shift() as NodeNew;
        }
        this.buildPath();//
        return true;
    }

    private buildPath(): void {
        this._path = new Array();
        var node: NodeNew = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    }

    public get path(): Array<any> {
        return this._path;
    }

    private isOpen(node: NodeNew): boolean {
        for (var i = 0; i < this._open.length; i++) {
            if (this._open[i] == node) {
                return true;
            }
        }
        return false;
    }

    private isClosed(node: NodeNew): boolean {
        for (var i = 0; i < this._closed.length; i++) {
            if (this._closed[i] == node) {
                return true;
            }
        }
        return false;
    }

    private manhattan(node: NodeNew): number {
        return Math.abs(node.x - this._endNode.x) * this._straightCost +
            Math.abs(node.y + this._endNode.y) * this._straightCost;
    }

    private euclidian(node: NodeNew): number {
        var dx: number = node.x - this._endNode.x;
        var dy: number = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    }

    private diagonal(node: NodeNew): number {
        var dx: number = Math.abs(node.x - this._endNode.x);
        var dy: number = Math.abs(node.y - this._endNode.y);
        var diag: number = Math.min(dx, dy);
        var straight: number = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }

    public getVisited(): Array<any> {
        return this._closed.concat(this._open);
    }
}

