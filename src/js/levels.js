var MODES = {
    SET: 1,
    KEEP: 2
};

var level_data = {
    'level1': {
        steps: [
            {
                start: ['type here'],
                match: ['int main() {'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            },
            {
                start: ['int main() {'],
                match: ['int main() {', '  return 0;', '}'],
                pos: {
                    mode: MODES.KEEP
                }
            },
            {
                start: ['int main() {', '  return 0;', '}'],
                match: ['#include <stdio.h>', '', 'int main() {', '  return 0;', '}'],
                pos: {
                    mode: MODES.KEEP
                }
            }
        ]
    }
};

function Level1() {
    this.name = 'level1';

    this.steps = level_data[this.name].steps;
    this.progress = 0;

    $('#level-title').text('Introduction');
    $('#level-desc').text('Learn how to play.');
    this.set_up_level();
}

Level1.prototype.set_up_level = function() {
    // Detach old keyboard bindings if any
    if (this.keyboard_layout != null) {
        this.keyboard_layout.destruct();
    }

    // Check if there is a next step; return early
    if (this.progress >= this.steps.length) {
        this.win();
        return;
    }

    // Store/Set up the cursor state
    var pos = {};
    switch(this.steps[this.progress].pos.mode) {
    case MODES.KEEP:
        pos.x = this.editor.get_cursor_x();
        pos.y = this.editor.get_cursor_y();
        break;
    case MODES.SET:
        pos.x = this.steps[this.progress].pos.x;
        pos.y = this.steps[this.progress].pos.y;
        break;
    default:
        throw 'No cursor position mode set';
    }
    
    // Create editors
    this.display = new Editor($('#text-display'), false);
    this.editor = new Editor($('#text-editor'), true);

    // Initialize editor states
    this.display.set_data_buffer(
        this.steps[this.progress]['match']
    );
    this.editor.set_data_buffer(
        this.steps[this.progress]['start']
    );
    this.editor.set_cursor(pos.x, pos.y);
    this.display.render();
    this.editor.render();

    // Attach keyboard binding
    this.keyboard_layout = new KeyboardLayout(this.editor);

    // Game implicitly begins
};

Level1.prototype.loop = function() {
    if (this.display.equals(this.editor)) {
        this.progress++;
        this.set_up_level();
    }
};

Level1.prototype.win = function() {
    // TODO: display some sort of message
    // TODO: allow advancing to level 2.
};
