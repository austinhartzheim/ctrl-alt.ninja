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
                start: ['// use your keyboard; make the text boxes match', ''],
                match: ['// use your keyboard; make the text boxes match', 'This is a typing game.'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 1
                }
            },
            {
                start: ['// use your keyboard; make the text boxes match', 'This is a typing game.'],
                match: ['// use your keyboard; make the text boxes match', 'This is a typing game.', 'New lines will appear with more text to type.'],
                pos: {
                    mode: MODES.KEEP
                }
            },
            {
                start: ['// use your keyboard; make the text boxes match', 'This is a typing game.', 'New lines will appear with more text to type.'],
                match: ['// use your keyboard; make the text boxes match', 'This is a typing game for ninjas.', 'New lines will appear with more text to type.',
                        'And sometimes you will have to make edits too.'],
                pos: {
                    mode: MODES.KEEP
                }
            },
            {
                start: ['// use your keyboard; make the text boxes match', 'This is a typing game for ninjas.', 'New lines will appear with more text to type.',
                        'And sometimes you will have to make edits too.'],
                match: ['// use your keyboard; make the text boxes match', 'This is a typing game for ninjas.', 'New lines will appear with more text to type.',
                        'And sometimes you will have to make edits too.', 'Now I have the hang of this.'],
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
                    '<p>The first skill every ninja-in-training learns is how to quickly move the cursor to the start and end of a line.' +
                    'With one keypress you can easily dazzle your foes and appear to teleport through them before landing your final blow.</p>' +
                    '<p>(Of course, by the time you finish your training, they won\'t be able to see you at all!)</p>' +
                    '<h2>New shortcuts!</h2><dl><dt>Ctrl+a</dt><dd>Skip to the start of a link.</dd><dt>Ctrl+e</dt><dd>Skip to the end of a line.</dd><dt>Alt+&lt;</dt><dd>Skip to the start of the file.</dd><dt>Alt+&gt;</dt><dd>Skip to the end of the file.</dd></dl>'),
        msg_win: '<h2>You did it!</h2><p>Can you feel the ninja power starting to take root in your fingers?</p>',
        steps: [
            {
                start: ['If only there was an easier way to reach the end...'],
                match: ['If only there was an easier way to reach the end... Like pressing Ctrl+e!'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            },
            {
                start: ['Ninja Facts:',
                        '1. If you see a ninja,',
                        '2.  do not sleep. They wait',
                        '3. Only a ninja can sneak up on another'],
                match: ['Ninja Facts:',
                        '1. If you see a ninja, they are not a ninja.',
                        '2. Ninjas do not sleep. They wait...',
                        '3. Only a ninja can sneak up on another ninja.'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            }
        ]
    },

    {
        title: 'Fixing Bugs',
        desc_short: 'Ninjas don\'t fix bugs; they fix you.',
        desc_long: '<h2>Know your own strength</h2><p>Teleporting is fun, but sometimes a quick punch is all it takes. Jump shorter distances with these new shortcuts.</p><p>Let the world know your strength!</p><h2>New Shortcuts!</h2><dl><dt>Alt+left arrow</dt><dd>Skip back one word.</dd><dt>Alt+right arrow</dt><dd>Skip forward on word</dd><dt>Alt+Backspace</dt><dd>Delete one word, backwards.</dd></dl>',
        msg_win: '<h2>You did it!</h2><p>The bugs have been fixed. Now it\'s time to find the person responsible...</p>',
        steps:[
            {
                start: [
                    'def get_sensor_data():',
                    '    // TODO: fix insecure eval()',
                    '    sensor_data = eval(requests.get(URL).text)',
                    '    ',
                    '    if sensor_data[\'temperature\'] < 60:',
                    '        enable_heater();'
                ],
                match: [
                    'def get_sensor_data():',
                    '    // TODO: fix insecure eval()',
                    '    sensor_data = json.loads(requests.get(URL).text)',
                    '    ',
                    '    if sensor_data[\'temperature\'] < 68:',
                    '        enable_heater();'
                ],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            },
            {
                start: [
                    'def get_sensor_data():',
                    '    // TODO: fix insecure eval()',
                    '    sensor_data = json.loads(requests.get(URL).text)',
                    '    ',
                    '    if sensor_data[\'temperature\'] < 68:',
                    '        enable_heater();'
                ],
                match: [
                    'def get_sensor_data():',
                    '    sensor_data = json.loads(requests.get(URL).text)',
                    '    ',
                    '    if sensor_data[\'temperature\'] < 68:',
                    '        enable_heater();'
                ],
                pos: {
                    mode: MODES.KEEP
                }
            }
        ]
    },

    {
        title: 'Revise/Edit',
        desc_short: 'Ninjas don\'t need jobs.',
        desc_long: '<h2>Independence is key</h2><p>True ninjas cannot be beholden to anyone. That is why this next lesson will be about showing people who is boss.</p>',
        msg_win: '<h2>How did that feel?</h2><p>Your boss is lucky you let him off easy. You\'re the boss now!</p>',
        steps: [
            {
                start: ['Email Draft:', 'Dear Employer,', 'It is my greatest displeasure to inform you that I must resign,', 'due to my recent transformation into a keyboard shortcut ninja.', 'I hope you will understand.', 'Sincerely,', 'Ctrl-Alt Ninja'],
                match: ['Email Draft:', 'Dear Sucker,', 'I\'m out of here!', 'I gotta do me now.', 'Could you write me a letter of rec??', 'Peace'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            }
        ]
    },

    {
        title: 'Haxx0r Ninja',
        desc_short: 'Ninjas don\'t make n00bie mistakes.',
        desc_long: 'Ctrl-k to kill line',
        msg_win: '<h2>Congrats Ninja Coder!</h2><p>You "kill"-ed all the mistakes! Just like a real ninja</p>',
        steps: [
            {
                start: ['if (var && 1)', '  count ++;', '  input = readInput();', 'else', '  count --;', '  input = readInput();'],
                match: ['if (var)', '  count ++;', 'input = readInput();'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            },
            {
                start: ['while ( WildHacks ) {', '  keyboard.add("crumbs");', '  for each (person in sleepingRoom){', '    if (!light)', '      step_on(person);', '  }', '  if (sleepy)', '    sleep();', '  else', '    code();', '  eatJunkFood(MAX_LIMIT);', '}'],
                match: ['while ( WildHacks ) {', '  keyboard.add("crumbs");', '  for each (free_item in Bathroom){', '    backStack.push(free_item);', '  }', '  if (sleepy)', '    redbull();', '  Building.temperature --;', '}'],
                pos: {
                    mode: MODES.SET,
                    x: 0,
                    y: 0
                }
            }
        ]
    }

];



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
