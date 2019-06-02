import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useActions } from 'm/store';

import { getConfigs, fetchConfigs, updateConfigs } from 'd/configs';
import {
  clearStorage,
  selectChartStyleIndex,
  getSelectedChartStyleIndex
} from 'd/app';

import ContentHeader from 'c/ContentHeader';
import Switch from 'c/Switch';
import ToggleSwitch from 'c/ToggleSwitch';
import Input from 'c/Input';
import Button from 'c/Button';
import Selection from 'c/Selection';
import TrafficChartSample from 'c/TrafficChartSample';

import s0 from 'c/Config.module.css';

const propsList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

const optionsRule = [
  {
    label: 'Global',
    value: 'Global'
  },
  {
    label: 'Rule',
    value: 'Rule'
  },
  {
    label: 'Direct',
    value: 'Direct'
  }
];

const optionsLogLevel = [
  {
    label: 'info',
    value: 'info'
  },
  {
    label: 'warning',
    value: 'warning'
  },
  {
    label: 'error',
    value: 'error'
  },
  {
    label: 'debug',
    value: 'debug'
  },
  {
    label: 'silent',
    value: 'silent'
  }
];

const actions = {
  selectChartStyleIndex,
  fetchConfigs,
  updateConfigs
};

const mapStateToProps = s => ({
  configs: getConfigs(s)
});

export default function ConfigContainer() {
  const { fetchConfigs } = useActions(actions);
  const { configs } = useStoreState(mapStateToProps);
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);
  return <Config configs={configs} />;
}

const mapStateToProps2 = s => ({
  selectedChartStyleIndex: getSelectedChartStyleIndex(s)
});

function Config({ configs }) {
  const { updateConfigs, selectChartStyleIndex } = useActions(actions);
  const { selectedChartStyleIndex } = useStoreState(mapStateToProps2);
  // configState to track component internal state
  // prevConfigs to track external props.configs
  const [configState, _setConfigState] = useState(configs);
  const [prevConfigs, setPrevConfigs] = useState(configs);
  // equivalent of getDerivedStateFromProps
  if (prevConfigs !== configs) {
    setPrevConfigs(configs);
    _setConfigState(configs);
  }

  const setConfigState = (name, val) => {
    _setConfigState({
      ...configState,
      [name]: val
    });
  };

  function handleInputOnChange(e) {
    const target = e.target;
    const { name } = target;
    let { value } = target;
    switch (target.name) {
      case 'allow-lan':
        value = target.checked;
        setConfigState(name, value);
        updateConfigs({ [name]: value });
        break;
      case 'mode':
      case 'log-level':
        setConfigState(name, value);
        updateConfigs({ [name]: value });
        break;
      case 'redir-port':
      case 'socks-port':
      case 'port':
        if (target.value !== '') {
          const num = parseInt(target.value, 10);
          if (num < 0 || num > 65535) return;
        }
        setConfigState(name, value);
        break;
      default:
        return;
    }
  }

  function handleInputOnBlur(e) {
    const target = e.target;
    const { name, value } = target;
    switch (name) {
      case 'port':
      case 'socks-port':
      case 'redir-port': {
        const num = parseInt(value, 10);
        if (num < 0 || num > 65535) return;
        updateConfigs({ [name]: num });
        break;
      }
    }
  }

  function handleChartStyleIndexOnChange(idx) {
    selectChartStyleIndex(idx);
  }

  return (
    <div>
      <ContentHeader title="Config" />
      <div className={s0.root}>
        <div>
          <div className={s0.label}>HTTP Proxy Port</div>
          <Input
            name="port"
            value={configState.port}
            onChange={handleInputOnChange}
            onBlur={handleInputOnBlur}
          />
        </div>

        <div>
          <div className={s0.label}>SOCKS5 Proxy Port</div>
          <Input
            name="socks-port"
            value={configState['socks-port']}
            onChange={handleInputOnChange}
            onBlur={handleInputOnBlur}
          />
        </div>

        <div>
          <div className={s0.label}>Redir Port</div>
          <Input
            name="redir-port"
            value={configState['redir-port']}
            onChange={handleInputOnChange}
            onBlur={handleInputOnBlur}
          />
        </div>

        <div>
          <div className={s0.label}>Allow LAN</div>
          <Switch
            name="allow-lan"
            checked={configState['allow-lan']}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Mode</div>
          <ToggleSwitch
            options={optionsRule}
            name="mode"
            value={configState.mode}
            onChange={handleInputOnChange}
          />
        </div>

        <div>
          <div className={s0.label}>Log Level</div>
          <ToggleSwitch
            options={optionsLogLevel}
            name="log-level"
            value={configState['log-level']}
            onChange={handleInputOnChange}
          />
        </div>
      </div>

      <div className={s0.sep}>
        <div />
      </div>

      <div className={s0.section}>
        <div>
          <div className={s0.label}>Chart Style</div>
          <Selection
            OptionComponent={TrafficChartSample}
            optionPropsList={propsList}
            selectedIndex={selectedChartStyleIndex}
            onChange={handleChartStyleIndexOnChange}
          />
        </div>
        <div>
          <div className={s0.label}>Action</div>
          <Button label="Log out" onClick={clearStorage} />
        </div>
      </div>
    </div>
  );
}

Config.propTypes = {
  configs: PropTypes.object
};
