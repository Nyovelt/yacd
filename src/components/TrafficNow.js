import React, { useState, useEffect } from 'react';
import prettyBytes from 'm/pretty-bytes';

import { useStoreState } from 'm/store';
import { getClashAPIConfig } from 'd/app';
import { fetchData } from '../api/traffic';

import s0 from 'c/TrafficNow.module.css';

export default function TrafficNow() {
  const { upStr, downStr } = useSpeed();
  return (
    <div className={s0.TrafficNow}>
      <div className={s0.up}>
        <div>Upload</div>
        <div>{upStr}</div>
      </div>
      <div className={s0.down}>
        <div>Download</div>
        <div>{downStr}</div>
      </div>
    </div>
  );
}

function useSpeed() {
  const [speed, setSpeed] = useState({ upStr: '0 B/s', downStr: '0 B/s' });
  const { hostname, port, secret } = useStoreState(getClashAPIConfig);
  useEffect(() => {
    return fetchData({
      hostname,
      port,
      secret
    }).subscribe(o =>
      setSpeed({
        upStr: prettyBytes(o.up) + '/s',
        downStr: prettyBytes(o.down) + '/s'
      })
    );
  }, [hostname, port, secret]);
  return speed;
}
