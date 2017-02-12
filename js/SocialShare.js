// Шарим треки
function ShareTrack() {
	var textShare = 'Отличная музыка: '+localStorage.NowSong+' - '+localStorage.NowArtist+'. Присоединяйся к Радио13! #радио #музыка #онлайн';
	modals('share');
	var ShareData = {
		message: textShare,
		subject: 'Мне нравится!',
		url: 'http://radio13.ru/track/'+localStorage.TrackIdBaseNow,
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

function SocialShare(a, s, id) {
	var textShare = 'Трек из ТОП 13: '+s+' - '+a+'. Присоединяйся к Радио13! #радио #музыка #онлайн';
	modals('share');
		var ShareData = {
			message: textShare,
			subject: 'Мне нравится!',
			url: 'http://radio13.ru/track/'+id,
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