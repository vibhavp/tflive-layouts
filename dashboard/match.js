(function () {
	'use strict';

	const node = document.getElementById('mapno');
	// var nodecg = new NodeCG('tflive');
	const maps = new window.nodecg.Replicant('maps', 'tflive', {defaultValue: []});
	function createChange(i, input) {
		return function () {
			maps.value[i] = input[0].value;
		};
	}

	$(node).on('change', () => {
		const num = parseInt(node.value, 10);
		setMapInput(num);
	});

	function setMapInput(num, mapList) {
		if (num < 0) {
			return;
		}

		const div = document.getElementById('maps');
		const length = $(div).children().length;
		let i;

		if (num < length) {
			for (i = length; i > num; i--) {
				$($(div).children()[i - 1]).detach();
				maps.value.pop();
			}
		} else {
			for (i = length; i < num; i++) {
				const input = $('<paper-input></paper-input>');
				$(input).attr('label', 'Map ' + (i + 1));
				$(input).attr('id', 'map' + (i));

				$(input).on('change', createChange(i, input));

				if (mapList !== undefined) {
					input[0].value = mapList[i];
				}

				$(div).append(input);
			}
		}
	}

	window.nodecg.readReplicant('maps', 'tflive', maps => {
		if ( maps !== undefined ) {
			node.value = ' ' + maps.length;
			setMapInput(maps.length, maps);
		}
	});
})();
