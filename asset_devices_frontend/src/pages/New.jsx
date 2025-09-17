import React, { useEffect, useMemo, useState } from 'react';

/**
 * Simple Select component helper.
 * Expects options to be array of { lookupValue, lookupDescription?, id? }
 */
// PUBLIC_INTERFACE
function SimpleSelect({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder = '-- Select --',
  id,
}) {
  /** This is a simple select builder for lookup options. */
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
export default function New() {
  /**
   * Render "Asset Devices" dynamically from ASSET_DEVICES lookup:
   * - Each device has an Enabled toggle
   * - Left card: Status
   * - Right card: Antenna Mfg, Model filtered by manufacturer
   */
  // Inject the provided lookUpData JSON here as the single source of truth.
  // Replace [...] with the actual JSON injected by the orchestrator for runtime.
  const lookUpData = useMemo(
    () => [
      { "lookupSetName": "ASSET_STATUSES", "values": [ { "id": 4, "lookupValue": "Installed", "lookupDescription": "Installed", "parentLookupValue": null, "lookupOrder": 2 }, { "id": 5, "lookupValue": "Obsolete", "lookupDescription": "Obsolete", "parentLookupValue": null, "lookupOrder": 3 }, { "id": 9588, "lookupValue": "TESTU", "lookupDescription": "84A212951WMP1", "parentLookupValue": null, "lookupOrder": 2 }, { "id": 3, "lookupValue": "To Be Installed", "lookupDescription": "To Be Installed", "parentLookupValue": null, "lookupOrder": 1 } ] },
      { "lookupSetName": "ANTENNA_MANUFACTURERS", "values": [ { "id": 5200, "lookupValue": "CTI", "lookupDescription": "CTI", "parentLookupValue": null, "lookupOrder": 6 }, { "id": 5060, "lookupValue": "General Electric", "lookupDescription": "General Electric", "parentLookupValue": null, "lookupOrder": 2 }, { "id": 9193, "lookupValue": "Generic", "lookupDescription": "Generic", "parentLookupValue": null, "lookupOrder": 7 }, { "id": 1153, "lookupValue": "No Antenna", "lookupDescription": "No Antenna", "parentLookupValue": null, "lookupOrder": 3 }, { "id": 5162, "lookupValue": "Sierra Wireless", "lookupDescription": "Sierra Wireless", "parentLookupValue": null, "lookupOrder": 5 }, { "id": 5000, "lookupValue": "Wired Matrix", "lookupDescription": "WiredMatrix", "parentLookupValue": null, "lookupOrder": 4 }, { "id": 34, "lookupValue": "Wireless Matrix", "lookupDescription": "Wireless Matrix", "parentLookupValue": null, "lookupOrder": 1 } ] },
      { "lookupSetName": "ANTENNA_MODELS", "values": [ { "id": 5202, "lookupValue": "GE PTC", "lookupDescription": "GE PTC", "parentLookupValue": 5060, "lookupOrder": 6 }, { "id": 1168, "lookupValue": "MARX-C1", "lookupDescription": "MARX-C1", "parentLookupValue": 5060, "lookupOrder": 3 }, { "id": 35, "lookupValue": "MBS2-LPR", "lookupDescription": "MBS2-LPR", "parentLookupValue": 34, "lookupOrder": 1 }, { "id": 5201, "lookupValue": "REX", "lookupDescription": "REX", "parentLookupValue": 5200, "lookupOrder": 5 }, { "id": 6340, "lookupValue": "REX-OBN", "lookupDescription": "REX with Mobile IP", "parentLookupValue": 5200, "lookupOrder": 8 }, { "id": 5163, "lookupValue": "Raven-X", "lookupDescription": "Raven-X", "parentLookupValue": 5162, "lookupOrder": 4 }, { "id": 9194, "lookupValue": "Server Ping Antenna", "lookupDescription": "Server Ping Antena", "parentLookupValue": 9193, "lookupOrder": 7 }, { "id": 5061, "lookupValue": "WMP1", "lookupDescription": "84A212951WMP1", "parentLookupValue": 5060, "lookupOrder": 2 }, { "id": 9584, "lookupValue": "WMP20", "lookupDescription": "84A212951WMP1", "parentLookupValue": 5060, "lookupOrder": 2 } ] },
      // If ASSET_DEVICES are part of the provided dataset, include them here.
      // This component expects ASSET_DEVICES to exist in lookUpData.
      // Example:
      // { "lookupSetName": "ASSET_DEVICES", "values": [ { "id": 1, "lookupValue": "GPS" }, ... ] }
    ],
    []
  );

  // Scoped style for the component (from design notes)
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

  const deviceNames = useMemo(
    () => devicesLookup.map((v) => v.lookupValue),
    [devicesLookup]
  );

  const [deviceEnabled, setDeviceEnabled] = useState({});
  const [deviceFields, setDeviceFields] = useState({});
  const [filteredModelsByDevice, setFilteredModelsByDevice] = useState({});

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

  useEffect(() => {
    deviceNames.forEach((name) => {
      const mfg = deviceFields[name]?.antennaMfg || '';
      recalcFilteredModelsForDevice(name, mfg);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antennaModels, antennaMfgs]);

  return (
    <div style={{ padding: 24 }}>
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
