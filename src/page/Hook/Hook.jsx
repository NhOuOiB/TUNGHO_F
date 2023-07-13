import SetHook from './SetHook';
import HookStatus from './HookStatus';
import Header from '../../component/Header';
import { Routes, Route } from 'react-router-dom';

const Hook = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/setHook" element={<SetHook />} />
        <Route path="/hookStatus" element={<HookStatus />} />
      </Routes>
    </>
  );
};

export default Hook;
