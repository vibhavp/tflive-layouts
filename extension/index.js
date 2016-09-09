'use strict';
const Twitter = require('twitter');

module.exports = function (nodecg) {
	const client = new Twitter({
		consumerKey: nodecg.bundleConfig.consumer_key,
		consumerSecret: nodecg.bundleConfig.consumer_secret,
		accessTokenKey: nodecg.bundleConfig.access_token_key,
		accessTokenSecret: nodecg.bundleConfig.access_token_secret
	});
	const maps = new nodecg.Replicant('maps', 'tflive', {defaultValue: []});

	maps.on('change', (newValue, oldValue) => {
		console.log(oldValue + ' => ' + newValue);
	});
};
