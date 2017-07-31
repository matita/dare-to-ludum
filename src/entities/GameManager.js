import displayTime from '../utils/displayTime';
import drawBar from '../utils/drawBar';


export const SCALE = 4;


const FLAPPIES = [
    'Bird',
    'Parrot',
    'Sparrow',
    'Fly'
];

const NAMES = {
    'rpg': [
        'Final _',
        '_ Fantasy',
        '_\'s Gate',
        '_ Nights'
    ],

    'fps': [
        'Call of _',
        '_ of Duty',
        'Medal of _',
        '_ of Honor'
    ],

    'moba': [
        'League of _',
        '_ of Legend'
    ],

    'rts': [
        'Clash of _',
        '_ of Clans',
        'Age of _',
        '_ of Empires',
        'Total _'
    ],

    'beat\'em up': [
        'God of _',
        '_ of War',
        'Double _',
        '_ Dragon',
        'King of _',
        '_ Fighter'
    ],

    'platformer': [
        'Tomb _',
        '_ Raider',
        'Super _',
        '_ Boy'
    ],

    'roguelike': [
        'Hyper Light _',
        '_ Drifter'
    ],

    'point-n-click': [
        'The Curse of _',
        '_ Island',
        'Broken _',
        '_ Sword'
    ]
};

class GameManager {

    constructor() {
        
    }

    init(game) {

        this.game = game;

        this.name = '';
        this.ideas = [];
        this.lastStep = 0;
        this.step = 5;
        this.lastIdea = 0;
        this.availableIdeas = Object.keys(NAMES);

        this.compoDuration = 48 * Phaser.Timer.MINUTE * 60;
        this.totalTime = Phaser.Timer.MINUTE * 5;
        this.remainingTime = this.totalTime;
        this.timerSpeed = 1;

        this.maxPower = 16 * Phaser.Timer.MINUTE * 60;
        this.power = this.maxPower;
        this.powerMultiplier = -1;
        this.powerWidth = 160;
        this.powerHeight = 20;

        /*this.timer = this.game.time.create(false);
        //this.deadlineEvent = this.timer.add(10*60*1000, this.deadline, this);
        this.loop = this.timer.loop(1*1000, this.deadline, this).timer.start();
        console.log('loop', this.loop);
        console.log('timer events', this.timer.events);
        this.timer.start();*/

        //this.game.time.events.loop(1*1000, this.deadline, this);
    }

    startTimer(speed = 1, powerMultiplier = -1) {

        this.countDownTxt = this.game.add.text(0, 0, 'a\nb', { 
            fill: '#fff',
            align: 'center',
            boundsAlignH: 'right',
            boundsAlignV: 'top'
        });
        this.countDownTxt.setShadow(0, 3, 'rgba(0,0,0,.5)', 0);
        this.countDownTxt.setTextBounds(0, 20, this.game.width - 20, this.game.height);

        this.powerGr = this.game.add.graphics(this.game.width - (this.powerWidth + SCALE*2) - 20, 170);
        this.drawPowerBar();

        this.timerSpeed = speed;
        this.powerMultiplier = powerMultiplier;

        this.timer = this.game.time.create();
        this.timer.loop(0, this.tick, this);
        this.timer.start();
    }


    stopTimer() {
        this.timer.stop();
    }


    tick() {

        if (!this.timer.running)
            return;

        const elapsed = this.timer.elapsed * this.timerSpeed;
        this.remainingTime -= elapsed;

        if (this.remainingTime < 0) {
            
            this.remainingTime = 0;
            this.timeFinished();

        } else {

            const fact = this.totalTime / this.compoDuration;
            this.power += (elapsed / fact) * this.powerMultiplier;

            if(this.power > this.maxPower) {
                
                this.power = this.maxPower;

            } else if (this.power < 0) {

                this.game.state.start('nopower');

            }

            this.countDownTxt.text = 'COMPO ends' + 
                '\n' + this.getRemainingTime() +
                '\n\nPower';

            this.drawPowerBar();

        }
    }


    drawPowerBar() {
        const fact = this.power / this.maxPower;

        const color = fact > 0.3 ? 0x00ff00 : 0xff0000;

        this.powerGr.clear();
        drawBar(this.powerGr, 0, 0, this.powerWidth + SCALE * 2, this.powerHeight + SCALE * 2, fact, color);
        /*this.powerGr.beginFill(0xffffff, 1);
        this.powerGr.drawRect(0, 0, this.powerWidth + SCALE * 2, this.powerHeight + SCALE*2);
        this.powerGr.beginFill(0xeeeeee, 1);
        this.powerGr.drawRect(SCALE, SCALE, this.powerWidth, this.powerHeight);
        this.powerGr.beginFill(color, 1);
        this.powerGr.drawRect(SCALE, SCALE, Math.floor(this.powerWidth * fact), this.powerHeight);

        this.powerGr.beginFill(0, 0.2);
        this.powerGr.drawRect(SCALE, SCALE, this.powerWidth, SCALE);
        this.powerGr.drawRect(SCALE, SCALE * 2, SCALE, this.powerHeight - SCALE);
        this.powerGr.endFill();*/
    }


    getRemainingMs() {
        const fact = this.remainingTime / this.totalTime;
        return Math.round(this.compoDuration * fact);
    }


    getRemainingTime() {
        return displayTime(this.getRemainingMs());
    }


    timeFinished() {
        this.game.state.start('notime');
    }


    deadline() {
        console.log('deadline!!!!');
    }


    checkNextIdea(score) {
        if (score >= this.step + this.lastIdea) {
            this.lastIdea += this.step;
            const lastStep = this.step;
            this.step = this.step + this.lastStep;
            this.lastStep = lastStep;
            this.addIdea(lastStep);
            return true;
        }

        return false;
    }

    pickGenre() {
        if (this.availableIdeas.length === 0)
            this.availableIdeas = Object.keys(NAMES);

        const index = this.game.rnd.integerInRange(0, this.availableIdeas.length - 1);
        const genre = this.availableIdeas.splice(index, 1)[0];
        return genre;
    }

    addIdea(difficulty) {
        var genre;
        
        if (!this.name) {
            genre = 'flappy';
            this.name = FLAPPIES[this.game.rnd.integerInRange(0, FLAPPIES.length - 1)];
        } else {
            genre = this.pickGenre();
            const possibleNames = NAMES[genre];
            const newName = possibleNames[this.game.rnd.integerInRange(0, possibleNames.length - 1)];
            this.name = newName.replace('_', this.name);
        }

        this.ideas.push({
            genre: genre,
            difficulty: difficulty,
            devNeeded: difficulty,
            devCompleted: 0,
            drawNeeded: difficulty,
            drawCompleted: 0
        });
    }


    checkDev(idea, value) {
        idea.devCompleted += value;
        if (idea.devCompleted >= idea.devNeeded) {
            idea.devCompleted = idea.devNeeded;
            return true;
        }

        return false;
    }


    checkDraw(idea, value) {
        idea.drawCompleted += value;
        if (idea.drawCompleted >= idea.drawNeeded) {
            idea.drawCompleted = idea.drawNeeded;
            return true;
        }

        return false;
    }


    publish() {
        this.game.state.start('publish');
    }

}


export default new GameManager();