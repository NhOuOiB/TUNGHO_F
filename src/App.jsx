import './App.css';
import Hook from './page/Hook/Hook';
import Lift from './page/Lift/Lift';
import Login from './page/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter initialEntries={['/']} initialIndex={0} basename="">
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/hook/*" element={<Hook />}></Route>
          <Route path="/lift/*" element={<Lift />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
