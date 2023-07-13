import Header from '../../component/Header';
import SetStorage from './SetStorage';
import { Routes, Route } from 'react-router-dom';

const Storage = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/setStorage" element={<SetStorage />} />
      </Routes>
    </>
  );
};

export default Storage;
