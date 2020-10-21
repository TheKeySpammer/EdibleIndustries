$(document).ready(() => {
    $(".delete").click(e => {
        $(e.target).parents('.modal').toggleClass('is-active');
        $(e.target).parents('.notification').hide();
    });
    $(".close-modal").click(e => {
        $(e.target).parents('.modal').toggleClass('is-active');
    });

    setTimeout(() => {
        $('.notification').animate({
            'margin-top' : '-63px'
        }, complete = () => {
            $('.notification').hide();
        });
    }, 4000);
});