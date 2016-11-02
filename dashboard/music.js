(function() {
	'use strict';

	const nodecg = window.nodecg;
	const node = document.getElementById('lastfm');
	const use_lastfm = new nodecg.Replicant('use_lastfm', 'tflive-pregame');
	node.addEventListener('change', () => {
		use_lastfm.value = node.active;
	});

	use_lastfm.on('change', value => {
		node.active = value;
	});

	const show = document.getElementById('show');
	const showRep = new nodecg.Replicant('show_now_playing', 'tflive-pregame');
	show.addEventListener('change', () => {
		showRep.value = show.active;
	});

	showRep.on('change', value => {
		show.active = value;
	});
})();
