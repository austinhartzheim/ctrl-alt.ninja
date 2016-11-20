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
                start: ['// start by editing this line to match the one above'],
                match: ['// this is a typing game'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            },
            {
                start: ['// this is a typing game'],
                match: ['// this is a typing game', 'int main() {'],
                pos: {
                    mode: MODES.KEEP
                }
            },
            {
                start: ['// this is a typing game', 'int main() {'],
                match: ['// this is a typing game', 'int main() {', '  return 0;', '}'],
                pos: {
                    mode: MODES.KEEP
                }
            },
            {
                start: ['// this is a typing game', 'int main() {', '  return 0;', '}'],
                match: ['// this is a typing game', 'int main() {', '  return 0;', '}'],
                pos: {
                    mode: MODES.KEEP
                }
            }
        ]
    },

    {
        title: 'Teleporting Home',
        desc_short: 'They won\'t see you coming.',
        desc_long: ('<h2>Let\'s start with the basics</h2>' +
                    '<p>The first skill every ninja-in-training learns is how to quickly move the cursor to the start and end of a line. With one keypress you can easily dazzle your foes and appear to teleport through them before landing your final blow.</p>' +
                    '<p>(Of course, by the time you finish your training, they won\'t be able to see you at all!)</p>' +
                    '<h2>New shortcuts!</h2><dl><dt>Ctrl+a</dt><dd>Skip to the start of a link.</dd><dt>Ctrl+e</dt><dd>Skip to the end of a line.</dd><dt>Alt+&lt;</dt><dd>Skip to the start of the file.</dd><dt>Alt+&gt;</dt><dd>Skip to the end of the file.</dd></dl>'),
        msg_win: '<h2>You did it!</h2><p>Can you feel the ninja power starting to take root in your fingers?</p>',
        steps: [
            {
                start: ['What on earth am I going to do with this long line?'],
                match: ['What on earth am I going to do with this long line? Add text at the end!'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            },
            {
                start: ['// this is a typing game', 'int main() {', '  return 0;', '}'],
                match: ['// this is a typing game', 'int main() {', '  return 0;', '}'],
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
        console.log(game);
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
               function(e) {
                   start_level_1();
               });
};


// Temporary hacks while we restructure the main game logic
function start_level_0() {
    game = new Game(Level0);
    game.start();
}


/*
 * Level 1
 */
function Level1() {
    this.num = 1;

    this.steps = level_data[this.num].steps;
    this.progress = 0;

    this.intro();
    this.set_up_level();
}

Level1.prototype.start = function() {
    $('html, body').animate({
        scrollTop: $("#level1").offset().top
    }, 750, function() {
        game.level.intro();
    });
};

Level1.prototype.intro = function() {
    show_modal(level_data[this.num].title,
               level_data[this.num].desc_short,
               level_data[this.num].desc_long,
               'Let\'s Start!',
               function(e) {game.level.set_up_level();}
              );
};

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
    this.display = new Editor($('#level1-display'), false);
    this.editor = new Editor($('#level1-editor'), true);

    // Initialize editor states
    console.log(this.display);
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

Level1.prototype.loop = function() {
    if (this.display.equals(this.editor)) {
        this.progress++;
        this.set_up_level();
    }
};

Level1.prototype.win = function() {
    this.editor.render();  // Render one more time to reset coloring
    game.stop();

    show_modal('Congratulations!',
               'You passed a level.',
               level_data[this.num].msg_win,
               'Continue',
               function(e) {start_level_2()}
              );
    // TODO: allow advancing to the next level
};


// Temporary hacks while we restructure the main game logic
function start_level_1() {
    game = new Game(Level1);
    game.start();
}




/*
 * Level 2
 */
function Level2() {
    this.num = 2;

    this.steps = level_data[this.num].steps;
    this.progress = 0;

    this.intro();
    this.set_up_level();
}

Level2.prototype.start = function() {
    $('html, body').animate({
        scrollTop: $("#level2").offset().top
    }, 750, function() {
        game.level.intro();
    });
};

Level2.prototype.intro = function() {
    show_modal(level_data[this.num].title,
               level_data[this.num].desc_short,
               level_data[this.num].desc_long,
               'Let\'s Start!',
               function(e) {game.level.set_up_level();}
              );
};

Level2.prototype.set_up_level = function() {
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
    this.display = new Editor($('#level2-display'), false);
    this.editor = new Editor($('#level2-editor'), true);

    // Initialize editor states
    console.log(this.display);
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

Level2.prototype.loop = function() {
    if (this.display.equals(this.editor)) {
        this.progress++;
        this.set_up_level();
    }
};

Level2.prototype.win = function() {
    this.editor.render();  // Render one more time to reset coloring
    game.stop();

    show_modal('Congratulations!',
               'You passed a level.',
               level_data[this.num].msg_win,
               'Continue',
               function(e) {console.log('not implemented');}
              );
    // TODO: allow advancing to the next level
};


// Temporary hacks while we restructure the main game logic
function start_level_2() {
    game = new Game(Level1);
    game.start();
}




/*
 * Utility functions to set up the level enviornment
 */
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
