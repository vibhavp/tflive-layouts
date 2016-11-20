(function () {
	const nodecg = window.nodecg;
	const team1 = new nodecg.Replicant('team1', 'tflive-layouts');
	const team2 = new nodecg.Replicant('team2', 'tflive-layouts');

	function changeTeam(team) {
		return value => {
			if (value) {
				$('.name', '#' + team).text(value);
			}
		};
	}

	team1.on('change', changeTeam('red'));
	team2.on('change', changeTeam('blu'));

	nodecg.readReplicant('team1', 'tflive-layouts', changeTeam('red'));
	nodecg.readReplicant('team2', 'tflive-layouts', changeTeam('blu'));

	function makeMapText(maps) {
		let str = '';

		for (const i in maps) {
			if ({}.hasOwnProperty.call(maps, i)) {
				str += maps[i].map;
				if (parseInt(i, 10) !== maps.length - 1) {
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

	const mapsDiv = $('#text', '#maps');
	let cur_map_index = 0;
	let show_all_maps = true;
	let show_stage = true;

	function setMaps() {
		nodecg.readReplicant('maps', 'tflive-layouts', maps => {
			if (!maps.length) {
				setTimeout(setMaps, 5000);
				return;
			}

			if (show_all_maps) {
				show_all_maps = false;
				show_stage = true;
				mapsDiv.fadeOut(() => {
					mapsDiv.text(makeMapText(maps));
				}).fadeIn();
			} else {
				const curMap = maps[cur_map_index++];

				mapsDiv.fadeOut(() => {
					mapsDiv.text(curMap.map + ' ' + curMap.team2Score + '-' + curMap.team1Score);
				}).fadeIn();
				if (cur_map_index === maps.length) {
					show_all_maps = true;
					cur_map_index = 0;
				}
			}
			setTimeout(setMaps, 5000);
		});
	}

	setMaps();
	new nodecg.Replicant('maps', 'tflive-layouts').on('change', values => {
		values.forEach(map => {
			if (map.current) {
				$('.score', '#blu').text(map.team2Score);
				$('.score', '#red').text(map.team1Score);
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

	const socialLinksHeight = $('#social-links').css('height');

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

				timer_div.fadeIn(() => {
					$('#social-links').height('0px');
					$('#social-links').show(0, () => {
						$('#social-links').animate({height: socialLinksHeight});
					});
				});

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
			$('#social-links').animate({height: '0px'}, () => {
				$('#social-links').hide();
				timer_div.fadeOut(() => {
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
})();
