// Шарим треки
function ShareTrack() {
    var textShare = 'Отличная музыка: ' + localStorage.NowSong + ' - ' + localStorage.NowArtist + '.\n Присоединяйся к RadioRadio!\n #радиорадио #музыка #онлайн';
    modals('share');
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
        var files = localStorage.TrackIdNowImgMega;
    } else {
        var files = 'icon.png';
    };
    var ShareData = {
        message: textShare,
        subject: 'Мне нравится!',
        files: [files],
        url: 'http://radioradio.ru',
        chooserTitle: 'Поделись треком!'
    }
    var onSuccess = function(result) {
        modals('share');
    }
    var onError = function(msg) {
        console.log("Ошибка: " + msg);
        modals('share');
    }
    window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}

function ShareRadioRadio() {
    var textShare = 'Присоединяйся к RadioRadio!\n https://vk.com/radioradioru \nhttps://www.facebook.com/radioradioru\n#радиорадио #музыка #онлайн';
    modals('share');
    var files = 'icon.png';
    var ShareData = {
        message: textShare,
        subject: 'Мне нравится!',
        files: [files],
        url: 'https://radioradio.ru/',
        chooserTitle: 'Поделись треком!'
    }
    var onSuccess = function(result) {
        modals('share');
    }
    var onError = function(msg) {
        console.log("Ошибка: " + msg);
        modals('share');
    }
    window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}


function SmsSend(mess, phone) {
    ons.notification.confirm('Услуга платная').then(
        function(answer) {
            if (answer === 1) {
                var SmsData = {
                    phoneNumber: phone,
                    textMessage: mess
                };
                sms.sendMessage(SmsData, function(message) {
                    console.log("success: " + message);
                }, function(error) {
                    console.log("code: " + error.code + ", message: " + error.message);
                });
                ons.notification.alert('Сообщение успешно отправлено!');
            }
        }
    );
}