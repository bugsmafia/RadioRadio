function timeLogs() {
	var now = new Date();
	var time = '['+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+'.'+now.getMilliseconds()+']';
	return time;
};

jQuery('#logs').append( timeLogs()+' - Загружен скрипт<br/>');

function exit(){
	var thisWindow = window.open("index.html",'_self');
	thisWindow.close();
}

function Loader() {
	$(".La").fadeOut(700);
	$(".Lb").fadeOut(700);
	$(".Lc").fadeOut(700);
	setTimeout(function() {
		$(".preload").fadeOut(350);
	}, 2000);
};

$(document).on('pagechange', function() {
    var lastPage = '#'+$.mobile.activePage.attr('id');
    console.log('setting last page to '+lastPage);
    localStorage.setItem('lastPage',lastPage);
});

var redirectedToLastPage = false;
$(document).bind("pagecreate", function(){
    var lastPage = localStorage.getItem('lastPage');
    if(lastPage // lastPage needs to be set
        && !redirectedToLastPage  // only do it on first pageload
        &&!window.location.hash // we don't want to redirect from pages other than the homepage
    ) {
        if($("div[data-role='page']"+lastPage).length) { // make sure a "page" div with that ID exists!
            console.log('redirecting to '+lastPage);
            $.mobile.changePage(lastPage);
        } 
        else {
        console.log(lastPage+' does not exist!');
        }
    }
    redirectedToLastPage = true;
});
function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension;
}

// Функция выполнения кода при загрузки приложения
function onLoad() {
	jQuery('#logs').append( timeLogs()+' - Приложение onLoad<br/>');
}
// Функция исполнения когда приложение готово
function onDeviceReady() {
	
	
	
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	ons.disableDeviceBackButtonHandler();
    document.addEventListener("backbutton", onBackKeyDown, false);
	
}
// Функция при нажатии кнопки НАЗАД
function onBackKeyDown() {
    if (openmodal == true) {
        console.log('Модальное закрывается');
        document.querySelector("#Modal_Config").hide();
        document.querySelector("#Modal_About").hide();
        document.querySelector("#Modal_Share").hide();
		document.querySelector("#Modal_Debug").hide();
        openmodal = false;
    } else {		
        console.log('Модальное было закрыто. останавливаем и закрываем все');        
        ons.notification.confirm('Закрыть радио?').then(
            function(answer) {
                if (answer === 1) {
					streamer = 1;
					$my_media.stop();
					OneclickPlay = 2;
                    console.log('закрывается');
					navigator.app.exitApp();
                }
            }
        );
    };
};
// Функция при сворачивании приложения
function onPause() {}
// Функция при восстановлении приложения
function onResume() {}
var openmodal = false;

function modals(name) {
    if (openmodal == false) {
        openmodal = true;
    } else {
        openmodal = false;
    };
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
		case "debug":
            document.querySelector("#Modal_Debug").toggle();
            break;
    };
}
var streamChanel;
streamChanel = false;

function LoadConfigApp() {
	jQuery('#logs').append( timeLogs()+' - Загружаем конфигурации приложения с сервера<br/>');
    if (localStorage.ConfigApp) {
        Config(localStorage.ConfigApp);
		jQuery('#logs').append( timeLogs()+' - Конфигурации доступны из кеша, возьмем их<br/>');
    }
    jQuery.getJSON("http://app.radioradio.ru/api.php", function(data) {
		}).done(function(data) {
			if (localStorage.ConfigApp) {
				localStorage.setItem('ConfigApp', JSON.stringify(data));				
			} else {
				localStorage.setItem('ConfigApp', JSON.stringify(data));
				Config(localStorage.ConfigApp);
			};
            
        }).fail(function() {
            console.log("error");
        }).always(function() {
            console.log("complete");
        })
}

