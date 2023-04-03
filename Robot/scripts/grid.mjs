/**
 * &copy; Panagiotis Kosmidis (panosru)
 */

import $ from './jquery.mjs';

// Grid class
export class Grid {

    // Private properties

    /**
     * The number of rows
     * @type {number}
     * @private
     */
    _rows;

    /**
     * The number of columns
     * @type {number}
     * @private
     */
    _cols;

    /**
     * The grid jQuery object
     * @type {jQuery}
     * @private
     */
    _$grid;

    /**
     * The controls jQuery objects
     * @type {{$leftBtn: *, $rightBtn: *, $upBtn: *, $downBtn: *, $resetBtn: *}}
     * @private
     */
    _controls = {
        $leftBtn: $('#left'),
        $rightBtn: $('#right'),
        $upBtn: $('#up'),
        $downBtn: $('#down'),
        $resetBtn: $('#reset')
    };

    /**
     * Grid constructor
     * @param {number} rows
     * @param {number} cols
     */
    constructor(rows, cols) {
        this._rows = rows;
        this._cols = cols;
        this._$grid = $('#grid');
    }

    // Getters

    /**
     * Get the number of rows
     * @returns {number}
     */
    get rows() { return this._rows; }

    /**
     * Get the number of columns
     * @returns {number}
     */
    get cols() { return this._cols; }

    /**
     * Get the grid jQuery object
     * @returns {{$leftBtn: *, $rightBtn: *, $upBtn: *, $downBtn: *, $resetBtn: *}}
     */
    get controls() { return this._controls; }

    // Public methods

    /**
     * Initialise the grid
     */
    init() {
        this._$grid.css('--grid-rows', this._rows);
        this._$grid.css('--grid-cols', this._cols);
        for (let c = 0; c < (this._rows * this._cols); c++) {
            const $cell = $(document.createElement("div")).addClass("grid-cell");
            // Add exit class on last cell
            if ((this._rows * this._cols) - 1 === c)
                $cell.addClass('exit');
            this._$grid.append($cell);
        }

        // Reset the grid
        this.reset();
    }

    /**
     * Activate a cell
     * @param {number} row
     * @param {number} col
     * @param {boolean} trail
     * @event grid:cell.changed
     */
    activateCell(row, col, trail = false) {

        // Deactivate the current cell
        let $prevCell = this._$grid.find('.grid-cell.active').removeClass('active');

        // Add trail if is enabled
        if (trail)
            $prevCell.addClass('visited');

        // Activate the new cell
        let $curCell = this._$grid.find(`.grid-cell:nth-child(${(row - 1) * this._cols + col})`).addClass('active');

        // Emit the change event
        document.dispatchEvent(new CustomEvent('grid:cell.changed', {
            detail: {
                row: row,
                col: col,
                $prevCell: $prevCell,
                $curCell: $curCell
            }
        }));

        // Update the controls
        this._updateControls(row, col);
    }

    /**
     * Reset the grid
     * @param {number} row
     * @param {number} col
     */
    reset(row = 1, col = 1) {
        this.activateCell(row, col);
        this._$grid.find('.grid-cell.visited').removeClass('visited');
        this._updateControls(row, col);
    }

    // Private methods

    /**
     * Update the controls
     * @param {number} row
     * @param {number} col
     */
    _updateControls(row, col) {
        // disable unnecessary buttons and enable the necessary ones
        this._controls.$leftBtn.attr('disabled', col === 1);
        this._controls.$rightBtn.attr('disabled', col === this._cols);
        this._controls.$upBtn.attr('disabled', row === 1);
        this._controls.$downBtn.attr('disabled', row === this._rows);

        // Enable reset button when the active cell is on the exit cell
        this._controls.$resetBtn.attr('disabled', !(row === this._rows && col === this._cols));
    }
}
