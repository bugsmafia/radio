function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    return filenameWithExtension;
}

document.addEventListener('init', function(event) {

});

// Функция выполнения кода при загрузки приложения
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
	$('.page__background').html('<div id="gradient2"></div><div id="gradient"></div>');
	
	LoadHot();
	LoadLove();
}
// Функция исполнения когда приложение готово
function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
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
		case "config":
			document.querySelector("#Modal_Config").toggle();
		break;
		case "about":
			document.querySelector("#Modal_About").toggle();
		break;
		case "share":
			document.querySelector("#Modal_Share").toggle();
		break;
	};
} 

// Канал трансляции
var streamChanel = "http://play.radio13.ru/64";


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
		cover: img,
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

			
		} else if (streamer == "2") {
			OneclickStop = 3;
			$my_media.stop();

			
		} else if (streamer == "3") {
			OneclickPlay = 2;
			OneclickStop = 3;
			$my_media.stop();
			
		} else if (streamer == "4") {
			OneclickStop = 2;
			$my_media.play();

			
		};
	}
    
	
	LoadStream();
	function LoadStream() {
		setTimeout(function() {
			$my_media = new PlayStream(streamChanel, function (status){
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



  
	
	jQuery("#volume").on('input', function () {
		var volume = jQuery("#volume").val();
		window.plugins.mediaVolume.setVol(volume);
		console.log(volume);
	});

}); 