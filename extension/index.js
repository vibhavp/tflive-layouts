'use strict';

module.exports = function (nodecg) {
	require('./roles')(nodecg);
	require('./music')(nodecg);
	require('./mumble')(nodecg);
	const maps = new nodecg.Replicant('maps', 'tflive', {defaultValue: []});
};
