import GameManager, { SCALE } from '../entities/GameManager';
import drawBar from '../utils/drawBar';

class Coding extends Phaser.State {

    constructor() {
        super();
    }


    create() {

        this.minIntensity = 0.001;
        this.maxIntensity = 0.01;
        this.wrongTapsForBug = 10;
        this.bugPenalty = 1;
        this.barWidth = 100;
        this.barHeight = 10;

        this.wrongTaps = 0;
        this.presses = 0;
        this.factIntensity = 0;
        this.intensity = this.minIntensity;
        this.isDown = false;
        this.isResting = true;
        this.isCompleted = false;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 800;

        this.idea = GameManager.ideas.filter(i => i.devCompleted < i.devNeeded)[0];

        this.audio = {
            completedIdea: this.game.add.sound('1up'),
            bug: this.game.add.sound('bird-lose')
        };
        
        this.createDesk();
        this.createBugs();
        this.createGUI();

        GameManager.startTimer();
        

    }


    createGUI() {

        this.instrText = this.game.add.text(
            //Math.floor(this.game.width / 2 + this.sheetWidth*SCALE), 
            //Math.floor(this.game.height / 2), 
            0, 0,
            'a\nb', { 
                fill: '#fff',
                align: 'center',
                boundsAlignH: 'right',
                boundsAlignV: 'middle'
            });
        //this.instrText.setTextBounds(this.sheet.x + this.sheet.width + 10, 0, this.game.width, this.game.height);
        this.instrText.setTextBounds(0, Math.floor(this.desk.y - this.desk.height / 2), Math.floor(this.game.width / 2 - this.desk.width / 2 - 40), this.desk.height);
        this.instrText.setShadow(0, 3, 'rgba(0,0,0,.5)', 0);
        this.instrText.fixedToCamera = true;

        this.completionBar = this.game.add.graphics(
            Math.floor(this.game.width / 2 - this.barWidth / 2 - SCALE), 
            Math.floor(this.game.height / 2 + this.desk.height - 20)
        );

        this.createStopBtn();

        this.updateText();
    }


    createStopBtn() {

        const width = 150;
        const height = 40;

        this.stopBmp = this.game.make.bitmapData(width, height);
        this.stopBmp.fill(255, 255, 255, 255);

        this.stopBtn = this.game.add.sprite(Math.floor(this.game.width / 2 + this.desk.width), Math.floor(this.game.height / 2 - height / 2), this.stopBmp);
        this.stopBtn.inputEnabled = true;
        this.stopBtn.events.onInputOver.add(() => this.game.canvas.style.cursor = 'pointer');
        this.stopBtn.events.onInputOut.add(() => this.game.canvas.style.cursor = 'default');
        this.stopBtn.events.onInputDown.add(() => this.game.state.start('game'));

        this.stopTxt = this.game.add.text(0, 0, 'Stop!', {
            fill: '#333',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });
        this.stopTxt.setTextBounds(this.stopBtn.x, this.stopBtn.y + 2, this.stopBtn.width, this.stopBtn.height);

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


    createBugs() {

        this.bugs = this.game.add.group();

        for (var i = 0; i < 10; i++) {
            var bug = this.game.add.sprite(0, 0, 'bug');
            bug.smoothed = false;
            bug.scale.setTo(SCALE / 2, SCALE / 2);
            bug.anchor.set(0.5, 0.5);
            bug.outOfBoundsKill = true;
            bug.outOfCameraBoundsKill = true;

            this.game.physics.arcade.enable(bug);
            bug.kill();

            this.bugs.add(bug);
        }

    }


    rest() {
        this.desk.frame = 0;
        this.isResting = true;
    }


    onDown() {
        
        if (this.isCompleted/* || this.isDown*/)
            return;

        this.isResting = false;
        this.isDown = true;
        this.presses++;
        const animationName = (this.presses % 2) ? 'left' : 'right';
        this.desk.animations.play(animationName);
        //this.game.camera.shake(this.intensity, 100);

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
            this.idea.devCompleted -= this.bugPenalty * this.game.rnd.integerInRange(1, 3);
            if (this.idea.devCompleted < 0)
                this.idea.devCompleted = 0;

            var bug = this.bugs.getFirstDead(/*true, 0, 0, 'bug'*/);
            this.game.physics.arcade.enable(bug);
            bug.revive();
            bug.x = this.game.width / 2;
            bug.y = this.game.height / 2;
            bug.body.velocity.y = -400;
            bug.body.velocity.x = this.game.rnd.integerInRange(20, 80) * this.game.rnd.sign();
            bug.body.allowGravity = true;

            this.audio.bug.play();
        }
        
    }


    completedIdea() {
        
        this.isCompleted = true;
        this.audio.completedIdea.play();

        GameManager.stopTimer();
        this.time.events.add(Phaser.Timer.SECOND * 2, () => this.game.state.start('game'));

    }


    onUp() {
        
        this.isDown = false;

    }


    updateText() {
        
        this.instrText.text = this.idea.genre.toUpperCase() + 
            '\nType mechanics' +
            '\nas fast as possible';

    }

    updateBar() {

        const barWidth = this.barWidth;
        const barHeight = this.barHeight;
        const factCompleted = this.idea.devCompleted / this.idea.devNeeded;

        drawBar(this.completionBar, 0, 0, barWidth + SCALE * 2, barHeight + SCALE * 2, factCompleted);

        const intensityColor = this.isDanger ? 0xff0000 : 0x00ff00;
        drawBar(this.completionBar, 0, barHeight + SCALE * 2 + barHeight, barWidth + SCALE*2, barHeight + SCALE*2, this.factIntensity, intensityColor);

    }


    update() {

        this.bugs.forEachAlive(bug => {
            if (bug.y > this.game.height)
                bug.kill();
        })

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