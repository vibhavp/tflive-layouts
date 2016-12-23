(function() {
	'use strict';

	const nodecg = window.nodecg;

	const lastFMConfigRep = new nodecg.Replicant('lastfm-config', 'tflive-layouts');

	const useLastFMToggle = document.getElementById('lastfm-use');
	useLastFMToggle.addEventListener('change', value => {
		lastFMConfigRep.value.enabled = useLastFMToggle.checked;
	});

	const lastFMUname = document.getElementById('lastfm-uname');
	lastFMUname.addEventListener('change', () => {
		lastFMConfigRep.value.username = lastFMUname.value;
	});

	lastFMConfigRep.on('change', conf => {
		useLastFMToggle.checked = conf.enabled;
		lastFMUname.value = conf.username;
	});

	const lastFMFetchButton = document.getElementById('lastfm-fetch');
	lastFMFetchButton.addEventListener('click', () => {
		nodecg.sendMessage('lastfm_fetch');
	});

	const show = document.getElementById('show');
	const showRep = new nodecg.Replicant('show_now_playing', 'tflive-layouts');
	show.addEventListener('change', () => {
		showRep.value = show.active;
	});

	showRep.on('change', value => {
		show.active = value;
	});
})();
