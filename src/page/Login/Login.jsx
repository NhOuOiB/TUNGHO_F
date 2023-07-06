import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState({
    account: 'mike',
    password: '1234',
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
      console.log(res);
      navigate('hook/setHook');
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    handleLogin();
  }, []);
  return (
    <>
      <div>
        <p className="text-left">帳號</p>
        <input
          type="text"
          minLength={8}
          maxLength={16}
          name="account"
          required
          onChange={handleChange}
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
        />
      </div>
      <div className="my-6 border cursor-pointer" onClick={handleLogin}>
        登入
      </div>
    </>
  );
};

export default Login;
