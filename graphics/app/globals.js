define(function() {
	'use strict';
	const nodecg = window.nodecg;

	const mapsRep = new nodecg.Replicant('maps', 'tflive-layouts');
	const team1Rep = new nodecg.Replicant('team1', 'tflive-layouts');
	const team2Rep = new nodecg.Replicant('team2', 'tflive-layouts');
	const stageRep = new nodecg.Replicant('stage', 'tflive-layouts');

	return Object.create(Object.prototype, {
		maps: {
			get: () => {return mapsRep.value;}
		},
		mapsRep: {
			value: mapsRep
		},

		team1: {
			get: () => {return team1Rep.value;}
		},
		team1Rep: {
			value: team1Rep
		},

		team2: {
			get: () => {return team2Rep.value;}
		},
		team2Rep: {
			value: team2Rep
		},

		stage: {
			get: () => {return stageRep.value.trim();}
		},
		stageRep: {
			value: stageRep
		}
	});
});
