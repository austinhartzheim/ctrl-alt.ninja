describe('test Editor', function() {
    it('default cursor state', function() {
        var editor = new Editor(null);

        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(0);
    });

    it('cursor simple move', function() {
        var editor = new Editor(null);

        editor.move_cursor(1, 1);
        expect(editor.cursor_pos_x).toBe(1);
        expect(editor.cursor_pos_y).toBe(1);
    });

    it('get line count', function() {
        var editor = new Editor(null);

        expect(editor.get_line_count()).toBe(2);

        editor.set_data_buffer(['hello', 'there', 'world']);
        expect(editor.get_line_count()).toBe(3);
    });

    it('set cursor - simple case, success', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello', 'there', 'world']);

        editor.set_cursor(2, 2);
        expect(editor.cursor_pos_x).toBe(2);
        expect(editor.cursor_pos_y).toBe(2);
    });

    it('cursor complex move pattern', function() {
        var editor = new Editor(null);

        editor.set_data_buffer(['hi', 'world', 'dogaa', 'cataa']);

        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(0);

        editor.move_cursor(0, 1);
        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(1);

        editor.move_cursor(0, -1);
        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(0);

        editor.move_cursor(1, 0);
        expect(editor.cursor_pos_x).toBe(1);
        expect(editor.cursor_pos_y).toBe(0);

        editor.move_cursor(1, 0);
        expect(editor.cursor_pos_x).toBe(2);
        expect(editor.cursor_pos_y).toBe(0);

        // Attempt to move cursor right beyond end of the first line
        editor.move_cursor(1, 0);
        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(1);
    });

    it('test home on line 0', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(1, 0);
        editor.move_cursor_home();

        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(0);
    });

    it('test home on last line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello', 'world']);

        editor.move_cursor(3, 1);
        editor.move_cursor_home();

        expect(editor.cursor_pos_x).toBe(0);
        expect(editor.cursor_pos_y).toBe(1);
    });

    it('test end on line 0', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor_end();

        expect(editor.cursor_pos_x).toBe(5);
        expect(editor.cursor_pos_y).toBe(0);
    });

    it('test end on last line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello', 'world']);

        editor.move_cursor(2, 1);
        editor.move_cursor_end();

        expect(editor.cursor_pos_x).toBe(5);
        expect(editor.cursor_pos_y).toBe(1);
    });

    it('test backspace', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(1, 0);
        editor.backspace();

        expect(editor.data_buffer).toEqual(['ello']);
    });

    it('test backspace start of file', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);
        editor.backspace();

        expect(editor.data_buffer).toEqual(['hello']);
    });

    it('test equals - equal, simple case', function() {
        var editor1 = new Editor(null);
        editor1.set_data_buffer(['hello', 'world']);
        var editor2 = new Editor(null);
        editor2.set_data_buffer(['hello', 'world']);

        expect(editor1.equals(editor2)).toBe(true);
    });

    it('test equals - not equal, simple case', function() {
        var editor1 = new Editor(null);
        editor1.set_data_buffer(['hello', 'lksjdf']);
        var editor2 = new Editor(null);
        editor2.set_data_buffer(['hello', 'world']);

        expect(editor1.equals(editor2)).toBe(false);
    });

});
