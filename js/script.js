function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension;
}
// Функция выполнения кода при загрузки приложения
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}
// Функция исполнения когда приложение готово
function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
}
// Функция при нажатии кнопки НАЗАД
function onBackKeyDown() {
	$my_media.stop();
	OneclickPlay = 2;
	ons.notification.confirm('Закрыть радио?').then(
		function(answer) {
		  if (answer === 1) {
				console.log('закрывается');
		  }
		}
	);
}
// Функция при сворачивании приложения
function onPause() {}
// Функция при восстановлении приложения
function onResume() {} 

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
							localStorage.setItem(md+'Small', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'Medium', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();							
							localStorage.setItem(md+'Large', $himg);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							
							localStorage.setItem(md+'Extralarge', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'Mega', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					}
				})
			});
			
			var ImgCashSmall = ContentSync.sync({
					src: localStorage.TrackIdNowImgSmall,
					id: 'small/'+getPageName(localStorage.TrackIdNowImgSmall),
					type: 'local'
			});
			var ImgCashMedium = ContentSync.sync({
					src: localStorage.TrackIdNowImgMedium,
					id: 'medium/'+getPageName(localStorage.TrackIdNowImgMedium),
					type: 'local'
			});
			var ImgCashLarge = ContentSync.sync({
					src: localStorage.TrackIdNowImgLarge,
					id: 'large/'+getPageName(localStorage.TrackIdNowImgLarge),
					type: 'local'
			});
			var ImgCashExtralarge = ContentSync.sync({
					src: localStorage.TrackIdNowImgExtralarge,
					id: 'extralarge/'+getPageName(localStorage.TrackIdNowImgExtralarge),
					type: 'local'
			});
			var ImgCashMega = ContentSync.sync({
					src: localStorage.TrackIdNowImgMega,
					id: 'mega/'+getPageName(localStorage.TrackIdNowImgMega),
					type: 'local'
			});
			
			ImgCashSmall.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
			});
			ImgCashMedium.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
			});
			ImgCashLarge.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
				if(data.localPath){
					statusBar(data.localPath);
				}
			});
			ImgCashExtralarge.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
				if(data.localPath){
					jQuery('#' + type + ' #' + id + ' img').attr('src', data.localPath);
					
				}
				
			});
			ImgCashMega.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
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
							localStorage.setItem(md+'Small', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'Medium', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'Large', $himg);
						};
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'Extralarge', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'Mega', $himg);
						}
					}
				})
			});
			
			var ImgCashSmall = ContentSync.sync({
					src: localStorage.TrackIdNowImgSmall,
					id: 'small/'+getPageName(localStorage.TrackIdNowImgSmall),
					type: 'local'
			});
			var ImgCashMedium = ContentSync.sync({
					src: localStorage.TrackIdNowImgMedium,
					id: 'medium/'+getPageName(localStorage.TrackIdNowImgMedium),
					type: 'local'
			});
			var ImgCashLarge = ContentSync.sync({
					src: localStorage.TrackIdNowImgLarge,
					id: 'large/'+getPageName(localStorage.TrackIdNowImgLarge),
					type: 'local'
			});
			var ImgCashExtralarge = ContentSync.sync({
					src: localStorage.TrackIdNowImgExtralarge,
					id: 'extralarge/'+getPageName(localStorage.TrackIdNowImgExtralarge),
					type: 'local'
			});
			var ImgCashMega = ContentSync.sync({
					src: localStorage.TrackIdNowImgMega,
					id: 'mega/'+getPageName(localStorage.TrackIdNowImgMega),
					type: 'local'
			});
			
			ImgCashSmall.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
			});
			ImgCashMedium.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
				
			});
			ImgCashLarge.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
				if(data.localPath){
					statusBar(data.localPath);
				}
			});
			ImgCashExtralarge.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
				if(data.localPath){
					jQuery('#' + type + ' #' + id + ' img').attr('src', data.localPath);
				}
			});
			ImgCashMega.on('complete', function(data) {
				console.log(data.localPath);
				console.log(data.cached);
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
// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');
LoadStatus();
// Каждые 15 секунд запрашиваем статус эфира
setInterval(function(){
	LoadStatus();
	$('#trace').html(window.location.pathname+' '+localStorage.TrackIdNow);	
}, 15000);
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
			}, 2000);
			localStorage.setItem('TrackIdNow', data.id);
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
		}); 
	}
}

