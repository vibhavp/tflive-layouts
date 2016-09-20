(function() {
	'use strict';

	const nodecg = window.nodecg;
	const node = document.getElementById("lastfm");
	const use_lastfm = new nodecg.Replicant("use_lastfm", "tflive");
	node.addEventListener("change", () => {
		use_lastfm.value = node.active;
	});
})();
