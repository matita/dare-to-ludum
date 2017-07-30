import GameManager, { SCALE } from '../entities/GameManager';
import crispLine from '../utils/bresenham';

class Drawing extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        this.sheetWidth = 30;
        this.sheetHeight = 40;
        this.minToComplete = 0.2;

        this.isDown = false;
        this.isError = false;
        this.color = '#000';
        this.errorColor = '#f00';
        
        this.createSheet();

        this.input.onDown.add(this.onMouseDown, this);
        this.input.onUp.add(this.onMouseUp, this);

    }


    onMouseDown() {

        const inputX = Math.floor((this.game.input.activePointer.x - this.sheet.x) / SCALE);
        const inputY = Math.floor((this.game.input.activePointer.y - this.sheet.y) / SCALE);

        this.beginDrawing(inputX, inputY);

    }


    onMouseUp() {

        const inputX = Math.floor((this.game.input.activePointer.x - this.sheet.x) / SCALE);
        const inputY = Math.floor((this.game.input.activePointer.y - this.sheet.y) / SCALE);

        if (this.isDown) {
            this.endDrawing(inputX, inputY);
        }

    }


    createSheet() {

        this.sheetBmp = this.game.make.bitmapData(this.sheetWidth, this.sheetHeight);
        this.sheetBmp.fill(255, 255, 255, 1);

        const sheetX = Math.floor((this.game.width / 2) - (this.sheetWidth * SCALE / 2));
        const sheetY = Math.floor((this.game.height / 2) - (this.sheetHeight * SCALE / 2));
        
        this.sheet = this.game.add.sprite(sheetX, sheetY, this.sheetBmp);
        this.sheet.smoothed = false;
        this.sheet.scale.setTo(SCALE, SCALE);


        this.tempBmp = this.game.make.bitmapData(this.sheetWidth, this.sheetHeight);
        this.tempSheet = this.game.add.sprite(sheetX, sheetY, this.tempBmp);
        this.tempSheet.smoothed = false;
        this.tempSheet.scale.setTo(SCALE, SCALE);


        
    }


    drawPixel(x, y) {
        this.tempBmp.rect(x, y, 1, 1, this.isError ? this.errorColor : this.color);
    }


    isValid(x, y) {
        return x >= 0 && x < this.sheetWidth &&
            y >= 0 && y < this.sheetHeight;
    }


    beginDrawing(x, y) {

        if (!this.isValid(x, y))
            return console.log('isError', this.isError);

        this.isError = false;
        this.isDown = true;
        this.tempBmp.clear();
        this.drawPixel(x, y);
        this.tempBmp.dirty = true;
        
        this.cursorX = x;
        this.cursorY = y;

    }


    endDrawing(x, y) {
        if (!this.isError && this.isValid(x, y)) {
            this.sheetBmp.copy(this.tempBmp);
            this.calculateSheet();
        }
        this.tempBmp.clear();
        this.isError = false;
        this.isDown = false;
    }


    calculateSheet() {
        this.sheetBmp.update();
        var coloredPixels = 0;
        this.sheetBmp.processPixelRGB(c => {
            if (c.a !== 0 && c.r === 0)
                coloredPixels++;
            return c;
        });

        const totalPixels = this.sheetWidth * this.sheetHeight;
        const factComplete = coloredPixels / totalPixels;
        if (factComplete >= this.minToComplete)
            this.completeSheet();
        console.log('Frame', Math.floor(100*factComplete) + '% complete');
    }


    completeSheet() {

    }


    flagError() {
        this.isError = true;
        this.tempBmp.update();
        this.tempBmp.processPixelRGB(c => {
            if (c.a !== 0)
                c.r = 255;
            return c;
        });
    }


    drawLine(x, y) {
        crispLine(this.cursorX, this.cursorY, x, y, this.drawPixel, this);
        if (!this.isValid(x, y)) {
            this.flagError();
        } else {
            this.tempBmp.dirty = true;
        }

        this.cursorX = x;
        this.cursorY = y;
    }


    update() {

        if (!this.dbgTxt) {
            this.dbgTxt = this.game.add.text(10, 10, '', { fill: '#fff' });
            this.dbgTxt.fixedToCamera = true;
        }

        this.dbgTxt.text = 'wasDown: ' + this.isDown;
        
        const inputX = Math.floor((this.game.input.activePointer.x - this.sheet.x) / SCALE);
        const inputY = Math.floor((this.game.input.activePointer.y - this.sheet.y) / SCALE);

        if (this.isDown) {
            
            if (inputX !== this.cursorX || inputY !== this.cursorY) {
                this.drawLine(inputX, inputY);
            }

        }

        this.dbgTxt.text += '\nisDown: ' + this.isDown;
    }

}


export default Drawing;