function KeyboardLayout(editor) {
    this.editor = editor;
    $('html').keypress(this, this.keypress);
}

KeyboardLayout.prototype.destruct = function() {
    $('html').off('keypress', handler=this.keypress);
};

KeyboardLayout.prototype.keypress = function(event) {
    var self = event.data;
    
    event.preventDefault();
    console.log(event);

    // Handle Ctrl+key commands
    if (event.originalEvent.ctrlKey){

        switch (event.originalEvent.charCode) {
        case 97:   // Ctrl-a (Home)
            self.editor.move_cursor_home();
            break; 
        case 101:  // Ctrl-e (End)
            self.editor.move_cursor_end();
            break; 
        case 107: //Ctrl-k (Kill rest of line)
            self.editor.kill_line();
            break;
        }

    } else {

        // Detect ASCII characters
        if (event.originalEvent.charCode > 0) {
            self.editor.type_character(String.fromCharCode(event.originalEvent.charCode));
            self.editor.render();
            return;  
        }

        // Handle arrow keys
        switch (event.originalEvent.keyCode) {
        case 8:   // Backspace
            self.editor.backspace();
            break; 
        case 13:  // Enter / New Line
            self.editor.type_newline();
            break;
        case 35:  // End
            self.editor.move_cursor_end();
            break;   
        case 36:  // Home
            self.editor.move_cursor_home();
            break;
        case 37:  // Left Arrow
            self.editor.move_cursor(-1, 0);
            break;
        case 38:  // Up Arrow
            self.editor.move_cursor(0, -1);
            break;
        case 39:  // Right Arrow
            self.editor.move_cursor(1, 0);
            break;
        case 40:  // Down Arrow
            self.editor.move_cursor(0, 1);
            break;
        }
    }

    self.editor.render();
};
