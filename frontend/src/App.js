import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { socket } from './socket';
import store from './slices';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { useGetMessagesQuery } from './slices/messagesSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { refetch } = useGetMessagesQuery();
  useEffect(() => {
    socket.on('newMessage', (payload) => {
      console.log('connected');
      console.log(payload);
      // refetch();
    });
  });
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
