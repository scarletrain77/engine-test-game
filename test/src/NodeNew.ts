class NodeNew {
    public x: number;
    public y: number;
    public f: number;
    public g: number;
    public h: number;
    public walkable: boolean;
    public parent: NodeNew;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.walkable = true;
    }

}