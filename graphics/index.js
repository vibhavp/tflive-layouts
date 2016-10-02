(function () {
	const nodecg = window.nodecg;
	const team1 = new nodecg.Replicant('team1', 'tflive');
	const team2 = new nodecg.Replicant('team2', 'tflive');

	function makeMapText(maps) {
		let str = '';
		let i;
		for (i in maps) {
			if ({}.hasOwnProperty.call(maps, i)) {
				str += maps[i].map;
				if (i != maps.length - 1) {
					str += ' · ';
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

	let cur_map_index = 0;
	let show_all_maps = true;
	let show_stage = true;

	function setMaps() {
		const mapsDiv = $('#text', '#maps');

		nodecg.readReplicant('maps', 'tflive', maps => {
			if (maps.length === 0) {
				setTimeout(setMaps, 5000);
				return;
			}

			if (show_all_maps) {
				show_all_maps = false;
				show_stage = true;
				mapsDiv.fadeOut(() => {
					mapsDiv.text(makeMapText(maps));
				}).fadeIn();
			} else if (show_stage) {
				nodecg.readReplicant('stage', 'tflive', stage => {
					if (stage || stage.trim() !== '') {
						mapsDiv.fadeOut(() => {
							mapsDiv.text(stage);
						}).fadeIn();
					}
				});
				show_stage = false;
			} else {
				const curMap = maps[cur_map_index++];
				mapsDiv.fadeOut(() => {
					mapsDiv.text(curMap.map + ' ' + curMap.team1Score + '-' + curMap.team2Score + ' ' + winner(curMap));
				}).fadeIn();

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
			const e = $('#' + color);

			if (!team || team.trim() === '') {
				e.text('TBD');
			} else {
				e.text(team);
			}
		};
	}

	team1.on('change', changeTeam('red'));
	team2.on('change', changeTeam('blu'));
	setMaps();

	const roles = new window.nodecg.Replicant('roles', 'tflive');
	let timer;

	roles.on('change', values => {
		for (const role in values) {
			const node = $('#' + role);
			const profile = values[role];

			if (!profile.name) {
				node.hide();
			} else {
				$('#name', node).text(profile.name);

				if (profile.twitter_id) {
					$('#twitter', node).text('@' + profile.twitter_id);

					$('.twitter', node).attr('src', profile.twitter_img);
					$('.twitter', node).show();
				} else {
					$('.twitter', node).hide();
				}

				node.show();
			}
		}
	});

	const change_song = song => {
		if (song || song.trim === '') {
			$('#music').show();
			$('#text', '#music').text(song);
		} else {
			$('#music').hide();
		}
	};

	const now_playing = new nodecg.Replicant('now_playing', 'tflive');
	now_playing.on('change', change_song);
	nodecg.readReplicant('now_playing', 'tflive', change_song);
})();
