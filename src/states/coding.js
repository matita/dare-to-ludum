import GameManager from '../entities/GameManager';

const SCALE = 4;

class Coding extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        this.presses = 0;
        this.isDown = false;
        this.minIntensity = 0.001;
        this.maxIntensity = 0.05;
        this.intensity = this.minIntensity;
        this.isResting = true;
        this.isCompleted = false;

        this.idea = GameManager.ideas.filter(i => i.devCompleted < i.devNeeded)[0];

        this.audio = {
            completedIdea: this.game.add.sound('1up')
        };
        
        this.createDesk();
        this.createGUI();

    }


    createGUI() {
        this.ideaText = this.game.add.text(10, 10, 'Idea:', { fill: '#fff' });
        this.ideaText.fixedToCamera = true;

        this.updateText();
    }


    createDesk() {
        
        this.desk = this.game.add.sprite(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2), 'desk');
        this.desk.smoothed = false;
        this.desk.scale.set(SCALE, SCALE);
        this.desk.anchor.setTo(0.5, 0.5);

        var anim = this.desk.animations.add('left', [1, 2], 24);
        anim.onComplete.add(this.rest, this);
        anim = this.desk.animations.add('right', [2, 3], 24);
        anim.onComplete.add(this.rest, this);

        this.game.input.keyboard.onDownCallback = this.onDown.bind(this);
        this.game.input.keyboard.onUpCallback = this.onUp.bind(this);
    }


    rest() {
        this.desk.frame = 0;
        this.isResting = true;
    }


    onDown() {
        
        if (this.isCompleted || this.isDown)
            return;

        this.isResting = false;
        this.isDown = true;
        this.presses++;
        const animationName = (this.presses % 2) ? 'left' : 'right';
        this.desk.animations.play(animationName);
        this.game.camera.shake(this.intensity, 100);
        
        if (GameManager.checkDev(this.idea, this.intensity*10))
            this.completedIdea();
        this.updateText();

    }


    completedIdea() {
        this.isCompleted = true;
        this.audio.completedIdea.play();
        this.time.events.add(Phaser.Timer.SECOND * 2, () => this.game.state.start('game'));
    }


    onUp() {
        
        this.isDown = false;

    }


    updateText() {
        this.ideaText.text = 'Idea: ' + this.idea.genre +
            '\nCompleted: ' + Math.floor(this.idea.devCompleted / this.idea.devNeeded * 100) + '%';
    }


    update() {
        if (this.isResting)
            this.intensity -= 0.0005;
        else
            this.intensity += 0.0001;

        if (this.intensity < this.minIntensity)
            this.intensity = this.minIntensity;
        else if (this.intensity > this.maxIntensity)
            this.intensity = this.maxIntensity;
    }

}


export default Coding;