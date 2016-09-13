'use strict';
const Twitter = require('twitter');

module.exports = function (nodecg) {
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

	nodecg.Replicant('maps', 'tflive', {defaultValue: []});

	function addRole(id) {
		const rep = new nodecg.Replicant(id, 'tflive', {defaultValue: {name: 'TBD', twitter: ''}});
		const repInfo = new nodecg.Replicant(id + 'Info', 'tflive', {defaultValue: {name: 'TBD', twitter: ''}});

		function setValue(image, data) {
			if (image && image.replace) {
				image = image.replace('_normal', '');
			}
			repInfo.value = {twitterImg: image, name: data.name, twitter: data.twitter};
		}

		rep.on('change', data => {
			if (client) {
				client.get('users/show', {screen_name: data.twitter}, (error, profile) => {
					if (error) {
						nodecg.log.error(error);
						setValue(null, data);
					}

					setValue(profile.profile_image_url_https, data);
				});
			} else {
				setValue(null, data);
			}
		});
	}

	addRole('caster1');
	addRole('caster2');
	addRole('observer');
};
