import GameManager from '../entities/GameManager';
import button from '../utils/button';


class Ideas extends Phaser.State {

    create() {

        const text = 'Hey, I could do a ' +
            GameManager.ideas
                .filter(i => i.genre !== 'flappy')
                .map(i => i.genre + ' ').join('') +
            'Flappy Bird clone!\n\nI should call it\n' +
            GameManager.name;

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
            'Let\'s dev it!',
            () => this.game.state.start('game')
        );

    }


    update() {

    }

}


export default Ideas;