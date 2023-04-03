/**
 * &copy; Panagiotis Kosmidis (panosru)
 */

import $ from './jquery.mjs';
import {Grid} from "./grid.mjs";

// Points class
export class Points {

    // Private properties

    /**
     * The number of points earned
     * @type {number}
     * @private
     */
    _points = 0;

    /**
     * Whether the points are locked and cannot be updated anymore
     * @type {boolean}
     * @private
     */
    _locked = false;

    /**
     * The maximum number of points that can be earned
     * @type {number}
     * @private
     */
    _maxPoints;

    /**
     * The grid object
     * @type {Grid}
     * @private
     */
    _grid;

    /**
     * Points constructor
     * @param {Grid} grid - The grid object
     */
    constructor(grid) {
        if (!(grid instanceof Grid)) {
            throw new TypeError('Expected a Grid object');
        }

        this._grid = grid;

        // Listen for grid and robot events
        document.addEventListener('grid:cell.changed', this._handleGridCellChanged.bind(this));
        document.addEventListener('robot:reset', this._handleRobotReset.bind(this));

        // Calculate the maximum points
        this._maxPoints = this._grid.rows * this._grid.cols - 2; // Start and exit cells are not counted
    }

    // Public methods

    /**
     * Initialize the points
     */
    init() {
        this._updatePoints();
    }

    // Private methods

    /**
     * Update the points
     * @private
     */
    _updatePoints() {
        $('#points').html(`${this._locked ? 'Max points' : 'Points'}: 
                           <b>${this._points}</b> out of <u><b>${this._maxPoints}</b></u>`);
    }

    // Event handlers

    /**
     * Handle grid cell changed event
     * @param {CustomEvent} e - The event object
     * @private
     */
    _handleGridCellChanged(e) {

        if (this._locked)
            return;

        let row = e.detail.row;
        let col = e.detail.col;

        // Ignore the start cell
        if (1 === row && 1 === col)
            return;

        // If exit cell, lock the points
        if (this._grid.rows === row && this._grid.cols === col)
            this._locked = true;

        let $curCell = e.detail.$curCell;

        // If curCell is active and prevCell is not visited, add a point
        if ($curCell.hasClass('active') && !$curCell.hasClass('visited'))
            this._points++;

        this._updatePoints();
    }

    /**
     * Handle robot reset event
     * @param {CustomEvent} e - The event object
     * @private
     */
    _handleRobotReset(e) {
        this._points = 0;
        this._locked = false;

        this._updatePoints();
    }
}
