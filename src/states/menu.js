import GameManager, { SCALE } from '../entities/GameManager';
import button from '../utils/button';

class Menu extends Phaser.State {

  constructor() {
    super();
  }
  
  create() {

    this.game.stage.backgroundColor = '#25386f';

    this.createDesk();
    this.createLogo();
    this.createStartBtn();

    //this.input.onDown.add(this.startGame, this);
    //this.startGame();
  }


  createDesk() {

    this.desk = this.game.add.sprite(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2), 'desk');
    this.desk.smoothed = false;
    this.desk.scale.setTo(SCALE, SCALE);
    this.desk.anchor.set(0.5, 0.5);

  }


  createLogo() {

    this.logo = this.game.add.image(Math.floor(this.game.width / 2), Math.floor(this.game.height / 2 - this.desk.height), 'logo');
    this.logo.smoothed = false;
    this.logo.scale.setTo(2, 2);
    this.logo.anchor.set(0.5, 0.5);

  }


  createStartBtn() {
    
    this.startBtn = button(
      this.game,
      Math.floor(this.game.width / 2 - 100),
      Math.floor(this.game.height / 2 + this.desk.height),
      200, 60,
      'Start Compo',
      this.startGame, this
    );

  }


  update() {}

  startGame () {
    GameManager.init(this.game);
    this.game.state.start('game');
    //this.game.state.start('nopower');
  }

}

export default Menu;
