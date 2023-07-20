import './App.css';
import Hook from './page/Hook/Hook';
import Lift from './page/Lift/Lift';
import Login from './page/Login/Login';
import Storage from './page/Storage/Storage';
import { ToastContainer } from 'react-toastify';
import CopyRight from './component/CopyRight';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter initialEntries={['/']} initialIndex={0} basename="">
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/hook/*" element={<Hook />}></Route>
          <Route path="/lift/*" element={<Lift />}></Route>
          <Route path="/storage/*" element={<Storage />}></Route>
        </Routes>
      </BrowserRouter>
        <CopyRight />
    </>
  );
}

export default App;
