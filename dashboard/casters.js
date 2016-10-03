(function() {
	'use strict';

	const inputs = document.getElementsByClassName('role');
	const nodecg = window.nodecg;
	const roles = nodecg.Replicant('roles', 'tflive');

	for (let i in inputs) {
		const id = inputs[i].id;
		const name_input = document.getElementById(id);
		if (!name_input) {
			continue;
		}

		const twitter_input = document.getElementById(id+'_twitter');
		const callback = () => {
			let name = name_input.value || '';
			let twitter = twitter_input.value || '';

			nodecg.sendMessage('rolesChange', {
				role: id,
				name: name,
				twitter_id: twitter.replace('@', '').trim()
			});
		};
		const set_values = data => {
			name_input.value = data[id].name;
			twitter_input.value = data[id].twitter_id;
		};

		name_input.addEventListener('change', callback);
		twitter_input.addEventListener('change', callback);

		nodecg.readReplicant('roles', (data) => {
			if (data[id].name) {
				name_input.value = data[id].name;
			}
			if (data[id].twitter_id) {
				twitter_input.value = data[id].twitter_id;
			}
		});
	}
})();
