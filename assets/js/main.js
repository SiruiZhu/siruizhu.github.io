/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1141px',  '1680px' ],
			large:    [ '981px',   '1140px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '321px',   '480px'  ],
			xxsmall:  [ null,      '320px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

})(jQuery);


// var imgs = document.querySelectorAll('img');

// //用来判断bound.top<=clientHeight的函数，返回一个bool值
// function isIn(el) {
//     var bound = el.getBoundingClientRect();
//     var clientHeight = window.innerHeight;
//     return bound.top <= clientHeight;
// } 

// //检查图片是否在可视区内，如果不在，则加载
// function check() {
//     Array.from(imgs).forEach(function(el){
//         if(isIn(el)){
//             loadImg(el);
//         }
//     })
// }

// function loadImg(el) {
//     if(!el.src){
//         var source = el.dataset.src;
//         el.src = source;
//     }
// }

// window.onload = window.onscroll = function () { //onscroll()在滚动条滚动的时候触发
//     check();
// }












