	var LoveBD = [];
	if (localStorage.getItem('LoveBD')){
		console.log('База любимых треков в наличии');
		LoveBD = JSON.parse(localStorage.getItem('LoveBD'));
	} else {
		// Базы любимых треков нет. создадим
		console.log('Базы любимых треков нет. создадим');
		localStorage.setItem('LoveBD', JSON.stringify(LoveBD));
	}


	function BaseLoveTrack(){
		var LoveTrackP = false;
		var md5Love = localStorage.getItem('NowArtist')+' - '+localStorage.getItem('NowSong');
		md5Love = $.md5(md5Love);
		$.each(LoveBD, function(i, Love) {
			if(Love['md'] == md5Love){
				LoveTrackP = true;
			}
		});
		if(LoveTrackP == true){
			$("#LoveTrackNow i").removeClass("zmdi-favorite-outline").addClass("zmdi-favorite");
		} else {
			$("#LoveTrackNow i").removeClass("zmdi-favorite").addClass("zmdi-favorite-outline");
		}
	}
	
	function DelLoveTrackBase(id){
		LoveBD = JSON.parse(localStorage.getItem('LoveBD'));
		LoveBD.splice(id, 1);
		localStorage.setItem('LoveBD', JSON.stringify(LoveBD));
		LoveBD = JSON.parse(localStorage.getItem('LoveBD'));
		LoadLove('1');
	}
	
	function GoLoveTrackNow(){
		console.log('Добавление в любимые треки. Текущий трек.');
		var md5Love = localStorage.getItem('NowArtist')+' - '+localStorage.getItem('NowSong');
		md5Love = $.md5(md5Love);
		var LoveTrackP = false;
		var maxLove = 0;
		$.each(LoveBD, function(i, Love) {
			if(Love['md'] == md5Love){
				console.log('Трек уже есть в базе любимых');
				LoveTrackP = true;
			}
			maxLove++;
		});
		
		if(LoveTrackP == false){
			var employees = {};
			LoveBD.push({ 
				"md" : md5Love,
				"a"  : localStorage.getItem('NowArtist'),
				"s" : localStorage.getItem('NowSong')
			});
			employees.LoveBD = LoveBD;
			
			console.log('Обновляем базу любимых треков делая запись.');
			localStorage.setItem('LoveBD', JSON.stringify(LoveBD));
			LoveBD = JSON.parse(localStorage.getItem('LoveBD'));
			$("#LoveTrackNow i").removeClass("zmdi-favorite-outline").addClass("zmdi-favorite");
			
			$himg =  'images/no-image.png';
			jQuery('#LoveTrack').prepend('<li class="list__item"  id="LoveId'+maxLove+'"><div class="list__item__left"><img class="list__item__thumbnail" src="'+$himg+'" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+localStorage.getItem("NowSong")+'</div><div class="list__item__subtitle">'+localStorage.getItem("NowArtist")+'</div></div></li>');
			infoCookieNow('LoveTrack', 'LoveId'+maxLove, object.md, object.a, object.s);
		} else {
			$("#LoveTrackNow i").removeClass("zmdi-favorite-outline").addClass("zmdi-favorite");
		}
	}
	
	function LoadLove(code){
		$key = 0;
		if(code == 1){
			jQuery('#LoveTrack').html('');
		}
		jQuery.each(LoveBD, function(key, object){
			if (object.md == 'f574aa2039805a9c1283398934788232'){
			} else {
			$himg =  'images/no-image.png';
			jQuery('#LoveTrack').prepend('<li class="list__item"  id="LoveId'+key+'"><div class="list__item__left"><img class="list__item__thumbnail" src="'+$himg+'" alt="Cute kitten"></div><div class="list__item__center"><div class="list__item__title">'+object.s+'</div><div class="list__item__subtitle">'+object.a+'</div></div><div class="list__item__right"><button class="button--quiet" onclick="DelLoveTrackBase('+key+')"><i class="zmdi zmdi-close"></i></button></div></li>');
			infoCookieNow('LoveTrack', 'LoveId'+key, object.md, object.a, object.s);
			}
		});
	
}
