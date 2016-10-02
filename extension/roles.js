const Twitter = require('twitter');

module.exports = function (nodecg) {
	const roles = new nodecg.Replicant('roles', 'tflive', {defaultValue: {
		'caster1': {}, 'caster2': {}, 'analyst1': {},
		'analyst2': {}, 'camera': {}, 'production': {}}});

	let client;
	if (!nodecg.bundleConfig) {
		nodecg.log.error('no config found. Twitter disabled');
	} else if (typeof nodecg.bundleConfig.twitter === 'undefined') {
		nodecg.log.error('no twitter config found. Twitter disabled');
	} else {
		client = new Twitter({
			consumer_key: nodecg.bundleConfig.twitter.consumer_key,
			consumer_secret: nodecg.bundleConfig.twitter.consumer_secret,
			access_token_key: nodecg.bundleConfig.twitter.access_token_key,
			access_token_secret: nodecg.bundleConfig.twitter.access_token_secret
		});
	}

	function getImage(twitterId, callback) {
		let twitterImg;

		if (client) {
			client.get('users/show', {screen_name: twitterId}, (error, profile) => {
				if (error) {
					nodecg.log.error('%j', error);
				} else {
					twitterImg = profile.profile_image_url.replace('_normal', '');
				}
				callback(twitterImg || '');
			});
		} else {
			callback('');
		}
	}

	nodecg.listenFor('rolesChange', data => {
		getImage(data.twitter_id, img => {
			roles.value[data.role] = {name: data.name, twitter_id: data.twitter_id, twitter_img: img};
		});
	});

	nodecg.readReplicant('roles', 'tflive', allRoles => {
		console.log(allRoles);
		for (const role in allRoles) {
			const data = allRoles[role];
			getImage(data.twitter_id, img => {
				console.log(img);
				allRoles[role] = {name: data.name, twitter_id: data.twitter_id, twitter_img: img};
			});
		}

		roles.value = allRoles;
	});
};
