import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/config';
import { toast } from 'react-toastify';

const SetLift = () => {
  const [lift, setLift] = useState([]);
  const [unit, setUnit] = useState({ unit: '' });
  const [info, setInfo] = useState(false);
  const [liftData, setLiftData] = useState([]);
  const [unitData, setUnitData] = useState([]);

  async function handleUnitClick(v) {
    setTimeout(() => {
      setLift([]);
    }, 80);
    setUnit({ unit: v.Unit });
  }

  async function handleLiftClick(liftNo) {
    let liftData = await axios.get(`${API_URL}/getLiftByNo`, {
      params: { unit: unit.unit, liftNo: liftNo },
    });
    setLift(liftData.data);
  }

  async function handleChangeStatus(status) {
    let res = await axios.put(`${API_URL}/updateLiftStatus`, {
      unit: unit.unit,
      liftNo: lift[0].LiftNo,
      status: status,
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
    handleLiftClick(lift[0].LiftNo);
  }

  function handleBack() {
    setLift([]);
  }

  useEffect(() => {
    (async () => {
      let unitData = await axios.get(`${API_URL}/getUnit`);
      setUnitData(unitData.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let lift = await axios.get(`${API_URL}/getLift`, { params: { unit: unit.unit } });

      setLiftData(lift.data);
    })();
  }, [unit.unit, lift]);

  return (
    <div className="px-5 py-10 w-full h-[calc(100%-72px)]">
      <div className={`absolute right-4 top-16 flex transition ${!unit.unit && 'opacity-0'} `}>
        <div
          className={`py-4 gap-2 w-fit px-10 me-2 rounded bg-gray-500 transition ${
            !info && 'opacity-0'
          }`}
        >
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-green-400"></div>
            <div>運作中</div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-cyan-100"></div>
            <div>閒置中</div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-red-500"></div>
            <div>停用中</div>
          </div>
          <div className="w-32 mt-5 text-sm">只有閒置中的升降機可以停用</div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#eee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition ${info && 'scale-110'}`}
          onMouseEnter={() => {
            setInfo(true);
          }}
          onMouseLeave={() => {
            setInfo(false);
          }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <div className={`flex transition ${unitData.length === 0 && 'opacity-0'}`}>
        {unitData.map((v, i) => {
          return (
            <div
              className={`w-12 py-2 mb-5 mx-3 border rounded cursor-pointer ${
                v.Unit === unit.unit ? 'bg-white text-gray-800' : ''
              }`}
              key={i}
              onClick={() => {
                handleUnitClick(v);
              }}
            >
              {v.Unit}
            </div>
          );
        })}
      </div>
      <div
        className={`2xl:w-4/6 xl:w-4/6 lg:w-4/5 sm:w-4/5 h-fit bg-amber-100 rounded m-auto text-[#444] py-10 transition ${
          !unit.unit && 'opacity-0'
        }`}
      >
        <div className="p-5">
          <div className="text-left text-5xl font-bold mb-10 ms-2">升降機</div>
          {liftData.length == 0 ? (
            <div>此群組無升降機</div>
          ) : (
            <>
              {lift.length == 0 ? (
                <div className="m-auto grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-10">
                  {liftData.map((v, i) => {
                    return (
                      <div
                        className={`w-20 h-20 rounded-full font-bold text-2xl  flex justify-center items-center m-2 ${
                          v.Status == 1
                            ? 'bg-green-400'
                            : v.Status == 2
                            ? 'bg-cyan-50 cursor-pointer'
                            : 'bg-red-500 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (v.Status != 1) handleLiftClick(v.LiftNo);
                        }}
                        key={i}
                      >
                        <p className="">{v.LiftNo}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                lift.map((v, i) => {
                  return (
                    <div key={i}>
                      <div className="text-3xl font-bold">{v.LiftNo}</div>
                      <div className="my-10 flex justify-center items-center gap-5">
                        <div
                          className={`border rounded-full w-14 h-14 flex justify-center items-center ${
                            v.Status == 3 ? 'bg-cyan-50 cursor-pointer' : 'bg-gray-400'
                          }`}
                          onClick={() => {
                            if (v.Status == 3) handleChangeStatus(2);
                          }}
                        >
                          ON
                        </div>
                        <div
                          className={`border rounded-full w-14 h-14 flex justify-center items-center ${
                            v.Status != 3 ? 'bg-red-500 cursor-pointer' : 'bg-gray-400'
                          }`}
                          onClick={() => {
                            if (v.Status != 3) handleChangeStatus(3);
                          }}
                        >
                          OFF
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-5">
                        <div
                          className="border rounded px-4 py-2 bg-slate-800 text-white cursor-pointer"
                          onClick={handleBack}
                        >
                          返回
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetLift;
