import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRemoveChannelMutation, channelsApi } from '../../api/channels';
import { changeChannel, setChannelModal } from '../../store/slices/appSlice';
import socket from '../../socket';

const DeleteChannel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.app.showModal);
  const currentChannelId = useSelector((state) => state.app.currentChannelId);
  const modalChannelId = useSelector((state) => state.app.modalChannelId);
  const [removeChannel] = useRemoveChannelMutation();
  const handleCloseModal = () => {
    dispatch(setChannelModal({ id: '', name: '', modalName: '' }));
  };
  const deleteChannel = async (id) => {
    try {
      await removeChannel(id).unwrap();
      handleCloseModal();
      if (id === currentChannelId) {
        dispatch(changeChannel({ id: '1', name: 'general' }));
      }
      toast.success(t('toast.deleteChannel'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleRemoveChannel = ({ id }) => {
      dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => draft.filter((curChannels) => curChannels.id !== id)));
    };
    socket.on('removeChannel', handleRemoveChannel);
    return () => {
      socket.off('removeChannel');
    };
  }, [dispatch]);
  return (
    <Modal show={showModal === 'delete-channel'} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.titleDeleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modals.textDeleteChannel')}</p>
        <div className="d-flex justify-content-end mt-2">
          <Button type="button" variant="secondary" onClick={handleCloseModal} className="me-2">{t('form.buttons.cancel')}</Button>
          <Button type="button" variant="danger" onClick={() => deleteChannel(modalChannelId)}>{t('form.buttons.delete')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteChannel;