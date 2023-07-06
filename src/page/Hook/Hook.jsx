import SetHook from './SetHook';
import { Routes, Route } from 'react-router-dom';

const Hook = () => {
  return (
    <Routes>
      <Route path="/setHook" element={<SetHook />} />
    </Routes>
  );
};

export default Hook;
