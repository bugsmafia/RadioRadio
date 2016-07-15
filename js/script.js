function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
}

function onPause() {
	
}

function onResume() {

} 

function modals(name) {
	switch (name) {
		case "config":
			document.querySelector("#Modal_Config").toggle();
		break;
		case "about":
			document.querySelector("#Modal_About").toggle();
		break;
		case "share":
			document.querySelector("#Modal_Share").toggle();
		break;
	};
} 

function LoadConfigApp() {
	jQuery.getJSON("http://radioradio.radio13.ru/api.php", function(data) {
		var streamChanel = data.stream.reg50.aac.b32[2].patch;
		localStorage.setItem('streamChanel', data.stream.reg50.aac.b32[2].patch);
		//console.log(data.stream.reg50.aac.b32[2].patch);
		setTimeout(function() {
			if(jQuery.isEmptyObject(data.poll)){
				jQuery('#poll').hide();
			} else {
				jQuery('#poll .poll_text').text(data.poll.text);
				jQuery('#poll .poll_ex').html('');
				jQuery.each(data.poll.ex, function (index, value) {
					jQuery('#poll .poll_ex').append('<div class="hor_grid_box"><a onclick="SmsSend(\''+data.poll.pref+' '+(index + 1)+'\')" href="#"><ons-button>'+value+'</ons-button></a></div>')
				});
				jQuery('#poll').show();
			}
		}, 5000);
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
				statusBar();
			}, 2000);
			localStorage.setItem('TrackIdNow', data.id);
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
		});
	}
}

var Playing = false;
function statusBar(){
	if(streamer == "1"){
		Playing = false;
	} else {
		Playing = true;
	};
	MusicControls.create({
		track: localStorage.NowSong,
		artist: localStorage.NowArtist,
		cover: localStorage.TrackIdNowImgE,
		isPlaying: Playing,
		
		dismissable : true,
		hasPrev: false,
		hasNext: false,
		hasClose: false, 
		ticker: 'Now playing "Time is Running Out"'
	}, onSuccess, onError);
}

var onSuccess = function(result) {
	cancelled (result.completed=false)
}
var onError = function(msg) {}
function ShareTrack() {
	modals('share');
	var ShareData = {
		message: 'На "Радио13" сейчас играет: '+localStorage.NowSong+' '+localStorage.NowArtist,
		subject: 'Мне нравится!',
		files: [localStorage.TrackIdNowImgM],
		url: 'https://radio13.ru',
		chooserTitle: 'Поделись треком!'
	}
	var onSuccess = function(result) {
	  modals('share');
	}

	var onError = function(msg) {
	  console.log("Sharing failed with message: " + msg);
	}
	
	window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}
function SmsSend(mess) {
ons.notification.confirm('Услуга платная').then(
    function(answer) {
      if (answer === 1) {
		var SmsData = {
			phoneNumber: "+79123555341",
			textMessage: mess
		};
		sms.sendMessage(SmsData , function(message) {
			console.log("success: " + message);
		}, function(error) {
			console.log("code: " + error.code + ", message: " + error.message);
		});
        ons.notification.alert('Сообщение отправлено!');
      }
    }
);
	
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
	var OneclickPlay = 1;
	function streamplay() {
		OneclickPlay = 2;
		
		if (streamer == "1") {
			$my_media.play();
		} else if (streamer == "2") {
			$my_media.stop();
		} else if (streamer == "3") {
			$my_media.stop();
		} else if (streamer == "4") {
			$my_media.play();
		};
	}
    
	
	LoadStream();
	function LoadStream() {
		setTimeout(function() {
			$my_media = new playAudio(localStorage.streamChanel, function (status){
					console.log("status - "+status);
					if(status === playAudio.MEDIA_STOPPED){
						console.log('stopped');
						MusicControls.updateIsPlaying(false);
						streamer = 1;
						$('#play i').attr('class', 'zmdi zmdi-play');
					}
					if(status === playAudio.MEDIA_STARTING){
						console.log('starting');
						MusicControls.updateIsPlaying(true);
						streamer = 2;
						$('#play i').attr('class', 'zmdi zmdi-play');
					}
					if(status === playAudio.MEDIA_RUNNING){
						console.log('running');
						MusicControls.updateIsPlaying(true);
						streamer = 3;
						$('#play i').attr('class', 'zmdi zmdi-stop');
					}
				}, 
				function (err) {
					alert(err);
				} 
			);
			var callmemabe = '1';
			PhoneCallTrap.onCall(function(state) {
				
				console.log("CHANGE STATE: " + state+" "+callmemabe);
				switch (state) {
					case "RINGING":
						console.log("Звонят");
						if (streamer == "2") {
							$('#play i').attr('class', 'zmdi zmdi-play');
							$my_media.stop();
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$my_media.stop();
						}
						callmemabe = '2';

						break;
					case "OFFHOOK":
						console.log("Phone is off-hook");
						 if (streamer == "2") {
							$('#play i').attr('class', 'zmdi zmdi-play');
							$my_media.stop();
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$my_media.stop();
						}
						callmemabe = '2';
						break;

					case "IDLE":
						console.log("Телефон свободен: "+streamer+ " "+callmemabe+ " "+OneclickPlay);
						if (streamer == "1" && callmemabe == '2' && OneclickPlay == "2") {
							console.log("Восстанавливаем стрим через 3 секунды");
							setTimeout(function() {
								console.log("Восстанавливаем стрим");
								$('#play i').attr('class', 'zmdi zmdi-play');
								$my_media.play();
							}, 3000);
						};
						break;
				}
			});
			$my_media.stop();
		}, 2000);
	}


// Sharing

ons.ready(function() {
function events(action) {
    switch(action) {
        case 'music-controls-next':
            console.log('Следующая');
            break;
        case 'music-controls-previous':
            console.log('Предыдущая');
            break;
        case 'music-controls-pause':
            console.log('Пауза');
			$my_media.stop();
            break;
        case 'music-controls-play':
            console.log('Плей');
			$my_media.play();
            break;
        case 'music-controls-destroy':
            console.log('Удалено');
			$my_media.stop();
            break;

        // Headset events (Android only)
        case 'music-controls-media-button' :
            console.log('music-controls-media-button');
            break;
        case 'music-controls-headset-unplugged':
            console.log('unplugged');
            break;
        case 'music-controls-headset-plugged':
            console.log('plugged');
            break;
        default:
            break;
    }
} 
MusicControls.subscribe(events);
MusicControls.listen();
}); 
$( document ).ready(function() {
	
});