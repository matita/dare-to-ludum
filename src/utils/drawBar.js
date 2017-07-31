const SCALE = 4;

export default function drawBar(graphics, x, y, width, height, value, color = 0x00ff00) {
    const colorWidth = width - SCALE * 2;
    const colorHeight = height - SCALE * 2;

    graphics.beginFill(0xffffff, 1);
    graphics.drawRect(x, y, width, height);
    graphics.beginFill(0xeeeeee, 1);
    graphics.drawRect(x + SCALE, y + SCALE, colorWidth, colorHeight);
    graphics.beginFill(color, 1);
    graphics.drawRect(x + SCALE, y + SCALE, Math.floor(colorWidth * value), colorHeight);

    graphics.beginFill(0, 0.2);
    graphics.drawRect(x + SCALE, y + SCALE, colorWidth, SCALE);
    graphics.drawRect(x + SCALE, y + SCALE * 2, SCALE, colorHeight - SCALE);
    graphics.endFill();
}