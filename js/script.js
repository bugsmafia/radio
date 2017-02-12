function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension;
}
function exit(){
	var thisWindow = window.open("index.html",'_self');
	thisWindow.close();
}
document.addEventListener('init', function(event) {

});
var showDialog = function(id) { document.getElementById(id).show();};
var hideDialog = function(id) {  document.getElementById(id).hide();};
// Функция выполнения кода при загрузки приложения
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("deviceready", StatusBarGo, false);
	$('.page__background').html('<div id="gradient2"></div><div id="gradient"></div>');
	
	LoadHot();
	LoadLove();
	
	 // Установка чека в настройки качества стрима
	if(localStorage.getItem('StreamQ')){
		if(localStorage.getItem('StreamQ') == '32'){
			$("#StreamQ32" ).prop("checked", true );
		}
		if(localStorage.getItem('StreamQ') == '64'){
			$("#StreamQ64" ).prop("checked", true );
		}
		if(localStorage.getItem('StreamQ') == '128'){
			$("#StreamQ128" ).prop("checked", true );
		}
		if(localStorage.getItem('StreamQ') == 'auto'){
			$("#StreamQAuto" ).prop("checked", true );
		}
		
		
	} else {
		$("#StreamQAuto" ).prop("checked", true );
	}
}
// Функция исполнения когда приложение готово
function onDeviceReady() {	
	if(localStorage.getItem('bg') == 1){
			localStorage.setItem('bg', '0');
			navigator.app.exitApp();
	}
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
	setTimeout(function() {
		BgMode();
	}, 2000);
	
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
// Вызов модальных окон
function modals(name) {
	switch (name) {
		case "PolitConf":
			document.querySelector("#Modal_PolitConf").toggle();
		break;
		case "about":
			document.querySelector("#Modal_About").toggle();
		break;
		case "share":
			document.querySelector("#Modal_Share").toggle();
		break;
	};
} 




function infoCookie(type, id, md, artist, song){
	if(localStorage.getItem(md)){
		var images = jQuery.parseJSON(localStorage.getItem(md));
		jQuery('#'+type+' #'+id+' img').attr('src', images.extralarge);
		jQuery('#'+type+' #'+id+' .alb').css('background-image', 'url('+images.extralarge+')');
	} else {
		infoAlbum(type, id, md, artist, song);
	};
}
function infoCookieNow(type, id, md, artist, song){
	if(localStorage.getItem(md)){
		var images = jQuery.parseJSON(localStorage.getItem(md));
		jQuery('#'+type+' #'+id+' img').attr('src', images.extralarge);
		jQuery('#'+type+' #'+id+' .alb').css('background-image', 'url('+images.extralarge+')');
	} else {
		infoAlbum(type, id, md, artist, song);
	};
}


// Тянем информацию об альбоме
function infoAlbum(type, id, md, artist, song){
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.getJSON( "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist="+artist+"&track="+song+"&format=json&autocorrect=1&api_key="+api, function(load) {

	})
	.done(function(load) {
		if(load.error){
			console.log( "Ошибка: "+load.error+" - "+load.message);
			infoArtist(type, id, md, artist, song);
		} else {
			var images = {};
			if(load.track.album){
				if(load.track.album.image){
					$.each(load.track.album.image, function(i, image) {
						images[image.size] = image['#text'];
					});
					localStorage.setItem(md, JSON.stringify(images));
					var urlimages = '';
					if(images.mega){
						urlimages = images.mega;
					} else if (images.extralarge){
						urlimages = images.extralarge;
					}
					var sync = ContentSync.sync({
						src: urlimages,
						id: 'mega-'+md
					});
					jQuery('#LoadAlbImg').show();
					sync.on('progress', function(data) {
						jQuery('#LoadAlbImg .progress-bar__primary').css('width', data.progress+'%')
					});
					sync.on('complete', function(data) {
						// data.localPath
						jQuery('#LoadAlbImg .progress-bar__primary').css('width', '100%');
						jQuery('#'+type+' #'+id+' .alb').css('background-image', 'url('+data.localPath+')');
						jQuery('#'+type+' #'+id+' img').attr('src', data.localPath);
						
						setTimeout(function() {
							jQuery('#LoadAlbImg').hide();
							jQuery('#LoadAlbImg .progress-bar__primary').css('width', '0%');
						}, 1000);
					});
					//jQuery('#'+type+' #'+id+' img').attr('src', images.extralarge);
					//jQuery('#'+type+' #'+id+' .alb').css('background-image', 'url('+images.extralarge+')');
				} else {
					console.log( "Малая обложка отсутствует к треку, отправляем запрос на получение обложки исполнителя" );
					infoArtist(type, id, md, artist, song);
				}
			} else {
				console.log( "Малая обложка отсутствует к треку, отправляем запрос на получение обложки исполнителя" );
				infoArtist(type, id, md, artist, song);
			}
		}
	})
	.fail(function() {
		console.log( "Ошибка в получении ответа от сервера, отправляем запрос на получение обложки исполнителя" );
		infoArtist(type, id, md, artist, song);
	})
	.always(function() {
		console.log( "always complete" );
	});	
}
function infoArtist(type, id, md, artist, song){
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.getJSON( "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist="+artist+"&format=json&autocorrect=1&api_key="+api, function(load) {
		console.log("Данные об артисте получены");
	})
	.done(function(load) {
		var images = {};
		if(load.artist.image){
			if(load.artist.image){
				$.each(load.artist.image, function(i, image) {
					images[image.size] = image['#text'];
				});
				localStorage.setItem(md, JSON.stringify(images));
				var urlimages = '';
				if(images.mega){
					urlimages = images.mega;
				} else if (images.extralarge){
					urlimages = images.extralarge;
				}
				var sync = ContentSync.sync({
					src: urlimages,
					id: 'mega-'+md
				});
				
				jQuery('#LoadAlbImg').show();
				sync.on('progress', function(data) {
					jQuery('#LoadAlbImg .progress-bar__primary').css('width', data.progress+'%')
				});
				sync.on('complete', function(data) {
						// data.localPath
					jQuery('#LoadAlbImg').css('width', '100%');
					jQuery('#'+type+' #'+id+' .alb').css('background-image', 'url('+data.localPath+')');
					jQuery('#'+type+' #'+id+' img').attr('src', data.localPath);
						
					setTimeout(function() {
						jQuery('#LoadAlbImg .progress-bar__primary').hide();
						jQuery('#LoadAlbImg .progress-bar__primary').css('width', '0%');
					}, 1000);
				});
				
				//jQuery('#'+type+' #'+id+' img').attr('src', images.extralarge);
				//jQuery('#'+type+' #'+id+' .alb').css('background-image', 'url('+images.extralarge+')');
			} else {
				console.log( "Обложка артиста отсутствует" );
			}
		}
	})
	.fail(function() {
		console.log( "Ошибка в получении обложки артиста от сервера" );
	})
	.always(function() {
		console.log( "always complete" );
	});	
}
function BiginfoAlbum(type, id, md, artist, song){
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.getJSON( "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist="+artist+"&track="+song+"&format=json&autocorrect=1&api_key="+api, function(load) {
	})
	.done(function(load) {
		if(load.error){
			console.log( "Ошибка: "+load.error+" - "+load.message);
			BiginfoArtist(type, id, md, artist, song, 'error');
		} else {
			console.log("Обработка данных для Большой обложки трека");
			var images = {};
			if(load.track.album){

				if(load.track.album.image){

					$.each(load.track.album.image, function(i, image) {
						images[image.size] = image['#text'];
					});
					localStorage.setItem(md, JSON.stringify(images));
					var urlimg = '/';
					if(images.mega){
						urlimg = images.mega;
					} else {
						if(images.extralarge){
							urlimg = images.extralarge;
						} else {
							urlimg = images.large;
						}
					}
					jQuery('#'+type+' #'+id+' img').attr('src', urlimg);
					jQuery('#'+type+' .images').css('background-image', 'url('+images.mega+')');
				} else {
					console.log( "1 Обложка отсутствует к треку, отправляем запрос на получение обложки исполнителя" );
					BiginfoArtist(type, id, md, artist, song, 'BiginfoAlbum');
				}
			} else {
				console.log( "2 Обложка отсутствует к треку, отправляем запрос на получение обложки исполнителя" );
				BiginfoArtist(type, id, md, artist, song, 'BiginfoAlbum');
			}
		}
	})
	.fail(function() {
		console.log( "Ошибка в получении ответа от сервера, отправляем запрос на получение обложки исполнителя" );
		BiginfoArtist(type, id, md, artist, song, 'BiginfoAlbum');
	})
	.always(function() {
		console.log( "always complete" );
	});	
}

function BiginfoArtist(type, id, md, artist, song, is){
	var api = '88571316d4e244f24172ea9a9bf602fe';
	jQuery.getJSON( "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist="+artist+"&format=json&autocorrect=1&api_key="+api, function(load) {
	})
	.done(function(load) {
		var images = {};
		if(load.artist.image){
			if(load.artist.image){
				$.each(load.artist.image, function(i, image) {
					images[image.size] = image['#text'];
				});
				localStorage.setItem(md, JSON.stringify(images));
				jQuery('#'+type+' #'+id+' img').attr('src', images.mega);
				jQuery('#'+type+' .images').css('background-image', 'url('+images.mega+')');
			} else {
				console.log( "Обложка артиста отсутствует" );
			}
		}
	})
	.fail(function() {
		console.log( "Ошибка в получении обложки артиста от сервера" );
	})
	.always(function() {
		if(id == "parallax"){
			$('.parallax').parallax();
		}
		console.log( "always complete" );
	});	
}
// Загружаем статус эфира
function LoadStatus() {
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=i", function(data) {
		UpdateStatus(data.i);
	});
}

