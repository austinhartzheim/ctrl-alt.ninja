var MODES = {
    SET: 1,
    KEEP: 2
};

var level_data = [
    {
        title: 'Introduction',
        desc_short: 'Learn to play the game.',
        desc_long: ('<h2>Welcome, Ninja!</h2><p>You have started down the path of becomming a <i>Keyboard Ninja</i>.</p>' +
                    '<p>There are two skills every Keyboard Ninja must learn: <ol><li>keyboard shortcuts</li><li>and when to use them</li></ol></p>' +
                    '<p>Together these skills provide great power.</p>' +
                    '<h2>What you must do</h2>' +
                    '<ul><li>Replicate the text you see on the screen by typing it.</li><li>Apply the shortcuts we will teach you to advance on your journey.</li></ul>'),
        msg_win: ('<h2>Your journey has begun!</h2><p>You have passed the first of many levels on your long journey to become a <i>Keyboard Ninja</i>.</p>' +
                  '<p>When you are ready to continue, you may click the button below.</p>'),
                  
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

    this.intro();
    this.set_up_level();
}

Level0.prototype.start = function() {
    $('html, body').animate({
        scrollTop: $("#level0").offset().top
    }, 750, function() {
        console.log('scroll complete');
        game.level.intro();
    });
};

Level0.prototype.intro = function() {
    show_modal(level_data[this.num].title,
               level_data[this.num].desc_short,
               level_data[this.num].desc_long,
               'Let\'s Start!',
               function(e) {game.level.set_up_level();}
              );
};

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

    show_modal('Congratulations!',
               'You passed a level.',
               level_data[this.num].msg_win,
               'Continue',
               function(e) {console.log('not implemented');}
              );
    // TODO: allow advancing to level 2.
};



function insert_level_screen(num) {
    
    $('<div class="screen level" id="level'+num+'"><div class="container">' +
      '  <div class="header">' + 
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
