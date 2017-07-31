import { SCALE } from '../entities/GameManager';
import button from '../utils/button';


class NoPower extends Phaser.State {

  constructor() {
    super();
  }
  
  create() {

    this.createGrave();
    this.createText();
    this.createBackBtn()
    
    this.saveVarsToLocalStorage();
  }


  createGrave() {

    this.grave = this.game.add.image(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2), 'grave');
    this.grave.smoothed = false;
    this.grave.scale.setTo(SCALE, SCALE);
    this.grave.anchor.set(0.5, 0.5);

  }


  createText() {

    var text = this.add.text(Math.floor(this.game.width * 0.5), Math.floor(this.game.height * 0.5 - 32*SCALE), 'You ran out of power', {
      fill: '#ffffff', align: 'center'
    });
    text.setShadow(0, 3, 'rgba(0,0,0,.5)', 0);
    text.anchor.set(0.5);

  }


  createBackBtn() {

    button(
        this.game, 
        Math.floor(this.game.width / 2 - 100),
        Math.floor(this.game.height / 2 + this.grave.height),
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


export default NoPower;