// ����� �����
function ShareTrack() {
    var textShare = '�������� ������: ' + localStorage.NowSong + ' - ' + localStorage.NowArtist + '.\n ������������� � RadioRadio!\n #���������� #������ #������';
    modals('share');
    if (localStorage.getItem('ConfloadAlbum') == 'false') {
        var files = localStorage.TrackIdNowImgMega;
    } else {
        var files = 'icon.png';
    };
    var ShareData = {
        message: textShare,
        subject: '��� ��������!',
        files: [files],
        url: 'http://radioradio.ru',
        chooserTitle: '�������� ������!'
    }
    var onSuccess = function(result) {
        modals('share');
    }
    var onError = function(msg) {
        console.log("������: " + msg);
        modals('share');
    }
    window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}

function ShareRadioRadio() {
    var textShare = '������������� � RadioRadio!\n https://vk.com/radioradioru \nhttps://www.facebook.com/radioradioru\n#���������� #������ #������';
    modals('share');
    var files = 'icon.png';
    var ShareData = {
        message: textShare,
        subject: '��� ��������!',
        files: [files],
        url: 'https://radioradio.ru/',
        chooserTitle: '�������� ������!'
    }
    var onSuccess = function(result) {
        modals('share');
    }
    var onError = function(msg) {
        console.log("������: " + msg);
        modals('share');
    }
    window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}


function SmsSend(mess, phone) {
    ons.notification.confirm('������ �������').then(
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
                ons.notification.alert('��������� ������� ����������!');
            }
        }
    );
}