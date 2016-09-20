const LastFM = require("lastfm-listener");


module.exports = (nodecg) => {
	const now_playing = new nodecg.Replicant("now_playing", "tflive", {defaultValue: ""});
	const use_lastfm = new nodecg.Replicant("use_lastfm", "tflive", {defaultValue: false});

	let client: any;
	if (!nodecg.bundleConfig) {
		nodecg.log.error("no config found. LastFM disabled.");
	} else if (typeof nodecg.bundleConfig.twitter === "undefined") {
		nodecg.log.error("no LastFM config found. LastFM disabled.");
	} else {
		client = new LastFM({
			api_key: nodecg.bundleConfig.lastfm.api_key,
			username: nodecg.bundleConfig.lastfm.username
		});
	}

	if (client && !use_lastfm) {
		client.getLatestSong((song) => {
			if (song.nowplaying) {
				now_playing.value = song.artist + ": " + song.name;
			}
		});
		client.on("song", (song) => {
			now_playing.value = song.artist + ": " + song.name;
		});
	}
};
