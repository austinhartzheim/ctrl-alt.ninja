var game;

function Game() {
    this.level = new Level0();
    this.level.start();

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


$(document).ready(function() {
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

            if (elm_num == 0) {
                game = new Game(Level0);
            } else if (elm_num == 1) {
                console.log("Game object not created yet");
            }

            game.start();
        });

});
