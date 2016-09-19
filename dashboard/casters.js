(function() {
	'use strict';

	const inputs = document.getElementsByClassName("role");
	const nodecg = window.nodecg;

	for (let i in inputs) {
		const id = inputs[i].id;
		const name_input = document.getElementById(id);
		if (!name_input) {
			continue;
		}
		const twitter_input = document.getElementById(id+"_twitter");

		const callback = () => {
			console.log(name_input.value +" => "+twitter_input.value);
			nodecg.sendMessage("rolesChange", {
				role: id,
				name: name_input.value,
				twitter_id: twitter_input.value
			});
		};

		name_input.addEventListener("change", callback);
		twitter_input.addEventListener("change", callback);
	}
})();
