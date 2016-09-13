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
				$('#map' + (i - 1)).detach();
				maps.value.pop();
			}
		} else {
			for (i = length; i < num; i++) {
				const mapItem = $('<div class="map" id="map' + i + '"></div>');
				const mapName = $('<paper-input></paper-input>');

				const team1Score = mapName.clone();
				$(team1Score).attr('type', 'number');
				$(team1Score).attr('label', 'Team 1 Score');
				const team2Score = team1Score.clone();
				$(team2Score).attr('label', 'Team 2 Score');

				$(mapName).attr('label', 'Map ' + (i + 1));
				$(mapName).on('change', createChange(i, mapName));

				if (mapList !== undefined) {
					mapName[0].value = mapList[i];
				}

				$(mapItem).append(mapName, team1Score, team2Score);
				$(div).append(mapItem);
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
