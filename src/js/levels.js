var MODES = {
    SET: 1,
    KEEP: 2
};

var level_data = {
    'level1': [
        {start: ['type here'],
         match: ['hello world'],
         pos: {
             mode: MODES.SET,
             x: 0,
             y: 0
         }
        },
        {start: ['hello world'],
         match: ['hello there world'],
         pos: {
             mode: MODES.KEEP
         }
        },
        {start: ['hello there world'],
         match: ['hello there world', 'how are you'],
         pos: {
             mode: MODES.KEEP
         }
        }
    ]
};

function Level1() {
    this.name = 'level1';
    this.progress = 0;

    this.set_up_level();
}

Level1.prototype.set_up_level = function() {
    // Detach old keyboard bindings if any
    if (this.keyboard_layout != null) {
        this.keyboard_layout.destruct();
    }

    var pos = {};
    switch(level_data[this.name][this.progress].pos.mode) {
    case MODES.KEEP:
        pos.x = this.editor.get_cursor_x();
        pos.y = this.editor.get_cursor_y();
        break;
    case MODES.SET:
        pos.x = level_data[this.name][this.progress].pos.x;
        pos.y = level_data[this.name][this.progress].pos.y;
        break;
    default:
        throw 'No cursor position mode set';
    }
    
    // Create editors
    this.display = new Editor($('#text-display'));
    this.editor = new Editor($('#text-editor'));

    // Initialize editor states
    this.display.set_data_buffer(
        level_data[this.name][this.progress]['match']
    );
    this.editor.set_data_buffer(
        level_data[this.name][this.progress]['start']
    );
    this.editor.set_cursor(pos.x, pos.y);
    this.display.render();
    this.editor.render();

    // Attach keyboard binding
    this.keyboard_layout = new KeyboardLayout(this.editor);
};

Level1.prototype.loop = function() {
    if (this.display.equals(this.editor)) {
        this.progress++;
        this.set_up_level();
    }
};
