(function () {
	'use strict';

	const node = document.getElementById('mapno');
	const nodecg = window.nodecg;
	const maps = new window.nodecg.Replicant('maps', 'tflive-layouts', {defaultValue: []});

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
				const show = $('<paper-checkbox>Show</paper-checkbox>');
				current.attr('style', 'padding-left: 2px;');
				current.attr('id', i);

				const team2Score = mapName.clone();
				$(team2Score).attr('style', 'padding-left: 5%');
				$(team2Score).attr('type', 'number');
				$(team2Score).attr('label', 'BLU Score');

				const team1Score = team2Score.clone();
				$(team1Score).attr('label', 'RED Score');

				$(mapName).attr('label', 'Map ' + (i + 1));
				team2Score[0].value = team1Score[0].value = 0;

				const onChange = () => {
					maps.value[i] = {map: mapName[0].value,
									 team1Score: parseInt(team1Score[0].value, 10),
									 team2Score: parseInt(team2Score[0].value, 10),
									 current: current[0].checked,
									 show: show[0].checked};

					if (current[0].checked) {
						const boxes = document.getElementsByTagName('paper-radio-button');
						for (const box of boxes) {
							if (!box.checked) {
								continue;
							}

							const boxId = parseInt(box.id, 10);

							if (boxId !== i) {
								const clone = JSON.parse(JSON.stringify(maps.value[boxId]));
								clone.current = false;
								maps.value[boxId] = clone;
								box.checked = false;
							}
						}
					}
				};

				$(mapName).on('change', onChange);
				$(team1Score).on('change', onChange);
				$(team2Score).on('change', onChange);
				$(current).on('change', onChange);
				$(show).on('change', onChange);

				team1Score[0].value = 0;
				team2Score[0].value = 0;

				if (mapList) {
					mapName[0].value = mapList[i].map;
					team1Score[0].value = mapList[i].team1Score;
					team2Score[0].value = mapList[i].team2Score;
					current[0].checked = mapList[i].current;
					show[0].checked = mapList[i].show;
				}

				$(mapItem).append(mapName, team2Score, team1Score, current, show);
				$(div).append(mapItem);
			}
		}
	}

	window.nodecg.readReplicant('maps', 'tflive-layouts', maps => {
		if (maps) {
			node.value = String(maps.length);
			setMapInput(maps.length, maps);
		}
	});

	const swapButton = $('#swap');
	const team1 = new nodecg.Replicant('team1', 'tflive-layouts');
	const team2 = new nodecg.Replicant('team2', 'tflive-layouts');

	swapButton.on('click', () => {
		const tmp = (team1.value);
		team1.value = team2.value;
		team2.value = tmp;

		nodecg.readReplicant('maps', 'tflive-layouts', mapsInfo => {
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
