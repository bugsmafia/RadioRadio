



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
				jQuery('.song').text(data.s);
				// артист
				jQuery('.titleinfo').text(data.a);
				jQuery('.artist').text(data.a);
				// Обновляет куки
			}, 1000);
			localStorage.setItem('TrackIdNow', data.id);
		});
	}
}
// Анимация информации о новом треке
function StatusAnimation(type) {
	if (type == 'show') {
		setTimeout(function() {
			jQuery("#playinfo").addClass("show");
		}, 20000);
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
}, 15000);


var status = 0;


Player();
function Player(){
	vars={"m":"audio","file":"#","uid":"stream","addcontrols":"start"};
	player = new Uppod(vars);
	document.getElementById('stream').addEventListener('init',onInit,false);
	
	document.getElementById('stream').addEventListener('start',onStart,false);
	document.getElementById('stream').addEventListener('stop',onStop,false);
	
	document.getElementById('stream').addEventListener('play',onPlay,false);
	document.getElementById('stream').addEventListener('pause',onPause,false);
	
	document.getElementById('stream').addEventListener('end',onEnd,false);
	document.getElementById('stream').addEventListener('error',onError,false);
}
var player;
player.start = false;
player.stop = false;
player.pause = false;
// Загрузился ли плеер?
function onInit(e){
	player.init = true;
}
// Команда старт.
function onStart(e){
	player.start = true;
	player.stop = false;
	player.pause = false;
}
// Получена команда стоп.
function onStop(e){
	player.stop = true;
	player.start = false;
}

function onPlay(e){
	player.start = true;
	$('#play i').attr('class', 'zmdi zmdi-stop');
}

function onPause(e){
	player.start = false;
	player.pause = true;
	$('#play i').attr('class', 'zmdi zmdi-play');
}
function onEnd(e){

}
function onError(e){

}

var url = 'http://play.radio13.ru/aac';
var streamer = 1;
var my_media = new PlayStream(url,
    function (status){
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

function streamplay() {
	alert('Нажали плей');
	if (streamer == "1") {
		alert('включаем 1 поток');
		//player.Play('http://play.radio13.ru/mp3');
		my_media.play();
	};
	if (streamer == "2") {
		alert('останавливаем 2 поток');
		//player.Play('http://play.radio13.ru/mp3');
		my_media.stop();
	};
	if (streamer == "3") {
		alert('останавливаем 3 поток');
		my_media.stop();
	};


}
setInterval(function(){
	if(player.stop == false && player.pause == true){
		console.log('ПЕРЕЗАПУСКАЙ!');
		player.Play('http://play.radio13.ru/mp3');
	}
}, 500);

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
	
	
	
	



});