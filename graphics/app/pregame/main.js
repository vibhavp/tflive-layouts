(function() {
	requirejs(['globals', 'teams', 'maps'], function (globals, teams, maps) {
		const nodecg = window.nodecg;

		teams.bindReplicant(globals.team1Rep, $('#red'));
		teams.bindReplicant(globals.team2Rep, $('#blu'));

		setInterval(() => {
			maps.setMaps($('#text', '#maps'));
		}, 5000);
		maps.setMaps($('#text', '#maps'));


		const roles = new window.nodecg.Replicant('roles', 'tflive-layouts');
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

		const showCasterVoice = new nodecg.Replicant('show_caster_voice', 'tflive-layouts');
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
		const change_song = song => {
			$('#text', '#music').text(song);
		};

		const now_playing = new nodecg.Replicant('now_playing', 'tflive-layouts');
		now_playing.on('change', change_song);
		nodecg.readReplicant('now_playing', 'tflive-layouts', change_song);

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
	});
}());