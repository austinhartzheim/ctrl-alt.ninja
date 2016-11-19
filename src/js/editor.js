/*
 * Manages a visual editor display in the page.
 * Exposes an interface to allow KeyboardLayouts to interact with the editor.
 * elm: the element containing the editor interface
 */
function Editor(elm) {
    this.elm = elm;
    
    this.cursor_pos_x = 0;
    this.cursor_pos_y = 0;

    this.data_buffer = ["hello world", "how are you?"];
}

Editor.prototype.render = function() {
    this.elm.empty();
    for (var i = 0; i < this.data_buffer.length; i++) {
        if (this.cursor_pos_y == i) {
            if (this.cursor_pos_x == this.get_line_length(i)) {
                this.elm.append('<p>' + this.data_buffer[i] + '<u>&nbsp;</u></p>');
            } else {
                this.elm.append('<p>' + this.data_buffer[i].slice(0, this.cursor_pos_x) +
                                '<u>' + this.data_buffer[i].slice(this.cursor_pos_x, this.cursor_pos_x + 1) + '</u>' +
                                this.data_buffer[i].slice(this.cursor_pos_x + 1));
            }
        } else {
            this.elm.append("<p>" + this.data_buffer[i] + "</p>");
        }
    }
};

Editor.prototype.set_data_buffer = function(data) {
    this.data_buffer = data;
    this.cursor_pos_y = Math.min(this.data_buffer.length, this.cursor_pos_y);
    this.cursor_pos_x = Math.min(this.data_buffer[this.cursor_pos_y].length, this.cursor_pos_x);
};

Editor.prototype.set_cursor = function(x, y) {
    if (y < 0 || y > this.get_line_count()) {
        throw "Cannot set cursor to a line that does not exist";
    }
    if (x < 0 || x > this.get_line_length(y)) {
        throw "Cannot set cursor to a column that does not exist on this line";
    }

    this.cursor_pos_x = x;
    this.cursor_pos_y = y;
};

/*
 * Shift the current position of the cursor.
 * xd: the amount to move the cursor along the x-axis
 * yd: the amount to move the cursor along the y-axis
 */
Editor.prototype.move_cursor = function(xd, yd) {
    this.cursor_pos_x += xd;
    if (this.cursor_pos_x > this.get_line_length(this.cursor_pos_y)) {
        // If we are at the end of the file, don't advance the cursor
        if (this.cursor_pos_y == this.get_line_count() - 1) {
            this.cursor_pos_x = this.get_line_length(this.cursor_pos_y);
        } else {
            this.cursor_pos_x = 0;
            this.cursor_pos_y++;
        }
    } else if (this.cursor_pos_x < 0) {
        // If we are at the start of the file, don't change lines
        if (this.cursor_pos_y == 0) {
            this.cursor_pos_x = 0;
        } else {
            this.cursor_pos_y--;
            this.cursor_pos_x = this.get_line_length(this.cursor_pos_y);
        }
    }

    this.cursor_pos_y += yd;
    this.cursor_pos_y = Math.max(0, Math.min(this.get_line_count() - 1, this.cursor_pos_y));

    /*
    this.cursor_pos_x = Math.min(Math.max(0, this.cursor_pos_x + xd),
                                 this.data_buffer[this.cursor_pos_y].length);
    this.cursor_pos_y = Math.min(Math.max(0, this.cursor_pos_y + yd),
                                 this.get_line_count() - 1);
     */
};

/*
 * Move the cursor to the end of the line.
 */
Editor.prototype.move_cursor_end = function() {
    this.cursor_pos_x = this.get_line_length(this.cursor_pos_y);
};

/*
 * Move the cursor to the start of the line.
 */
Editor.prototype.move_cursor_home = function() {
    this.cursor_pos_x = 0;
};

/*
 * Type a character.
 * c: the character to insert.
 */
Editor.prototype.type_character = function(c) {
    if (c == '\n') {
        this.type_newline();
        return;
    }

    this.data_buffer[this.cursor_pos_y] = utils.string_insert(
        this.data_buffer[this.cursor_pos_y], this.cursor_pos_x, c
    );
    this.move_cursor(1, 0);
};

/*
 * Insert a newline at cursor position.
 */
Editor.prototype.type_newline = function() {
    var pre_cursor = this.data_buffer[this.cursor_pos_y].slice(0, this.cursor_pos_x);
    var post_cursor = this.data_buffer[this.cursor_pos_y].slice(this.cursor_pos_x);
    this.data_buffer[this.cursor_pos_y] = pre_cursor;
    this.data_buffer.slice(this.cursor_pos_y + 1, 0, post_cursor);
    
    // Move cursor to the start of the next line
    this.cursor_pos_x = 0;
    this.cursor_pos_y++;
};

/*
 * Kill the line, starting at the position of the cursor.
 */
Editor.prototype.kill_line = function() {

    this.data_buffer[this.cursor_pos_y] = this.data_buffer[this.cursor_pos_y].slice(0, this.cursor_pos_x);

};

/*
 * Delete the character before the current position and adjust the
 * cursor position.
 */
Editor.prototype.backspace = function() {
    if (this.cursor_pos_x == 0) {
        if (this.cursor_pos_y == 0) {
            // Nothing to do; backspace at start of file
            return;
        }
        // TODO: handle line merge
        //var post_cursor = this.data_buffer[this.cursor_pos_y].slice(this.cursor_pos_x);
        //console.log(post_cursor);
        return;
    }

    this.data_buffer[this.cursor_pos_y] = utils.string_delete_char(
        this.data_buffer[this.cursor_pos_y], this.cursor_pos_x - 1
    );

    this.cursor_pos_x --;
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
    return this.cursor_pos_x;
};

Editor.prototype.get_cursor_y = function() {
    return this.cursor_pos_y;
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