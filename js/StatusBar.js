MusicControls.destroy(onSuccess, onError);
function StatusBarEvents(action) {
    switch(action) {
        case 'music-controls-pause':
            // ������ �����
			console.log('������ �����');
            break;
        case 'music-controls-play':
            // ����� ����
			console.log('����� ����');
            break;
        case 'music-controls-destroy':
            // �������
			console.log('�������');
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

// Register callback
MusicControls.subscribe(StatusBarEvents);
MusicControls.listen();

MusicControls.create({
	track       : 'Time is Running Out',
	artist      : 'Muse',
    cover       : 'icon.png',
	isPlaying   : true
}, onSuccess, onError);