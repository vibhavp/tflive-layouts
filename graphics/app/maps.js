define(['globals'], globals => {
	'use strict';

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
			setMapsText(mapsTextSpan, globals.maps.map(map => map.map).join(' · '));
		} else if (showStage) {
			if (globals.stage !== '') {
				setMapsText(mapsTextSpan, globals.stage);
			}
			showStage = false;
		} else { // show a single map
			const filtered = globals.maps.filter(m => m.show);
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

		const entries = [];
		entries.push($(`
<thead>
<tr>
    <th>Map</th>
    <th style="color: #49ACDF">${globals.team2}</th>
    <th style="color: #DC4C4A">${globals.team1}</th>
</tr>
</thead>`));

		globals.maps.filter(m => m.show).reverse().forEach(map => {
			entries.push($(`
<tfoot>
<tr>
    <td style="text-align: left; font-weight: 500">${map.map[0].toUpperCase() + map.map.slice(1)}</td>
    <td style="color: #49ACDF">${map.team2Score}</td>
    <td style="color: #B13C42">${map.team1Score}</td>
</tr>
</tfoot>`));
		});

		return entries;
	}

	return {
		setMaps: setMaps,
		getScoresTable: getScoresTable
	};
});
