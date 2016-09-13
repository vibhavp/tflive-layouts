(function () {
	'use strict';

	const node = document.getElementById('mapno');
	// var nodecg = new NodeCG('tflive');
	const maps = new window.nodecg.Replicant('maps', 'tflive', {defaultValue: []});

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

		if (num < length) {
			for (let i = length; i > num; i--) {
				$('#map' + (i - 1)).detach();
				maps.value.pop();
			}
		} else {
			for (let i = length; i < num; i++) {
				const mapItem = $('<div class="map" id="map' + i + '"></div>');
				const mapName = $('<paper-input></paper-input>');

				const team1Score = mapName.clone();
				$(team1Score).attr('type', 'number');
				$(team1Score).attr('label', 'Team 1 Score');
				const team2Score = team1Score.clone();
				$(team2Score).attr('label', 'Team 2 Score');

				$(mapName).attr('label', 'Map ' + (i + 1));

				const onChange = () => {
					maps.value[i] = {map: mapName[0].value, team1Score: team1Score[0].value, team2Score: team2Score[0].value};
				};

				$(mapName).on('change', onChange);
				$(team1Score).on('change', onChange);
				$(team2Score).on('change', onChange);

				if (mapList !== undefined) {
					mapName[0].value = mapList[i].map;
					team1Score[0].value = mapList[i].team1Score;
					team2Score[0].value = mapList[i].team2Score;
				}

				$(mapItem).append(mapName, team1Score, team2Score);
				$(div).append(mapItem);
			}
		}
	}

	window.nodecg.readReplicant('maps', 'tflive', maps => {
		if ( maps !== undefined ) {
			node.value = String(maps.length);
			setMapInput(maps.length, maps);
		}
	});
})();
