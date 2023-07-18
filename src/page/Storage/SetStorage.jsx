import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/config';
import { toast } from 'react-toastify';

const SetStorage = () => {
  const [unit, setUnit] = useState({ unit: '' });
  const [storage, setStorage] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [unitData, setUnitData] = useState([]);

  async function handleUnitClick(v) {
    setTimeout(() => {
      setStorage([]);
    }, 80);
    setUnit({ unit: v.Unit });
  }

  async function handleStorageClick(storageNo) {
    let storageData = await axios.get(`${API_URL}/getStorageByNo`, {
      params: { unit: unit.unit, storageNo: storageNo },
    });
    setStorage(storageData.data);
  }

  async function handleChangeStatus(status) {
    let res = await axios.put(`${API_URL}/updateStorageStatus`, {
      unit: unit.unit,
      storageNo: storage[0].StorageNo,
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
    handleStorageClick(storage[0].StorageNo);
  }

  function handleBack() {
    setStorage([]);
  }

  useEffect(() => {
    (async () => {
      let unitData = await axios.get(`${API_URL}/getUnit`);
      setUnitData(unitData.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let storage = await axios.get(`${API_URL}/getStorage`, { params: { unit: unit.unit } });

      setStorageData(storage.data);
    })();
  }, [unit.unit, storage]);
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
            {storageData.length == 0 ? (
              <div>該群組無儲存槽</div>
            ) : (
              <>
                {storage.length == 0 ? (
                  <div className="m-auto grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-10">
                    {storageData.map((v, i) => {
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
                            if (v.Status != 1) handleStorageClick(v.StorageNo);
                          }}
                          key={i}
                        >
                          <p className="">{v.StorageNo}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  storage.map((v, i) => {
                    return (
                      <div key={i}>
                        <div className="text-3xl font-bold">{v.StorageNo}</div>
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

export default SetStorage;
