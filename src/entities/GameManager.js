class GameManager {

    constructor() {
        this.init();
    }

    init() {
        this.ideas = [];
        this.lastStep = 0;
        this.step = 5;
        this.lastIdea = 0;
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

    addIdea(difficulty) {
        this.ideas.push({
            difficulty: difficulty
        });
    }

}


export default new GameManager();