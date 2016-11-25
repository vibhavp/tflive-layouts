define(['globals'], globals => {
	'use strict';

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

	function filter(map) {
		return map.show;
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
			const filtered = globals.maps.filter(filter);
			if (filtered.length === 0) {
				return;
			}
			const curMap = filtered[curMapIndex++];

			setMapsText(mapsTextSpan, singleMapText(curMap));
			if (curMapIndex >= filtered.length) {
				reset();
			}
		}
	}

	function getScoresTable() {
		if (!globals.maps) {
			return;
		}

		const maps = globals.maps.filter(filter);
		const entries = [];
		entries.push($(`
<thead>
<tr>
    <th>Map</th>
    <th style="color: #5B7586">${globals.team2}</th>
    <th style="color: #B13C42">${globals.team1}</th>
</tr>
</thead>`));
		for (const map of maps) {
			entries.push($(`
<tfoot>
<tr>
    <td style="text-align: left">${map.map.toUpperCase()}</td>
    <td style="color: #5B7586">${map.team2Score}</td>
    <td style="color: #B13C42">${map.team1Score}</td>
</tr>
</tfoot>`));
		}

		return entries;
	}

	return {
		setMaps: setMaps,
		getScoresTable: getScoresTable
	};
});
