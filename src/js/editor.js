/*
 * Manages a visual editor display in the page.
 * Exposes an interface to allow KeyboardLayouts to interact with the editor.
 * elm: the element containing the editor interface
 */
function Editor(elm, display_cursor) {
    this.elm = elm;
    this.display_cursor = display_cursor || false;
    
    this.cx = 0;
    this.cy = 0;
    self.diff = false;
    self.diff_target = null;
    
    this.data_buffer = [];
}

Editor.prototype.enable_diffing = function(diff_target) {
    this.diff_target = diff_target;
    this.diff = true;
};

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

            var line = $('<div>' + pre_cursor + '<u>' + at_cursor + '</u>' +
                         post_cursor + '</div>');
            if (this.diff && this.diff_target.get_line_count() > i) {
                if (this.get_line(i) != this.diff_target.get_line(i)) {
                    line.css('color', 'yellow');
                }
            }

            this.elm.append(line);
        } else {
            if (this.data_buffer[i] == '') {
                this.elm.append('<br />');
            } else {
                var line = $('<div>', {
                    text: this.data_buffer[i]
                });

                if (this.diff && this.diff_target.get_line_count() > i) {
                    if (this.get_line(i) != this.diff_target.get_line(i)) {
                        line.css('color', 'red');
                    }
                }
                this.elm.append(line);
            }
        }
    }
};

Editor.prototype.set_data_buffer = function(data) {
    this.data_buffer = data;
    this.cy = Math.min(this.data_buffer.length, this.cy);
    this.cx = Math.min(this.data_buffer[this.cy].length, this.cx);
};

Editor.prototype.get_cursor = function() {
    return {x: this.cx, y: this.cy};
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

Editor.prototype.get_character = function(x, y) {
    return this.data_buffer[y].slice(x, x + 1);
};

/*
 * Find a stop point for skipping words, deleting words, etc.
 * direction: true for forwards, false for backwards.
 *
 * returns: [x, y], the location of the next stop point.
 */
Editor.prototype.find_stop_point = function(direction) {
    var stop_chars = [' ', '?', '!', '', '^', '@', '#', '=', '+', '_', '-', '`', '~',
                      ')', '(', ',', '.', '<', '>', '/', '\\', '*'];
    var found_nonstop_char = false;

    var scanline = this.cy;
    var scanchar = this.cx;

    while (true) {
        if (direction) {
            // Increment position
            scanchar++;
            if (scanchar > this.get_line_length(scanline)) {
                scanline++;
                scanchar = 0;
            }

            // stop if we reach EOF
            if (scanline >= this.get_line_count()) {
                return {x: this.get_line_length(this.get_line_count() - 1),
                        y: this.get_line_count() - 1};
            }

            // Update found_nonstop_char
            if (stop_chars.indexOf(this.get_character(scanchar, scanline)) == -1) {
                found_nonstop_char = true;
            }
            
            // stop if we have found a non-stop char and reached EOL
            if (scanchar == this.get_line_length(scanline)) {
                if (found_nonstop_char) {
                    return {x: scanchar, y: scanline};
                }
            }
            
            // stop if we have found a non-stop char and reached a stop char
            if (found_nonstop_char &&
                stop_chars.indexOf(this.get_character(scanchar, scanline)) != -1) {
                return {x: scanchar, y: scanline};
            }
        } else {
            // Decrement position
            scanchar--;
            if (scanchar < 0) {
                scanline--;
                if (scanline >= 0) {
                    scanchar = this.get_line_length(scanline);
                }
            }

            // update found_nonstop_char
            if (stop_chars.indexOf(this.get_character(scanchar, scanline)) == -1) {
                found_nonstop_char = true;
            }
            
            // stop if we found a non-stop char and reached a stop char
            if (found_nonstop_char &&
                stop_chars.indexOf(this.get_character(scanchar, scanline)) != -1) {
                return {x: scanchar + 1, y: scanline};
            }

            // stop if we found a nonstop char and reached SOL
            if (found_nonstop_char && scanchar == 0) {
                return {x: scanchar, y: scanline};
            }

            // stop if we reach SOF
            if (scanline <= 0 && scanchar <= 0) {
                return {x: 0, y: 0};
            }
        }
    }
    
    return [scanchar, scanline];
};

Editor.prototype.delete_line = function(line) {
    this.data_buffer.pop(line);
};

/*
 * Delete the range between r1 and r2 where r1 and r2 are objects
 * containing integer fields x and y.
 */
Editor.prototype.delete_range = function(r1, r2) {
    // If we are deleeting a range on the same line, handle it and return early
    if (r1.y == r2.y) {
        var line = this.get_line(r1.y);
        this.data_buffer[r1.y] = line.slice(0, r1.x) + line.slice(r2.x + 1);
        this.set_cursor(r1.x, r1.y);
        return;
    }

    // Start by deleting any partial data on the last line
    var last_line = this.get_line(r2.y);
    this.data_buffer[r2.y] = last_line.slice(r2.x);

    // Delete any lines between r2 and r1
    for (var i = r2.y - 1; i > r1.y; i--) {
        this.delete_line(i);
    }

    // Delete any partial data on the first line
    var first_line = this.get_line(r1.y);
    this.data_buffer[r1.y] = first_line.slice(0, r1.x);
};

/*
 * Execute the delete opeeration at the current cursor position.
 */
Editor.prototype.delete = function() {
    // Check if we need to merge lines
    if (this.cx == this.get_line_length(this.cy)) {
        // Check if we are at the end of the file
        if (this.cy == this.get_line_count() - 1) {
            return;  // Do nothing
        }

        this.data_buffer[this.cy] += this.data_buffer[this.cy + 1];
        this.data_buffer.splice(this.cy + 1, 1);
        return;
    }

    // Delete the current character
    this.data_buffer[this.cy] = utils.string_delete_char(this.data_buffer[this.cy], this.cx);

};
