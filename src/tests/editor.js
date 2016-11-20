describe('test Editor', function() {
    it('default cursor state', function() {
        var editor = new Editor(null);

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(0);
    });

    it('test move cursor to beginning', function() {
        var editor = new Editor(null);

        editor.set_data_buffer(['hello']);
        editor.move_cursor_beginning_of_text();

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(0);
    });

    it('test move cursor to end', function() {
        var editor = new Editor(null);

        editor.set_data_buffer(['hello']);
        editor.move_cursor_end_of_text();

        expect(editor.cx).toBe(5);
        expect(editor.cy).toBe(0);
    });

    it('cursor simple move', function() {
        var editor = new Editor(null);

        editor.move_cursor(1, 1);
        expect(editor.cx).toBe(1);
        expect(editor.cy).toBe(1);
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
        expect(editor.cx).toBe(2);
        expect(editor.cy).toBe(2);
    });

    it('cursor complex move pattern', function() {
        var editor = new Editor(null);

        editor.set_data_buffer(['hi', 'world', 'dogaa', 'cataa']);

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(0);

        editor.move_cursor(0, 1);
        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(1);

        editor.move_cursor(0, -1);
        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(0);

        editor.move_cursor(1, 0);
        expect(editor.cx).toBe(1);
        expect(editor.cy).toBe(0);

        editor.move_cursor(1, 0);
        expect(editor.cx).toBe(2);
        expect(editor.cy).toBe(0);

        // Attempt to move cursor right beyond end of the first line
        editor.move_cursor(1, 0);
        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(1);
    });

    it('test home on line 0', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(1, 0);
        editor.move_cursor_home();

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(0);
    });

    it('test home on last line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello', 'world']);

        editor.move_cursor(3, 1);
        editor.move_cursor_home();

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(1);
    });

    it('test end on line 0', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor_end();

        expect(editor.cx).toBe(5);
        expect(editor.cy).toBe(0);
    });

    it('test end on last line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello', 'world']);

        editor.move_cursor(2, 1);
        editor.move_cursor_end();

        expect(editor.cx).toBe(5);
        expect(editor.cy).toBe(1);
    });

    it('test newline at beginning of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(0, 0);
        editor.type_newline();

        expect(editor.data_buffer).toEqual(['', 'hello']);

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(1);
    });

    it('test newline in middle of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['helloworld']);

        editor.move_cursor(5, 0);
        editor.type_newline();

        expect(editor.data_buffer).toEqual(['hello', 'world']);

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(1);
    });

    it('test newline at end of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(5, 0);
        editor.type_newline();

        expect(editor.data_buffer).toEqual(['hello', '']);

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(1);
    });

    it('several newlines', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(1, 0);
        editor.type_newline();

        editor.move_cursor(1, 0);
        editor.type_newline();

        editor.move_cursor(1, 0);
        editor.type_newline();

        editor.move_cursor(1, 0);
        editor.type_newline();

        expect(editor.data_buffer).toEqual(['h', 'e', 'l', 'l', 'o']);

        expect(editor.cx).toBe(0);
        expect(editor.cy).toBe(4);
    });

    it('test tab at beginning of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(0, 0);
        editor.type_tab();

        expect(editor.data_buffer).toEqual(['  hello']);

        expect(editor.cx).toBe(2);
        expect(editor.cy).toBe(0);
    });

    it('test tab in middle of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['helloworld']);

        editor.move_cursor(5, 0);
        editor.type_tab();

        expect(editor.data_buffer).toEqual(['hello  world']);
        expect(editor.cx).toBe(7);
        expect(editor.cy).toBe(0);
    });

    it('test tab at end of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(5, 0);
        editor.type_tab();

        expect(editor.data_buffer).toEqual(['hello  ']);

        expect(editor.cx).toBe(7);
        expect(editor.cy).toBe(0);
    });

    it('test kill at beginning of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(0, 0);
        editor.kill_line();

        expect(editor.data_buffer).toEqual(['']);
    });

    it('test kill in middle of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello world']);

        editor.move_cursor(5, 0);
        editor.kill_line();

        expect(editor.data_buffer).toEqual(['hello']);
    });

    it('test kill at end of line', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(5, 0);
        editor.kill_line();

        expect(editor.data_buffer).toEqual(['hello']);
    });

    it('several tabs', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello']);

        editor.move_cursor(1, 0);
        editor.type_tab();
        editor.type_tab();
        editor.type_tab();

        expect(editor.data_buffer).toEqual(['h      ello']);

        expect(editor.cx).toBe(7);
        expect(editor.cy).toBe(0);
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

    it('test backspace newline', function() {
        var editor = new Editor(null);
        editor.set_data_buffer(['hello','world']);
        editor.move_cursor(0, 1);
        editor.backspace();

        expect(editor.data_buffer).toEqual(['helloworld']);
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
