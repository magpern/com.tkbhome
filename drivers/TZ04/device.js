'use strict';

const Homey = require('homey');
const ZwaveMeteringDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ04oubleRelayMeteringModule extends ZwaveMeteringDevice {
	async onNodeInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');

		// Settings
		this.registerSetting('watt_report', value => Math.round(newValue / 5));
		this.registerSetting('kwh_report', value => Math.round(newValue / 10));

		// Flows
		let resetMeterFlowAction = this.homey.flow.getActionCard('resetMeter');

		let commandClassMeter = this.getCommandClass('METER');
		if (!(commandClassMeter instanceof Error) && typeof commandClassMeter.METER_RESET === 'function') {

			resetMeterFlowAction.registerRunListener(() => {
				commandClassMeter.METER_RESET({}, (err, result) => {
					if (err || result !== 'TRANSMIT_COMPLETE_OK') return Promise.reject(err || result);
					return Promise.resolve();
				});
			});
		}
	}
}

module.exports = TZ04oubleRelayMeteringModule;
