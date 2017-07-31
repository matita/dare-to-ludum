import GameManager from '../entities/GameManager';
import button from '../utils/button';


class Publish extends Phaser.State {

    create() {

        var total = 0;
        GameManager.ideas.forEach(i => {
            var score = i.devCompleted + i.drawCompleted;
            const isComplete = i.devCompleted >= i.devNeeded &&
                i.drawCompleted >= i .drawNeeded;
            if (isComplete)
                score = score * 3;
            total += score;
        });
        
        const text = 'You published your game' +
            '\n' + GameManager.name + '!' +
            '\n\nYou scored ' + total + ' points';

        this.txt = this.game.add.text(0, 0, text, {
            fill: '#fff',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'bottom',
            wordWrap: true,
            wordWrapWidth: 600
        });
        this.txt.setShadow(0, 3, 'rgba(0,0,0,.3)', 0);
        this.txt.setTextBounds(0, 0, this.game.width, this.game.height / 2);


        button(
            this.game,
            Math.floor(this.game.width / 2 - 100),
            Math.floor(this.game.height / 2 + 40),
            200, 60,
            'Back to Menu',
            () => this.game.state.start('menu')
        );


    }


    update() {

    }

}


export default Publish;