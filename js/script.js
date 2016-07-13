

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
				trackinfoload();
			}, 1000);
			localStorage.setItem('TrackIdNow', data.id);
		});
	}
}
function trackinfoload(){
		var options = {
			message: 'На "Радио13" сейчас играет: '+localStorage.NowSong+' '+localStorage.NowArtist,
			subject: 'Мне нравится!',
			files: [localStorage.TrackIdNowImgM],
			url: 'https://radio13.ru',
			chooserTitle: 'Поделись треком!'
		}
		var onSuccess = function(result) {
			cancelled (result.completed=false)
		}
		var onError = function(msg) {
		}
		function ShareTrack() {
			window.plugins.socialsharing.shareWithOptions(options);
		}
	alert('информация о треке загружена');
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
		}, 2000);
	}

// Sharing

ons.ready(function() {

});
$( document ).ready(function() {
	
});