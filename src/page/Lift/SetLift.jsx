import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/config';
import { toast } from 'react-toastify';

const SetLift = () => {
  const [unit, setUnit] = useState({ unit: '' });
  const [lift, setLift] = useState([]);
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
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
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
    <div className="px-5 py-10 mb-5">
      <div className="flex">
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
      {unit.unit != '' ? (
        <div className="2xl:w-4/6 xl:w-4/6 lg:w-4/5 sm:w-4/5 h-fit bg-amber-100 rounded m-auto text-[#444] py-10">
          <div className="p-5">
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
      ) : (
        ''
      )}
    </div>
  );
};

export default SetLift;
