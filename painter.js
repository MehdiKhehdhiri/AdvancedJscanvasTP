export class Painter {
    constructor(canvasId, colorPaletteId, brushSizeId, clearButtonId, rectangleModeId, saveButtonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.colorPalette = document.getElementById(colorPaletteId);
        this.brushSizeInput = document.getElementById(brushSizeId);
        this.clearButton = document.getElementById(clearButtonId);
        this.rectangleModeButton = document.getElementById(rectangleModeId);
        this.saveButton = document.getElementById(saveButtonId);

        this.painting = false;
        this.rectangleMode = false;
        this.currentColor = "black";
        this.currentBrushSize = 5;

        // Bind necessary methods to the instance
        this.draw = this.draw.bind(this);
        this.drawRectangle = this.drawRectangle.bind(this);
    }

    init() {
        this.addEventListeners();
    }

    addEventListeners() {
        this.canvas.addEventListener("mousedown", this.startPainting.bind(this));
        this.canvas.addEventListener("mouseup", this.stopPainting.bind(this));
        this.canvas.addEventListener("mousemove", this.draw);
        this.canvas.addEventListener("mouseleave", this.stopPainting.bind(this));
        this.clearButton.addEventListener("click", this.clearCanvas.bind(this));
        this.rectangleModeButton.addEventListener("click", this.toggleRectangleMode.bind(this));
        this.saveButton.addEventListener("click", this.saveDrawing.bind(this));

        this.colorPalette.querySelectorAll(".color").forEach(color => {
            color.addEventListener("click", this.changeColor.bind(this));
        });

        this.brushSizeInput.addEventListener("input", () => {
            this.currentBrushSize = this.brushSizeInput.value;
        });

        this.canvas.addEventListener("contextmenu", e => {
            e.preventDefault(); // Prevent context menu in rectangle mode
        });
    }
startPainting(e) {
    this.painting = true;
    this.draw(e);
    this.ctx = this.canvas.getContext("2d");
}

    stopPainting() {
        this.painting = false;
        this.ctx.beginPath();
    }

    draw(e) {
    if (this.rectangleMode && e.type === "mouseup") {
        this.drawRectangle(e);
        return; // Exit early to prevent line drawing in rectangle mode
    }

    if (!this.painting) return;

    this.ctx.lineWidth = this.currentBrushSize;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = this.currentColor;

    if (this.rectangleMode) {
        this.drawRectangle(e);
        return; // If in rectangle mode, stop drawing after drawing the rectangle
    }

        this.ctx.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }

drawRectangle(e) {
    if (this.rectangleMode) {
        if (this.initialClickX && this.initialClickY) {
            this.mousedownX = e.clientX;
            this.mousedownY = e.clientY;
        }

        if (e.type === "mouseup") {
            const x = e.clientX - this.canvas.offsetLeft;
            const y = e.clientY - this.canvas.offsetTop;

            if (x !== this.initialClickX || y !== this.initialClickY) {
                this.ctx.fillStyle = this.currentColor;
                this.ctx.fillRect(x, y, this.currentBrushSize * 5, this.currentBrushSize * 5); // Draw the rectangle
                this.stopPainting(); // Stop painting after placing one rectangle
            }

            // Reset the mousedown position
            this.mousedownX = null;
            this.mousedownY = null;
        }
    }
}
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

   toggleRectangleMode() {
    this.rectangleMode = !this.rectangleMode;

    if (this.rectangleMode) {
        this.canvas.addEventListener("click", this.drawRectangle);
        this.canvas.removeEventListener("mouseup", this.stopPainting);
        this.canvas.addEventListener("mouseup", this.draw);
    } else {
        this.canvas.removeEventListener("click", this.drawRectangle);
        this.canvas.addEventListener("mouseup", this.stopPainting);
        this.canvas.addEventListener("mousemove", this.draw);
    }
}

    isRectangleMode() {
        return this.rectangleMode;
    }

    changeColor(e) {
        this.currentColor = e.target.style.backgroundColor;
    }

    saveDrawing() {
        const image = this.canvas.toDataURL("image/png");
        // Send the 'image' variable to the server using AJAX
        // You can use the Fetch API or other libraries like Axios
    }
}
