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
                            localStorage.setItem(md + 'Small', $himg);
                        }
                    };
                    if (img == "medium") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Medium', $himg);
                        }
                    };
                    if (img == "large") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Large', $himg);
                        }
                    };
                    if (img == "extralarge") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();

                            localStorage.setItem(md + 'Extralarge', $himg);
                        }
                    }
                    if (img == "mega") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Mega', $himg);
                        } else {
                            infoArtist(type, id, md, artist, song);
                        }
                    }
                })
            });

            var ImgCashSmall = ContentSync.sync({
                src: localStorage.TrackIdNowImgSmall,
                id: 'small/' + getPageName(localStorage.TrackIdNowImgSmall),
                type: 'local'
            });
            var ImgCashMedium = ContentSync.sync({
                src: localStorage.TrackIdNowImgMedium,
                id: 'medium/' + getPageName(localStorage.TrackIdNowImgMedium),
                type: 'local'
            });
            var ImgCashLarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgLarge,
                id: 'large/' + getPageName(localStorage.TrackIdNowImgLarge),
                type: 'local'
            });
            var ImgCashExtralarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgExtralarge,
                id: 'extralarge/' + getPageName(localStorage.TrackIdNowImgExtralarge),
                type: 'local'
            });
            var ImgCashMega = ContentSync.sync({
                src: localStorage.TrackIdNowImgMega,
                id: 'mega/' + getPageName(localStorage.TrackIdNowImgMega),
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
				console.log('Ларге - отправим в бар');
                console.log(data.localPath);
                console.log(data.cached);
				ContentSync.loadUrl('file://' + data.localPath, function() {
					if (data.localPath) {
						statusBar(data.localPath);
						console.log('Ларге - отправили в бар Готово');
					}
				});
                
            });
            ImgCashExtralarge.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
                if (data.localPath) {
					console.log(data.localPath);
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
				statusBar('icon.png');
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
                            localStorage.setItem(md + 'Small', $himg);
                        }
                    };
                    if (img == "medium") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Medium', $himg);
                        }
                    };
                    if (img == "large") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Large', $himg);
                        };
                    };
                    if (img == "extralarge") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Extralarge', $himg);
                        }
                    }
                    if (img == "mega") {
                        if (jQuery(this).text()) {
                            $himg = jQuery(this).text();
                            localStorage.setItem(md + 'Mega', $himg);
                        }
                    }
                })
            });

            var ImgCashSmall = ContentSync.sync({
                src: localStorage.TrackIdNowImgSmall,
                id: 'small/' + getPageName(localStorage.TrackIdNowImgSmall),
                type: 'local'
            });
            var ImgCashMedium = ContentSync.sync({
                src: localStorage.TrackIdNowImgMedium,
                id: 'medium/' + getPageName(localStorage.TrackIdNowImgMedium),
                type: 'local'
            });
            var ImgCashLarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgLarge,
                id: 'large/' + getPageName(localStorage.TrackIdNowImgLarge),
                type: 'local'
            });
            var ImgCashExtralarge = ContentSync.sync({
                src: localStorage.TrackIdNowImgExtralarge,
                id: 'extralarge/' + getPageName(localStorage.TrackIdNowImgExtralarge),
                type: 'local'
            });
            var ImgCashMega = ContentSync.sync({
                src: localStorage.TrackIdNowImgMega,
                id: 'mega/' + getPageName(localStorage.TrackIdNowImgMega),
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
				console.log('Ларге - отправим в бар');
                console.log(data.localPath);
                console.log(data.cached);
				ContentSync.loadUrl('file://' + data.localPath, function() {
					if (data.localPath) {
						statusBar(data.localPath);
						console.log('Ларге - отправили в бар Готово');
					}
				});
                
            });
            ImgCashExtralarge.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
            ImgCashMega.on('complete', function(data) {
                console.log(data.localPath);
                console.log(data.cached);
            });
        },
        statusCode: {
            400: function() {
				statusBar('icon.png'); 				
			}
        }
    });
}