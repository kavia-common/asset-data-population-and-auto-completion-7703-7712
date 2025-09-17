import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Minimal mock LookupDataContext to keep this example self-contained.
// In your full app, import LookupDataContext from ../context/LookupDataContext and remove this.
const LookupDataContext = createContext({ lookUpData: [] });

/**
 * Simple Select component helper.
 * Expects options to be array of { lookupValue, lookupDescription?, id? }
 */
function SimpleSelect({ value, onChange, options = [], disabled = false, placeholder = '-- Select --' }) {
  return (
    <select className="form-select" value={value} onChange={onChange} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.lookupValue} value={opt.lookupValue}>
          {opt.lookupDescription || opt.lookupValue}
        </option>
      ))}
    </select>
  );
}

// PUBLIC_INTERFACE
export const FIELDS = {
  ASSET_DEVICES: 'ASSET_DEVICES',
  ANTENNA_MANUFACTURERS: 'ANTENNA_MANUFACTURERS',
  ANTENNA_MODELS: 'ANTENNA_MODELS',
  ASSET_STATUSES: 'ASSET_STATUSES',
};

// PUBLIC_INTERFACE
export function New() {
  /**
   * This component renders an "Asset Devices" section dynamically from lookUpData's ASSET_DEVICES:
   * - Each device has its own fieldset and an "Enabled" checkbox
   * - When enabled, shows Antenna Mfg and Antenna Model selects
   * - Antenna Models are filtered by selected Antenna Mfg using parentLookupValue matching
   */
  const { lookUpData } = useContext(LookupDataContext);

  // extract lookups by set name
  const getLookupValues = (setName) => {
    const set = lookUpData?.find(s => s.lookupSetName === setName);
    return set?.values || [];
  };

  const devicesLookup = useMemo(() => getLookupValues(FIELDS.ASSET_DEVICES), [lookUpData]);
  const antennaMfgs = useMemo(() => getLookupValues(FIELDS.ANTENNA_MANUFACTURERS), [lookUpData]);
  const antennaModels = useMemo(() => getLookupValues(FIELDS.ANTENNA_MODELS), [lookUpData]);

  // Build the device list of names from lookup values
  const deviceNames = useMemo(
    () => devicesLookup.map(v => v.lookupValue),
    [devicesLookup]
  );

  // Enabled toggle state per device
  const [deviceEnabled, setDeviceEnabled] = useState({});
  // Per-device fields: { [deviceName]: { antennaMfg: string, antennaModel: string } }
  const [deviceFields, setDeviceFields] = useState({});
  // Per-device filtered antenna models based on selected antenna manufacturer
  const [filteredModelsByDevice, setFilteredModelsByDevice] = useState({});

  // Initialize device fields when the lookup device list changes
  useEffect(() => {
    if (!deviceNames.length) return;
    setDeviceEnabled(prev => {
      const next = { ...prev };
      deviceNames.forEach(name => {
        if (typeof next[name] === 'undefined') next[name] = false;
      });
      return next;
    });
    setDeviceFields(prev => {
      const next = { ...prev };
      deviceNames.forEach(name => {
        if (!next[name]) next[name] = { antennaMfg: '', antennaModel: '' };
      });
      return next;
    });
  }, [deviceNames]);

  // When a device's antenna manufacturer changes, filter its models list
  const recalcFilteredModelsForDevice = (deviceName, selectedMfgValue) => {
    const mfgObj = antennaMfgs.find(m => m.lookupValue === selectedMfgValue);
    const mfgId = mfgObj?.id;
    const models = mfgId
      ? antennaModels.filter(mod => mod.parentLookupValue === mfgId)
      : [];
    setFilteredModelsByDevice(prev => ({ ...prev, [deviceName]: models }));
  };

  const onToggleDevice = (deviceName) => (e) => {
    const checked = e.target.checked;
    setDeviceEnabled(prev => ({ ...prev, [deviceName]: checked }));
    // If disabling, keep the values but they won't be submitted unless required otherwise
  };

  const onAntennaMfgChange = (deviceName) => (e) => {
    const value = e.target.value;
    setDeviceFields(prev => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], antennaMfg: value, antennaModel: '' },
    }));
    recalcFilteredModelsForDevice(deviceName, value);
  };

  const onAntennaModelChange = (deviceName) => (e) => {
    const value = e.target.value;
    setDeviceFields(prev => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], antennaModel: value },
    }));
  };

  // Recompute filtered models when deviceFields change (e.g., when restoring previous values)
  useEffect(() => {
    deviceNames.forEach((name) => {
      const mfg = deviceFields[name]?.antennaMfg || '';
      recalcFilteredModelsForDevice(name, mfg);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antennaModels, antennaMfgs]);

  return (
    <div style={{ padding: 24 }}>
      <h2>New Asset - Devices</h2>
      <p>This section is rendered dynamically from the ASSET_DEVICES lookup set.</p>

      {devicesLookup.length === 0 && (
        <div style={{ padding: '8px 0' }}>
          <em>No devices available in lookup data.</em>
        </div>
      )}

      {devicesLookup.map((device) => {
        const deviceName = device.lookupValue;
        const enabled = !!deviceEnabled[deviceName];
        const fields = deviceFields[deviceName] || { antennaMfg: '', antennaModel: '' };
        const filteredModels = filteredModelsByDevice[deviceName] || [];

        return (
          <fieldset key={deviceName} style={{ marginBottom: 16, borderRadius: 8 }}>
            <legend style={{ fontWeight: 600 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={onToggleDevice(deviceName)}
                />
                {deviceName} Enabled
              </label>
            </legend>

            <div style={{ opacity: enabled ? 1 : 0.6 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                <label style={{ minWidth: 160 }}>Antenna Mfg:</label>
                <div style={{ minWidth: 260 }}>
                  <SimpleSelect
                    value={fields.antennaMfg}
                    onChange={onAntennaMfgChange(deviceName)}
                    options={antennaMfgs}
                    disabled={!enabled}
                    placeholder="-- Select Manufacturer --"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <label style={{ minWidth: 160 }}>Antenna Model:</label>
                <div style={{ minWidth: 260 }}>
                  <SimpleSelect
                    value={fields.antennaModel}
                    onChange={onAntennaModelChange(deviceName)}
                    options={filteredModels}
                    disabled={!enabled || !fields.antennaMfg}
                    placeholder="-- Select Model --"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

// Demo wrapper to provide sample lookUpData so the page works in this minimal template.
const sampleLookupData = [
  {
    lookupSetName: 'ASSET_DEVICES',
    values: [
      { id: 1, lookupValue: 'GPS', lookupDescription: 'GPS' },
      { id: 2, lookupValue: 'Modem', lookupDescription: 'Modem' },
      { id: 3, lookupValue: 'WiFi', lookupDescription: 'WiFi' },
    ],
  },
  {
    lookupSetName: 'ANTENNA_MANUFACTURERS',
    values: [
      { id: 34, lookupValue: 'Wireless Matrix', lookupDescription: 'Wireless Matrix' },
      { id: 5060, lookupValue: 'General Electric', lookupDescription: 'General Electric' },
      { id: 5200, lookupValue: 'CTI', lookupDescription: 'CTI' },
    ],
  },
  {
    lookupSetName: 'ANTENNA_MODELS',
    values: [
      { id: 35, lookupValue: 'MBS2-LPR', lookupDescription: 'MBS2-LPR', parentLookupValue: 34 },
      { id: 1168, lookupValue: 'MARX-C1', lookupDescription: 'MARX-C1', parentLookupValue: 5060 },
      { id: 5201, lookupValue: 'REX', lookupDescription: 'REX', parentLookupValue: 5200 },
    ],
  },
];

/**
 * Export a page-level component wired with a mock provider so the route renders in this template.
 * In the real app, you'd render <New /> within your actual LookupDataContext provider.
 */
// PUBLIC_INTERFACE
export default function NewPageWithProvider() {
  return (
    <LookupDataContext.Provider value={{ lookUpData: sampleLookupData }}>
      <New />
    </LookupDataContext.Provider>
  );
}
