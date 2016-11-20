var MODES = {
    SET: 1,
    KEEP: 2
};

var level_data = [
    {
        title: 'Introduction',
        desc_short: 'Learn to play the game.',
        desc_long: 'Replicate the text you see on the top half of your screen in the lower half of the screen.',
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
    },

    {
        title: 'Leaving Home',
        desc_short: 'Don\'t be in such a rush.',
        desc_long: 'Use ctrl+e to go to the end of a line. Press ctrl+a to go to the start of a line. The home and end keys can also be used.',
        steps: [
            {
                start: ['What on earth am I going to do with this long line?'],
                goal: ['What on earth am I going to do with this long line? Add text at the end!'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            }
        ]
    }
];

function Level0() {
    this.num = 0;

    this.steps = level_data[this.num].steps;
    this.progress = 0;

    this.set_up_level();
}

Level0.prototype.set_up_level = function() {
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
    this.display = new Editor($('#level0-display'), false);
    this.editor = new Editor($('#level0-editor'), true);

    // Initialize editor states
    this.display.set_data_buffer(
        this.steps[this.progress]['match']
    );
    this.editor.set_data_buffer(
        this.steps[this.progress]['start']
    );    
    this.editor.set_cursor(pos.x, pos.y);
    this.editor.enable_diffing(this.display);
    this.display.render();
    this.editor.render();

    // Attach keyboard binding
    this.keyboard_layout = new KeyboardLayout(this.editor);

    // Game implicitly begins
};

Level0.prototype.loop = function() {
    if (this.display.equals(this.editor)) {
        this.progress++;
        this.set_up_level();
    }
};

Level0.prototype.win = function() {
    this.editor.render();  // Render one more time to reset coloring
    game.stop();
    // TODO: display some sort of message
    // TODO: allow advancing to level 2.
};



function insert_level_screen(num) {
    
    $('<div class="screen level"><div class="container">' +
      '  <div class="level-header">' + 
      '    <h1>' + level_data[num].title + '</h1>' +
      '    <p>' + level_data[num].desc_short + '</p>' +
      '  </div><div>' +
      '    <h2>Goal:</h2>' +
      '    <pre class="editor" id="level' + num + '-display"></pre>' +
      '  </div><div>' +
      '    <h2>Type:</h2>' + 
      '    <pre class="editor" id="level' + num + '-editor"></pre>' +
      '  </div></div></div>')
        .insertBefore($('#credits-screen'));
};

function insert_all_levels() {
    for (var i = 0; i < level_data.length; i++) {
        console.log('inserting level', i);
        insert_level_screen(i);
    }
}
