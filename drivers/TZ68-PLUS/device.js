'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ68PlusPlugSwitch extends ZwaveDevice {
	async onNodeInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY', {
			getOpts: {
				pollInterval: this.getSetting('poll_interval') * 1000,
			}
		});
	}
}

module.exports = TZ68PlusPlugSwitch;