var ConfloadC = 0;
function Config(data) {
    data = JSON.parse(data);
    streamChanel = data.stream;
    if (jQuery.isEmptyObject(data.poll)) {
        jQuery('#poll').hide();
    } else {
        jQuery('#poll .poll_text').text(data.poll.text);
        jQuery('#poll .poll_ex').html('');
        jQuery.each(data.poll.ex, function(index, value) {
            jQuery('#poll .poll_ex').append('<div class="hor_grid_box"><a onclick="SmsSend(\'' + data.poll.pref + ' ' + (index + 1) + '\', \'' + data.poll.phone + '\')" href="#"><ons-button>' + value + '</ons-button></a></div>')
        });
        jQuery('#poll').show();
    };

    if (jQuery.isEmptyObject(data.conf.ads)) {
        //jQuery('#ads').hide();
    } else {
        jQuery('#ads .logoAds a').attr('href', data.conf.ads.url);
        jQuery('#ads .logoAds a').css('background-image', 'url(http://app.radioradio.ru/partner/' + data.conf.ads.img + ')');
       // jQuery('#ads').show();
    };
    if (jQuery.isEmptyObject(data.conf.sms)) {
        jQuery('.buttonSMS').hide();
    } else {
        jQuery('.smsact').attr('href', data.conf.sms);
        jQuery('.buttonSMS').show();
    };
    if (jQuery.isEmptyObject(data.conf.phone)) {
        jQuery('.buttonCall').hide();
    } else {
        jQuery('.phoneact').attr('href', data.conf.phone);
        jQuery('.buttonCall').show();
    };
	if(ConfloadC == 0){
		if (streamChanel != false) {
			$(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
			$(".l3s").css("background-image", "url(img/play2-play.png)");
			$("#l2sOffAnim").fadeOut(750);
		};
		ConfloadC++; 
	}
}

// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');

// Статус, играет или нет.
var Playing = false;
// Вывод статус бара в шторку с инфой трека и обложкой
function statusBar(img) {
    if (streamer == "1") {
        Playing = false;
    } else {
        Playing = true;
    };
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
		
	} else {
        img = 'icon.png';
    };
	
	/*
    MusicControls.create({
        track: localStorage.NowSong,
        artist: localStorage.NowArtist,
        cover: img,
        isPlaying: Playing,

        dismissable: true,
        hasPrev: false,
        hasNext: false,
        hasClose: false
    }, onSuccess, onError);
	*/
}

var onSuccess = function(result) {
    cancelled(result.completed = false)
}
var onError = function(msg) {}

function LogoRadioRadio() {
    ons.notification.confirm('Перейти на веб версию RadioRadio.ru?').then(
        function(answer) {
            if (answer === 1) {
				var ref = cordova.InAppBrowser.open('http://radioradio.ru', '_blank', 'location=yes');
				window.open = cordova.InAppBrowser.open;
            }
        }
    );
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Неизвестный тип соединения';
    states[Connection.ETHERNET] = 'Соединение Ethernet';
    states[Connection.WIFI] = 'через Wi-fi';
    states[Connection.CELL_2G] = 'мобильный 2G';
    states[Connection.CELL_3G] = 'мобильный 3G';
    states[Connection.CELL_4G] = 'мобильный 4G';
    states[Connection.CELL] = 'мобильный, базовый';
    states[Connection.NONE] = 'нет соединения';
    return states[networkState];
}

	



var streamer = 1;
var OneclickPlay = 1;
var OneclickStop = 1;
// Функция кнопки ПЛЕЙ основной

