(function () {
	'use strict';

	const nodecg = window.nodecg;

	$('#connect-mumble').on('click', () => {
		console.log('connecting to mumble');
		nodecg.sendMessage('mumble_connect');
	});

	nodecg.listenFor('mumble_connected', () => {
		$('nodecg-toast')[0].show();
	});

	const showMumbleOverlay = new nodecg.Replicant('show_mumble_overlay', 'tflive', {defaultValue: false});
	const nodeToggled = $('#show-mumble');
	nodeToggled.on('change', () => {
		showMumbleOverlay.value = nodeToggled[0].active;
	});
	showMumbleOverlay.on('change', value => {
		nodeToggled[0].active = value;
	});

	const filteredMumbleNames = new nodecg.Replicant('filtered_mumble_names', 'tflive', {defaultValue: []});

	function newInput(index, name) {
		const input = $('<paper-input></paper-input>');
		input.attr('label', 'Name');
		input.on('change', () => {
			filteredMumbleNames.value[index] = input[0].value;
		});
		if (name) {
			input[0].value = name;
		}
		const remove = $('<paper-icon-button icon="remove" title="Remove"></paper-icon-button>');
		remove.css('padding-left', '5%');
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
})();
