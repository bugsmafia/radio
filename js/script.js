(function ($) {
    'use strict';
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;                        
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }
    
    $.md5 = function (string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            } else {
                return raw_md5(string);
            }
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        } else {
            return raw_hmac_md5(key, string);
        }
    };
    
}(typeof jQuery === 'function' ? jQuery : this));


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
					console.log('mega-'+md);
					var sync = ContentSync.sync({
						src: images.mega,
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
				console.log('mega-'+md);
				var sync = ContentSync.sync({
					src: images.mega,
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
function LoadHot(){
	$key = 0;
	//jQuery('#hottrack').html('').attr('class', '');
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=hot", function(data) {
		jQuery.each(data, function(key, object){
			if (object.md == 'f574aa2039805a9c1283398934788232'){
			} else {
			$himg =  'images/no-image.png';
			jQuery('#hottrack').append('<li class="list__item"  id="'+object.id+'"><div class="list__item__left"><img class="list__item__thumbnail" src="http://placekitten.com/g/40/40" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+object.song+'</div><div class="list__item__subtitle">'+object.artist+'</div></div></li>');
			infoCookieNow('hottrack', object.id, object.md, object.artist, object.song);
			}
		});

	});		
}
function LoadHistory(){
	$key = 0;
	//jQuery('#newtrack').html('').attr('class', '');
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=new", function(data) {
		jQuery.each(data, function(key, object){				
			jQuery('#newtrack').append('<li class="list__item" id="'+object.id+'"><div class="list__item__left"><img class="list__item__thumbnail" src="http://placekitten.com/g/40/40" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+object.song+'</div><div class="list__item__subtitle">'+object.artist+'</div></div></li>');
			infoCookieNow('newtrack', object.id, object.md, object.artist, object.song);
		});

	});		
}
// Устанавливаем первоначальное значение куки о треке
localStorage.setItem('TrackIdNow', '');
LoadStatus();
LoadHot();
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