// Статус, играет или нет.
var Playing = false;
// Вывод статус бара в шторку с инфой трека и обложкой
function statusBar(img){
	if(streamer == "1"){
		Playing = false;
	} else { 
		Playing = true;
	};
	MusicControls.create({
		track: localStorage.NowSong,
		artist: localStorage.NowArtist,
		cover: img,
		isPlaying: Playing,
		
		dismissable : true,
		hasPrev: false,
		hasNext: false,
		hasClose: false
	}, onSuccess, onError);
}

var onSuccess = function(result) {
	cancelled (result.completed=false)
}
var onError = function(msg) {}


// Шарим треки
function ShareTrack() {
var textShare = 'Отличная музыка: '+localStorage.NowSong+' - '+localStorage.NowArtist+'. Присоединяйся к Радио13! #радио #музыка #онлайн';
	modals('share');
	var ShareData = {
		message: textShare,
		subject: 'Мне нравится!',
		files: [localStorage.TrackIdNowImgMega],
		url: 'https://app.radio13.ru',
		chooserTitle: 'Поделись треком!'
	}
	var onSuccess = function(result) {
	  modals('share');
	}

	var onError = function(msg) {
	  console.log("Ошибка: " + msg);
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


function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Неизвестный тип соединения';
    states[Connection.ETHERNET] = 'Соединение Ethernet';
    states[Connection.WIFI]     = 'через Wi-fi';
    states[Connection.CELL_2G]  = 'мобильный 2G';
    states[Connection.CELL_3G]  = 'мобильный 3G';
    states[Connection.CELL_4G]  = 'мобильный 4G';
    states[Connection.CELL]     = 'мобильный, базовый';
    states[Connection.NONE]     = 'нет соединения';
	$('#inet').html('Статус соединения - '+states[networkState]);
}


	LoadConfigApp();	
	setInterval(function(){
		LoadConfigApp();
	}, 60000);
	
	
	
	
	var streamer = 1;
	var OneclickPlay = 1;
	var OneclickStop = 1;
	// Функция кнопки ПЛЕЙ основной
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
			$my_media = new PlayStream(localStorage.streamChanel, function (status){
					console.log("status - "+status);
					if(status === PlayStream.MEDIA_STOPPED){
						console.log('stopped');
						MusicControls.updateIsPlaying(false);
						streamer = 1;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').removeClass('active');
						$("#play ons-progress-circular").hide();
					}
					if(status === PlayStream.MEDIA_STARTING){
						console.log('starting');
						MusicControls.updateIsPlaying(true);
						streamer = 2;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').addClass('active');
						$("#play ons-progress-circular").show();
					}
					if(status === PlayStream.MEDIA_RUNNING){
						console.log('running');
						MusicControls.updateIsPlaying(true);
						streamer = 3;
						$('#play i').attr('class', 'zmdi zmdi-stop');
						$('#play').addClass('active');
						$("#play ons-progress-circular").hide();
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
							$('#play').removeClass('active');
							$my_media.stop();
							OneclickStop = 3;
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
							OneclickStop = 3;
						}
						callmemabe = '2';

						break;
					case "OFFHOOK":
						console.log("Phone is off-hook");
						 if (streamer == "2") {
							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
							OneclickStop = 3;
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
							OneclickStop = 3;
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
								$('#play').addClass('active');
								$my_media.play();
								OneclickStop = 2;
							}, 3000);
						};
						break;
				}
			});
			$my_media.stop();
		}, 2000);
	}

	// Функция восстановления воспроизведения
function streamRePlayGO(){
	setTimeout(function() {
		console.log("Восстанавливаем стрим");
		$('#play i').attr('class', 'zmdi zmdi-play');
		$('#play').addClass('active');
		$my_media.play();
	}, 100);
};
function streamRePlay(){
	console.log(navigator.connection.type+' '+streamer+' '+OneclickStop+' '+OneclickPlay);
	if(navigator.connection.type != 'none' && streamer == "1" && OneclickStop == "2"){
		console.log('Сработали условия для перезапуска стрима!');
		streamRePlayGO();
	};	
}
setInterval(function(){
	streamRePlay()
}, 6000); 
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
				OneclickPlay = 1;
				OneclickStop = 3;
				$my_media.stop();
				
				break;
			case 'music-controls-play':
				console.log('Плей');
				OneclickPlay = 2;
				OneclickStop = 2;
				$my_media.play();
				
				break;
			case 'music-controls-destroy':
				console.log('Удалено');
				OneclickPlay = 1;
				OneclickStop = 3;
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



  
	
	jQuery("#volume").on('input', function () {
		var volume = jQuery("#volume").val();
		window.plugins.mediaVolume.setVol(volume);
		console.log(volume);
	});

}); 