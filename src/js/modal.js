function show_modal(title, desc_short, desc_long, button_text, click_handler) {
    var modal = $('<div/>', {
        class: 'modal'
    });

    var modal_inner = $('<div/>', {
        class: 'modal-inner'
    }).appendTo(modal);

    var header = $('<div/>', {
        class: 'header'
    }).appendTo(modal_inner);

    var header_h1 = $('<h1/>', {
        class: 'modal-title',
        text: title
    }).appendTo(header);

    var header_p = $('<p/>', {
        class: 'modal-desc-short',
        text: desc_short
    }).appendTo(header);

    var modal_desc_long = $('<div/>', {
        class: 'modal-desc-long',
        html: desc_long
    }).appendTo(modal_inner);

    var modal_submit = $('<div/>', {
        class: 'modal-submit'
    }).appendTo(modal_inner);

    var modal_button = $('<a/>', {
        class: 'modal-button button-green',
        text: button_text
    }).click(function(event) {
        click_handler(event);
        modal.fadeOut(500, function(event) {
            this.remove();
        });
    }).appendTo(modal_submit);

    modal.hide();
    modal.appendTo('body');
    modal.fadeIn({
        duration: 1000,
        queue: true
    });
}
