function BgMode(){
	localStorage.setItem('bg', '1');
	cordova.plugins.backgroundMode.setDefaults({
		title: 'Радио 13',
		text: 'Жизнь прекрасна и удивительна',
		icon: 'icon.png',
		hidden: false
	})
	cordova.plugins.backgroundMode.enable();
	//cordova.plugins.backgroundMode.configure({ silent: true });
}