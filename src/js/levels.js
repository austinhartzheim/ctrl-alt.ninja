function Level1() {
    this.display = new Editor($('#text-display'));
    this.display.set_data_buffer(['match this text']);
    this.display.render();
    
    this.editor = new Editor($('#text-editor'));
    this.editor.set_data_buffer(['start with this']);
    this.keyboard_layout = new KeyboardLayout(this.editor);
    this.editor.render();
}

Level1.prototype.loop = function() {
    if (this.display.equals(this.editor)) {
        alert('you win the game!');
    }
};
