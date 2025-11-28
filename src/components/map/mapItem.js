import { Graphics } from 'pixi.js';

/** Represents a drawable item on the PIXI grid map. */
export class MapItem {
    constructor(id, x, y, color = 0xff0000) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    /**
     * Draw the item into a PIXI container as a filled square.
     * @param {import('pixi.js').Container} container target container
     * @param {number} x column index within the grid
     * @param {number} y row index within the grid
     * @param {number} cellWidth width of a single grid cell
     * @param {number} cellHeight height of a single grid cell
     */
    draw(container, x, y, cellWidth, cellHeight) {
        const graphic = new Graphics();
        graphic.beginFill(this.color);
        graphic.drawRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        graphic.endFill();

        container.addChild(graphic);
    }
}
