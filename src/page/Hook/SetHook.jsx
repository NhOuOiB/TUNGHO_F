import axios from 'axios';
import Ensure from '../../component/Ensure';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils/config';
import { toast } from 'react-toastify';

const SetHook = () => {
  const [lift, setLift] = useState([]);
  const [status, setStatus] = useState([]);
  const [storage, setStorage] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [productData, setProductData] = useState([]);

  const [edit, setEdit] = useState(false);
  const [ensure, setEnsure] = useState(false);
  const [info, setInfo] = useState(false);

  const [product, setProduct] = useState('');
  const [insertGroup, setInsertGroup] = useState('');

  const [unit, setUnit] = useState({ unit: '' });
  const [group, setGroup] = useState({ groupNo: '' });

  // 變更升降機、儲存槽狀態
  function handleClick(set, v) {
    if (edit) {
      if (v.working || v.click) {
        set((prev) => {
          return prev.map((item) => {
            if (v.name === item.name) return { ...item, click: false, working: false };
            return item;
          });
        });
      } else {
        set((prev) => {
          return prev.map((item) => {
            if (v.name === item.name) return { ...item, click: true, working: false };
            return item;
          });
        });
      }
    }
  }

  // 選擇機組
  function handleUnitClick(v) {
    setUnit({ unit: v.Unit });
    setGroup({ groupNo: '' });
  }

  // 選擇群組
  function handleGroupClick(v) {
    setGroup({ groupNo: v.GroupNo });
    setInsertGroup('');
    handleBack();
  }

  // 整理要運作、停止的陣列
  function processArray(arr) {
    let startArr = [];
    let stopArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].click || arr[i].working) {
        startArr.push(arr[i].name);
      } else {
        stopArr.push(arr[i].name);
      }
    }
    startArr.sort((a, b) => parseInt(a.slice(1, 4)) - parseInt(b.slice(1, 4)));
    stopArr.sort((a, b) => parseInt(a.slice(1, 4)) - parseInt(b.slice(1, 4)));

    return { startArr, stopArr };
  }

  // 更新群組
  async function handleSave() {
    const { startArr: liftStartArr, stopArr: liftStopArr } = processArray(lift);
    const { startArr: storageStartArr, stopArr: storageStopArr } = processArray(storage);

    if (liftStartArr.length === 0 || storageStartArr.length === 0) {
      setEnsure(true);
    } else {
      let res = await axios.put(`${API_URL}/updateLS`, {
        unit: unit,
        group: group,
        product: product,
        liftStopArr: liftStopArr,
        liftStartArr: liftStartArr,
        storageStopArr: storageStopArr,
        storageStartArr: storageStartArr,
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
    }
  }

  // 新增群組
  async function handleInsert() {
    const { startArr: liftStartArr } = processArray(lift);
    const { startArr: storageStartArr } = processArray(storage);

    if (insertGroup === '') {
      toast.error('沒有輸入群組名稱', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (groupData.map((v) => v.GroupNo).includes(insertGroup.toUpperCase())) {
      toast.error('已經有重複的群組名稱', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }
    if (product === '') {
      toast.error('尚未選擇產品', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return false;
    }

    if (liftStartArr.length === 0 || storageStartArr.length === 0) {
      toast.error('請選擇至少各一個升降台或儲存槽', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      let res = await axios.post(`${API_URL}/addGroup`, {
        unit: unit.unit,
        group: insertGroup.toUpperCase(),
        product: product,
        liftStartArr: liftStartArr,
        storageStartArr: storageStartArr,
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
      setInsertGroup('');
      setGroup({ groupNo: insertGroup });
    }
  }

  // 退出編輯模式
  function handleBack() {
    setEdit(false);
  }

  // 選擇料號
  function handleSelect(e) {
    setProduct(e.target.value);
  }

  function handleAdd() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    (() => {
      for (let i = 0; i < alphabet.length; i++) {
        const currentLetter = alphabet[i];
        if (!groupData.map((v) => v.GroupNo).includes(currentLetter)) {
          setInsertGroup(currentLetter);
          return currentLetter;
        }
      }
    })();
    setGroup({ groupNo: '+' });
    setEdit(true);
  }
  useEffect(() => {
    (async () => {
      let unitData = await axios.get(`${API_URL}/getUnit`);
      setUnitData(unitData.data);

      let product = await axios.get(`${API_URL}/getProduct`);
      setProductData(product.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let groupData = await axios.get(`${API_URL}/getGroup`, { params: unit });
      setGroupData(groupData.data);
    })();
  }, [unit, ensure, insertGroup]);

  useEffect(() => {
    (async () => {
      let liftArr = [];
      let storageArr = [];
      let SameGroupLiftNum = [];
      let SameGroupStorageNum = [];

      for (let i = 0; i < status.length; i++) {
        SameGroupLiftNum = status[i].LiftMember.split(';');
        SameGroupStorageNum = status[i].StorageMember.split(';');
        break;
      }

      if (SameGroupLiftNum != '') {
        for (let j = 0; j < SameGroupLiftNum.length; j++) {
          liftArr.push({
            name: SameGroupLiftNum[j],
            click: false,
            working: true,
          });
        }
      }

      if (SameGroupStorageNum != '') {
        for (let j = 0; j < SameGroupStorageNum.length; j++) {
          storageArr.push({
            name: SameGroupStorageNum[j],
            click: false,
            working: true,
          });
        }
      }

      if (edit) {
        let idleLift = await axios.get(`${API_URL}/getIdleLift`, { params: unit });

        for (let i = 0; i < idleLift.data.length; i++) {
          liftArr.push({ name: idleLift.data[i].LiftNo, click: false, working: false });
        }

        let idleStorage = await axios.get(`${API_URL}/getIdleStorage`, { params: unit });

        for (let i = 0; i < idleStorage.data.length; i++) {
          storageArr.push({ name: idleStorage.data[i].StorageNo, click: false, working: false });
        }
      }

      setLift(liftArr);
      setStorage(storageArr);
    })();
  }, [edit, unit, status]);

  useEffect(() => {
    (async () => {
      let merge = { ...unit, groupNo: group.groupNo };
      let Status = await axios.get(`${API_URL}/getLSStatus`, { params: merge });
      setStatus(Status.data);
      if (Status.data.length > 0) {
        setProduct(Status.data[0].ProductNo);
      } else {
        setProduct('');
      }
    })();
  }, [group.groupNo, edit]);
  return (
    <>
      <div
        className={`absolute right-4 top-16 flex transition ${
          !unit.unit || !group.groupNo ? 'opacity-0' : 'opacity-1'
        } `}
      >
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
            <div className="w-2 h-2 rounded-sm bg-green-200"></div>
            <div> 已選取</div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-cyan-100"></div>
            <div>閒置中</div>
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
      <div className={`transition ${!ensure ? 'opacity-0' : 'opacity-1'}`}>
        <Ensure
          message={'是否確定不勾選升降機或儲存槽?'}
          hint={'(將刪除此群組)'}
          ensure={ensure}
          setEnsure={setEnsure}
          handleBack={handleBack}
          unit={unit.unit}
          group={group.groupNo}
          setGroup={setGroup}
          lift={processArray(lift)}
          storage={processArray(storage)}
          from={'group'}
        />
      </div>
      <div className="px-5 py-10 w-full h-[calc(100%-72px)]">
        <div className={`flex  transition ${unitData.length === 0 && 'opacity-0'}`}>
          {unitData.map((v, i) => {
            return (
              <div
                className={`w-12 py-2 mb-5 mx-3 border rounded cursor-pointer ${
                  v.Unit === unit.unit ? 'bg-white text-gray-800' : ''
                } `}
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
          className={`mb-5 flex items-center transition ${groupData.length === 0 && 'opacity-0'}`}
        >
          {groupData.map((v, i) => {
            return (
              <div
                className={`w-12 py-2 mx-3 border rounded cursor-pointer  ${
                  v.GroupNo === group.groupNo ? 'bg-white text-gray-800' : ''
                } `}
                key={i}
                onClick={() => {
                  handleGroupClick(v);
                }}
              >
                {v.GroupNo}
              </div>
            );
          })}
          {groupData.length > 0 ? (
            <div
              className={`w-12 py-2 mx-3 border rounded cursor-pointer ${
                group.groupNo == '+' ? 'bg-white text-gray-800' : ''
              }`}
              onClick={() => {
                handleAdd();
              }}
            >
              +
            </div>
          ) : (
            ''
          )}
        </div>

        <div
          className={`2xl:w-4/6 xl:w-4/6 lg:w-4/5 sm:w-4/5 h-fit bg-amber-100 rounded m-auto text-[#444] pt-10 pb-20 transition ${
            !unit.unit || !group.groupNo ? 'opacity-0' : 'opacity-1'
          }`}
        >
          {edit ? (
            <div className="flex justify-end mx-10 mb-5">
              <div
                className="border py-2 px-3 rounded cursor-pointer bg-green-100 hover:bg-green-200 hover:drop-shadow-md mx-5"
                onClick={() => {
                  if (group.groupNo == '+') {
                    handleInsert();
                  } else {
                    handleSave();
                  }
                }}
              >
                儲存
              </div>
              {group.groupNo == '+' ? (
                ''
              ) : (
                <div
                  className="border py-2 px-3 rounded cursor-pointer bg-cyan-50 hover:bg-cyan-100 hover:drop-shadow-md"
                  onClick={() => {
                    handleBack();
                  }}
                >
                  返回
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-end mx-10 mb-5">
              <div
                className="border py-2 px-3 rounded cursor-pointer bg-cyan-50 hover:bg-cyan-100 hover:drop-shadow-md"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                編輯
              </div>
            </div>
          )}
          <div className=" flex justify-center items-center mb-10">
            <div className="mx-5">機組 : {unit.unit}</div>
            <div className="mx-5">
              群組 : {group.groupNo == '+' ? `${insertGroup}` : `${group.groupNo}`}
            </div>
            <div className="mx-5">
              料號 :
              {edit ? (
                <select
                  name="product"
                  id="product"
                  className="border bg-white ms-1"
                  onChange={(e) => {
                    handleSelect(e);
                  }}
                  value={product}
                >
                  <option value={''} disabled>
                    請選擇
                  </option>
                  {productData.map((v, i) => {
                    return (
                      <option value={v.ProductNo} key={i}>
                        {v.ProductName}
                      </option>
                    );
                  })}
                </select>
              ) : (
                productData.map((v) => v.ProductNo == status[0]?.ProductNo && ` ${v.ProductName}`)
              )}
            </div>
          </div>
          <div className="mx-10 p-5 border-8 border-t-0 border-amber-200 rounded-xl rounded-t-none ">
            <div className="font-bold text-xl">升降台</div>
            {lift.length == 0 ? (
              <div className="h-20 flex justify-center items-center m-2">沒有空閒的升降台</div>
            ) : (
              <div className="m-auto grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-10">
                {lift.map((v, i) => {
                  return (
                    <div
                      className={`w-20 h-20 rounded-full font-bold text-2xl cursor-pointer flex justify-center items-center m-2 ${
                        v.click ? 'bg-green-200' : v.working ? 'bg-green-400' : 'bg-cyan-100'
                      }`}
                      onClick={() => {
                        handleClick(setLift, v);
                      }}
                      key={i}
                      name={v.id}
                    >
                      <p className="">{v.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mx-10 mt-10 p-5 border-8 border-b-0 border-amber-200 rounded-xl rounded-b-none">
            <div className="font-bold text-xl">儲存槽</div>
            {storage.length == 0 ? (
              <div className="h-20 flex justify-center items-center m-2">沒有空閒的儲存槽</div>
            ) : (
              <div className="m-auto grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-10">
                {storage.map((v, i) => {
                  return (
                    <div
                      className={`w-20 h-20 rounded-full  cursor-pointer flex justify-center items-center m-2 ${
                        v.click ? 'bg-green-200' : v.working ? 'bg-green-400' : 'bg-cyan-100'
                      }`}
                      onClick={() => {
                        handleClick(setStorage, v);
                      }}
                      key={i}
                      name={v.id}
                    >
                      <p className="font-bold text-2xl">{v.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SetHook;
