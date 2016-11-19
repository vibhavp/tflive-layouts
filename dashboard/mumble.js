(function () {
	'use strict';

	const nodecg = window.nodecg;

	$('#connect-mumble').on('click', () => {
		console.log('connecting to mumble');
		nodecg.sendMessage('mumble_connect');
	});

	const showMumbleOverlay = new nodecg.Replicant('show_mumble_overlay', 'tflive-pregame', {defaultValue: false});
	const showCasterVoice = new nodecg.Replicant('show_caster_voice', 'tflive-pregame', {defaultValue: true});
	const showMumbleToggle = $('#show-mumble');
	showMumbleToggle.on('change', () => {
		showMumbleOverlay.value = showMumbleToggle[0].active;
	});
	showMumbleOverlay.on('change', value => {
		showMumbleToggle[0].active = value;
	});
	const casterVoiceToggle = $('#show-caster-voice');

	casterVoiceToggle.on('change', () => {
		showCasterVoice.value = casterVoiceToggle[0].active;
	});
	showCasterVoice.on('change', value => {
		casterVoiceToggle[0].active = value;
	});

	const filteredMumbleNames = new nodecg.Replicant('filtered_mumble_names', 'tflive-pregame', {defaultValue: []});

	function newInput(index, name) {
		const input = $('<paper-input></paper-input>');
		input.attr('label', 'Name');
		input.on('change', () => {
			filteredMumbleNames.value[index] = input[0].value;
			nodecg.sendMessage('mumble_refresh_players');
		});
		if (name) {
			input[0].value = name;
		}
		const remove = $('<paper-icon-button icon="remove" title="Remove"></paper-icon-button>');
		remove.on('click', () => {
			input.detach();
			remove.detach();
			filteredMumbleNames.value.splice(index, 1);
		});

		const div = $('<div class="filter-name"></div>');
		div.append(input, remove);
		return div;
	}
	let len = 0;

	const dialog = $('#mumble-filter');
	const button = $('#add-name');
	button.on('click', () => {
		dialog.append(newInput(len++));
	});

	nodecg.readReplicant('filtered_mumble_names', names => {
		for (const name of names) {
			const input = newInput(len++, name);
			dialog.append(input);
		}
	});

	const mumbleConnected = new nodecg.Replicant('mumble_connected', 'tflive-pregame', {persistent: false, defaultValue: false});
	const disconnectMumbleButton = $('#disconnect-mumble');

	mumbleConnected.on('change', (value) => {
		if (value) {
			console.log('connected to mumble');
			disconnectMumbleButton.show();
			$('nodecg-toast')[0].show();
			$('#connect-mumble').text('Reconnect');
		} else {
			console.log('disconnected from mumble');
			disconnectMumbleButton.hide();
			$('#connect-mumble').text('Connect');
		}
	});

	disconnectMumbleButton.on('click', () => {
		nodecg.sendMessage('mumble_disconnect');
	});

	$('#refresh-mumble').on('click', () => {
		nodecg.sendMessage('mumble_refresh_players');
	});
})();
