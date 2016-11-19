var level_data = {
    'level1': [
        {'start': ['type here'],
         'match': ['hello world']
        },
        {'start': ['hello world'],
         'match': ['hello there world']
        },
        {'start': ['hello there world'],
         'match': ['hello there world', 'how are you']
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
    
    // Create editors
    this.display = new Editor($('#text-display'));
    this.editor = new Editor($('#text-editor'));

    // Initialize editor states
    this.display.set_data_buffer(level_data[this.name][this.progress]['match']);
    this.editor.set_data_buffer(level_data[this.name][this.progress]['start']);
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
