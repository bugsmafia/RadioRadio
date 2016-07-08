// Тянем информацию об альбоме
function infoAlbum(type, id, md, artist, song) {
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=" + artist + "&album=" + song + "&api_key=" + api,
		type: "GET",
		dataType: "xml",
		success: function(xml) {
			jQuery(xml).find('album').each(function() {
				jQuery(this).find('image').each(function() {
					var img = jQuery(this).attr('size');
					if (img == "small") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'S', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							localStorage.setItem(md+'L', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'E', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					}
				})
			});
		},
		statusCode: {
			400: function() {
				infoArtist(type, id, md, artist, song);
			}
		}
	});
}
// Тянем информацию об артисте
function infoArtist(type, id, md, artist, song) {
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" + artist + "&api_key=" + api,
		type: "GET",
		dataType: "xml",
		success: function(xml) {
			jQuery(xml).find('artist').each(function() {
				jQuery(this).find('image').each(function() {
					var img = jQuery(this).attr('size');
					if (img == "small") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'S', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							localStorage.setItem(md+'L', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'E', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					}
				})
			});
		},
		statusCode: {
			400: function() {}
		}
	});
}
// Загружаем статус эфира
function LoadStatus() {
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=i", function(data) {
		UpdateStatus(data.i);
	});
}
// Обновляем статус эфира
function UpdateStatus(now) {
	if (localStorage.TrackIdNow == now) {} else {
		jQuery.getJSON("http://app.radio13.ru/status/json.php?i=l", function(data) {
			StatusAnimation('hide');
			setTimeout(function() {
				jQuery("#playinfo").addClass("show");
				// название трека
				jQuery('.songinfo').text(data.s);
				jQuery('footer .wrap .track .song').text(data.s);
				// артист
				jQuery('.titleinfo').text(data.a);
				jQuery('footer .wrap .track .artist').text(data.a);
				// Обновляет куки
			}, 1000);
			localStorage.setItem('TrackIdNow', data.id);
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
			StatusAnimation('show');
		});
	}
}
// Анимация информации о новом треке
function StatusAnimation(type) {
	if (type == 'show') {
		setTimeout(function() {
			jQuery("#playinfo").addClass("show");
		}, 5000);
	} else if (type == 'hide') {
		jQuery("#playinfo").removeClass("show");
	}
}
// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');

LoadStatus();
setInterval(function(){
	LoadStatus();
	$('#trace').html(window.location.pathname+' '+localStorage.TrackIdNow);
}, 10000);

function titleupdpage(page) {
	if (page == 'home.html') {

	}
}
var player = new Uppod({
	m: "audio",
	uid: "stream",
	file: '#'
});
var status = 0;

function streamplay() {
	if (status == false) {
		$('.play ons-icon').attr('icon', 'md-stop');
		player.Play('http://play.radio13.ru/mp3');
		status = 1;
	} else if (status == true) {
		status = 0;
		$('.play ons-icon').attr('icon', 'md-play');
		player.Play('http://play.radio13.ru/none');
	}
}
ons.ready(function() {
	window.fn = {};
	window.fn.open = function() {
		var menu = document.getElementById('menu');
		menu.open();
	};
	window.fn.load = function(page) {
		var content = document.getElementById('content');
		var menu = document.getElementById('menu');
		content.load(page)
			.then(
				menu.close.bind(menu),
				titleupdpage(page)
			);
	};

});

ons.ready(function() {
var playButton = {
    el: document.querySelector(".js-button"),

    iconEls: {
        playing: document.querySelector("#pause-icon"),
        paused:  document.querySelector("#play-icon")
    },

    nextState: {
        playing: "paused",
        paused:  "playing"
    },

    animationDuration: 350,

    init: function () {
        this.setInitialState();
        this.replaceUseEl();
        this.el.addEventListener("click", this.toggle.bind(this));
    },

    setInitialState: function () {
      var initialIconRef = this.el.querySelector("use").getAttribute("xlink:href");
      this.state = this.el.querySelector(initialIconRef).getAttribute("data-state");
    },

    replaceUseEl: function () {
        d3.select(this.el.querySelector("use")).remove();
        d3.select(this.el.querySelector("svg")).append("path")
            .attr("class", "js-icon")
            .attr("d", this.stateIconPath());
    },

    toggle: function () {
		streamplay();
        this.goToNextState();

        d3.select(this.el.querySelector(".js-icon")).transition()
            .duration(this.animationDuration)
            .attr("d", this.stateIconPath());
    },

    goToNextState: function () {
        this.state = this.nextState[this.state];
    },

    stateIconPath: function () {
        return this.iconEls[this.state].getAttribute("d");
    }
};

playButton.init();
});