function LoadHistory(){
	$key = 0;
	//jQuery('#newtrack').html('').attr('class', '');
	$himg =  'images/no-image.png';
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=new", function(data) {
		jQuery.each(data, function(key, object){				
			jQuery('#newtrack').append('<li class="list__item" id="'+object.id+'"><div class="list__item__left"><img class="list__item__thumbnail" src="'+$himg+'" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+object.song+'</div><div class="list__item__subtitle">'+object.artist+'</div></div></li>');
			infoCookieNow('newtrack', object.id, object.md, object.artist, object.song);
		});

	});		
}




// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');
LoadStatus();


LoadHistory();

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
				
				// Проверим, является ли любимым
				BaseLoveTrack();
			}, 2000);
			localStorage.setItem('TrackIdNow', data.id);
			localStorage.setItem('TrackIdBaseNow', data.c);
			var md = data.a+' - '+data.s;
			md = $.md5(md);
			infoAlbum('playinfo', 'playinfoimg', md, data.a, data.s);
			
			
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
		cover: 'icon.png',
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







	
	
	
	var streamer = 1;
	var OneclickPlay = 1;
	var OneclickStop = 1;
	// Функция кнопки ПЛЕЙ основной
	function streamplay() {
		$("#LoadStream").show();
		if (streamer == "1") {
			OneclickStop = 2;
			$my_media.play();
			MusicControls.updateIsPlaying(true);
			MusicControls.updateDismissable(true);
			
		} else if (streamer == "2") {
			OneclickStop = 3;
			$my_media.stop();
			MusicControls.updateIsPlaying(false);
			MusicControls.updateDismissable(false);

			
		} else if (streamer == "3") {
			OneclickPlay = 2;
			OneclickStop = 3;
			$my_media.stop();
			MusicControls.updateIsPlaying(false);
			MusicControls.updateDismissable(false);
			
		} else if (streamer == "4") {
			OneclickStop = 2;
			$my_media.play();
			MusicControls.updateIsPlaying(true);
			MusicControls.updateDismissable(true);
			
		};
	}
   
	function GetStreamQ(Q){
		if(Q){
			if(Q == '32'){
				localStorage.setItem('StreamQ', Q);
			}
			if(Q == '64'){
				localStorage.setItem('StreamQ', Q);
			}
			if(Q == '128'){
				localStorage.setItem('StreamQ', Q);
			}
			if(Q == 'auto'){
				localStorage.setItem('StreamQ', Q);
			}
		} else {
			localStorage.setItem('StreamQ', 'auto');
		}
		LoadStream();
	}
	// Канал трансляции
	function streamChanel() {
		var chanel = "http://play.radio13.ru/64";
		if(localStorage.getItem('StreamQ')){
			if(localStorage.getItem('StreamQ') == '32'){
				chanel = "http://play.radio13.ru/32";
				return chanel;
			}
			if(localStorage.getItem('StreamQ') == '64'){
				chanel = "http://play.radio13.ru/64";
				return chanel;
			}
			if(localStorage.getItem('StreamQ') == '128'){
				chanel = "http://play.radio13.ru/64";
				return chanel;
			}
			if(localStorage.getItem('StreamQ') == 'auto'){
				chanel = "http://play.radio13.ru/64";
				return chanel;
			}
		} else {
			localStorage.setItem('StreamQ', 'auto');
			chanel = "http://play.radio13.ru/64";
			return chanel;
		}		
	}
	
	LoadStream();
	function LoadStream() {
		setTimeout(function() {
			$my_media = new PlayStream(streamChanel(), function (status){
					console.log("status - "+status);
					if(status === PlayStream.MEDIA_STOPPED){
						console.log('stopped');
						MusicControls.updateIsPlaying(false);
						streamer = 1;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').removeClass('active');
						$("#LoadStream").hide();
					}
					if(status === PlayStream.MEDIA_STARTING){
						console.log('starting');
						MusicControls.updateIsPlaying(true);
						streamer = 2;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').addClass('active');
						$("#LoadStream").show();
					}
					if(status === PlayStream.MEDIA_RUNNING){
						console.log('running');
						MusicControls.updateIsPlaying(true);
						streamer = 3;
						$('#play i').attr('class', 'zmdi zmdi-stop');
						$('#play').addClass('active');
						$("#LoadStream").hide();
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

function streamRePlayGO(){
	setTimeout(function() {
		console.log("Восстанавливаем стрим");
		$('#play i').attr('class', 'zmdi zmdi-play');
		$('#play').addClass('active');
		$my_media.play();
	}, 100);
};
function streamRePlay(){
	if(navigator){
		console.log(navigator.connection.type+' '+streamer+' '+OneclickStop+' '+OneclickPlay);
		if(navigator.connection.type != 'none' && streamer == "1" && OneclickStop == "2"){
			console.log('Сработали условия для перезапуска стрима!');
			streamRePlayGO();
		};	
	}
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
	if(!MusicControls){
		MusicControls.subscribe(events);
		MusicControls.listen();
	}

	window.youtube.init("AIzaSyDK0GC82T_MbUt_4LKTUEdrK3QQ8ORUH_0");

}); 