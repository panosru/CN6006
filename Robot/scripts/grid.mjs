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
     * Status of the grid
     * @type {boolean}
     * @private
     */
    _status = false;

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
        $resetBtn: $('#reset'),
        $statusSwitch: $('#toggle')
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
     * Get the status of the grid
     * @returns {boolean}
     */
    get isStatusOn() { return this._status; }

    /**
     * Get the grid jQuery object
     * @returns {{$leftBtn: *, $rightBtn: *, $upBtn: *, $downBtn: *, $resetBtn: *, $statusSwitch: *}}
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

        // Add event listeners
        this._controls.$statusSwitch.on('change', this._handleStatusSwitchChange);

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
        let $curCell = this._$grid
            .find(`.grid-cell:nth-child(${(row - 1) * this._cols + col})`)
            .addClass('active');

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
        this._$grid.find('.grid-cell:nth-child(-n+' + this._cols + ')').removeClass('bottom-border');
        this._$grid.removeClass('status-on');
        this._controls.$statusSwitch.prop('checked', false);
        this._status = false;
        this._updateControls(row, col);
    }

    // Private methods

    /**
     * Handle status switch change
     * @param {Event} e
     * @private
     */
    _handleStatusSwitchChange = (e) => {
        this._status = e.target.checked;

        // If the status is enabled, then apply
        // bottom-border class to the cells of
        // the first row, when off, remove it
        this._$grid.find('.grid-cell:nth-child(-n+' + this._cols + ')')
            .toggleClass('bottom-border', this._status);

        this._$grid.toggleClass('status-on', this._status);
    }

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

        // Status switch must be enabled only when the active cell is not on first row
        this._controls.$statusSwitch.attr('disabled', row === 1);

        // Enable reset button when the active cell is on the exit cell
        this._controls.$resetBtn.attr('disabled', !(row === this._rows && col === this._cols));
    }
}
