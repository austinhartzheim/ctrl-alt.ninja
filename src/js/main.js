function Game() {
    this.level = new Level0();

    this.animation_frame_request = null;
    this.loop_interval = 50;
    this.stop_running = false;
}

Game.prototype.start = function() {
    setTimeout(function() {game.loop();}, this.loop_interval);
};

Game.prototype.stop = function() {
    this.stop_running = true;
};

Game.prototype.loop = function(timestamp) {
    this.level.loop();
    if (!this.stop_running) {
        setTimeout(function() {game.loop();}, this.loop_interval);
    }
};



