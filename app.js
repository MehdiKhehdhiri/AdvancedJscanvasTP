
import { Painter } from './painter.js';

document.addEventListener("DOMContentLoaded", function () {
    const painter = new Painter("paintCanvas", "colorPalette", "brushSize", "clearButton", "rectangleMode", "saveButton");
    painter.init();
}); 