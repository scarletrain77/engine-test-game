class Grid {
    private _startNode: NodeNew;
    private _endNode: NodeNew;
    private _nodes: Array<any>;
    private _numCols: number;
    private _numRows: number;
    constructor(numCols: number, numRows: number, tileData: TileData[]) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = new Array();

        for (var i = 0; i < this._numCols; i++) {
            this._nodes[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new NodeNew(i, j);
                //walkable在TileDate里的位置转换为Nodes中的位置
                //this._nodes[i][j].walkable = tileData[i + j * this._numRows].walkable;
                this._nodes[i][j].walkable = tileData[i * this._numCols + j].walkable;
            }
        }
    }

    public getNode(x: number, y: number): NodeNew {
        return this._nodes[x][y] as NodeNew;
    }

    public setEndNode(x: number, y: number): void {
        this._endNode = this._nodes[x][y] as NodeNew;
    }

    public setStartNode(x: number, y: number): void {
        this._startNode = this._nodes[x][y] as NodeNew;
    }

    public setWalkable(x: number, y: number, value: boolean): void {
        this._nodes[x][y].walkable = value;
    }

    public getEndNode(): NodeNew {
        return this._endNode;
    }

    public getNumCols(): number {
        return this._numCols;
    }

    public getNumRows(): number {
        return this._numRows;
    }

    public getStartNode(): NodeNew {
        return this._startNode;
    }
}
