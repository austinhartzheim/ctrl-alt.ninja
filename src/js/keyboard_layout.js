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
    if (event.originalEvent.ctrlKey && event.originalEvent.ctrlKey){       

        switch (event.originalEvent.charCode) {
        case 97:   // Ctrl-a (Home)
            self.editor.move_cursor_home();
            break; 
        case 98:   // Ctrl-b (Back char)
            self.editor.move_cursor(-1, 0);
            break; 
        case 101:  // Ctrl-e (End)
            self.editor.move_cursor_end();
            break; 
        case 102:  // Ctrl-f (Forward char)
            self.editor.move_cursor(1, 0);
            break; 
        case 107:  //Ctrl-k (Kill rest of line)
            self.editor.kill_line();
            break;
        case 112:  // Ctrl-p (Previous line)
            self.editor.move_cursor(0, -1);
            break; 
        }

    } else if (event.originalEvent.altKey) {
        
        if (event.originalEvent.shiftKey) {
            
            switch (event.originalEvent.charCode) {
            case 60:   // M-< (Beginning of Text)
                self.editor.move_cursor_beginning_of_text();
                break; 
            case 62:   // M-> (End of Text)
                self.editor.move_cursor_end_of_text();
                break; 
            }
            
        } else {

            if (event.originalEvent.charCode > 0) {

                switch (event.originalEvent.charCode) {
                case 102:  // M-f
                    var next_stop = self.editor.find_stop_point(true);
                    self.editor.set_cursor(next_stop.x, next_stop.y);
                    break;
                case 98:
                    var next_stop = self.editor.find_stop_point(false);
                    self.editor.set_cursor(next_stop.x, next_stop.y);
                    break;
                }

            } else {

                switch (event.originalEvent.keyCode) {
                case 8:  // Backspace
                    self.editor.move_cursor(-1, 0);
                    var next_stop = self.editor.find_stop_point(false);
                    console.log('Deleting from', next_stop, self.editor.get_cursor());
                    
                    self.editor.delete_range(next_stop, self.editor.get_cursor());
                    break;
                case 37:  // Left Arrow
                    var next_stop = self.editor.find_stop_point(false);
                    self.editor.set_cursor(next_stop.x, next_stop.y);
                    break;
                case 39:  // Right Arrow
                    var next_stop = self.editor.find_stop_point(true);
                    self.editor.set_cursor(next_stop.x, next_stop.y);
                    break;
                }

            }
            
        }

    } else {

        // Detect ASCII characters
        if (event.originalEvent.charCode > 0) {
            self.editor.type_character(
                String.fromCharCode(event.originalEvent.charCode)
            );
            self.editor.render();
            return;  
        }

        // Handle arrow keys
        switch (event.originalEvent.keyCode) {
        case 8:   // Backspace
            self.editor.backspace();
            break; 
        case 9:   // Tab
            self.editor.type_tab();
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
        case 46:  // Delete
            self.editor.delete();
            break;
        }
    }

    self.editor.render();
};
