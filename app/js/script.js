$(document).ready(function () {

  if (document.documentElement.clientWidth > 1200) {

    $(window).enllax();

    $("body").niceScroll({
      scrollspeed: 70,
      mousescrollstep: 60,
      smoothscroll: true,
      cursorwidth: 5,
      cursorborder: 0,
      cursorcolor: '#cd0009',
      cursorborderradius: 2,
      autohidemode: true,
      horizrailenabled: false,
      zindex: "9999"
    });

  };
});


// Start Page cursors
(function ($) {
  "use strict";
  document.getElementsByTagName("body")[0].addEventListener("mousemove", function (n) {
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



// Scroll Go
let tl = new TimelineMax();
tl.to('.header__picture', 1.65, {y: -200, scaleX: 0.75, rotationX: 20, scaleY: 0.75, opacity: 0, ease: Linear.easeNone}, 0);
tl.to('.header__logo img', 1, {y: -70, ease: Power4.easeOut}, 0);
tl.to('.go', 1.85, {y: -400, ease: Linear.easeNone}, 0);

const controller = new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({
  duration: '600',
  offset: 80,
  triggerElement: '#trigger',
  triggerHook: 0,
});


scene.addIndicators({
  name: 'Lets Go'
});
scene.setTween(tl);
scene.addTo(controller);
// End Scroll Go


// Start Reveal effect
(function ($) {
  $.expr[":"].onScreen = function (elem) {
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


$(function () {
  setInterval(function () {
    $(".photo__item")
      .filter(":onScreen")
      .addClass("focus-in")
      .addClass("reveal")
  })
});
// End Reveal effect



window.console.log('Made with fun and love ❤️❤️❤️️ by Dmitriy Moskvichov')

const g = 23;