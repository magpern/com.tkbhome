'use strict';

const Homey = require('homey');
const ZwaveMeteringDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ88MeteringPlug extends ZwaveMeteringDevice {
	async onNodeInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY', {
			pollInterval: this.getSetting('poll_interval') * 1000,
		});
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_current', 'METER', {
			pollInterval: this.getSetting('poll_interval_current') * 1000,
		});
		this.registerCapability('measure_voltage', 'METER', {
			pollInterval: this.getSetting('poll_interval_current') * 1000,
		});

		// Settings
		this.registerSetting('watt_interval', value => value / 5);
		this.registerSetting('kwh_interval', value => value / 10);
		this.registerSetting('amp_overload', value => Math.round(value * 100));
		this.registerSetting('always_on', value => (value) ? 0 : 1);

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

module.exports = TZ88MeteringPlug;
