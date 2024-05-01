import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Channels from '../components/channels/Channels';
import Messages from '../components/messages/Messages';

const Home = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      return navigate('/login');
    }
  }, [token, navigate]);
  return (
    <Container className="rounded shadow">
      <Row className="bg-white flex-md-row h-100">
        <Channels />
        <Messages />
      </Row>
    </Container>
  );
};

export default Home;
