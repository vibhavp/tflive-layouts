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
				const current = $('<paper-radio-button>Current</paper-radio-button>');
				$(current).attr('style', 'padding-left: 2px;');
				$(current).attr('id', i);

				const team1Score = mapName.clone();
				$(team1Score).attr('style', 'padding-left: 5%');
				$(team1Score).attr('type', 'number');
				$(team1Score).attr('label', 'Team 1 Score');
				const team2Score = team1Score.clone();
				$(team2Score).attr('label', 'Team 2 Score');

				$(mapName).attr('label', 'Map ' + (i + 1));

				const onChange = () => {
					const boxes = document.getElementsByTagName('paper-radio-button');
					Array.from(boxes).forEach(box => {
						if (parseInt(box.id, 10) !== i) {
							box.checked = false;
						}
					});

					if (i === 0 && maps.length === 1) {
						current[0].checked = true;
					}
					maps.value[i] = {map: mapName[0].value, team1Score: team1Score[0].value, team2Score: team2Score[0].value, current: current[0].checked};
				};

				$(mapName).on('change', onChange);
				$(team1Score).on('change', onChange);
				$(team2Score).on('change', onChange);
				$(current).on('change', onChange);

				if (mapList) {
					mapName[0].value = mapList[i].map;
					team1Score[0].value = mapList[i].team1Score;
					team2Score[0].value = mapList[i].team2Score;
					current[0].checked = mapList[i].current;
				}

				$(mapItem).append(mapName, team1Score, team2Score, current);
				$(div).append(mapItem);
			}
		}
	}

	window.nodecg.readReplicant('maps', 'tflive', maps => {
		if (maps) {
			node.value = String(maps.length);
			setMapInput(maps.length, maps);
		}
	});

	const swapButton = $('#swap');
	const team1 = new nodecg.Replicant('team1', 'tflive');
	const team2 = new nodecg.Replicant('team2', 'tflive');

	swapButton.on('click', () => {
		const tmp = (team1.value);
		team1.value = team2.value;
		team2.value = tmp;

		nodecg.readReplicant('maps', 'tflive', mapsInfo => {
			for (const i in mapsInfo) {
				const tmp = mapsInfo[i].team1Score;
				mapsInfo[i].team1Score = mapsInfo[i].team2Score;
				mapsInfo[i].team2Score = tmp;
			}

			maps.value = mapsInfo;
			location.reload();
		});
	});
})();
