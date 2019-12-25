
$(window).scroll(function () {
    var scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    var start = document.documentElement.clientHeight;


    if ($(this).scrollTop() > start / 2) {
        $('.scrollup').fadeIn();

        var persent = ($(this).scrollTop() + start) / scrollHeight * 100;
        var angle = persent * 0.02 - 1 / 2;
        var x = 180 * Math.cos(angle * Math.PI) + 100;
        var y = 180 * Math.sin(angle * Math.PI) + 100;
        var rez;

        if (Math.cos(angle * Math.PI) >= 0) {
            rez = 'M 100,-80 A180,180   0  0, 1 ' + x + ',' + y;
        }
        else {
            rez = 'M 100,-80 A180,180   0  0, 1 100 280 m0,0 A180,180 0  0, 1 ' + x + ',' + y;
        }

        $('#path-anim').attr('d', rez);
    } else {
        $('.scrollup').fadeOut();
    }
});

$('.scrollup').click(function () {
    $("html, body").animate({ scrollTop: 0 });
    return false;
});