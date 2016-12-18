(function() {
	'use strict';

	const nodecg = window.nodecg;

	const inputs = document.getElementsByTagName('paper-input');
	const rostersRep = new nodecg.Replicant('team_rosters', 'tflive-layouts', {defaultValue: {red: {}, blu: {}}});

	for (const input of inputs) {
		input.addEventListener('change', () => {
			const clone = JSON.parse(JSON.stringify(rostersRep.value[input.dataset.class]));
			clone[input.id]	= input.value;
			rostersRep.value[input.dataset.class] = clone;
		});
	}
})();
