import React, { useEffect } from 'react';
import { useActions, useStoreState } from 'm/store';

import Modal from 'c/Modal';
import APIConfig from 'c/APIConfig';

import { closeModal } from 'd/modals';
import { fetchConfigs } from 'd/configs';

import { DOES_NOT_SUPPORT_FETCH, errors } from '../misc/errors';

import s0 from './APIDiscovery.module.css';

const mapStateToProps = s => ({
  modals: s.modals
});

const actions = {
  closeModal,
  fetchConfigs
};

export default function APIDiscovery() {
  if (!window.fetch) {
    const { detail } = errors[DOES_NOT_SUPPORT_FETCH];
    const err = new Error(detail);
    err.code = DOES_NOT_SUPPORT_FETCH;
    throw err;
  }

  const { modals } = useStoreState(mapStateToProps);
  const { closeModal, fetchConfigs } = useActions(actions);
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return (
    <Modal
      isOpen={modals.apiConfig}
      className={s0.content}
      overlayClassName={s0.overlay}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onRequestClose={() => closeModal('apiConfig')}
    >
      <div className={s0.container}>
        <APIConfig />
      </div>
    </Modal>
  );
}
