import GameManager, { SCALE } from '../entities/GameManager';

class Game extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        this.game.stage.backgroundColor = '#25386f';

        //GameManager.addIdea(5);

        this.desk = this.game.add.sprite(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2), 'desk');
        this.desk.smoothed = false;
        this.desk.scale.set(SCALE, SCALE);
        this.desk.anchor.setTo(0.5, 0.5);

        var btns = 4;
        var btnDistance = 16*4*2;
        var btnWidth = (btns -1 ) * btnDistance;
        var btnX = (this.game.width / 2) - (btnWidth / 2);
        var btnY = Math.floor(this.desk.y - 16*4 - 60);

        this.createIdeaBtn(Math.floor(btnX + btnWidth*0/btns), btnY);
        this.createCodeBtn(Math.floor(btnX + btnWidth*1/btns), btnY);
        this.createDrawBtn(Math.floor(btnX + btnWidth*2/btns), btnY);
        //this.game.state.start('coding');
    }


    createStateBtn(x, y, key, onClick, clickContext, disabled, alwaysBouncing) {
        var btn = this.game.add.sprite(x, y, key);
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


    onIdeaClick() {
        this.game.state.start('flappy');
    }

    onCodeClick() {
        this.game.state.start('coding');
    }

    onDrawClick() {
        this.game.state.start('drawing');
    }


    update() {

    }

}


export default Game;