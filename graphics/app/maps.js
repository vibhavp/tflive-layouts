define(['globals'], function(globals) {
	function makeMapText() {
		let str = '';
		const maps = globals.maps;

		for (const i in maps) {
			str += maps[i].map;
			if (parseInt(i, 10) !== maps.length - 1) {
				str += ' · ';
			}
		}

		return str;
	}

	function winner(map) {
		if (map.team1Score > map.team2Score) {
			return globals.team1;
		} else if (map.team2Score > map.team1Score) {
			return globals.team2;
		}

		return '';
	}

	function setMapsText(mapsText, text) {
		mapsText.fadeOut(() => {
			mapsText.text(text);
		}).fadeIn();
	}

	function singleMapText(map) {
		return `${map.map} ${map.team2Score} - ${map.team1Score}`;
	}

	let curMapIndex = 0;
	let showAllMaps = true;
	let showStage = true;

	function reset() {
		showAllMaps = true;
		curMapIndex = 0;
	}

	function setMaps(mapsTextSpan) {
		if (!globals.maps) {
			return;
		}

		if (showAllMaps) {
			showAllMaps = false;
			showStage = true;
			setMapsText(mapsTextSpan, makeMapText());
		} else if (showStage) {
			if (globals.stage !== '') {
				setMapsText(mapsTextSpan, globals.stage);
			}
			showStage = false;
		} else { // show a single map
			let curMap = globals.maps[curMapIndex];
			while (!curMap.show) {
				if (curMapIndex >= globals.maps.length) {
					reset();
					return;
				}
				curMap = globals.maps[curMapIndex++];
			}

			setMapsText(mapsTextSpan, singleMapText(curMap));
			curMapIndex++;
			if (curMapIndex >= globals.maps.length) {
				reset();
			}
		}
	}

	return {
		setMaps: setMaps
	};
});
