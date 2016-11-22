var game;


function Game() {
    this.level = null;

    this.animation_frame_request = null;
    this.loop_interval = 50;
    this.stop_running = false;

    this.level_number = 0;
}

Game.prototype.start = function() {
    this.stop_running = false;
    this.level.intro();
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

Game.prototype.start_next_level = function() {
    this.level_number++;
    this.start_level(this.level_number);
};

Game.prototype.start_level = function(level_number) {
    this.level_number = level_number;
    this.level = new Level(this.level_number);
    this.start();
};


$(document).ready(function() {
    game = new Game();
    
    $("#modal").hide();
    insert_all_levels();

    $("#begin-button").click(function() {
        $('html, body').animate({
            scrollTop: $("#main-menu").offset().top
        }, 750);
    });
    
    $(".hex")
        .hover(function() {
            // Total hack to update text
            var elm_num = parseInt(this.id.slice(3));
            $("#level-title").text(level_data[elm_num].title);
            $("#level-desc").text(level_data[elm_num].desc_short);
            $(".description-box").css('opacity', 1);
        }, function() {
            $(".description-box").css('opacity', 0);
        })

        .click(function() {
            // Total hack to get hex number
            var elm_num = parseInt(this.id.slice(3));
            game.start_level(elm_num);
        });

});
