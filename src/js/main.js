function Game() {

}


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
        this.elm.append("<p>" + this.data_buffer[i] + "</p>");
    }
};

/*
 * Shift the current positiono of the cursor.
 * xd: the amount to move the cursor along the x-axis
 * yd: the amount to move the cursor along the y-axis
 */
Editor.prototype.move_cursor = function(xd, yd) {
    this.cursor_pos_x = Math.min(Math.max(0, this.cursor_pos_x + xd),
                                 this.data_buffer[this.cursor_pos_y].length);
    this.cursor_pos_y = Math.min(Math.max(0, this.cursor_pos_y + xd),
                                 this.data_buffer.length - 1);
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
};

/*
 * Insert a newline at cursor position.
 */
Editor.prototype.type_newline = function() {
    var pre_cursor = this.data_buffer[this.cursor_pos_y].splice(0, this.cursor_pos_x);
    var post_cursor = this.data_buffer[this.cursor_pos_y].splice(this.cursor_pos_x);
    this.data_buffer[this.cursor_pos_y] = pre_cursor;
    this.data_buffer.splice(this.cursor_pos_y + 1, 0, post_cursor);
    
    // Move cursor to the start of the next line
    this.cursor_pos_x = 0;
    this.cursor_pos_y++;
};




function KeyboardLayout(editor) {
    this.editor = editor;
    $('html').keypress(this.keypress);
}

KeyboardLayout.prototype.keypress = function(event) {
    event.preventDefault();
    console.log(event);

    this.editor.type_character(event.originalEvent.code);
    this.editor.render();
};
