function show_modal(title, desc_short, desc_long, button_text, click_handler) {
    $('#modal-title').text(title);
    $('#modal-desc-short').text(desc_short);
    $('#modal-desc-long').html(desc_long);
    $('#modal-button').text(button_text).click(function(event) {
        click_handler(event);
        $('#modal').css('opacity', 0);
    }).focus();;
    
    $('#modal').css('opacity', 1);
    $('#modal').show();
}
