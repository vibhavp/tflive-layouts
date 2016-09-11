(function() {
	'use strict';

	const toast = document.getElementById("toast");

	function setProfileReplicant(role) {
		const name = document.getElementById(role);
		const nameTwitter = document.getElementById(role+'Twitter');
		const rep = new window.nodecg.Replicant(role, 'tflive', {defaultValue: {name: "TBD", twitter: ""}});

		$(name).on('change', () => {
			rep.value['name'] = name.value;
		});

		$(nameTwitter).attr('allowed-pattern', '[A-Za-z0-9_]');
		$(nameTwitter).attr('style', 'padding-left: 5%');
		$(nameTwitter).attr('maxlength', 15);

		$(nameTwitter).on('change', () => {
			rep.value['twitter'] = nameTwitter.value;
		});

		window.nodecg.readReplicant(role, 'tflive', profile => {
			if (profile !== undefined && profile !== null) {
				name.value = profile['name'];
				nameTwitter.value = profile['twitter'];
			}
		});
	}

	setProfileReplicant('caster1');
	setProfileReplicant('caster2');
	setProfileReplicant('observer');
})();
