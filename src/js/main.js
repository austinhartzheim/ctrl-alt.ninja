function Game() {
    this.level = new Level1();

    this.animation_frame_request = null;
    this.loop_interval = 10;
}

Game.prototype.start = function() {
    setTimeout(function() {game.loop();}, this.loop_interval);
};

Game.prototype.loop = function(timestamp) {
    this.level.loop();
    setTimeout(function() {game.loop();}, this.loop_interval);
};



