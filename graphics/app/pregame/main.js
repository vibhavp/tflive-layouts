(function () {
	requirejs(['globals', 'teams', 'maps'], (globals, teams, maps) => {
		const nodecg = window.nodecg;

		teams.bindReplicant(globals.team1Rep, $('#red'));
		teams.bindReplicant(globals.team2Rep, $('#blu'));
		teams.bindReplicant(globals.team1Rep, $('.team-name', '#red-roster'));
		teams.bindReplicant(globals.team2Rep, $('.team-name', '#blu-roster'));

		setInterval(() => {
			maps.setMaps($('#text', '#maps'));
		}, 5000);
		maps.setMaps($('#text', '#maps'));

		const roles = new nodecg.Replicant('roles', 'tflive-layouts');

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

					globals.setCssOnce(node, 'visibility', 'visible');
					node.show();
				} else {
					node.hide();
				}
			}
		});

		nodecg.listenFor('mumble_status', data => {
			if (data.role) {
				const role = $('#' + data.role);

				if (data.active) {
					role.addClass('voice-active');
				} else {
					role.removeClass('voice-active');
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

		const mumbleUserList = new nodecg.Replicant('mumble_player_list', 'tflive-layouts');
		mumbleUserList.on('change', players => {
			if (!players) {
				return;
			}

			$('#mumble').empty();
			for (const player of players) {
				const name = player;
				const span = $('<span class="mumble-player">' + name + '</span>');
				span.attr('id', 'mumble-player-' + name);
				$('#mumble').append(span);
			}
		});

		const showMumbleOverlay = new nodecg.Replicant('show_mumble_overlay', 'tflive-layouts');
		showMumbleOverlay.on('change', show => {
			if (show) {
				$('#mumble').css('visibility', 'visible');
				$('#mumble').slideDown();
			} else {
				$('#mumble').slideUp();
			}
		});

		const showNowPlaying = new nodecg.Replicant('show_now_playing', 'tflive-layouts');
		showNowPlaying.on('change', show => {
			if (show) {
				$('#music').show();
			} else {
				$('#music').hide();
			}
		});
		const changeSong = song => {
			$('#text', '#music').text(song);
		};

		const nowPlaying = new nodecg.Replicant('now_playing', 'tflive-layouts');
		nowPlaying.on('change', changeSong);

		const matchStatus = new nodecg.Replicant('match-status', 'tflive-layouts');
		matchStatus.on('change', value => {
			if (value.matchEnded) {
				$('#maps').fadeOut(() => {
					$('#tflive-logo').hide();
					$('#upper').slideUp();
					$('#lower').slideUp();
				});
			} else {
				$('#maps').show();
				$('#upper').slideDown(() => $('#tflive-logo').show());
				$('#lower').slideDown();
			}
		});

		const showMapSummaryRep = new nodecg.Replicant('show_map_summary', 'tflive-layouts');
		const table = $('table', '#scores-summary');
		table.fadeOut();
		globals.mapsRep.on('change', () => {
			table.empty();
			table.append(maps.getScoresTable());
		});

		showMapSummaryRep.on('change', value => {
			if (value) {
				// globals.setDisplayOnce($('#scores-summary'), 'block');
				// globals.setDisplayOnce(table, 'block');
				globals.setCssOnce(table, 'visibility', 'visible');
				globals.setCssOnce($('#scores-summary'), 'visibility', 'visible');

				table.fadeIn();
				$('#maps').fadeOut();
				table.empty();
				table.append(maps.getScoresTable());
			} else {
				table.fadeOut();
				$('#maps').fadeIn();
			}
		});

		function appendPlayerName(team, name) {
			const e = $(`<span class="player-name">${name}</span>`);
			const div = $(`#${team}-roster`);
			div.append(e);
		}

		const showTeamRostersRep = new nodecg.Replicant('show_team_rosters', 'tflive-layouts');
		const teamRosters = $('#team-rosters');
		const allClasses = ['scout1', 'scout2', 'soldier1', 'soldier2', 'demoman', 'medic'];
		teamRosters.slideUp();

		showTeamRostersRep.on('change', value => {
			if (value) {
				nodecg.readReplicant('team_rosters', 'tflive-layouts', teams => {
					$('.player-name').remove();
					for (const team of ['red', 'blu']) {
						for (const className of allClasses) {
							const name = teams[team][className];
							if (name) {
								appendPlayerName(team, name);
							}
						}
					}
					globals.setCssOnce(teamRosters, 'visibility', 'visible');
					teamRosters.slideDown();
				});
			} else {
				teamRosters.slideUp();
			}
		});
	});
})();
