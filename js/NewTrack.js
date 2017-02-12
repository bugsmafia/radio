function LoadNewTrack(){
	$key = 0;
	//jQuery('#newtrack').html('').attr('class', '');
	$himg =  'images/no-image.png';
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=new", function(data) {
		jQuery.each(data, function(key, object){				
			jQuery('#newtrack').append('<li class="list__item" id="'+object.id+'"><div class="list__item__left"><img class="list__item__thumbnail" src="'+$himg+'" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+object.song+'</div><div class="list__item__subtitle">'+object.artist+'</div></div><div class="list__item__right"><button class="button--quiet" onclick="SocialShare(\''+object.artist+'\', \''+object.song+'\', \''+object.id+'\')"><i class="zmdi zmdi-share"></i></button></div></li>');
			infoCookieNow('newtrack', object.id, object.md, object.artist, object.song);
		});

	});		
}