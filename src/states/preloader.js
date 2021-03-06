class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }

  preload() {
    //setup loading bar
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);

    //Setup loading and its events
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }

  update() {
      if (this.ready) {
        this.game.state.start('menu');
      }
  }

  loadResources() {
      // load your resources here
      this.load.image('logo', './assets/ld39-logo.png?v=0');
      this.load.spritesheet('lamp', './assets/ld39-lamp.png?v=0', 16, 16);
      this.load.spritesheet('keyboard', './assets/ld39-keyboard.png?v=1', 16, 16);
      this.load.spritesheet('draw', './assets/ld39-draw.png?v=1', 16, 16);
      this.load.spritesheet('littlebed', './assets/ld39-littlebed.png?v=0', 16, 16);
      this.load.spritesheet('desk', './assets/ld39-desk.png?v=3', 32, 32);
      this.load.spritesheet('tube', './assets/ld39-tube.png?v=2', 8, 8);
      this.load.spritesheet('bird', './assets/ld39-bird.png?v=0', 8, 8);
      this.load.spritesheet('bug', './assets/ld39-bug.png?v=0', 16, 16);
      this.load.spritesheet('littlelamp', './assets/ld39-littlelamp.png?v=0', 8, 8);
      this.load.spritesheet('bed', './assets/ld39-bed.png', 32, 32);
      this.load.spritesheet('grave', './assets/ld39-grave.png?v=1', 32, 32);

      this.load.audio('blip', './assets/blip.wav');
      this.load.audio('bird-lose', './assets/bird-lose.wav');
      this.load.audio('1up', './assets/1up.wav');
      this.load.audio('coin', './assets/coin.wav');
  }

  onLoadComplete() {
    this.ready = true;
  }
}

export default Preloader;
