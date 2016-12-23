(function () {
	const nodecg = window.nodecg;
	const customText = new nodecg.Replicant('match-status', 'tflive-layouts', {defaultValue: {enabled: false}});
	const paused = nodecg.Replicant('paused', 'tflive-layouts', {defaultValue: false});
	const textItem = $('#custom-text');

	customText.on('change', value => {
		$('#radio-group')[0].select(value.name);
		if (value.name === 'custom') {
			textItem[0].value = value.text;
		}
	});

	$('#radio-group').on('paper-radio-group-changed', e => {
		const item = $('#radio-group')[0].selectedItem;
		const name = $(item).attr('name');
		if (!item) {
			return;
		}

		if (item.checked) {
			paused.value = (name === 'paused');
			customText.value.enabled = (name !== 'none');
			customText.value.name = $(item).attr('name');
			customText.value.text = $(item).data('text') || '';
			customText.value.matchEnded = $(item).data('match-ended');
			customText.value.hideMaps = $(item).data('hide-maps');
		}
	});

	textItem.on('change', () => {
		$("#custom").data('text', textItem[0].value);
		if (customText.value.name === 'custom') {
			customText.value.text = textItem[0].value;
		}
	});
})();
