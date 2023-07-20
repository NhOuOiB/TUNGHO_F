import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [login, setLogin] = useState({
    account: '',
    password: '',
  });
  const navigate = useNavigate();
  function handleChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }
  async function handleLogin() {
    try {
      let res = await axios.post(`${API_URL}/login`, login, {
        withCredentials: true,
      });
      toast.success(res.data.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate('hook/setHook');
    } catch (err) {
      toast.error(err, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  }

  return (
    <div className="w-full h-[calc(100%-24px)] flex flex-col justify-center items-center">
      <div>
        <div>
          <p className="text-left">帳號</p>
          <input
            type="text"
            minLength={8}
            maxLength={16}
            name="account"
            required
            onChange={handleChange}
            className=' bg-neutral-700'
          />
        </div>
        <div>
          <p className="text-left">密碼</p>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.keyCode == 13) {
                handleLogin(e);
              }
            }}
            className=' bg-neutral-700'
          />
        </div>
        <div className="my-6 border cursor-pointer" onClick={handleLogin}>
          登入
        </div>
      </div>
    </div>
  );
};

export default Login;
