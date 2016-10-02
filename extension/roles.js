const Twitter = require('twitter');

const Role = (function () {
	function Role(name, twitter_id, twitter_img) {
		if (twitter_img) {
			twitter_img = twitter_img.replace("_normal", "");
		}
		this.name = name;
		this.twitter_id = twitter_id;
		this.twitter_img = twitter_img;
	}
	return Role;
}());

function get_large(img) {
	return img.replace('_normal', '');
}

module.exports = function (nodecg) {
	const roles = new nodecg.Replicant('roles', 'tflive', { defaultValue: {
		'caster1': new Role(), 'caster2': new Role(), 'analyst1': new Role(),
		'analyst2': new Role(), 'camera': new Role(), 'production': new Role()
        } });

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

	nodecg.listenFor('rolesChange', function (data) {
		let twitter_img = '';
		if (client) {
			client.get('users/show', {screen_name: data.twitter_id}, (error, profile) => {
				if (error) {
					nodecg.log.error('%s', error);
				}
				else {
					twitter_img = get_large(profile.profile_image_url);
				}
			});
		}
		roles.value[data.role] = new Role(data.name, data.twitter_id, twitter_img);
	});
};
