
// Start Page cursors
(function($) { "use strict";
    document.getElementsByTagName("body")[0].addEventListener("mousemove", function(n) {
    t.style.left = n.clientX + "px", 
		t.style.top = n.clientY + "px", 
		e.style.left = n.clientX + "px", 
		e.style.top = n.clientY + "px"
    });
    var t = document.getElementById("cursor"),
        e = document.getElementById("cursor2")
    function n(t) {
        e.classList.add("hover")
    }
    function s(t) {
        e.classList.remove("hover")
    }
    s();
    for (var r = document.querySelectorAll(".hover-target"), a = r.length - 1; a >= 0; a--) {
        o(r[a])
    }
    function o(t) {
        t.addEventListener("mouseover", n), t.addEventListener("mouseout", s)
    }
})(jQuery);
// End Page cursors


// Start Reveal effect
(function($) {
  $.expr[":"].onScreen = function(elem) {
    let $window = $(window)
    let viewport_top = $window.scrollTop()
    let viewport_height = $window.height()
    let viewport_bottom = viewport_top + viewport_height
    let $elem = $(elem)
    let top = $elem.offset().top + 200;
    let height = $elem.height()
    let bottom = top + height

    return (top >= viewport_top && top < viewport_bottom) ||
           (bottom > viewport_top && bottom <= viewport_bottom) ||
           (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
  }
})(jQuery);


$(function() {
  setInterval(function() {
    $(".photo__item")
      .filter(":onScreen") 
      .addClass("focus-in") 
      .addClass("reveal") 
  })                             
});
// End Reveal effect


// Scroll Go
let tl = new TimelineMax();
tl.to('.header__picture', 1, { y: -90, scaleX:0.85, rotationX: 10, scaleY:0.85, opacity:0.35, ease: Power4.easeOut }, 0);
tl.to('.header__logo img', 0.85, { y: -70, ease: Power4.easeOut }, 0);
tl.to('.main', 1.25, { y: -180, ease: Power4.easeOut }, 0);

const controller = new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({
  duration: '800',
  offset: 0,
  triggerElement: '#trigger',
  triggerHook: 0,
});

scene.addIndicators({name: 'Lets Go'});
scene.setTween(tl);
scene.addTo(controller);
// End Scroll Go


window.console.log('Made with fun and love ❤️❤️❤️️ by Dmitriy Moskvichov')