define(function() {
	'use strict';

	return {
		bindReplicant: (replicant, element) => {
			replicant.on('change', (value) => {
				if (!value || value.trim() === '') {
					element.text('TBD');
				} else {
					element.text(value);
				}
			});
		}
	};
});
