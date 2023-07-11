import Header from '../../component/Header';
import SetLift from './SetLift';
import { Routes, Route } from 'react-router-dom';

const Lift = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/setLift" element={<SetLift />} />
      </Routes>
    </>
  );
};

export default Lift;
