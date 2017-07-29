const SCALE = 4;

class Game extends Phaser.State {

    constructor() {
        super();
    }


    create() {

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
        //this.game.state.start('coding');
    }


    createIdeaBtn(x, y) {
        this.ideaBtn = this.game.add.sprite(x, y, 'lamp');
        this.ideaBtn.anchor.setTo(0.5, 0.5);
        this.ideaBtn.smoothed = false;
        this.ideaBtn.scale.set(SCALE, SCALE);

        this.ideaBtn.inputEnabled = true;
        this.ideaBtn.events.onInputDown.add(this.onIdeaClick, this);
    }


    createCodeBtn(x, y) {
        this.codeBtn = this.game.add.sprite(x, y, 'keyboard');
        this.codeBtn.anchor.setTo(0.5, 0.5);
        this.codeBtn.smoothed = false;
        this.codeBtn.scale.set(SCALE, SCALE);

        this.codeBtn.inputEnabled = true;
        this.codeBtn.events.onInputDown.add(this.onCodeClick, this);
    }


    onIdeaClick() {
        this.game.state.start('flappy');
    }

    onCodeClick() {
        this.game.state.start('coding');
    }


    update() {

    }

}


export default Game;