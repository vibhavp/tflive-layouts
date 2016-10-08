(function () {
	'use strict';

	const nodecg = window.nodecg;

	$('#connect-mumble').on('click', () => {
		console.log('connecting to mumble');
		nodecg.sendMessage('mumble_connect');
	});

	nodecg.listenFor('mumble_connected', () => {
		$('nodecg-toast')[0].show();
	});

	const showMumbleOverlay = new nodecg.Replicant('show_mumble_overlay', 'tflive', {defaultValue: false});
	const nodeToggled = $('#show-mumble');
	nodeToggled.on('change', () => {
		showMumbleOverlay.value = nodeToggled[0].active;
	});
	showMumbleOverlay.on('change', value => {
		nodeToggled[0].active = value;
	});
})();
