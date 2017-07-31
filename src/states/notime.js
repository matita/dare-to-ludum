import button from '../utils/button';


class NoTime extends Phaser.State {

  constructor() {
    super();
  }
  
  create() {
    
    const text = 'Time is up and you didn\'t publish any game...' +
        '\nSo bad :(' +
        '\n\nTry harder during the next Ludum Dare!';

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

  saveVarsToLocalStorage(){

  }

  resetGlobalVariables(){

  }

  update() {}

  restartGame () {
    this.resetGlobalVariables();
    this.game.state.start('menu');
  }

}


export default NoTime;