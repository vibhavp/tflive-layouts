'use strict';

const mumble = require('mumble');

module.exports = function (nodecg) {
	const mumbleAddr = new nodecg.Replicant('mumble_addr', 'tflive-pregame');
	const mumblePort = new nodecg.Replicant('mumble_port', 'tflive-pregame');
	const mumblePwd = new nodecg.Replicant('mumble_pwd', 'tflive-pregame');
	const mumbleBotName = new nodecg.Replicant('mumble_bot_name', 'tflive-pregame');
	const mumbleChannel = new nodecg.Replicant('mumble_channel', 'tflive-pregame');
	const mumbleConnected = new nodecg.Replicant('mumble_connected', 'tflive-pregame', {persistent: false, defaultValue: []});

	const mumblePlayerList = new nodecg.Replicant('mumble_player_list', 'tflive-pregame', {persistent: false});
	const mumbleFilteredNames = new nodecg.Replicant('filtered_mumble_names', 'tflive-pregame', {defaultValue: []});
	const roles = new nodecg.Replicant('roles', 'tflive-pregame');

	function setVoiceStatus(status) {
		return function (user) {
			const talkingRole = isRole(user.name);
			if (talkingRole) {
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

	function connectMumble() {
		mumble.connect(mumbleAddr.value + ':' + mumblePort.value, {}, (error, connection) => {
			const userList = [];

			function makePlayerList() {
				for (const user of connection.users()) {
					if (user.name !== mumbleBotName.value && !isRole(user.name) && mumbleFilteredNames.value.indexOf(user.name) === -1) {
						userList.push(user.name);
					}
				}

				mumblePlayerList.value = userList;
			}

			if (error) {
				nodecg.log.error('mumble error: %j', error);
				mumbleConnected.value = true;
				return;
			}

			let pwd;
			if (mumblePwd.value && mumblePwd.value.trim() !== '') {
				pwd = mumblePwd.value;
			}

			connection.on('ready', () => {
				makePlayerList();
				nodecg.sendMessage('mumble_connected');

				if (mumbleChannel.value && mumbleChannel.value.trim() !== '') {
					const channel = connection.channelByName(mumbleChannel.value);
					if (channel) {
						channel.join();
					} else {
						nodecg.log.error('could not join channel ' + mumbleChannel.value);
					}
				}
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
			connection.on('user-move', makePlayerList);
			nodecg.listenFor('mumble_refresh_players', makePlayerList);
			connection.authenticate(mumbleBotName.value, pwd);
		});
	}

	try {
		nodecg.listenFor('mumble_connect', connectMumble);
	}
	catch (e) {
		nodecg.log.error('Error with mumble: ' + e);
	}
};
