import Boot from './states/boot';
import Coding from './states/coding';
import Drawing from './states/drawing';
import Game from './states/game';
import Ideas from './states/ideas';
import Flappy from './states/flappy';
import Menu from './states/menu';
import NoPower from './states/nopower';
import NoTime from './states/notime';
import Preloader from './states/preloader';
import Publish from './states/publish';
import Sleeping from './states/sleeping';
import Gameover from './states/gameover';


const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'dare-to-ludum-game');

game.state.add('boot', new Boot());
game.state.add('coding', new Coding());
game.state.add('drawing', new Drawing());
game.state.add('game', new Game());
game.state.add('ideas', new Ideas());
game.state.add('flappy', new Flappy());
game.state.add('menu', new Menu());
game.state.add('nopower', new NoPower());
game.state.add('notime', new NoTime());
game.state.add('preloader', new Preloader());
game.state.add('publish', new Publish());
game.state.add('sleeping', new Sleeping());
game.state.add('gameover', new Gameover());

game.state.start('boot');
