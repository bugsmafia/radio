

function StatusBarEvents(action) {
    switch(action) {
        case 'music-controls-pause':
            OneclickStop = 3;
			$my_media.stop();
			MusicControls.updateIsPlaying(false);
			MusicControls.updateDismissable(false);
            break;
        case 'music-controls-play':
            // Нажат Плей
			OneclickStop = 2;
			$my_media.play();
			MusicControls.updateIsPlaying(true);
			MusicControls.updateDismissable(true);
            break;
        case 'music-controls-destroy':
            OneclickStop = 3;
			$my_media.stop();
			MusicControls.updateIsPlaying(false);
			MusicControls.updateDismissable(false);
            break;

        // Headset events (Android only)
        // All media button events are listed below
        case 'music-controls-media-button' :
            // Do something
			console.log('music-controls-media-button');
            break;
        case 'music-controls-headset-unplugged':
            // Do something
			console.log('music-controls-headset-unplugged');
            break;
        case 'music-controls-headset-plugged':
            // Do something
			console.log('music-controls-headset-plugged');
            break;
        default:
            break;
    }
}
function StatusBarGo() {
	/*
	MusicControls.destroy(onSuccess, onError);
	// Register callback
	MusicControls.subscribe(StatusBarEvents);
	MusicControls.listen();
	
	MusicControls.create({
		track       : 'Жизнь прекрасна и удивительна',
		artist      : 'Радио 13',
		cover       : 'icon.png',
		isPlaying   : false
	}, onSuccess, onError);
	
	*/
}

