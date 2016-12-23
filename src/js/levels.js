var MODES = {
    SET: 1,
    KEEP: 2
};

var level_data = [];  // Will be loaded in the background

/*
 * number: the level number.
 */
function Level(number) {
    this.number = number;
    this.progress = 0;
    this.started = false;
    this.data = level_data[this.number];
    this.steps = this.data.steps;
}

Level.prototype.intro = function() {
    // Scroll to my screen
    $('html').animate({
        scrollTop: $('#level' + this.number).offset().top
    }, {
        duration: 1000,
        queue: true
    });

    // Show the pre-level modal
    console.log(this.data.title);
    show_modal(this.data.title, this.data.desc_short, this.data.desc_long,
               'Let\'s Start!', function(e) {game.level.start();});
};

Level.prototype.start = function() {
    this.set_up_level();
    this.started = true;
};

Level.prototype.set_up_level = function() {
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
    this.display = new Editor($('#level' + this.number + '-display'), false);
    this.editor = new Editor($('#level' + this.number + '-editor'), true);

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

Level.prototype.loop = function() {
    if (!this.started) {
        return;
    }
    
    if (this.display.equals(this.editor)) {
        this.progress++;
        this.set_up_level();
    }
};

Level.prototype.win = function() {
    this.editor.render();  // Render one more time to reset coloring
    game.stop();

    // If this is the last level, display a "game complete" message.
    if (this.number == level_data.length - 1) {
        show_modal('Congratulations!', 'You passed all levels!',
                   level_data[this.number].msg_win, 'Continue',
                   function(e) {
                       $('html').animate({
                           scrollTop: $('#main-menu').offset().top
                       }, {
                           duration: 1000
                       });
                   });
        return;
    }

    // Display a message about passing the level. Allow moving on to
    // the next level.
    show_modal('Congratulations!',
               'You passed a level.',
               level_data[this.number].msg_win,
               'Continue',
               function(e) {
                   game.start_next_level();
               });
};



function Level0() {
    Level.call(this, 0);
}
Level0.prototype = Object.create(Level.prototype);


function Level1() {
    Level.call(this, 1);
}
Level1.prototype = Object.create(Level.prototype);


function Level2() {
    Level.call(this, 2);
}

Level2.prototype = Object.create(Level.prototype);


function Level3() {
    Level.call(this, 3);
}

Level3.prototype = Object.create(Level.prototype);



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
        insert_level_screen(i);
    }
}
