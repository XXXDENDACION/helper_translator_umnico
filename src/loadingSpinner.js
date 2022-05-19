const process = require("process");
const rdl = require("readline");
const std = process.stdout;
const cliSpinners = require('cli-spinners');

class Spinner {
    timer = null;
    text = ' ';

    changeText(text) {
        this.text = ' ' + text;
    }

    spin() {
        std.write("\x1B[?25l");
        const spin = cliSpinners.dots;
        const spinnerTimeInterval = spin.interval;
        const spinnerFrames = spin.frames;
        let index = 0;
        this.timer = setInterval(() => {
            let now = spinnerFrames[index];
            if (now === undefined) {
                index = 0;
                now = spinnerFrames[index];
            }
            std.write(now + this.text);
            rdl.cursorTo(std, 0, 0);
            index = index >= spinnerFrames.length ? 0 : index + 1;
        }, spinnerTimeInterval)
    }

    stop() {
        clearInterval(this.timer);
        rdl.moveCursor(std, 0, 0);
    }
}

module.exports = Spinner;