const LastFM = require('lastfm-listener');

module.exports = function (nodecg) {
	const nowPlaying = new nodecg.Replicant('now_playing', 'tflive-layouts', {defaultValue: ''});
	const lastFMConfig = new nodecg.Replicant('lastfm-config', 'tflive-layouts');
	let client;
	let hasConfig = true;

	if (!nodecg.bundleConfig) {
		nodecg.log.error('no config found. LastFM disabled.');
		hasConfig = false;
	} else if (!nodecg.bundleConfig.lastfm) {
		nodecg.log.error('no LastFM config found. LastFM disabled.');
		hasConfig = false;
	} else if (lastFMConfig.username && lastFMConfig.username.trim() !== '') {
		client = new LastFM({
			api_key: nodecg.bundleConfig.lastfm.api_key,
			username: lastFMConfig.username
		});
		client.start();
	}

	function startClient(config) {
		if (client && config.enabled) {
			client.start();
			nodecg.log.info(`Started listening for user ${config.username}`);
			client.getLatestSong(song => {
				if (song.nowplaying) {
					nowPlaying.value = song.artist['#text'] + ': ' + song.name;
				}
			});
			client.on('song', song => {
				nowPlaying.value = song.artist['#text'] + ': ' + song.name;
			});
		}
	}

	startClient(lastFMConfig.value);
	lastFMConfig.on('change', conf => {
		if (client) {
			client.stop();
		}

		if (conf.username.trim() === '' || !hasConfig) {
			return;
		}
		client = new LastFM({
			api_key: nodecg.bundleConfig.lastfm.api_key,
			username: conf.username
		});
		startClient(lastFMConfig.value);
	});

	nodecg.listenFor('lastfm_fetch', () => {
		if (client) {
			client.getLatestSong(song => {
				if (song.nowplaying) {
					nowPlaying.value = song.artist['#text'] + ': ' + song.name;
				}
			});
		}
	});
};