function streamplay() {
    if (streamChanel == false) {
        alert('Пожалуйста подождите. Соединяемся с сервером.');
    } else if (checkConnection == 'нет соединения') {
        alert('Соединение с интернетом - отсутствует.');
    } else {
        OneclickPlay = 2;
		jQuery('#logs').append('Плей/стоп. Стрим статус: '.streamer.'<br/>');
        if (streamer == "1") {
            var url = StreamGO();
			$my_media.play();
			jQuery('#logs').append('Плей/стоп. Включаем трансляцию<br/>');
			$(".l3sAnim").css("background-color", "rgba(51,177,255,1)");
			$(".l3s").css("background-image", "url(img/play2-stop.png)");
			$("#l2sOffAnim").fadeIn(750);

		//localStorage.NowSong
		//localStorage.NowArtist
			
		} else if (streamer == "2") {
			$my_media.stop();
			jQuery('#logs').append('Плей/стоп. Останавливаем трансляцию 2<br/>');
			$(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
			$(".l3s").css("background-image", "url(img/play2-play.png)");
			$("#l2sOffAnim").fadeOut(750);
			streamer = 1;
        } else if (streamer == "3") {
            $my_media.stop();
			jQuery('#logs').append('Плей/стоп. Останавливаем трансляцию 3<br/>');
			$(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
			$(".l3s").css("background-image", "url(img/play2-play.png)");
			$("#l2sOffAnim").fadeOut(750);
			streamer = 1;
        } else if (streamer == "4") {
            $my_media.stop();
			jQuery('#logs').append('Плей/стоп. Останавливаем трансляцию 4<br/>');
			$(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
			$(".l3s").css("background-image", "url(img/play2-play.png)");
			$("#l2sOffAnim").fadeOut(750);
			streamer = 1;
        };
    }
}

function StreamGO() {
    var StreamGO;
    var StreamRegion = 'reg' + localStorage.getItem('StreamReg');
	if(streamChanel){
		 $.each(streamChanel, function(key, region) {
			// выбираем регион
			if (key == StreamRegion) {
				$.each(region, function(index, codec) {
					// выбираем кодек
					if (index == 'aac') {
						$.each(codec, function(index, qa) {
							$.each(qa, function(index, chanel) {
								StreamGO = chanel.patch;
								localStorage.setItem('Stream', StreamGO);
								console.log(StreamGO);
							})
						})
					};
				})
			};
		});
		return StreamGO;
	} else {
		return localStorage.Stream;
	}
   
};
// Функция восстановления воспроизведения
function streamRePlayGO() {
    setTimeout(function() {
        console.log("Восстанавливаем стрим");
        $("#l2sOffAnim").fadeIn(750);
    }, 100);
};

function streamRePlay() {
    console.log(navigator.connection.type + ' ' + streamer + ' ' + OneclickStop + ' ' + OneclickPlay);
    if (navigator.connection.type != 'none' && streamer == "1" && OneclickStop == "2") {
        console.log('Сработали условия для перезапуска стрима!');
        streamRePlayGO();
    };
}

function LocalConfig() {
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
    } else {
        $("#album").prop('checked', localStorage.getItem('ConfloadAlbum'));
    };
    if (localStorage.getItem('StreamQ')) {
        $("input[name='qa']").each(function() {
            if (this.value == localStorage.getItem('StreamQ')) {
                $(this).prop('checked', true)
            }
        });
    } else {
        localStorage.setItem('StreamQ', 'auto');
        $("input[name='qa']").each(function() {
            if (this.value == localStorage.getItem('StreamQ')) {
                $(this).prop('checked', true)
            }
        });
    };

    if (localStorage.getItem('StreamReg')) {
        localStorage.setItem('StreamReg', 'RU-MOS');
    } else {
        localStorage.setItem('StreamReg', 'RU-MOS');
    };
};

function LoadStream() {
	jQuery('#logs').append('Функция LoadStream<br/>');
        setTimeout(function() {
			jQuery('#logs').append('Сервер '.StreamGO().'<br/>');
            $my_media = new PlayStream(StreamGO(), function(status) {
                    console.log("status - " + status);
                    if (status === PlayStream.MEDIA_STOPPED) {
                        console.log('stopped');
						jQuery('#logs').append('LoadStream остановлено<br/>');
                        MusicControls.updateIsPlaying(false);
                        streamer = 1; 
                        $(".l3sAnim").css("background-color", "rgba(51,177,255,0.7)");
                        $(".l3s").css("background-image", "url(img/play2-play.png)");
                        $("#l2sOffAnim").fadeOut(750);
                    }
                    if (status === PlayStream.MEDIA_STARTING) {
                        console.log('starting');
						jQuery('#logs').append('LoadStream буфер<br/>');
                        MusicControls.updateIsPlaying(true);
                        streamer = 2;
                        $(".l3sAnim").css("background-color", "rgba(255,87,34,1)");
                    }
                    if (status === PlayStream.MEDIA_RUNNING) {
                        console.log('running');
						jQuery('#logs').append('LoadStream запущено<br/>');
                        MusicControls.updateIsPlaying(true);
                        streamer = 3;
                        $(".l3sAnim").css("background-color", "rgba(51,177,255,1)");
                        $(".l3s").css("background-image", "url(img/play2-stop.png)");
                        $("#l2sOffAnim").fadeIn(750);
                    }
                },
                function(err) {
                    alert(err);
					jQuery('#logs').append('LoadStream ошибка '.err.'<br/>');
                }
            );
            var callmemabe = '1';
            PhoneCallTrap.onCall(function(state) {
				jQuery('#logs').append('Событие звонка '.state.'<br/>');
                console.log("CHANGE STATE: " + state + " " + callmemabe);
                switch (state) {
                    case "RINGING":
                        console.log("Звонят");
                        if (streamer == "2") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        } else if (streamer == "3") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        }
                        callmemabe = '2';

                        break;
                    case "OFFHOOK":
                        console.log("Phone is off-hook");
                        if (streamer == "2") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        } else if (streamer == "3") {
                            $("#l2sOffAnim").fadeOut(750);
                            $my_media.stop();
                            OneclickStop = 3;
                        }
                        callmemabe = '2';
                        break;

                    case "IDLE":
                        console.log("Телефон свободен: " + streamer + " " + callmemabe + " " + OneclickPlay);
                        if (streamer == "1" && callmemabe == '2' && OneclickPlay == "2") {
                            console.log("Восстанавливаем стрим через 3 секунды");
                            setTimeout(function() {
                                console.log("Восстанавливаем стрим");
                                $("#l2sOffAnim").fadeIn(750);
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
ons.ready(function() {
	
	setInterval(function() {
		LoadConfigApp();
	}, 60000);
    
   

    setInterval(function() {
        streamRePlay()
    }, 6000);
    // Sharing


    console.log('Приложение загружено');
    LocalConfig();

		if(typeof screen){
			screen.lockOrientation('portrait');
		};
    $('input:checkbox').change(function() {
        var IdName = $(this).attr('id');
        if (IdName == 'album') {
            $(this).prop('checked')
            var ConfloadAlbum = $("#album").prop('checked');
            localStorage.setItem('ConfloadAlbum', ConfloadAlbum);
        };
    });
    $('input[name="qa"]').change(function() {
        $("input[name='qa']").each(function() {
            if (this.checked == true) {
                console.log(this.value);
                streamQ = this.value;
                localStorage.setItem('StreamQ', streamQ);
            }
        });
    });

    function events(action) {
        switch (action) {
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
            case 'music-controls-media-button':
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


	function volumecurrent(){
		window.plugins.mediaVolume.getVol(
		  function(data){
			var cur = Math.floor((data.current * 100) / data.max);
			jQuery("#volume").val(cur)
		  },
		  function(error){
		});
	}
	volumecurrent();
	setInterval(function() {
        volumecurrent()
    }, 1200);
	
    jQuery("#volume").on('input', function() {
        var volume = jQuery("#volume").val();
        window.plugins.mediaVolume.setVol(volume);
        console.log(volume);
    });
	
    // скрыть плашку загрузки
    //navigator.splashscreen.hide(); 
});

document.addEventListener("init", function(event) {
  if (event.target.id == "RadioRadio") {
		
		document.addEventListener("deviceready", onDeviceReady, false);
		LoadConfigApp();
		LoadStatus();
		LoadStream();
		Loader();
		$('.playbtn').width($('body').width());
		$('.playbtn').height($('body').width());
		$('.buttonSMS').css('bottom', (($('.boxmain').height() * 0.370) + ($('.buttonCall').height() / 2)+'px'));
		$('.buttonCall').css('bottom', (($('.boxmain').height() * 0.370) + ($('.buttonCall').height() / 2)+'px'));
		
		
		
  }
}, false);
var stpl = 0;

function statPlay(){
	stpl = 0;
	/*
	navigator.RADIO.update(function(a) {
		if(a == 'Играет'){
			stpl = 1;
		} else {
			stpl = 0;
		}
	});
	*/
	return stpl;
}

function stat(){
	$.post("http://app.radioradio.ru/stat.php", {
		cordova: device.cordova,
		model: device.model,
		platform: device.platform,
		uuid: device.uuid,
		version: device.version,
		manufacturer: device.manufacturer,
		isVirtual: device.isVirtual,
		serial: device.serial,
		play: statPlay()
	}).done(function(data, statusText, xhr){
	if(xhr.status == 200){
			// Все отлично
		} else {
			// Все отлично
		};
	});
}

document.addEventListener('deviceready', function () {
	if(localStorage.getItem('bg') == 1){
		setTimeout(function() {
			localStorage.setItem('bg', '0');
			navigator.app.exitApp();
		}, 500);
	}
    //cordova.plugins.backgroundMode.enable();
	cordova.plugins.backgroundMode.setDefaults({
		title:  'Радиостанция',
		ticker: 'Радио',
		text:   'Радио',
		resume: true,
		isPublic: true
	});
	cordova.plugins.backgroundMode.onactivate = function() {
		localStorage.setItem('bg', '1');
		setTimeout(function () {
            // Modify the currently displayed notification
            cordova.plugins.backgroundMode.configure({
				title: localStorage.getItem('NowSong'),
                text: localStorage.getItem('NowArtist')
            });
        }, 5000);
	};
	cordova.plugins.backgroundMode.ondeactivate = function() {
		localStorage.setItem('bg', '0');
	};
	setInterval(function() {
	window.plugins.webintent.getUri(function(url) {
		if(url !== "") {
			// url is the url the intent was launched with
		}
	});
	window.plugins.webintent.onNewIntent(function(url) {
		if(url !== "") {
			// url is the url that was passed to onNewIntent
		}
	});
	}, 1000);
	cordova.plugins.backgroundMode.enable();
	stat();
	setInterval(function() {
		stat();
		
		jQuery('#logs').append( checkConnection()+' - тип подключения<br/>');
	}, 15000);
}, false);
function exit(){
	var thisWindow = window.open("index.html",'_self');
	thisWindow.close();
}