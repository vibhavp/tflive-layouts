'use strict';
const Twitter = require('twitter');

module.exports = function (nodecg) {
	// if (!nodecg.bundleConfig) {
	// 	nodecg.log.error('no config found. Twitter disabled');
	// 	return;
	// }

	// if (typeof nodecg.bundleConfig.twitter === 'undefined') {
	// 	nodecg.log.error('no twitter config found. Twitter disabled');
	// 	return;
	// }

	// const client = new Twitter({
	// 	consumerKey: nodecg.bundleConfig.twitter.consumer_key,
	// 	consumerSecret: nodecg.bundleConfig.twitter.consumer_secret,
	// 	accessTokenKey: nodecg.bundleConfig.twitter.access_token_key,
	// 	accessTokenSecret: nodecg.bundleConfig.twitter.access_token_secret
	// });

	let caster1 = new nodecg.Replicant('caster1', 'tflive', {defaultValue: {}});
	caster1.on('change', newValue => {
		console.log(newValue);
		const info = new nodecg.Replicant('caster1_info', 'tflive');
		info.value = {twitter_img: null, name: newValue.name, twitter: newValue.twitter};
	})

};
