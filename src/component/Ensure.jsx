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
}) => {
  async function handleDelete() {
    let res = await axios.delete(`${API_URL}/deleteGroup`, {
      params: {
        unit: unit,
        group: group,
        liftStopArr: lift.startArr.concat(lift.stopArr),
        storageStopArr: storage.startArr.concat(storage.stopArr),
      },
    });
    toast.success(res.data.message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    setEnsure(false);
    handleBack();
    setGroup({ groupNo: '' });
  }

  return (
    <div
      className={`absolute w-full h-[calc(100%-48px)] flex justify-center items-center drop-shadow transition duration-200 ${
        ensure ? 'block opacity-1' : 'hidden opacity-0'
      }`}
    >
      <div
        className="absolute w-full h-full"
        onClick={() => {
          setEnsure(false);
          handleBack();
        }}
      ></div>
      <div className="w-96 h-64 bg-white rounded flex justify-center items-center text-[#444] z-10">
        <div className="h-32 flex flex-col justify-between items-center">
          <div className="">
            <div className="  font-bold text-xl">{message}</div>
            <div className="text-sm text-[#888]">{hint}</div>
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
                handleBack();
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
