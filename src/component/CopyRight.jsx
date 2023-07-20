import moment from 'moment';
import logo from '/src/assets/Logo-Taiwan.png';

const CopyRight = () => {
  return (
    <div className="w-full flex justify-center items-end">
      © {moment().year()} Copyright - 岳林工業有限公司
      <img className='h-6' src={logo} alt="" />
    </div>
  );
};

export default CopyRight;
