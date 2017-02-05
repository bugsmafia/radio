function LoadHot(){
	$key = 0;
	//jQuery('#hottrack').html('').attr('class', '');
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=hot", function(data) {
		jQuery.each(data, function(key, object){
			if (object.md == 'f574aa2039805a9c1283398934788232'){
			} else {
			$himg =  'images/no-image.png';
			jQuery('#hottrack').append('<li class="list__item"  id="'+object.id+'"><div class="list__item__left"><img class="list__item__thumbnail" src="'+$himg+'" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+object.song+'</div><div class="list__item__subtitle">'+object.artist+'</div></div><div class="list__item__right"><button class="button--quiet" onclick="SocialShare(\''+object.artist+'\', \''+object.song+'\')"><i class="zmdi zmdi-share"></i></button></li>');
			infoCookieNow('hottrack', object.id, object.md, object.artist, object.song);
			}
		});

	});		
}