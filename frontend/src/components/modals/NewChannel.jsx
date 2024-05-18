import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import * as filter from 'leo-profanity';
import { useAddChannelMutation, useGetChannelsQuery } from '../../api/channels';
import { setChannelModal, changeChannel } from '../../store/slices/appSlice';

const NewChannel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.app.showModal);
  const { data: channels = [] } = useGetChannelsQuery();
  const [addChannel] = useAddChannelMutation();
  const channelsNames = channels.map((channel) => channel.name);
  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string().notOneOf(channelsNames, t('form.errors.channelExists')).min(3, t('form.errors.range')).max(20, t('form.errors.range'))
      .required(t('form.errors.required')),
  });

  const handleCloseModal = () => {
    dispatch(setChannelModal({ id: '', name: '', modalName: '' }));
  };
  const handleFormSubmit = async (values) => {
    try {
      const { channelName } = values;
      const data = {};
      data.name = filter.clean(channelName);
      data.removable = true;
      const response = await addChannel(data);
      const { id, name } = response.data;
      dispatch(changeChannel({ id, name }));
      handleCloseModal();
      toast.success(t('toast.addChannel'));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Modal show={showModal === 'new-channel'} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.titleAddChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ channelName: '' }}
          onSubmit={handleFormSubmit}
          validationSchema={channelNameSchema}
        >
          {({
            values, handleChange, handleSubmit, errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Label htmlFor="channelName">{t('form.labels.channelName')}</Form.Label>
              <Form.Control value={values.channelName} name="channelName" onChange={handleChange} id="channelName" isInvalid={!!errors.channelName} autoFocus />
              <Form.Control.Feedback type="invalid">{errors.channelName}</Form.Control.Feedback>
              <div className="d-flex justify-content-end mt-2">
                <Button type="button" variant="secondary" onClick={handleCloseModal} className="me-2">{t('form.buttons.cancel')}</Button>
                <Button type="submit" variant="primary">{t('form.buttons.submit')}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default NewChannel;