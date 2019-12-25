// import easyScroll from 'scroll';


$(document).ready(function () {

  if (document.documentElement.clientWidth > 1024) {

    var isIE = false;
    var ua = window.navigator.userAgent;
    var old_ie = ua.indexOf('MSIE ');
    var new_ie = ua.indexOf('Trident/');

    if ((old_ie > -1) || (new_ie > -1)) {
      isIE = true;
    }

    if (!isIE) {
      var image = document.getElementsByClassName('photo__img-big');
      new simpleParallax(image, {
        delay: .55,
        scale: 1.35,
        transition: 'cubic-bezier(0,0,0,1)'
      });


      var image2 = document.getElementsByClassName('photo__img-small');
      new simpleParallax(image2, {
        delay: 1.5,
        scale: 1.15,
        transition: 'cubic-bezier(0,0,0,1)'
      });

    }
  };
});




// easyScroll({
//   'scrollableDomEle': window,
//   'direction': 'bottom',
//   'duration': 2000,
//   'easingPreset': 'easeInQuad',
//   'scrollAmount': 1000
// });



// Start Page cursors
// (function ($) {
//   "use strict";
//   document.getElementsByTagName("body")[0].addEventListener("mousemove", function (n) {

//     t.style.left = n.clientX + "px",
//       t.style.top = n.clientY + "px",
//       e.style.left = n.clientX + "px",
//       e.style.top = n.clientY + "px"
//   });
//   var t = document.getElementById("cursor"),
//     e = document.getElementById("cursor2")

//   function n(t) {
//     e.classList.add("hover")
//   }

//   function s(t) {
//     e.classList.remove("hover")
//   }
//   s();

//   for (var r = document.querySelectorAll(".hover-target"), a = r.length - 1; a >= 0; a--) {
//     o(r[a])
//   }

//   function o(t) {
//     t.addEventListener("mouseover", n), t.addEventListener("mouseout", s)
//   }
// })(jQuery);
// End Page cursors



// Scroll Go
let tl = new TimelineMax();
tl.to('.header__picture', 1.65, { y: -200, scaleX: 0.75, rotationX: 20, scaleY: 0.75, opacity: 0, ease: Linear.easeNone }, 0);
tl.to('.header__logo', 1, { y: -70, ease: Power4.easeOut }, 0);
tl.to('.go', 1.85, { y: -140, ease: Linear.easeNone }, 0);

const controller = new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({
  duration: '600',
  offset: 80,
  triggerElement: '#trigger',
  triggerHook: 0,
});


// scene.addIndicators({
//   name: 'Lets Go'
// });
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