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
  className = '',
}) {
  /** This is a simple select builder for lookup options. */
  return (
    <select
      id={id}
      className={`form-select ${className}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-describedby={id ? `${id}-desc` : undefined}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
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
   * This component renders ASSET DEVICES dynamically based on lookUpData.
   * Updated to match assets/new_asset_devices_design_notes.md pixel-accurate spec:
   * - Card border 1px #e6e6e6, radius 2px, padding 12-16px
   * - Two-column grid with 24px column gap, 12px row gap
   * - Labels 12px/16px semibold, 4px spacing to control
   * - Controls 28px height, 1px border, 2px radius
   * - Field order: Status, Antenna Manufacturer, Antenna Model
   */
  const lookUpData = useMemo(
    () => [
      // Example inline data; in real runtime this is provided by orchestrator
      { lookupSetName: 'ASSET_STATUSES', values: [
        { id: 4, lookupValue: 'Installed', lookupDescription: 'Installed' },
        { id: 5, lookupValue: 'Obsolete', lookupDescription: 'Obsolete' },
        { id: 3, lookupValue: 'To Be Installed', lookupDescription: 'To Be Installed' },
      ]},
      { lookupSetName: 'ANTENNA_MANUFACTURERS', values: [
        { id: 5200, lookupValue: 'CTI', lookupDescription: 'CTI' },
        { id: 5060, lookupValue: 'General Electric', lookupDescription: 'General Electric' },
        { id: 5162, lookupValue: 'Sierra Wireless', lookupDescription: 'Sierra Wireless' },
      ]},
      { lookupSetName: 'ANTENNA_MODELS', values: [
        { id: 5202, lookupValue: 'GE PTC', lookupDescription: 'GE PTC', parentLookupValue: 5060 },
        { id: 1168, lookupValue: 'MARX-C1', lookupDescription: 'MARX-C1', parentLookupValue: 5060 },
        { id: 5163, lookupValue: 'Raven-X', lookupDescription: 'Raven-X', parentLookupValue: 5162 },
      ]},
      { lookupSetName: 'ASSET_DEVICES', values: [
        { id: 9082, lookupValue: 'CMU' },
        { id: 9084, lookupValue: 'LCV' },
        { id: 9083, lookupValue: 'HPEAP' },
      ]},
    ],
    []
  );

  // Scoped styles reflecting assets/new_asset_devices_design_notes.md
  const style = `
  :root {
    --bg-canvas: #ffffff;
    --bg-panel: #ffffff;
    --text-strong: #333333;
    --text-default: #4a4a4a;
    --text-muted: #6b7280;
    --border-default: #d6d6d6;
    --border-subtle: #e6e6e6;
    --border-hover: #bfbfbf;
    --accent: #2f55a4;
    --accent-rgb: 47, 85, 164;
  }

  .page-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 16px;
    background: var(--bg-canvas);
    font-family: "Helvetica Neue", Arial, sans-serif;
  }

  .device-fieldset {
    border: 1px solid var(--border-subtle);
    border-radius: 2px;
    padding: 12px 16px;
    margin-bottom: 16px;
    background: var(--bg-panel);
  }
  .device-legend {
    padding: 0 6px;
    margin-left: 8px;
    color: var(--text-strong);
    font: 600 13px/18px "Helvetica Neue", Arial, sans-serif;
  }
  .device-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-strong);
  }

  .device-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 12px;
    margin-top: 8px;
  }

  .card {
    background: var(--bg-panel);
    border: 1px solid var(--border-subtle);
    border-radius: 2px;
    padding: 12px 16px;
  }
  .card-title {
    font: 600 13px/18px "Helvetica Neue", Arial, sans-serif;
    color: var(--text-strong);
    margin: 0 0 8px 0;
  }

  .two-col-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 12px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
  }
  .form-field > label {
    font: 600 12px/16px "Helvetica Neue", Arial, sans-serif;
    color: var(--text-strong);
    margin-bottom: 4px;
  }
  .input {
    height: 28px;
    border: 1px solid var(--border-default);
    border-radius: 2px;
    padding: 0 8px;
    font: 400 12px/28px "Helvetica Neue", Arial, sans-serif;
    color: var(--text-default);
    background: #fff;
    width: 100%;
    min-width: 0;
  }
  .input:hover { border-color: var(--border-hover); }
  .input:focus {
    border-color: var(--accent);
    outline: 2px solid rgba(var(--accent-rgb), 0.25);
    outline-offset: 0;
  }

  .disabled-block {
    opacity: 0.6;
  }

  @media (max-width: 991px) {
    .device-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .card { padding: 10px; }
    .two-col-fields { grid-template-columns: 1fr; column-gap: 0; row-gap: 10px; }
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
      // derive "To Be Installed" from ASSET_STATUSES if present
      const tbi =
        (statusOptions || []).find((s) => s.lookupValue === 'To Be Installed')
          ?.lookupValue || 'To Be Installed';
      deviceNames.forEach((name) => {
        if (!next[name]) next[name] = { status: tbi, antennaMfg: '', antennaModel: '' };
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

  // Status is read-only in UI; keep handler for completeness but it won't be used.
  const onStatusChange = (deviceName) => (_e) => {
    // No-op since Status is disabled. Kept for potential future use.
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

  // Ensure any downstream data consumers receive a normalized default status
  useEffect(() => {
    // no-op here in this minimal sandbox; in the full app this would push to context
    // Left intentionally minimal to avoid side effects in this template
  }, [deviceFields, deviceEnabled]);

  return (
    <div className="page-container">
      <style>{style}</style>
      <h2 style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 18, margin: '0 0 12px 0', color: 'var(--text-strong)' }}>
        New Asset — Devices
      </h2>

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
          <fieldset key={deviceName} className="device-fieldset">
            <legend className="device-legend">
              <label className="device-toggle">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={onToggleDevice(deviceName)}
                  aria-label={`${deviceName} enabled`}
                />
                {deviceName} Enabled
              </label>
            </legend>

            <section className={`device-grid ${enabled ? '' : 'disabled-block'}`}>
              <article className="card">
                <h3 className="card-title">Asset Devices</h3>
                <div className="two-col-fields">
                  <div className="form-field">
                    <label htmlFor={`${deviceName}-status`}>Status</label>
                    <SimpleSelect
                      id={`${deviceName}-status`}
                      value={
                        fields.status ||
                        ((statusOptions || []).find(
                          (s) => s.lookupValue === 'To Be Installed'
                        )?.lookupValue || 'To Be Installed')
                      }
                      onChange={onStatusChange(deviceName)}
                      options={statusOptions}
                      disabled={true}
                      placeholder={''}
                      className="input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor={`${deviceName}-antennaMfg`}>Antenna Manufacturer</label>
                    <SimpleSelect
                      id={`${deviceName}-antennaMfg`}
                      value={fields.antennaMfg}
                      onChange={onAntennaMfgChange(deviceName)}
                      options={antennaMfgs}
                      disabled={!enabled}
                      placeholder={''}
                      className="input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor={`${deviceName}-antennaModel`}>Antenna Model</label>
                    <SimpleSelect
                      id={`${deviceName}-antennaModel`}
                      value={fields.antennaModel}
                      onChange={onAntennaModelChange(deviceName)}
                      options={filteredModels}
                      disabled={!enabled || !fields.antennaMfg}
                      placeholder={''}
                      className="input"
                    />
                  </div>
                  <div aria-hidden="true" />
                </div>
              </article>

              <article className="card">
                <h3 className="card-title">Commissioning Information</h3>
                <div className="two-col-fields">
                  <div className="form-field">
                    <label>Registered</label>
                    <input className="input" type="text" disabled value="" />
                  </div>
                  <div className="form-field">
                    <label>Commissioned</label>
                    <input className="input" type="text" disabled value="" />
                  </div>
                </div>
              </article>
            </section>
          </fieldset>
        );
      })}
    </div>
  );
}
