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

function SocialShare(a, s) {
	var textShare = 'Отличная музыка: '+s+' - '+a+'. Присоединяйся к Радио13! #радио #музыка #онлайн';
	//modals('share');
	var md5Love = a+' - '+s;
	md5Love = $.md5(md5Love);
	var dataalb = JSON.parse(localStorage.getItem(md5Love));
	var urlimages = '';
	if(dataalb.mega){
		urlimages = dataalb.mega;
	} else if (dataalb.extralarge){
		urlimages = dataalb.extralarge;
	}

	var ShareData = {
		message: textShare,
		subject: 'Мне нравится!',
		files: urlimages,
		url: 'https://app.radio13.ru',
		chooserTitle: 'Поделись треком!'
	}
	var onSuccess = function(result) {
	  modals('share');
	}
	var onError = function(msg) {
	  console.log("Ошибка: " + msg);
	}

}