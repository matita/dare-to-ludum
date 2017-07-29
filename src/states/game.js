const SCALE = 4;

class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    /*var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5, 'Game', {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    text.anchor.set(0.5);*/

    //this.input.onDown.add(this.endGame, this);

    this.isPlaying = true;
    this.score = 0;
    this.lastTube = null;

    this.tubeCount = 12;
    this.gapHeight = 2;
    this.tubeHeight = 8 * SCALE;
    this.tubeDistance = 200;
    this.initDistance = 300;
    this.speed = 120;
    this.upperBound = (this.game.height / 2) - (this.tubeHeight * this.tubeCount / 2);
    this.lowerBound = this.upperBound + this.tubeCount * this.tubeHeight; 

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 800;

    this.audio = {
      blip: this.game.add.sound('blip'),
      birdLose: this.game.add.sound('bird-lose')
    };

    this.createCheckpoints();
    this.createTubes();
    this.createBird();
    this.createGUI();
    while (!this.lastTube || this.lastTube.x < this.game.width)
      this.createTube();
    
    this.input.onDown.add(this.jump, this);
  }


  createGUI() {
    this.scoreText = this.game.add.text(10, 10, 'Score: ' + this.score, { fill: '#fff' });
    this.scoreText.fixedToCamera = true;
  }


  createBird() {
      
      this.bird = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'bird');
      this.bird.smoothed = false;
      this.bird.scale.setTo(SCALE, SCALE);
      this.game.physics.arcade.enable(this.bird, Phaser.Physics.ARCADE);
    
  }


  createTubes() {
    this.tubes = this.game.add.group();

    const tubesModulesCount = (this.tubeCount - this.gapHeight) * 10;

    for (var i = 0; i < tubesModulesCount; i++) {
      var tube = this.game.add.sprite(0, 0, 'tube');
      tube.smoothed = false;
      tube.scale.setTo(SCALE, SCALE);

      this.tubes.add(tube);
      tube.kill();
    }
  }


  createTube() {
    const x = this.lastTube ? 
      this.lastTube.x + this.tubeDistance : 
      this.initDistance + (this.game.width / 2);

    var gapJ = this.game.rnd.integerInRange(1, this.tubeCount - 2 - this.gapHeight);
      

    for (var j = 0; j < this.tubeCount; j++) {
      var y = this.upperBound + (j * this.tubeHeight);
      
      if (j === gapJ) {
        
        var check = this.checkpoints.getFirstDead(true, x + this.tubeHeight, y);
        check.revive();
        check.body.velocity.x = -this.speed;

      } else if (j >= gapJ && j <= gapJ + this.gapHeight) {
        
        continue;

      } else {

        var tube = this.tubes.getFirstDead(true, x, y, 'tube');
        tube.revive();
        
        if (j < gapJ - 1 || j > gapJ + this.gapHeight + 1)
          tube.frame = 2;
        else if (j == gapJ - 1)
          tube.frame = 1;
        else if (j == gapJ + this.gapHeight)
          tube.frame = 0;
        
        this.game.physics.arcade.enable(tube, Phaser.Physics.ARCADE);
        tube.body.immovable = true;
        tube.body.allowGravity = false;
        tube.body.velocity.x = -this.speed;
        this.lastTube = tube;

      }
    }
  }


  createCheckpoints() {
    this.checkpoints = this.game.add.group();

    for (var i = 0; i < 10; i++) {
      const check = this.game.add.sprite(0, 0);
      check.scale.setTo(SCALE * this.tubeHeight, SCALE * this.tubeHeight * this.gapHeight);
      this.game.physics.arcade.enable(check, Phaser.Physics.ARCADE);
      check.body.immovable = true;
      check.body.allowGravity = false;
      this.checkpoints.add(check);
      check.kill();
    }
  }


  jump() {
    this.bird.body.velocity.y = -300;
    this.audio.blip.play();
  }

  onCollision() {
    this.loseGame();
  }


  onCheckPoint(bird, checkPoint) {
    checkPoint.kill();
    this.score++;
    this.scoreText.text = 'Score: ' + this.score;
  }


  update() {
    if (this.isPlaying) {
      if (this.bird.y <= this.upperBound || this.bird.y + this.bird.height >= this.lowerBound) {
        
        this.loseGame();

      } else {

        this.game.physics.arcade.collide(this.bird, this.tubes, this.onCollision, null, this);
        this.game.physics.arcade.overlap(this.bird, this.checkpoints, this.onCheckPoint, null, this);
        this.killPassedObjects();

        if (this.lastTube.x < this.game.width - this.tubeDistance)
          this.createTube();

      }
    }
  }


  killPassedObjects() {
    this.tubes.forEachAlive(t => {
      if (t.x < 0 - t.width) 
        t.kill();
    });

    this.checkpoints.forEachAlive(t => {
      if (t.x < 0 - t.width)
        t.kill();
    });
  }


  stopAll() {
    this.tubes.forEachAlive(s => s.body.velocity.x = 0);
    this.checkpoints.forEachAlive(s => s.body.velocity.x = 0);
  }

  loseGame() {
    if (!this.isPlaying)
      return;

    this.isPlaying = false;
    this.stopAll();
    this.bird.body.velocity.y = -200;
    this.bird.body.angularVelocity = this.game.rnd.integerInRange(100, 200) * this.game.rnd.sign();
    this.time.events.add(Phaser.Timer.SECOND * 2, () => this.game.state.start('game'));
    this.audio.birdLose.play();
  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
