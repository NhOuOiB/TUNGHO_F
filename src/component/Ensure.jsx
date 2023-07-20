import axios from 'axios';
import { API_URL } from '../utils/config';
import { toast } from 'react-toastify';

const ensure = ({
  message,
  hint,
  ensure,
  setEnsure,
  handleBack,
  unit,
  group,
  setGroup,
  lift,
  storage,
  from,
}) => {
  async function handleDelete() {
    if (from == 'hooks') {
      let res = await axios.put(`${API_URL}/resetHookPair`, {
        unit: unit,
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
    } else if (from == 'group') {
      let res = await axios.delete(`${API_URL}/deleteGroup`, {
        params: {
          unit: unit,
          group: group,
          liftStopArr: lift.startArr.concat(lift.stopArr),
          storageStopArr: storage.startArr.concat(storage.stopArr),
        },
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
      handleBack();
      setGroup({ groupNo: '' });
    }
    setEnsure(false);
  }

  return (
    <div
      className={`absolute w-full h-[calc(100%-48px)] flex justify-center items-center drop-shadow transition z-10 ${
        ensure ? 'block opacity-1' : 'hidden opacity-0'
      }`}
    >
      <div
        className="absolute w-full h-full bg-black/50"
        onClick={() => {
          setEnsure(false);
          if (handleBack) handleBack();
        }}
      ></div>
      <div className="w-96 h-64 bg-white rounded flex justify-center items-center text-[#444] z-50">
        <div className="h-32 flex flex-col justify-between items-center">
          <div className="">
            <div className="  font-bold text-xl">{message}</div>
            <div className=" text-red-600 ">{hint}</div>
          </div>
          <div className="flex">
            <div
              className="py-2 px-4 bg-red-600 text-white rounded cursor-pointer mx-4"
              onClick={() => {
                handleDelete();
              }}
            >
              是
            </div>
            <div
              className="py-2 px-4 bg-gray-400 text-white rounded cursor-pointer mx-4"
              onClick={() => {
                setEnsure(false);
                if (handleBack) handleBack();
              }}
            >
              否
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ensure;
