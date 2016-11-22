(function() {
	'use strict';

	require(['globals', 'teams', 'maps'], function (globals, teams, maps) {
		const nodecg = window.nodecg;

		teams.bindReplicant(globals.team1Rep, $('.name', '#red'));
		teams.bindReplicant(globals.team2Rep, $('.name', '#blu'));

		setInterval(() => {
			maps.setMaps($('#text', '#maps'));
		}, 5000);
		maps.setMaps($('#text', '#maps'));

		globals.mapsRep.on('change', values => {
			values.forEach(map => {
				if (map.current) {
					$('.score', '#blu').text(map.team2Score);
					$('.score', '#red').text(map.team1Score);
					return;
				}
			});
		});

		const paused = nodecg.Replicant('paused', 'tflive-layouts', {defaultValue: false});
		const pausedTime = nodecg.Replicant('paused_time', 'tflive-layouts');
		let timer;

		function pad(t) {
			if (t === 0) {
				return '00';
			}
			if (t < 10) {
				return '0' + t;
			}

			return String(t);
		}

		paused.on('change', value => {
			const timer_div = $('#pause-info');
			const timer_text = timer_div.find('.timer');

			if (value) {
				nodecg.readReplicant('paused_time', 'tflive-layouts', lastPause => {
					let sec = 0;
					let min = 0;
					if (lastPause) {
						const diff = Math.trunc((new Date().getTime() - lastPause) / 1000);
						min = Math.trunc(diff / 60);
						sec = diff % 60;
						timer_text.text(pad(min) + ':' + pad(sec));
					} else {
						pausedTime.value = new Date().getTime();
					}

					timer_div.slideDown();
					$('#social-links').slideDown();

					timer = setInterval(() => {
						sec++;
						if (sec === 60) {
							sec = 0;
							min++;
						}

						timer_text.text(pad(min) + ':' + pad(sec));
					}, 1000);
				});
			} else {
				$('#social-links').slideUp(() => {
					timer_div.slideUp(() => {
						timer_text.text('00:00');
					});
				});

				/* Remove background & pause text from timer gap */
				$('#timer').removeClass('fill').find('.text').text('');

				if (timer) {
					clearInterval(timer);
				}
				pausedTime.value = null;
			}
		});

		const topTimerText = new nodecg.Replicant('custom-timer-text', 'tflive-layouts', {defaultValue: {enabled: false}});

		topTimerText.on('change', value => {
			if (value.enabled) {
				if (value.hideMaps) {
					$('#maps').fadeOut();
				} else {
					$('#maps').show();
				}
				$('#timer').addClass('fill').find('.text').text(value.text);
			} else {
				$('#timer').removeClass('fill').find('.text').text('');
			}
		});
	});
}());
