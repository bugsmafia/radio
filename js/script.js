
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
	$('.page__background').html('<div id="gradient2"></div><div id="gradient"></div>');
}

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
}


function onBackKeyDown() {
	$my_media.stop();
	ons.notification.confirm('Закрыть радио?').then(
		function(answer) {
		  if (answer === 1) {
				console.log('закрывается');
		  }
		}
	);
}
function onPause() {
	
}

function onResume() {

} 

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


var streamChanel = "http://play.radio13.ru/aac";

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
							localStorage.setItem(md+'S', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							localStorage.setItem(md+'L', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'E', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					}
				})
			});
		},
		statusCode: {
			400: function() {
				infoArtist(type, id, md, artist, song);
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
							localStorage.setItem(md+'S', $himg);
						}
					};
					if (img == "medium") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					};
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							localStorage.setItem(md+'L', $himg);
						} else {
							infoArtist(type, id, md, artist, song);
						}
					};
					if (img == "extralarge") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'E', $himg);
						}
					}
					if (img == "mega") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							localStorage.setItem(md+'M', $himg);
						}
					}
				})
			});
		},
		statusCode: {
			400: function() {}
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
				statusBar();
			}, 2000);
			localStorage.setItem('TrackIdNow', data.id);
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
		}); 
	}
}

var Playing = false;
function statusBar(){
	if(streamer == "1"){
		Playing = false;
	} else {
		Playing = true;
	};
	MusicControls.create({
		track: localStorage.NowSong,
		artist: localStorage.NowArtist,
		cover: localStorage.TrackIdNowImgE,
		isPlaying: Playing,
		
		dismissable : true,
		hasPrev: false,
		hasNext: false,
		hasClose: false, 
		ticker: 'Now playing "Time is Running Out"'
	}, onSuccess, onError);
}

var onSuccess = function(result) {
	cancelled (result.completed=false)
}
var onError = function(msg) {}
function ShareTrack() {
	modals('share');
	var ShareData = {
		message: 'На "Радио13" сейчас играет: '+localStorage.NowSong+' '+localStorage.NowArtist,
		subject: 'Мне нравится!',
		files: [localStorage.TrackIdNowImgM],
		url: 'https://radio13.ru',
		chooserTitle: 'Поделись треком!'
	}
	var onSuccess = function(result) {
	  modals('share');
	}

	var onError = function(msg) {
	  console.log("Sharing failed with message: " + msg);
	}
	
	window.plugins.socialsharing.shareWithOptions(ShareData, onSuccess, onError);
}


// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');
LoadStatus();
setInterval(function(){
	LoadStatus();
	$('#trace').html(window.location.pathname+' '+localStorage.TrackIdNow);
	
	checkConnection();
}, 15000);



	
	var volume = 100;
	jQuery("#volume").val(volume);
	jQuery("#volume").on('input', function () {
		var volume = jQuery("#volume").val();
		volume = volume / 100;
		player.Volume(volume);
	});
	
	
	var streamer = 1;
	var OneclickPlay = 1;
	function streamplay() {
		OneclickPlay = 2;
		
		if (streamer == "1") {
			$my_media.play();
		} else if (streamer == "2") {
			$my_media.stop();
		} else if (streamer == "3") {
			$my_media.stop();
		} else if (streamer == "4") {
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
					}
					if(status === PlayStream.MEDIA_STARTING){
						console.log('starting');
						MusicControls.updateIsPlaying(true);
						streamer = 2;
						$('#play i').attr('class', 'zmdi zmdi-play');
						$('#play').addClass('active');
					}
					if(status === PlayStream.MEDIA_RUNNING){
						console.log('running');
						MusicControls.updateIsPlaying(true);
						streamer = 3;
						$('#play i').attr('class', 'zmdi zmdi-stop');
						$('#play').addClass('active');
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
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
						}
						callmemabe = '2';

						break;
					case "OFFHOOK":
						console.log("Phone is off-hook");
						 if (streamer == "2") {
							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
						} else if (streamer == "3") {

							$('#play i').attr('class', 'zmdi zmdi-play');
							$('#play').removeClass('active');
							$my_media.stop();
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
							}, 3000);
						};
						break;
				}
			});
			$my_media.stop();
		}, 2000);
	}


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
			$my_media.stop();
            break;
        case 'music-controls-play':
            console.log('Плей');
			$my_media.play();
            break;
        case 'music-controls-destroy':
            console.log('Удалено');
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
MusicControls.subscribe(events);
MusicControls.listen();



    var colors = new Array(
      [255,152,0],
      [240, 238, 233],
      [145, 167, 208],
      [168, 176, 174]);

    var step = 0;
    var colorIndices = [0,1,2,3];
    var gradientSpeed = 0.002;

    function updateGradient() {
      var c0_0 = colors[colorIndices[0]];
      var c0_1 = colors[colorIndices[1]];
      var c1_0 = colors[colorIndices[2]];
      var c1_1 = colors[colorIndices[3]];

      var istep = 1 - step;
      var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      var color1 = "#"+((r1 << 16) | (g1 << 8) | b1).toString(16);

      var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      var color2 = "#"+((r2 << 16) | (g2 << 8) | b2).toString(16);

        $('#gradient').css({background: "-webkit-radial-gradient(80% 10%, circle, "+color1+", transparent), -webkit-radial-gradient(80% 50%, circle, "+color2+", transparent)"});
        
        step += gradientSpeed;
        if ( step >= 1 )
        {
          step %= 1;
          colorIndices[0] = colorIndices[1];
          colorIndices[2] = colorIndices[3];
          colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
          colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
          
        }
    } setInterval(updateGradient,10);

}); 