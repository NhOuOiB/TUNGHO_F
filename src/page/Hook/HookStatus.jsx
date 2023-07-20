import axios from 'axios';
import moment from 'moment/moment';
import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/config';
import Ensure from '../../component/Ensure';

const HookStatus = () => {
  const [hook, setHook] = useState([]);
  const [hooks, setHooks] = useState([]);
  const [unitData, setUnitData] = useState([]);

  const [info, setInfo] = useState(false);
  const [ensure, setEnsure] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [hookNow, setHookNow] = useState('');
  const [unit, setUnit] = useState({ unit: '' });

  async function handleUnitClick(v) {
    setUnit({ unit: v.Unit });
    setHook([]);
    setHookNow('');
  }

  async function handleHookClick(hookNo) {
    setHookNow(hookNo);
    let hook = await axios.get(`${API_URL}/getHook`, {
      params: { unit: unit.unit, hookNo: hookNo },
    });
    setHook(hook.data);
  }

  function handleRefresh() {
    setHook([]);
    setRefresh(!refresh);
  }

  useEffect(() => {
    (async () => {
      let unitData = await axios.get(`${API_URL}/getUnit`);
      setUnitData(unitData.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let hooks = await axios.get(`${API_URL}/getHooks`, { params: { unit: unit.unit } });
      setHooks(hooks.data);
    })();
  }, [unit.unit, refresh, ensure]);

  return (
    <>
      <div className={`absolute right-4 top-16 flex transition ${!unit.unit && 'opacity-0'} `}>
        <div
          className={`py-4 w-fit px-10 me-2 rounded bg-gray-500 transition ${!info && 'opacity-0'}`}
        >
          <div className="flex justify-center items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-red-500 hover:stroke-red-400 transition cursor-pointer"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <div>配對重置</div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-blue-600 hover:stroke-blue-500  transition cursor-pointer"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            <div>資料刷新</div>
          </div>
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
      <div className={`transition ${!ensure && 'opacity-0'}`}>
        <Ensure
          message={`是否確定重置${unit.unit}機組?`}
          hint={'(將天鈎全部重新分配)'}
          ensure={ensure}
          setEnsure={setEnsure}
          from={'hooks'}
          unit={unit.unit}
        />
      </div>
      <div className="px-5 pt-10">
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
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 md:gap-5 ms-3">
          <div
            className={`2xl:w-1/5 xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-2/5 w-full h-[45rem] bg-amber-100 rounded flex flex-col justify-around items-center transition  ${
              hooks.length == 0 ? 'opacity-0' : 'opacity-1'
            }`}
          >
            <div
              className={`w-full flex justify-between items-center px-2 ${
                hooks.length == 0 ? 'opacity-0' : 'opacity-1'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-red-500 hover:stroke-red-400 transition cursor-pointer"
                onClick={() => {
                  setEnsure(true);
                }}
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-blue-600 hover:stroke-blue-500  transition cursor-pointer"
                onClick={() => {
                  handleRefresh();
                }}
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
              </svg>
            </div>
            <div
              className={`w-full grid grid-cols-3 text-[#444] ${
                hooks.length == 0 ? 'opacity-0' : 'opacity-1'
              }`}
            >
              <div className="py-2 ml-2 border border-amber-500">料號</div>
              <div className="py-2 mx-1 border border-amber-500">鈎號</div>
              <div className="py-2 mr-2 border border-amber-500">是否勾料</div>
            </div>
            {hooks.length != 0 && (
              <div className="w-full h-[38rem] text-[#444] overflow-auto">
                {hooks.map((v, i) => {
                  return (
                    <div key={i}>
                      {(i == 0 || v.ProductName != hooks[i - 1]?.ProductName) &&
                        v.ProductName != null && (
                          <div className="w-full grid grid-cols-3 py-4 font-bold">
                            {v.ProductName}
                          </div>
                        )}
                      {hooks[i].ProductName != hooks[i - 1]?.ProductName &&
                        v.ProductName == null && (
                          <div className="rounded grid grid-cols-3 py-4 font-bold">未配對</div>
                        )}
                      {hooks.every((v) => v.ProductName === null) && i === 0 && (
                        <div className="rounded grid grid-cols-3 py-4 font-bold">未配對</div>
                      )}
                      <div
                        className={`rounded grid grid-cols-3 py-2 ml-2 hover:bg-amber-200 hover:shadow ${
                          v.HookNo === hookNow && 'bg-amber-200 hover:bg-amber-300'
                        }`}
                        onClick={() => {
                          handleHookClick(v.HookNo);
                        }}
                      >
                        <div></div>
                        <div>{v.HookNo}</div>
                        <div className="flex justify-center items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              v.ProductFlag && 'bg-gradient-to-r from-[#000046] to-[#1cb5e0]'
                            } `}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className={`2xl:w-3/6 xl:w-3/4 lg:w-3/4 md:w-2/3 sm:w-3/5 w-full h-[45rem] bg-amber-100 text-[#444] rounded flex transition duration-200 ${
              hook.length == 0 ? 'opacity-0' : 'opacity-1'
            }`}
          >
            {hook.length > 0 ? (
              <div className="w-full">
                <div className="w-full h-1/2 rounded flex justify-center items-center">
                  {hook[0].map((v, i) => {
                    return (
                      <div
                        key={i}
                        className="w-11/12 h-5/6 rounded-[3rem] bg-white flex justify-center items-center flex-col gap-5"
                      >
                        <div className="w-full">
                          <div className="grid grid-cols-5 text-2xl">
                            <div>群組</div>
                            <div>勾號</div>
                            <div>升降機</div>
                            <div>儲存槽</div>
                            <div>材料名稱</div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="grid grid-cols-5 text-2xl font-bold">
                            <div>{v.GroupNo}</div>
                            <div>{v.HookNo}</div>
                            <div>{v.LiftNo}</div>
                            <div>{v.StorageNo}</div>
                            <div>{v.ProductName}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className={`h-1/2 flex flex-col justify-end items-center rounded transition  ${
                    hook[1].length == 0 ? 'justify-center' : ''
                  }`}
                >
                  <div
                    className={`font-bold text-3xl mb-10 transition ${
                      hook[1].length == 0 && 'opacity-0 transition-none'
                    }`}
                  >
                    近期紀錄
                  </div>
                  {hook[1].length == 0 ? (
                    <div>沒有紀錄</div>
                  ) : (
                    <table className="table-auto w-full rounded">
                      <thead>
                        <tr>
                          <th>群組</th>
                          <th>勾號</th>
                          <th>升降機</th>
                          <th>儲存槽</th>
                          <th>材料名稱</th>
                          <th>時間</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hook[1].map((v, i) => {
                          return (
                            <tr className="h-10 bg-amber-100 border-y border-slate-500" key={i}>
                              <td className="w-1/12">{v.GroupNo}</td>
                              <td className="w-1/12">{v.HookNo}</td>
                              <td className="w-1/12">{v.LiftNo}</td>
                              <td className="w-1/12">{v.StorageNo}</td>
                              <td className="w-1/12">{v.ProductName}</td>
                              <td className="w-3/12">
                                {moment.utc(v.CreateTime).format('MM 月 DD 日 HH 時 mm 分 ss 秒')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HookStatus;
