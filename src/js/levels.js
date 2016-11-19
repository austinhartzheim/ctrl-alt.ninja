function Level1() {
    this.display = new Editor($('#text-display'));
    
    this.editor = new Editor($('#text-editor'));
    this.keyboard_layout = new KeyboardLayout(this.editor);
    this.editor.render();
}
