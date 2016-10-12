'use strict';

const mumble = require('mumble');

module.exports = function (nodecg) {
	const mumbleAddr = new nodecg.Replicant('mumble_addr', 'tflive');
	const mumblePort = new nodecg.Replicant('mumble_port', 'tflive');
	const mumblePwd = new nodecg.Replicant('mumble_pwd', 'tflive');
	const mumbleBotName = new nodecg.Replicant('mumble_bot_name', 'tflive');
	const mumbleChannel = new nodecg.Replicant('mumble_channel', 'tflive');

	const mumblePlayerList = new nodecg.Replicant('mumble_player_list', 'tflive', {persistent: false});
	const mumbleFilteredNames = new nodecg.Replicant('filtered_mumble_names', 'tflive', {defaultValue: []});
	const roles = new nodecg.Replicant('roles', 'tflive');

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
			function makePlayerList() {
				const userList = [];

				for (const user of connection.users()) {
					if (user.name !== mumbleBotName.value && !isRole(user.name) && mumbleFilteredNames.value.indexOf(user.name) === -1) {
						userList.push(user.name);
					}
				}

				mumblePlayerList.value = userList;
			}

			if (error) {
				nodecg.log.error('mumble error: %j', error);
				nodecg.sendMessage('mumble_error', error);
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

			connection.on('voice-start', setVoiceStatus(true));
			connection.on('voice-end', setVoiceStatus(false));
			connection.on('user-move', makePlayerList);
			connection.authenticate(mumbleBotName.value, pwd);
		});
	}

	nodecg.listenFor('mumble_connect', connectMumble);
};
