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

        this.ideas = [];
        this.lastStep = 0;
        this.step = 5;
        this.lastIdea = 0;
        this.availableIdeas = Object.keys(NAMES);
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
            genre = 'clone';
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
            devCompleted: 0
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

}


export default new GameManager();