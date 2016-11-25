(function () {
	requirejs(['globals', 'teams', 'maps'], (globals, teams, maps) => {
		const nodecg = window.nodecg;

		teams.bindReplicant(globals.team1Rep, $('#red'));
		teams.bindReplicant(globals.team2Rep, $('#blu'));

		setInterval(() => {
			maps.setMaps($('#text', '#maps'));
		}, 5000);
		maps.setMaps($('#text', '#maps'));

		const roles = new window.nodecg.Replicant('roles', 'tflive-layouts');

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

		const topTimerText = new nodecg.Replicant('custom-timer-text', 'tflive-layouts');
		topTimerText.on('change', value => {
			if (value.matchEnded) {
				$('#maps').fadeOut(() => {
					$('#upper').slideUp();
					$('#lower').slideUp();
				});
			} else {
				$('#maps').show();
				$('#upper').show();
				$('#lower').show();
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
				table.fadeIn();
				$('#maps').fadeOut();
				table.empty();
				table.append(maps.getScoresTable());
			} else {
				table.fadeOut();
				$('#maps').fadeIn();
			}
		});
	});
})();
