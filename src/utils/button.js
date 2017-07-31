import { SCALE } from '../entities/GameManager';


export default function button (game, x, y, width, height, text, callback, callbackContext) {

    const bmp = game.make.bitmapData(width, height);
    bmp.fill(255, 255, 255, 255);
    bmp.rect(0, height - SCALE, width, SCALE, 'rgba(0,0,0,.3)');

    const btn = game.add.sprite(x, y, bmp);
    btn.inputEnabled = true;
    btn.events.onInputOver.add(() => {
        game.canvas.style.cursor = 'pointer';
        bmp.rect(0, 0, width, height, 'rgba(0, 0, 0, .1)');
        bmp.dirty = true;
    });
    btn.events.onInputOut.add(() => {
        game.canvas.style.cursor = 'default';
        bmp.fill(255, 255, 255, 255);
        bmp.rect(0, height - SCALE, width, SCALE, 'rgba(0, 0, 0, .3)');
        bmp.dirty = true;
    });
    btn.events.onInputDown.add(() => callback.call(callbackContext));

    const txt = game.add.text(0, 0, text, {
        fill: '#333',
        boundsAlignH: 'center',
        boundsAlignV: 'middle'
    });
    txt.setTextBounds(btn.x, btn.y + 2, btn.width, btn.height);

    const oldKill = btn.kill;
    btn.kill = () => {
        oldKill.apply(btn, arguments);
        txt.text = '';
    };

    return btn;

}