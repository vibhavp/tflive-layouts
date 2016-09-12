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
			consumerKey: nodecg.bundleConfig.twitter.consumer_key,
			consumerSecret: nodecg.bundleConfig.twitter.consumer_secret,
			accessTokenKey: nodecg.bundleConfig.twitter.access_token_key,
			accessTokenSecret: nodecg.bundleConfig.twitter.access_token_secret
		});
	}

	nodecg.Replicant('maps', 'tflive', {defaultValue: []});

	function addRole(id) {
		const rep = new nodecg.Replicant(id, 'tflive', {defaultValue: {name: 'TBD', twitter: ''}});
		const repInfo = new nodecg.Replicant(id + 'Info', 'tflive', {defaultValue: {name: 'TBD', twitter: ''}});
		rep.on('change', data => {
			repInfo.value = {twitterImg: null, name: data.name, twitter: data.twitter};
		});
	}

	addRole('caster1');
	addRole('caster2');
	addRole('observer');
};
