import GameManager, { SCALE } from '../entities/GameManager';
import button from '../utils/button';


class Sleeping extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        this.createBed();
        this.createWakeBtn();

        GameManager.startTimer(20, 2);

    }


    createBed() {
        this.bed = this.game.add.sprite(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2), 'bed');
        this.bed.smoothed = false;
        this.bed.anchor.set(0.5, 0.5);
        this.bed.scale.setTo(SCALE, SCALE);
        this.bed.frame = 1;
    }


    createWakeBtn() {

        this.wakeBtn = button(
            this.game,
            this.bed.x - 100, 
            this.bed.y + this.bed.height - 30,
            200, 60,
            'Wake up!',
            this.wakeUp, this
        );
        /*const width = 200;
        const height = 40;

        this.wakeBmp = this.game.make.bitmapData(width, height);
        this.wakeBmp.fill(255,255,255,255);

        this.wakeBtn = this.game.add.sprite(this.bed.x - width / 2, this.bed.y + this.bed.height - 20, this.wakeBmp);
        this.wakeBtn.inputEnabled = true;
        this.wakeBtn.events.onInputOver.add(() => this.game.canvas.style.cursor = 'pointer');
        this.wakeBtn.events.onInputOut.add(() => this.game.canvas.style.cursor = 'default');
        this.wakeBtn.events.onInputDown.add(this.wakeUp, this);


        this.wakeTxt = this.game.add.text(0, 0, 'Wake Up!', {
            fill: '#333',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });
        this.wakeTxt.setTextBounds(this.wakeBtn.x, this.wakeBtn.y + 2, this.wakeBtn.width, this.wakeBtn.height);*/
    }


    wakeUp() {
        this.game.state.start('game');
    }


    update() {

    }

}


export default Sleeping;