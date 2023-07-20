import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/assets/logo.gif';

const Header = () => {
  const [link] = useState([
    {
      link: '/hook/setHook',
      name: '群組',
    },
    {
      link: '/lift/setLift',
      name: '升降機',
    },
    {
      link: '/storage/setStorage',
      name: '儲存槽',
    },
    {
      link: '/hook/hookStatus',
      name: '天鈎',
    },
  ]);
  return (
    <div className="bg-white text-[#444] h-12 flex">
      <div className="">
        <img className="w-20 h-20 bg-white rounded-full p-1" src={logo} alt="" />
      </div>
      <div className="flex items-center">
      <div className='ms-2 me-4 font-extrabold text-xl'>東河紡織</div>
        {link.map((v, i) => {
          return (
            <div
              className={`w-20 h-full font-bold relative hover:text-cyan-700 hover:cursor-pointer hover:bg-slate-50 ${
                i == 0 ? 'border-x' : 'border-e'
              }`}
              key={i}
            >
              <Link to={`${v.link}`} className="w-full h-full flex justify-center items-center">
                {v.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
