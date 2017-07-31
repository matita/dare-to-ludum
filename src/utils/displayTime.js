function pad(n) {
    return ('0' + n).substr(-2);
}


export default function displayTime(ms) {
    const hh = Math.floor(ms / (Phaser.Timer.MINUTE * 60));
    const mm = Math.floor((ms - (hh * Phaser.Timer.MINUTE * 60)) / Phaser.Timer.MINUTE);
    const ss = Math.floor((ms - (hh * Phaser.Timer.MINUTE * 60) - (mm * Phaser.Timer.MINUTE)) / Phaser.Timer.SECOND);
    return [hh, mm, ss]
        .map(pad)
        .join(':');
}