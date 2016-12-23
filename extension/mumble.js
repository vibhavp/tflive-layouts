'use strict';

const mumble = require('mumble');

module.exports = function (nodecg) {
	const mumbleAddr = new nodecg.Replicant('mumble_addr', 'tflive-layouts');
	const mumblePort = new nodecg.Replicant('mumble_port', 'tflive-layouts');
	const mumblePwd = new nodecg.Replicant('mumble_pwd', 'tflive-layouts');
	const mumbleBotName = new nodecg.Replicant('mumble_bot_name', 'tflive-layouts');
	const mumbleConnected = new nodecg.Replicant('mumble_connected', 'tflive-layouts', {persistent: false, defaultValue: false});

	const mumblePlayerList = new nodecg.Replicant('mumble_player_list', 'tflive-layouts', {persistent: false});
	const mumbleFilteredNames = new nodecg.Replicant('filtered_mumble_names', 'tflive-layouts', {defaultValue: []});
	const roles = new nodecg.Replicant('roles', 'tflive-layouts');
	const showCasterVoice = new nodecg.Replicant('show_caster_voice', 'tflive-layouts', {defaultValue: true});

	function setVoiceStatus(status) {
		return function (user) {
			const talkingRole = isRole(user.name);
			if (talkingRole && showCasterVoice.value) {
				nodecg.sendMessage('mumble_status', {role: talkingRole, active: status});
			} else {
				nodecg.sendMessage('mumble_status', {name: user.name, active: status});
			}
		};
	}

	function isRole(name) {
		for (const role in roles.value) {
			if (roles.value[role].mumble_name === name) {
				return role;
			}
		}

		return null;
	}

	let currConnection;

	function connectMumble() {
		mumble.connect(mumbleAddr.value + ':' + mumblePort.value, {}, (error, connection) => {
			if (error) {
				nodecg.log.error('mumble error: %j', error);
				mumbleConnected.value = false;
				return;
			}

			let userList = [];

			function makePlayerList() {
				for (const user of connection.users()) {
					if (user.name !== mumbleBotName.value && !isRole(user.name) && mumbleFilteredNames.value.indexOf(user.name) === -1) {
						userList.push(user.name);
					}
				}

				mumblePlayerList.value = userList;
			}

			let pwd;
			if (mumblePwd.value && mumblePwd.value.trim() !== '') {
				pwd = mumblePwd.value;
			}

			connection.on('ready', () => {
				makePlayerList();
				mumbleConnected.value = true;
			});

			connection.on('user-connect', (user) => {
				const listIndex = userList.indexOf(user.name);
				if (user.name !== mumbleBotName.value && !isRole(user.name) && mumbleFilteredNames.value.indexOf(user.name) === -1) {
					userList.push(user.name);
				} else if (listIndex !== -1){
					userList.splice(listIndex, 1);
				}

				mumblePlayerList.value = userList;
			});

			connection.on('user-disconnect', (user) => {
				const listIndex = userList.indexOf(user.name);

				if (listIndex !== -1) {
					userList.splice(listIndex, 1);
				}
				mumblePlayerList.value = userList;
			});

			connection.on('voice-start', setVoiceStatus(true));
			connection.on('voice-end', setVoiceStatus(false));
			nodecg.listenFor('mumble_refresh_players', () => {
				userList = [];
				makePlayerList();
			});
			connection.authenticate(mumbleBotName.value, pwd);
			currConnection = connection;
		});
	}

	nodecg.listenFor('mumble_disconnect', () => {
		if (currConnection){
			currConnection.disconnect();
		}
		mumbleConnected.value = false;
	});

	try {
		nodecg.listenFor('mumble_connect', connectMumble);
	}
	catch (e) {
		nodecg.log.error('Error with mumble: ' + e);
	}
};
