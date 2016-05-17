$i = 0;
$id = 1;
var voted = false;

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
							jQuery('#full-' + object.id).materialbox();
						}
					}
				});
			});
		}
	});
}
setInterval(function(){
	getinfo();
}, 15000);
getinfo();
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
			.then(menu.close.bind(menu));
	};
});