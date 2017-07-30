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
        this.barWidth = 100;
        this.barHeight = 20;
        this.sheetColor = { r: 220, g: 220, b: 220 };
        this.color = '#555';
        this.errorColor = '#f00';

        this.isDown = false;
        this.isError = false;
        this.isCompleted = false;
        this.sheetCompletion = 0;

        this.idea = GameManager.ideas.filter(i => i.drawCompleted < i.drawNeeded)[0];

        this.audio = {
            completedIdea: this.game.add.sound('1up'),
            completedSheet: this.game.add.sound('coin')
        };
        
        this.createSheet();
        this.createGUI();

        this.input.onDown.add(this.onMouseDown, this);
        this.input.onUp.add(this.onMouseUp, this);

    }


    createGUI() {

        this.instrText = this.game.add.text(
            //Math.floor(this.game.width / 2 + this.sheetWidth*SCALE), 
            //Math.floor(this.game.height / 2), 
            0, 0,
            'a\nb', { 
                fill: '#fff',
                boundsAlignV: 'middle'
            });
        this.instrText.setTextBounds(this.sheet.x + this.sheet.width + 10, 0, this.game.width, this.game.height);
        this.instrText.setShadow(0, 3, 'rgba(0,0,0,.5)', 0);
        this.instrText.fixedToCamera = true;

        this.completionBar = this.game.add.graphics(this.sheet.x - SCALE, this.sheet.y + this.sheet.height + this.barHeight);
        this.completionBar.fixedToCamera = true;

        this.updateBar();

    }


    onMouseDown() {

        if (this.isCompleted)
            return;

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
        this.sheetBmp.fill(this.sheetColor.r, this.sheetColor.g, this.sheetColor.b, 1);

        const sheetX = Math.floor((this.game.width / 2) - (this.sheetWidth * SCALE / 2));
        const sheetY = Math.floor((this.game.height / 2) - (this.sheetHeight * SCALE / 2));
        
        this.sheet = this.game.add.sprite(sheetX, sheetY, this.sheetBmp);
        this.sheet.smoothed = false;
        this.sheet.scale.setTo(SCALE, SCALE);


        this.tempBmp = this.game.make.bitmapData(this.sheetWidth, this.sheetHeight);
        this.tempSheet = this.game.add.sprite(sheetX, sheetY, this.tempBmp);
        this.tempSheet.smoothed = false;
        this.tempSheet.scale.setTo(SCALE, SCALE);


        this.completedBmp = this.game.make.bitmapData(this.sheetWidth, this.sheetHeight);
        this.completedSheet = this.game.add.sprite(-this.game.width, 0, this.completedBmp);
        this.completedSheet.smoothed = false;
        this.completedSheet.scale.setTo(SCALE, SCALE);
        
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
            if (c.r !== this.sheetColor.r || c.g !== this.sheetColor.g || c.b != this.sheetColor.b)
                coloredPixels++;
            return c;
        });

        const totalPixels = this.sheetWidth * this.sheetHeight;
        this.sheetCompletion = coloredPixels / totalPixels;

        if (this.sheetCompletion >= this.minToComplete)
            this.completeSheet();

        this.updateBar();
        
    }


    completeSheet() {

        this.completedBmp.copy(this.sheetBmp);
        this.completedSheet.x = this.sheet.x - this.sheetWidth*SCALE * 2;
        this.completedSheet.y = this.sheet.y;
        this.completedSheet.alpha = 1;
        this.game.add.tween(this.completedSheet)
            .to({ x: - this.sheetWidth * SCALE, alpha: 0 }, 200, Phaser.Easing.Cubic.Out, true);

        this.sheet.alpha = 0;

        if (GameManager.checkDraw(this.idea, 1)) {
            
            this.completedIdea();

        } else {

            this.sheetBmp.fill(this.sheetColor.r, this.sheetColor.g, this.sheetColor.b, 1);
            this.sheetBmp.dirty = true;
            this.sheet.x = this.game.width * 2;
            this.game.add.tween(this.sheet)
                .to({ x: Math.floor((this.game.width / 2) - (this.sheetWidth * SCALE / 2)), alpha: 1 }, 200, Phaser.Easing.Cubic.Out, true)
                .onComplete.add(() => {
                    this.sheetCompletion = 0;
                    this.updateBar();
                });

            this.audio.completedSheet.play();

        }

        this.updateBar();

    }


    completedIdea() {
        this.isCompleted = true;
        this.audio.completedIdea.play();
        this.time.events.add(Phaser.Timer.SECOND * 2, () => this.game.state.start('game'));
    }


    flagError() {
        this.isError = true;
        this.tempBmp.update();
        this.tempBmp.processPixelRGB(c => {
            if (c.r !== this.sheetColor.r || c.g !== this.sheetColor.g || c.b !== this.sheetColor.b) {
                c.r = 255;
                c.g = 0;
                c.b = 0;
            }
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


    updateBar() {

        this.completionBar.beginFill(0xffffff, 1);
        this.completionBar.drawRect(0, 0, this.sheet.width + SCALE * 2, this.barHeight + SCALE*2);

        const sheetFactCompleted = Math.min(this.sheetCompletion, this.minToComplete) / this.minToComplete;
        this.completionBar.beginFill(0x00ff00, 1);
        this.completionBar.drawRect(SCALE, SCALE, Math.floor(this.sheet.width * sheetFactCompleted), this.barHeight);
        this.completionBar.beginFill(0, 0.5);
        this.completionBar.drawRect(SCALE, SCALE, this.sheet.width, SCALE);
        this.completionBar.drawRect(SCALE, SCALE * 2, SCALE, this.barHeight - SCALE);
        this.completionBar.endFill();

        const assetsToDraw = this.idea.drawNeeded - this.idea.drawCompleted;
        this.instrText.text = assetsToDraw > 0 ? `Draw ${assetsToDraw} assets\nas fast as you can` : 'All assets completed!';

    }


    update() {

        const inputX = Math.floor((this.game.input.activePointer.x - this.sheet.x) / SCALE);
        const inputY = Math.floor((this.game.input.activePointer.y - this.sheet.y) / SCALE);

        if (this.isDown) {
            
            if (inputX !== this.cursorX || inputY !== this.cursorY) {
                this.drawLine(inputX, inputY);
            }

        }
    }

}


export default Drawing;