import GameManager, { SCALE } from '../entities/GameManager';
import displayTime from '../utils/displayTime';
import textBuilder from '../utils/textBuilder';
import button from '../utils/button';

class Game extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        //GameManager.addIdea(5);

        this.desk = this.game.add.sprite(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2), 'desk');
        this.desk.smoothed = false;
        this.desk.scale.set(SCALE, SCALE);
        this.desk.anchor.setTo(0.5, 0.5);
        this.btnsCount = 0;

        var btns = 4;
        var btnDistance = 16*SCALE + 10;//16*SCALE*2;
        var btnWidth = (btns -1 ) * btnDistance;
        var btnX = Math.floor(this.game.width / 2 + this.desk.width / 2 + 80);
        var btnY = Math.floor(this.game.height / 2) - 60 + 8*SCALE;//(this.game.height / 2) - (this.desk.height / 2) - 40;

        this.createIdeaBtn(btnX, Math.floor(btnY));
        this.createCodeBtn(btnX, Math.floor(btnY += btnDistance));
        this.createDrawBtn(btnX, Math.floor(btnY += btnDistance));
        this.createBedBtn(btnX, Math.floor(btnY += btnDistance));
        this.createPublishBtn();
        this.createGDD();
        
        GameManager.startTimer();
    }


    createStateBtn(x, y, key, onClick, clickContext, disabled, alwaysBouncing) {
        var btn = this.game.add.sprite(this.game.width + 10, y, key);
        btn.anchor.setTo(0.5, 0.5);
        btn.smoothed = false;
        btn.scale.set(SCALE, SCALE);

        if (disabled) {

            btn.alpha = 0.2;

        } else {

            var inOver = false;

            btn.inputEnabled = true;
            btn.events.onInputOver.add(() => {
                this.game.canvas.style.cursor = 'pointer';
                if (!alwaysBouncing)
                    tween.start();
                inOver = true;
            });
            btn.events.onInputOut.add(() => {
                this.game.canvas.style.cursor = 'default';
                inOver = false;
            });
            btn.events.onInputDown.add(onClick, clickContext);

            var tween = this.game.add.tween(btn);
            tween.to({ y: y - 20 }, 300, Phaser.Easing.Cubic.Out, false, 0, 0, true);
            tween.onComplete.add(() => { 
                if (inOver || alwaysBouncing)
                    tween.start();
            });
            if (alwaysBouncing)
                tween.start();

        }

        this.game.add.tween(btn)
            .to({ x: x }, 400, Phaser.Easing.Cubic.Out, true, 200 * this.btnsCount);

        this.btnsCount++;
        
        return btn;
    }


    createIdeaBtn(x, y) {
        var isAlwaysBouncing = GameManager.ideas.length === 0;
        this.ideaBtn = this.createStateBtn(x, y, 'lamp', this.onIdeaClick, this, false, isAlwaysBouncing);
    }


    createCodeBtn(x, y) {
        var isDisabled = GameManager.ideas.filter(i => i.devCompleted < i.devNeeded).length === 0;
        this.codeBtn = this.createStateBtn(x, y, 'keyboard', this.onCodeClick, this, isDisabled);
    }


    createDrawBtn(x, y) {
        var isDisabled = GameManager.ideas.filter(i => i.drawCompleted < i.drawNeeded).length === 0;
        this.drawBtn = this.createStateBtn(x, y, 'draw', this.onDrawClick, this, isDisabled);
    }


    createBedBtn(x, y) {
        this.drawBtn = this.createStateBtn(x, y, 'littlebed', this.onBedClick, this, false);
    }


    createPublishBtn() {

        const hasIdeaDeveloped = GameManager.ideas.filter((i) => i.devCompleted > 0 || i.drawCompleted > 0).length !== 0;

        if (!hasIdeaDeveloped)
            return;

        this.publishBtn = button(
            this.game,
            Math.floor(this.game.width / 2 - 100),
            Math.floor(this.game.height / 2 - this.desk.height / 2 - 60 - 40),
            200, 60,
            'Publish game',
            GameManager.publish, GameManager
        );

    }


    createGDD() {
        const width = 250;
        const height = width / 3 * 4;
        const x = Math.floor(this.game.width / 2 - this.desk.width / 2 - 40 - width);
        const y = Math.floor(this.game.height / 2) - 60;
        
        this.gddBmp = this.game.make.bitmapData(width, height);
        this.gddBmp.fill(255, 255, 255, 255);

        this.gdd = this.game.add.sprite(-width, y, this.gddBmp);
        //this.gdd.anchor.set(0.5, 0.5);

        this.gddTxt = this.game.add.text(0,0, '', {
            fill: '#000',
            fontSize: '13px',
            align: 'center',
            boundsAlignH: 'center',
            wordWrap: true,
            wordWrapWidth: width
        });
        this.gddTxt.lineSpacing = -3;
        this.gddTxt.setTextBounds(this.gdd.x, this.gdd.y, this.gdd.width, this.gdd.height);

        const txtBuilder = textBuilder(this.gddTxt, 'GDD\n', '#555')
            .add(GameManager.name || '???', '#000')
            .add('\n\nMechanics');

        GameManager.ideas.forEach(i => {
            const devFact = i.devCompleted / i.devNeeded;
            const drawFact = i.drawCompleted / i.drawNeeded;

            txtBuilder.add('\n')
                .add(i.genre.toUpperCase(), '#000')
                .add('\ndev: ').add(Math.floor(devFact * 100) + '%', devFact === 1 ? '#1f832b' : '#e70909')
                .add(', art: ').add(Math.floor(drawFact * 100) + '%', drawFact === 1 ? '#1f832b' : '#e70909')
        });

        this.gddIsMoving = true;
        this.game.add.tween(this.gdd).to({ x: x }, 600, Phaser.Easing.Quadratic.Out, true, 0)
            .onComplete.add(() => this.gddIsMoving = false);
        //this.game.add.tween(this.gddTxt.textBounds).to({ x: x }, 600, Phaser.Easing.Quadratic.Out, true, 0);

        txtBuilder.write();


    }


    onIdeaClick() {
        this.game.state.start('flappy');
    }

    onCodeClick() {
        this.game.state.start('coding');
    }

    onDrawClick() {
        this.game.state.start('drawing');
    }

    onBedClick() {
        this.game.state.start('sleeping');
    }


    update() {

        if (this.gddIsMoving)
            this.gddTxt.setTextBounds(this.gdd.x, this.gdd.y, this.gdd.width, this.gdd.height);

    }

}


export default Game;