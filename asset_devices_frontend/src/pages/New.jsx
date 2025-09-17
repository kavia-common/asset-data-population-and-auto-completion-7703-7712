import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Minimal mock LookupDataContext to keep this example self-contained.
// In your full app, import LookupDataContext from ../context/LookupDataContext and remove this.
const LookupDataContext = createContext({ lookUpData: [] });

/**
 * Simple Select component helper.
 * Expects options to be array of { lookupValue, lookupDescription?, id? }
 */
function SimpleSelect({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder = '-- Select --',
  id,
}) {
  return (
    <select
      id={id}
      className="form-select asset-form-select"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
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
   * Render "Asset Devices" dynamically from ASSET_DEVICES lookup:
   * - Each device has an Enabled toggle
   * - Styled as two cards side-by-side:
   *    Left card: ASSET DEVICES (Status)
   *    Right card: Asset Registration - Commissioning Information (Antenna Mfg, Model)
   * - Styles match the provided design notes.
   */
  const { lookUpData } = useContext(LookupDataContext);

  // Scoped CSS compiled from assets/asset_devices_section_design_notes.md
  const style = `
  :root {
    --color-bg-canvas: #FFFFFF;
    --color-border-subtle: #E0E0E0;
    --color-border-input: #C9C9C9;
    --color-text-strong: #333333;
    --color-text-default: #000000;
    --color-accent-deep: #003366;
    --color-focus: #2B6CB0;
  }
  .asset-device-fieldset {
    border: 1px solid var(--color-border-subtle);
    border-radius: 6px;
    padding: 12px 12px 16px 12px;
    background: #fff;
    margin-bottom: 16px;
  }
  .asset-device-legend {
    padding: 0 6px;
    margin-left: 8px;
    color: var(--color-accent-deep);
    font: 600 13px/1.2 "Helvetica Neue", Arial, sans-serif;
  }
  .asset-device-toggle {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    color: var(--color-text-strong);
    font: 600 13px/1.2 "Helvetica Neue", Arial, sans-serif;
  }
  .asset-devices-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    background: var(--color-bg-canvas);
  }
  .asset-card {
    background: #fff;
    border: 1px solid var(--color-border-subtle);
    border-radius: 4px;
    padding: 16px;
  }
  .asset-card-title {
    margin: 0 0 12px 0;
    font: 700 13px/1.2 "Helvetica Neue", Arial, sans-serif;
    color: var(--color-accent-deep);
  }
  .asset-form-grid {
    display: grid;
    grid-template-columns: 160px 1fr;
    column-gap: 8px;
    row-gap: 10px;
    align-items: center;
  }
  .asset-form-label {
    text-align: right;
    color: var(--color-text-strong);
    font: 400 12px/1.2 "Helvetica Neue", Arial, sans-serif;
  }
  .asset-form-select {
    height: 28px;
    padding: 4px 8px;
    border: 1px solid var(--color-border-input);
    border-radius: 2px;
    background: #fff;
    color: var(--color-text-default);
    font: 400 12px/1 "Helvetica Neue", Arial, sans-serif;
    width: 100%;
    max-width: 420px;
  }
  .asset-form-select:hover { border-color: #A8A8A8; }
  .asset-form-select:focus { outline: 2px solid var(--color-focus); outline-offset: 0; }
  .device-disabled { opacity: 0.6; }
  @media (max-width: 768px) {
    .asset-devices-panel { grid-template-columns: 1fr; gap: 16px; }
    .asset-form-grid { grid-template-columns: 1fr; }
    .asset-form-label { text-align: left; margin-bottom: 6px; }
  }
  `;

  // extract lookups by set name
  const getLookupValues = (setName) => {
    const set = lookUpData?.find((s) => s.lookupSetName === setName);
    return set?.values || [];
  };

  const devicesLookup = useMemo(
    () => getLookupValues(FIELDS.ASSET_DEVICES),
    [lookUpData]
  );
  const statusOptions = useMemo(
    () => getLookupValues(FIELDS.ASSET_STATUSES),
    [lookUpData]
  );
  const antennaMfgs = useMemo(
    () => getLookupValues(FIELDS.ANTENNA_MANUFACTURERS),
    [lookUpData]
  );
  const antennaModels = useMemo(
    () => getLookupValues(FIELDS.ANTENNA_MODELS),
    [lookUpData]
  );

  // Build the device list of names from lookup values
  const deviceNames = useMemo(
    () => devicesLookup.map((v) => v.lookupValue),
    [devicesLookup]
  );

  // Enabled toggle state per device
  const [deviceEnabled, setDeviceEnabled] = useState({});
  // Per-device fields: { [deviceName]: { status: string, antennaMfg: string, antennaModel: string } }
  const [deviceFields, setDeviceFields] = useState({});
  // Per-device filtered antenna models based on selected antenna manufacturer
  const [filteredModelsByDevice, setFilteredModelsByDevice] = useState({});

  // Initialize device fields when the lookup device list changes
  useEffect(() => {
    if (!deviceNames.length) return;
    setDeviceEnabled((prev) => {
      const next = { ...prev };
      deviceNames.forEach((name) => {
        if (typeof next[name] === 'undefined') next[name] = false;
      });
      return next;
    });
    setDeviceFields((prev) => {
      const next = { ...prev };
      deviceNames.forEach((name) => {
        if (!next[name]) next[name] = { status: '', antennaMfg: '', antennaModel: '' };
      });
      return next;
    });
  }, [deviceNames]);

  // When a device's antenna manufacturer changes, filter its models list
  const recalcFilteredModelsForDevice = (deviceName, selectedMfgValue) => {
    const mfgObj = antennaMfgs.find((m) => m.lookupValue === selectedMfgValue);
    const mfgId = mfgObj?.id;
    const models = mfgId
      ? antennaModels.filter((mod) => mod.parentLookupValue === mfgId)
      : [];
    setFilteredModelsByDevice((prev) => ({ ...prev, [deviceName]: models }));
  };

  const onToggleDevice = (deviceName) => (e) => {
    const checked = e.target.checked;
    setDeviceEnabled((prev) => ({ ...prev, [deviceName]: checked }));
  };

  const onStatusChange = (deviceName) => (e) => {
    const value = e.target.value;
    setDeviceFields((prev) => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], status: value },
    }));
  };

  const onAntennaMfgChange = (deviceName) => (e) => {
    const value = e.target.value;
    setDeviceFields((prev) => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], antennaMfg: value, antennaModel: '' },
    }));
    recalcFilteredModelsForDevice(deviceName, value);
  };

  const onAntennaModelChange = (deviceName) => (e) => {
    const value = e.target.value;
    setDeviceFields((prev) => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], antennaModel: value },
    }));
  };

  // Recompute filtered models when lookups change
  useEffect(() => {
    deviceNames.forEach((name) => {
      const mfg = deviceFields[name]?.antennaMfg || '';
      recalcFilteredModelsForDevice(name, mfg);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antennaModels, antennaMfgs]);

  return (
    <div style={{ padding: 24 }}>
      {/* Scoped style for this component */}
      <style>{style}</style>

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
        const fields =
          deviceFields[deviceName] || { status: '', antennaMfg: '', antennaModel: '' };
        const filteredModels = filteredModelsByDevice[deviceName] || [];

        return (
          <fieldset key={deviceName} className="asset-device-fieldset">
            <legend className="asset-device-legend">
              <label className="asset-device-toggle">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={onToggleDevice(deviceName)}
                  aria-label={`${deviceName} enabled`}
                />
                {deviceName} Enabled
              </label>
            </legend>

            <div className={`asset-devices-panel ${enabled ? '' : 'device-disabled'}`}>
              {/* Left card: ASSET DEVICES (Status) */}
              <article className="asset-card asset-devices">
                <h3 className="asset-card-title">ASSET DEVICES</h3>
                <div className="asset-form-grid">
                  <label
                    htmlFor={`${deviceName}-status`}
                    className="asset-form-label"
                  >
                    Status:
                  </label>
                  <SimpleSelect
                    id={`${deviceName}-status`}
                    value={fields.status}
                    onChange={onStatusChange(deviceName)}
                    options={statusOptions}
                    disabled={!enabled}
                    placeholder="-- Select Status --"
                  />
                </div>
              </article>

              {/* Right card: Registration/Commissioning (Antenna Mfg, Model) */}
              <article className="asset-card asset-registration">
                <h3 className="asset-card-title">
                  Asset Registration - Commissioning Information
                </h3>
                <div className="asset-form-grid">
                  <label
                    htmlFor={`${deviceName}-antennaMfg`}
                    className="asset-form-label"
                  >
                    Antenna Mfg:
                  </label>
                  <SimpleSelect
                    id={`${deviceName}-antennaMfg`}
                    value={fields.antennaMfg}
                    onChange={onAntennaMfgChange(deviceName)}
                    options={antennaMfgs}
                    disabled={!enabled}
                    placeholder="-- Select Manufacturer --"
                  />

                  <label
                    htmlFor={`${deviceName}-antennaModel`}
                    className="asset-form-label"
                  >
                    Model:
                  </label>
                  <SimpleSelect
                    id={`${deviceName}-antennaModel`}
                    value={fields.antennaModel}
                    onChange={onAntennaModelChange(deviceName)}
                    options={filteredModels}
                    disabled={!enabled || !fields.antennaMfg}
                    placeholder="-- Select Model --"
                  />
                </div>
              </article>
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
    lookupSetName: 'ASSET_STATUSES',
    values: [
      { id: 3, lookupValue: 'To Be Installed', lookupDescription: 'To Be Installed' },
      { id: 4, lookupValue: 'Installed', lookupDescription: 'Installed' },
      { id: 5, lookupValue: 'Obsolete', lookupDescription: 'Obsolete' },
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
