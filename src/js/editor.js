/*
 * Manages a visual editor display in the page.
 * Exposes an interface to allow KeyboardLayouts to interact with the editor.
 * elm: the element containing the editor interface
 */
function Editor(elm, display_cursor) {
    this.elm = elm;
    this.display_cursor = display_cursor;
    
    this.cx = 0;
    this.cy = 0;

    this.data_buffer = ["hello world", "how are you?"];
}

Editor.prototype.render = function() {
    this.elm.empty();
    for (var i = 0; i < this.data_buffer.length; i++) {
        if (this.display_cursor && this.cy == i) {
            var pre_cursor = utils.string_escape(
                this.data_buffer[i].slice(0, this.cx)
            );
            var at_cursor = utils.string_escape(
                this.data_buffer[i].slice(this.cx, this.cx + 1)
            );
            var post_cursor = utils.string_escape(
                this.data_buffer[i].slice(this.cx + 1)
            );

            if (at_cursor == ' ' || at_cursor == '') {
                at_cursor = '&nbsp;';
            }

            this.elm.append('<div>' + pre_cursor + '<u>' + at_cursor + '</u>' +
                            post_cursor + '</div>');
        } else {
            if (this.data_buffer[i] == '') {
                this.elm.append('<br />');
            } else {
                var str = utils.string_escape(this.data_buffer[i]);
                this.elm.append("<div>" + str + "</div>");
            }
        }
    }
};

Editor.prototype.set_data_buffer = function(data) {
    this.data_buffer = data;
    this.cy = Math.min(this.data_buffer.length, this.cy);
    this.cx = Math.min(this.data_buffer[this.cy].length, this.cx);
};

Editor.prototype.set_cursor = function(x, y) {
    if (y < 0 || y > this.get_line_count()) {
        throw "Cannot set cursor to a line that does not exist";
    }
    if (x < 0 || x > this.get_line_length(y)) {
        throw "Cannot set cursor to a column that does not exist on this line";
    }

    this.cx = x;
    this.cy = y;
};

/*
 * Shift the current position of the cursor.
 * xd: the amount to move the cursor along the x-axis
 * yd: the amount to move the cursor along the y-axis
 */
Editor.prototype.move_cursor = function(xd, yd) {
    this.cx += xd;
    if (this.cx > this.get_line_length(this.cy)) {
        // If we are at the end of the file, don't advance the cursor
        if (this.cy == this.get_line_count() - 1) {
            this.cx = this.get_line_length(this.cy);
        } else {
            this.cx = 0;
            this.cy++;
        }
    } else if (this.cx < 0) {
        // If we are at the start of the file, don't change lines
        if (this.cy == 0) {
            this.cx = 0;
        } else {
            this.cy--;
            this.cx = this.get_line_length(this.cy);
        }
    }

    this.cy += yd;
    this.cy = Math.max(0, Math.min(this.get_line_count() - 1, this.cy));

    /*
    this.cx = Math.min(Math.max(0, this.cx + xd),
                                 this.data_buffer[this.cy].length);
    this.cy = Math.min(Math.max(0, this.cy + yd),
                                 this.get_line_count() - 1);
     */
};

/*
 * Move the cursor to the end of the line.
 */
Editor.prototype.move_cursor_end = function() {
    this.cx = this.get_line_length(this.cy);
};

/*
 * Move the cursor to the start of the line.
 */
Editor.prototype.move_cursor_home = function() {
    this.cx = 0;
};

/*
 * Insert a tab as two spaces.
 */
Editor.prototype.type_tab = function() {
    this.type_character(' ');
    this.type_character(' ');
}

/*
 * Type a character.
 * c: the character to insert.
 */
Editor.prototype.type_character = function(c) {
    if (c == '\n') {
        this.type_newline();
        return;
    }

    this.data_buffer[this.cy] = utils.string_insert(
        this.data_buffer[this.cy], this.cx, c
    );
    this.move_cursor(1, 0);
};

/*
 * Insert a newline at cursor position.
 */
Editor.prototype.type_newline = function() {
    var pre_cursor = this.data_buffer[this.cy].slice(0, this.cx);
    var post_cursor = this.data_buffer[this.cy].slice(this.cx);
    this.data_buffer[this.cy] = pre_cursor;
    this.data_buffer.splice(this.cy + 1, 0, post_cursor);
    
    // Move cursor to the start of the next line
    this.cx = 0;
    this.cy++;
};

/*
 * Kill the line, starting at the position of the cursor.
 */
Editor.prototype.kill_line = function() {

    this.data_buffer[this.cy] = this.data_buffer[this.cy].slice(0, this.cx);

};

/*
 * Move cursor to 0,0.
 */
Editor.prototype.move_cursor_beginning_of_text = function() {

    this.cx = 0;
    this.cy = 0;

};

/*
 * Move cursor to the end of the text.
 */
Editor.prototype.move_cursor_end_of_text = function() {

    this.cy = this.get_line_count() - 1;
    this.cx = this.get_line_length(this.cy);

};

/*
 * Delete the character before the current position and adjust the
 * cursor position.
 */
Editor.prototype.backspace = function() {
    if (this.cx == 0) {
        if (this.cy == 0) {
            // Nothing to do; backspace at start of file
            return;
        }
        // Handle line merge
        var index = this.get_line_length(this.cy-1);
        
        this.data_buffer[this.cy-1] += this.data_buffer[this.cy];
        this.data_buffer.splice(this.cy, 1);

        this.cx = index;
        this.cy --;

        return;
    }

    this.data_buffer[this.cy] = utils.string_delete_char(
        this.data_buffer[this.cy], this.cx - 1
    );

    this.cx --;
};

Editor.prototype.get_line_count = function() {
    return this.data_buffer.length;
};

Editor.prototype.get_line_length = function(line) {
    if (line < 0 || line >= this.get_line_count()) {
        throw "Cannot access line beyond buffer bounds";
    }

    return this.data_buffer[line].length;
};

Editor.prototype.get_line = function(line) {
    if (line < 0 || line >= this.get_line_count()) {
        throw "Cannot access line beyond buffer bounds";
    }
    
    return this.data_buffer[line];
};

Editor.prototype.get_cursor_x = function() {
    return this.cx;
};

Editor.prototype.get_cursor_y = function() {
    return this.cy;
};

Editor.prototype.equals = function(editor) {
    if (this.get_line_count() != editor.get_line_count()) {
        return false;
    }

    for (var i = 0; i < this.get_line_count(); i++) {
        if (this.get_line(i) != editor.get_line(i)) {
            return false;
        }
    }

    return true;
};
