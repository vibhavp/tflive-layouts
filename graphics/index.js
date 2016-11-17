(function () {
	const nodecg = window.nodecg;
	const team1 = new nodecg.Replicant('team1', 'tflive-pregame');
	const team2 = new nodecg.Replicant('team2', 'tflive-pregame');

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

		nodecg.readReplicant('maps', 'tflive-pregame', maps => {
			if (maps && maps.length === 0) {
				nodecg.readReplicant('stage', 'tflive-pregame', stage => {
					if (stage && stage.trim() !== '') {
						mapsDiv.fadeOut(() => {
							mapsDiv.text(stage);
						}).fadeIn();
					}
				});
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
				nodecg.readReplicant('stage', 'tflive-pregame', stage => {
					if (stage && stage.trim() !== '') {
						mapsDiv.fadeOut(() => {
							mapsDiv.text(stage);
						}).fadeIn();
					}
				});
				show_stage = false;
			} else {
				const curMap = maps[cur_map_index++];
				mapsDiv.fadeOut(() => {
					mapsDiv.text(curMap.map + ' ' + curMap.team2Score + '-' + curMap.team1Score + ' ' + winner(curMap));
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

	const roles = new window.nodecg.Replicant('roles', 'tflive-pregame');
	let timer;

	roles.on('change', values => {
		for (const role in values) {
			const node = $('#' + role);
			const profile = values[role];
			const twitter = $('#twitter', node);
			const twitterImg = $('.twitter', node);

			if (profile.name) {
				$('#name', node).text(profile.name);

				if (profile.twitter_id && profile.twitter_id !== '') {
					twitter.text('@' + profile.twitter_id);
					twitter.css('visibility', 'visible');

					twitterImg.attr('src', profile.twitter_img);
					twitterImg.css('visibility', 'visible');
				} else {
					twitter.text('');
					twitterImg.css('visibility', 'hidden');
				}

				node.show();
			} else {
				node.hide();
			}
		}
	});

	nodecg.listenFor('mumble_status', data => {
		if (data.role) {
			const role = data.role;
			const mumbleIcon = $('.active', '#' + role);
			if (data.active) {
				mumbleIcon.css('visibility', 'visible');
			} else {
				mumbleIcon.css('visibility', 'hidden');
			}
		} else { // is a player
			const div = $('#mumble-player-' + data.name);
			if (data.active) {
				div.css('color', 'red');
			} else {
				div.css('color', 'white');
			}
		}
	});

	const mumbleUserList = new nodecg.Replicant('mumble_player_list', 'tflive-pregame');
	mumbleUserList.on('change', players => {
		if (!players) {
			return;
		}

		$('#mumble').empty();
		console.log(players);
		for (const player of players) {
			const name = player;
			const span = $('<span class="mumble-player">' + name + '</span>');
			span.attr('id', 'mumble-player-' + name);
			$('#mumble').append(span);
		}
	});

	const showMumbleOverlay = new nodecg.Replicant('show_mumble_overlay', 'tflive-pregame');
	showMumbleOverlay.on('change', show => {
		if (show) {
			$('#mumble').fadeIn();
		} else {
			$('#mumble').slideUp();
		}
	});

	const showNowPlaying = new nodecg.Replicant('show_now_playing', 'tflive-pregame');
	showNowPlaying.on('change', show => {
		if (show) {
			$('#music').show();
		} else {
			$('#music').hide();
		}
	});
	const change_song = song => {
		$('#text', '#music').text(song);
	};

	const now_playing = new nodecg.Replicant('now_playing', 'tflive-pregame');
	now_playing.on('change', change_song);
	nodecg.readReplicant('now_playing', 'tflive-pregame', change_song);
})();
