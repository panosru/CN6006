/**
 * &copy; Panagiotis Kosmidis (panosru)
 */

import $ from './jquery.mjs';
import { Grid } from './grid.mjs';
import { Robot } from './robot.mjs';
import { Points } from './points.mjs';

(function () {
    'use strict';

    // Constants
    const grid = new Grid(6, 6);
    const robot = new Robot(grid);
    const points = new Points(grid);

    // Initialise the grid
    grid.init();
    points.init();

    // Bind the grid controls to the robot actions
    grid.controls.$leftBtn.click(robot.moveLeft);
    grid.controls.$rightBtn.click(robot.moveRight);
    grid.controls.$upBtn.click(robot.moveUp);
    grid.controls.$downBtn.click(robot.moveDown);
    grid.controls.$resetBtn.click(robot.reset);

    // Keyboard navigation
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                grid.controls.$leftBtn.click();
                break;
            case 38: // up
                grid.controls.$upBtn.click();
                break;
            case 39: // right
                grid.controls.$rightBtn.click();
                break;
            case 40: // down
                grid.controls.$downBtn.click();
                break;
            case 82: // r
                grid.controls.$resetBtn.click();
                break;
            case 83: // s
                grid.controls.$statusSwitch.click();
                break;
            default:
                return;
        }
        e.preventDefault();
    });

    // Alert the user about exceptions thrown
    window.onerror = function (message, source, lineno, colno, error) {
        alert(message);
    };
})();
