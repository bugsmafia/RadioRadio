// Загружаем статус эфира
function LoadStatus() {
    jQuery.getJSON("http://app.radioradio.ru/json.php?i=i", function(data) {
    }).done(function(data) {
		UpdateStatus(data.i);
	}).fail(function() {
		console.log("error");
	})
	        
};
// Обновляем статус эфира
function UpdateStatus(now) {
    if (localStorage.TrackIdNow == now) {} else {
        jQuery.getJSON("http://app.radioradio.ru/json.php?i=l", function(data) {
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
            if (localStorage.getItem('ConfloadAlbum') == 'false') {
				  infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
            } else {               
				console.log('Загрузка изображений альбома отключена.');
                statusBar('icon.png');        
            };
        });
    } 
};

// Каждые 15 секунд запрашиваем статус эфира
setInterval(function() {
    LoadStatus();
    $('#trace').html(window.location.pathname + ' ' + localStorage.TrackIdNow);
}, 15000);
