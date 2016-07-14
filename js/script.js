function LoadConfigApp() {
	jQuery.getJSON("http://radioradio.radio13.ru/api.php", function(data) {
		if(jQuery.isEmptyObject(data.poll)){
			jQuery('#poll').hide();
		} else {
			jQuery('#poll .poll_text').text(data.poll.text);
			jQuery('#poll .poll_ex').html('');
			jQuery.each(data.poll.ex, function (index, value) {
				jQuery('#poll .poll_ex').append('<div class="hor_grid_box"><a href="sms:+7'+data.poll.phone+'?body='+data.poll.pref+' '+(index + 1)+'"><ons-button>'+value+'</ons-button></a></div>')
			});
			jQuery('#poll').show();
		}
	});
}

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
			setTimeout(function() {
				jQuery("#playinfo").addClass("show");
				// название трека
				jQuery('.songinfo').text(data.s);
				jQuery('.song').text(data.s);
				// артист
				jQuery('.titleinfo').text(data.a);
				jQuery('.artist').text(data.a);
				// Обновляет куки
				localStorage.setItem('NowSong', data.s);
				localStorage.setItem('NowArtist', data.a);
			}, 1000);
			localStorage.setItem('TrackIdNow', data.id);
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
		});
	}
}



var onSuccess = function(result) {
	cancelled (result.completed=false)
}
var onError = function(msg) {}
function ShareTrack() {
	var ShareData = {
		message: 'На "Радио13" сейчас играет: '+localStorage.NowSong+' '+localStorage.NowArtist,
		subject: 'Мне нравится!',
		files: [localStorage.TrackIdNowImgM],
		url: 'https://radio13.ru',
		chooserTitle: 'Поделись треком!'
	}
	window.plugins.socialsharing.shareWithOptions(ShareData);
}



// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');
LoadStatus();
setInterval(function(){
	LoadStatus();
	$('#trace').html(window.location.pathname+' '+localStorage.TrackIdNow);
}, 15000);









	LoadConfigApp();
	
	
	setInterval(function(){
		LoadConfigApp();
	}, 60000);
	
	var volume = 100;
	jQuery("#volume").val(volume);
	jQuery("#volume").on('input', function () {
		var volume = jQuery("#volume").val();
		volume = volume / 100;
		player.Volume(volume);
	});
	
	
	var streamer = 1;
	function streamplay() {

		
		if (streamer == "1") {

			$my_media.play();
			$('#play i').attr('class', 'zmdi zmdi-stop');
		} else if (streamer == "2") {

			$('#play i').attr('class', 'zmdi zmdi-play');
			$my_media.stop();
		} else if (streamer == "3") {

			$('#play i').attr('class', 'zmdi zmdi-play');
			$my_media.stop();
		} else if (streamer == "4") {

			$('#play i').attr('class', 'zmdi zmdi-play');
			$my_media.play();
		};
	}
    
	LoadStream();
	function LoadStream() {
		setTimeout(function() {

			var url = 'http://play.radio13.ru/aac';
			$my_media = new PlayStream(url, function (status){
					alert("статус плеера "+status);
					console.log(status);
					if(status === PlayStream.MEDIA_STOPPED){
						console.log('stopped');
						streamer = 1;
					}
					if(status === PlayStream.MEDIA_STARTING){
						console.log('starting');
						streamer = 2;
					}
					if(status === PlayStream.MEDIA_RUNNING){
						console.log('running');
						streamer = 3;
					}
				},
				function (err) {
					alert(err);
				}
			);
			
			PhoneCallTrap.onCall(function(state) {
				console.log("CHANGE STATE: " + state);
				switch (state) {
					case "RINGING":
						console.log("Phone is ringing");
						$my_media.stop();
						break;
					case "OFFHOOK":
						console.log("Phone is off-hook");
						$my_media.stop();
						break;

					case "IDLE":
						console.log("Phone is idle");
						$my_media.start();
						break;
				}
			});
			
		}, 2000);
	}

// Sharing

ons.ready(function() {

});
$( document ).ready(function() {
	
});