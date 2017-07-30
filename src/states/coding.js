import GameManager from '../entities/GameManager';

const SCALE = 4;

class Coding extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        
        this.minIntensity = 0.001;
        this.maxIntensity = 0.01;
        this.wrongTapsForBug = 10;
        this.bugPenalty = 1;

        this.wrongTaps = 0;
        this.presses = 0;
        this.factIntensity = 0;
        this.intensity = this.minIntensity;
        this.isDown = false;
        this.isResting = true;
        this.isCompleted = false;

        this.idea = GameManager.ideas.filter(i => i.devCompleted < i.devNeeded)[0];

        this.audio = {
            completedIdea: this.game.add.sound('1up'),
            bug: this.game.add.sound('bird-lose')
        };
        
        this.createDesk();
        this.createGUI();

    }


    createGUI() {
        this.ideaText = this.game.add.text(10, 10, 'Idea:', { fill: '#fff' });
        this.ideaText.fixedToCamera = true;

        this.completionBar = this.game.add.graphics(10, 100);

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

        this.checkBug();
        
        if (GameManager.checkDev(this.idea, this.intensity*10))
            this.completedIdea();
        this.updateText();

    }


    checkBug() {
        
        if (!this.isDanger)
            return this.wrongTaps = 0;
        
        this.wrongTaps++;
        if (this.wrongTaps >= this.wrongTapsForBug) {
            
            this.wrongTaps = 0;
            this.idea.devCompleted -= this.bugPenalty;
            if (this.devCompleted < 0)
                this.idea.devCompleted = 0;

            this.audio.bug.play();
        }
        
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
        this.ideaText.text = 'Name: ' + GameManager.name + 
            '\nIdea: ' + this.idea.genre +
            '\nCompleted: ' + Math.floor(this.idea.devCompleted / this.idea.devNeeded * 100) + '%';
    }

    updateBar() {

        const barWidth = 100;
        const barHeight = 20;
        
        this.completionBar.beginFill(0xffffff, 1);
        this.completionBar.drawRect(0, 0, barWidth + SCALE * 2, barHeight + SCALE * 2);
        this.completionBar.beginFill(this.isDanger ? 0xff0000 : 0x00ff00, 1);
        this.completionBar.drawRect(SCALE, SCALE, Math.floor(barWidth * this.factIntensity), barHeight);
        this.completionBar.endFill();

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

        this.factIntensity = (this.intensity - this.minIntensity) / (this.maxIntensity - this.minIntensity);
        this.isDanger = this.factIntensity > 0.8;

        this.updateBar();
    }

}


export default Coding;