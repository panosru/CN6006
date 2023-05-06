/**
 * &copy; Panagiotis Kosmidis (panosru)
 */
import {Grid} from "./grid.mjs";

// Robot class
export class Robot {

    // Public static properties
    static DIRECTION_LEFT = 'left';
    static DIRECTION_RIGHT = 'right';
    static DIRECTION_UP = 'up';
    static DIRECTION_DOWN = 'down';

    // Public properties

    /**
     * The robot's current row
     * @type {number}
     */
    row = 1;

    /**
     * The robot's current column
     * @type {number}
     */
    col = 1;

    // Private properties

    /**
     * The grid object
     * @type {Grid}
     * @private
     */
    _grid;

    /**
     * Robot constructor
     * @param {Grid} grid - The grid object
     */
    constructor(grid) {
        if (!(grid instanceof Grid)) {
            throw new TypeError('Expected a Grid object');
        }

        this._grid = grid;
    }

    // Public methods

    /**
     * Move the robot left
     */
    moveLeft = () => { this._move(Robot.DIRECTION_LEFT); };

    /**
     * Move the robot right
     */
    moveRight = () => { this._move(Robot.DIRECTION_RIGHT); };

    /**
     * Move the robot up
     */
    moveUp = () => { this._move(Robot.DIRECTION_UP); };

    /**
     * Move the robot down
     */
    moveDown = () => { this._move(Robot.DIRECTION_DOWN); };

    /**
     * Reset the robot
     * @event robot:reset
     */
    reset = () => {
        this._checkExit();

        document.dispatchEvent(new CustomEvent('robot:reset', {
            detail: null
        }));

        // Reset the robot position
        this.row = 1;
        this.col = 1;
        this._grid.reset();
    }

    // Private methods

    /**
     * Move the robot
     * @param {string} direction - The direction to move ('left', 'right', 'up', 'down')
     * @private
     */
    _move(direction) {

        // Check if the robot is trying to move out of bounds
        this._checkOutOfBounds(direction);

        switch (direction) {
            case 'left':
                if (this.col > 1)
                    this.col--;
                break;
            case 'right':
                if (this.col < this._grid.cols)
                    this.col++;
                break;
            case 'up':
                if (this.row > 1)
                    this.row--;
                break;
            case 'down':
                if (this.row < this._grid.rows)
                    this.row++;
                break;
        }

        // Activate the grid cell where the robot is located
        this._grid.activateCell(this.row, this.col, true);
    }

    /**
     * Check if the robot is trying to move out of bounds
     * @param {string} direction - The direction to check ('left', 'right', 'up', 'down')
     * @private
     */
    _checkOutOfBounds(direction) {
        let $btn = this._grid.controls[`$${direction}Btn`];

        // Check if the button is disabled, if so, throw an out-of-bounds error
        if ($btn.attr('disabled'))
            throw new Error('Cannot move out of bounds');
    }

    /**
     * Check if the robot is at the exit
     * @private
     */
    _checkExit() {
        if (this._grid.controls.$resetBtn.attr('disabled'))
            throw new Error('Must be at the exit to reset the robot');
    }
}
