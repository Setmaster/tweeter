$(document).ready(function() {
    $('.new-tweet textarea').on('input', function() {
        const text = $(this).val();
        const counter = $(this).closest('form').find('.counter');
        if (text.length > 140){
            counter.text(-(text.length - 140));
            counter.addClass('error');
        }else{
            counter.text(140 - text.length);
            counter.removeClass('error');
        }
    });
});