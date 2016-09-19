(function () {
	const nodecg = window.nodecg;
	let cur_map_index = 0;
	let show_all_maps = true;
	const mapsDiv = document.getElementById('maps');
	const team1 = new nodecg.Replicant('team1', 'tflive');
	const team2 = new nodecg.Replicant('team2', 'tflive');

	function makeMapText(maps) {
		let str = '';
		let i;
		for (i in maps) {
			if ({}.hasOwnProperty.call(maps, i)) {
				str += maps[i].map;
				if (i != maps.length - 1) {
					str += ' Â· ';
				}
			}
		}

		return str;
	}

	function winner(map) {
		if (map.team1Score > map.team2Score) {
			return team1.value;
		} else if (map.team2Score > map.team1Score) {
			return team2.value;
		}

		return '';
	}

	function setMaps() {
		nodecg.readReplicant('maps', 'tflive', maps => {
			if (maps.length === 0) {
				setTimeout(setMaps, 5000);
				return;
			}

			if (show_all_maps) {
				show_all_maps = false;
				mapsDiv.innerText = makeMapText(maps);
			} else {
				const curMap = maps[cur_map_index++];

				mapsDiv.innerText = 'Map #' + (cur_map_index + 1) + ': ' + curMap.map + ' ' + curMap.team1Score + '-' + curMap.team2Score + ' ' + winner(curMap);
				if (cur_map_index === maps.length) {
					show_all_maps = true;
					cur_map_index = 0;
				}
			}
			setTimeout(setMaps, 5000);
		});
	}

	function changeTeam(color) {
		return function (team) {
			const e = document.getElementById(color);

			if (team === undefined || team === '') {
				e.innerText = 'TBD';
			} else {
				e.innerText = team;
			}
		};
	}

	team1.on('change', changeTeam('red'));
	team2.on('change', changeTeam('blu'));
	setMaps();

	const roles = new window.nodecg.Replicant("roles", "tflive");

	roles.on("change", (values) => {
		for (let role in values) {
			let node = $("#"+role);
			let profile = values[role];

			if (!profile.name) {
				node.hide();
			} else {
				node.show();
			}
		}
	});
})();
