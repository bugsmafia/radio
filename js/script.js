$i = 0;
$id = 1;
var voted = false;
// Функция запроса куки

function get_cookie(cookie_name) {
	var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
	if (results)
		return (unescape(results[2]));
	else
		return null;
}
// Получаем куки
function infoCookie(type, id, md, artist, song) {
	if ($.cookie(md)) {
		jQuery('#' + type + ' #' + id + ' img').attr('src', $.cookie(md));
		jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $.cookie(md) + ')');
	} else {
		infoAlbum(type, id, md, artist, song);
	};
}
// Куки трека котоырй играет
function infoCookieNow(id, md, artist, song) {
	if ($.cookie(md)) {
		jQuery('#' + type + ' #' + id + ' img').attr('src', $.cookie(md));
		jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $.cookie(md) + ')');
	} else {
		infoAlbum(type, id, md, artist, song);
	};
}
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
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' img').attr('src', jQuery(this).text());
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							jQuery.cookie(md, $himg, {
								expires: 14,
								path: '/',
								domain: '.radio13.ru'
							});
						} else {
							infoArtist(type, id, md, artist, song);
						};
					};
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
					if (img == "large") {
						if (jQuery(this).text()) {
							$himg = jQuery(this).text();
							jQuery('#' + type + ' #' + id + ' .alb').css('background-image', 'url(' + $himg + ')');
							jQuery.cookie(md, $himg, {
								expires: 7,
								path: '/',
								domain: '.radio13.ru'
							});
						} else {
							$himg = 'images/no-image.png';
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
	if ($.cookie('TrackIdNow') == now) {} else {
		jQuery.getJSON("http://app.radio13.ru/status/json.php?i=l", function(data) {
			StatusAnimation('hide');
			setTimeout(function() {
				jQuery("#playinfo").addClass("show");
				// название трека
				jQuery('.songinfo').text(data.s);
				jQuery('footer .wrap .track .song').text(data.s);
				// артист
				jQuery('.titleinfo').text(data.a);
				jQuery('footer .wrap .track .artist').text(data.a);
				// Обновляет куки
			}, 1000);
			jQuery.cookie('TrackIdNow', data.id, {
				expires: 1,
				path: '/',
				domain: '.radio13.ru'
			});
			infoAlbum('playinfo', 'playinfoimg', 'TrackIdNowImg', data.a, data.s);
			StatusAnimation('show');
		});
	}
}
// Анимация информации о новом треке
function StatusAnimation(type) {
	if (type == 'show') {
		setTimeout(function() {
			jQuery("#playinfo").addClass("show");
		}, 5000);
	} else if (type == 'hide') {
		jQuery("#playinfo").removeClass("show");
	}
}
// Устанавливаем первоначальное значение куки о треке
jQuery.cookie('TrackIdNow', '', {
	expires: 1,
	path: '/',
	domain: '.radio13.ru'
});

function getinfo() {
	$.getJSON("http://app.radio13.ru/status/json.php?i=i", function(info) {
		$i = info.i;
		$l = info.l;
		$u = info.u;
		$sv = parseFloat($l) + parseFloat($u);
		if ($sv != 0) {
			var prc = Math.round(($l * 100) / $sv);
			$('.determinate').width(prc + '%');
		} else {
			$('.determinate').width('0%');
		}
		$('#' + $i + '_likes').text($l);
		$('#' + $i + '_unlikes').text($u);
		if ($i != $id) {
			$.getJSON("http://app.radio13.ru/status/json.php?i=l", function(load) {
				$id = load.id;
				$a = load.a;
				$s = load.s;
				$c = load.c;
				$vkmus = load.vk;
				$('.track .artist').text($a);
				$('.track .song').text($s);
				$('#imgalb').attr('data-caption', $a + ' - ' + $s);
				$('body').attr('id', $id);
				$('.nmbl').attr('id', $id + '_likes');
				$('.nmbu').attr('id', $id + '_unlikes');
				if (voted) reset();
				$.ajax({
					url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=" + $a + "&album=" + $s + "&api_key=88571316d4e244f24172ea9a9bf602fe",
					type: "GET",
					dataType: "xml",
					success: function(xml) {
						$(xml).find('album').each(function() {
							$(this).find('image').each(function() {
								var img = $(this).attr('size');
								if (img == "mega")
									if ($(this).text()) {
										$('#imgalb').attr('src', $(this).text());
										var imgalb2 = $(this).text();
										jQuery('#history').prepend('<div class="collection-item avatar" id="' + $id + '"><img id="full-' + $id + '" src="' + imgalb2 + '" alt="" class="circle materialboxed"><span class="title">' + $a + '</span><p>' + $s + '</p><a href="#!" class="secondary-content"><i class="mdi-action-grade"></i></a></div>');
									} else {
										$('#imgalb').attr('src', 'images/no-image.png');
										var imgalb2 = 'images/no-image.png';
										jQuery('#history').prepend('<div class="collection-item avatar" id="' + $id + '"><img id="full-' + $id + '" src="' + imgalb2 + '" alt="" class="circle materialboxed"><span class="title">' + $a + '</span><p>' + $s + '</p><a href="#!" class="secondary-content"><i class="mdi-action-grade"></i></a></div>');
									}
							})
						});
					},
					statusCode: {
						400: function() {
							$('#imgalb').attr('src', 'images/no-image.png');
							var imgalb2 = 'images/no-image.png';
							jQuery('#history').prepend('<div class="collection-item avatar" id="' + $id + '"><img id="full-' + $id + '" src="' + imgalb2 + '" alt="" class="circle materialboxed"><span class="title">' + $a + '</span><p>' + $s + '</p><a href="#!" class="secondary-content"><i class="mdi-action-grade"></i></a></div>');
						}
					}
				});
			});
		}
	});
}

LoadStatus();
setInterval(function(){
	LoadStatus();
	$('#trace').html(window.location.pathname );
}, 10000);

function titleupdpage(page) {
	if (page == 'home.html') {
		$i = 0;
		$id = 1;
	}
}
var player = new Uppod({
	m: "audio",
	uid: "stream",
	file: '#'
});
var status = 0;

function streamplay() {
	if (status == false) {
		$('.play ons-icon').attr('icon', 'md-stop');
		player.Play('http://play.radio13.ru/aac');
		status = 1;
	} else if (status == true) {
		status = 0;
		$('.play ons-icon').attr('icon', 'md-play');
		player.Play('http://play.radio13.ru/none');
	}
}
ons.ready(function() {
	window.fn = {};
	window.fn.open = function() {
		var menu = document.getElementById('menu');
		menu.open();
	};
	window.fn.load = function(page) {
		var content = document.getElementById('content');
		var menu = document.getElementById('menu');
		content.load(page)
			.then(
				menu.close.bind(menu),
				titleupdpage(page)
			);
	};
	
});