(function () {
	const nodecg = window.nodecg;
	let cur_map_index = 0;
	let show_all_maps = true;
	const mapsDiv = document.getElementById('maps');

	function makeMapText(maps) {
		let str = '';
		let i;
		for (i in maps) {
			if ({}.hasOwnProperty.call(maps, i)) {
				str += maps[i];
				if (i !== maps.length - 1) {
					str += ' · ';
				}
			}
		}

		return str;
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
				mapsDiv.innerText = 'Map #' + (cur_map_index + 1) + ': ' + maps[cur_map_index++];
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

	nodecg.Replicant('team1', 'tflive').on('change', changeTeam('red'));
	nodecg.Replicant('team2', 'tflive').on('change', changeTeam('blu'));
	setMaps();

	function setProfiles(id, role) {
		nodecg.Replicant(id + 'Info', 'tflive').on('change', data => {
			if (data === null || data === undefined || data === {}) {
				return;
			}

			$($('#' + id).children()[0]).attr('src', data.twitter_img);
			// $('#' + id).children()

			[1].innerHTML = '<b>' + data.name + '</b><br>@<i>' + data.twitter + '</i>';
			$('#name', '#' + id)[0].innerHTML = '<b>' + data.name + '</b>';
			$('#twitter', '#' + id)[0].innerHTML = '<i>@' + data.twitter + '</i>';
		});
	}

	setProfiles('caster1', 'Caster');
	setProfiles('caster2', 'Caster');
	setProfiles('observer', 'Observer');
})();
