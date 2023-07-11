import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils/config';

const SetHook = () => {
  const [lift, setLift] = useState([]);
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState([]);
  const [product, setProduct] = useState('');
  const [productData, setProductData] = useState([]);
  const [storage, setStorage] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [unit, setUnit] = useState({ unit: '' });
  const [group, setGroup] = useState({ groupNo: '' });

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

  function handleUnitClick(v) {
    setUnit({ unit: v.Unit });
    setGroup({ groupNo: '' });
  }

  function handleGroupClick(v) {
    setGroup({ groupNo: v.GroupNo });
    handleBack();
  }

  async function handleSave() {
    let liftStartArr = [];
    let liftStopArr = [];
    for (let i = 0; i < lift.length; i++) {
      // 新增的項目
      if (lift[i].click || lift[i].working) {
        liftStartArr.push(lift[i].name);
      } else {
        liftStopArr.push(lift[i].name);
      }
    }
    liftStartArr.sort((a, b) => {
      return parseInt(a.slice(1, 4)) - parseInt(b.slice(1, 4));
    });
    liftStopArr.sort((a, b) => {
      return parseInt(a.slice(1, 4)) - parseInt(b.slice(1, 4));
    });
    let storageStartArr = [];
    let storageStopArr = [];
    for (let i = 0; i < storage.length; i++) {
      if (storage[i].click || storage[i].working) {
        storageStartArr.push(storage[i].name);
      } else {
        storageStopArr.push(storage[i].name);
      }
    }
    storageStartArr.sort((a, b) => {
      return parseInt(a.slice(1, 4)) - parseInt(b.slice(1, 4));
    });
    storageStopArr.sort((a, b) => {
      return parseInt(a.slice(1, 4)) - parseInt(b.slice(1, 4));
    });
    console.log(product);
    await axios.put(`${API_URL}/updateLS`, {
      unit: unit,
      group: group,
      product: product,
      liftStopArr: liftStopArr,
      liftStartArr: liftStartArr,
      storageStopArr: storageStopArr,
      storageStartArr: storageStartArr,
    });
    handleBack();
  }

  function handleBack() {
    setEdit(false);
  }

  function handleSelect(e) {
    setProduct(e.target.value);
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
  }, [unit]);

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
      setProduct(Status.data[0].ProductNo)
      
    })();
  }, [group.groupNo, edit]);
  console.log(product);
  // console.log(productData);
  return (
    <div className="px-5 py-10">
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
      <div className="flex">
        {groupData.map((v, i) => {
          return (
            <div
              className={`w-12 py-2 mb-5 mx-3 border rounded cursor-pointer ${
                v.GroupNo === group.groupNo ? 'bg-white text-gray-800' : ''
              }`}
              key={i}
              onClick={() => {
                handleGroupClick(v);
              }}
            >
              {v.GroupNo}
            </div>
          );
        })}
      </div>
      {!unit.unit || !group.groupNo ? (
        ''
      ) : (
        <div className="2xl:w-4/6 xl:w-4/6 lg:w-4/5 sm:w-4/5 h-fit bg-amber-100 rounded m-auto text-[#444] pt-10 pb-20">
          {edit ? (
            <div className="flex justify-end mx-10 mb-5">
              <div
                className="border py-2 px-3 rounded cursor-pointer bg-green-100 hover:bg-green-200 hover:drop-shadow-md mx-5"
                onClick={() => {
                  handleSave();
                }}
              >
                儲存
              </div>
              <div
                className="border py-2 px-3 rounded cursor-pointer bg-cyan-50 hover:bg-cyan-100 hover:drop-shadow-md"
                onClick={() => {
                  handleBack();
                }}
              >
                返回
              </div>
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
            <div className="mx-5">群組 : {group.groupNo}</div>
            <div className="mx-5">
              料號 :
              {edit ? (
                <select
                  name="product"
                  id="product"
                  className="border bg-white ms-1"
                  onClick={(e) => {
                    handleSelect(e);
                  }}
                >
                  {productData.map((v, i) =>
                    v.ProductNo == status[0]?.ProductNo ? (
                      <option value={v.ProductNo} key={i} selected>
                        {v.ProductName}
                      </option>
                    ) : (
                      <option value={v.ProductNo} key={i}>
                        {v.ProductName}
                      </option>
                    )
                  )}
                </select>
              ) : (
                productData.map((v) =>
                  v.ProductNo == status[0]?.ProductNo ? ` ${v.ProductName}` : ''
                )
              )}
            </div>
          </div>
          <div className="mx-10 p-5 border-8 border-t-0 border-amber-200 rounded-xl rounded-t-none ">
            <div className="font-bold text-xl">升降台</div>
            {lift.length == 0 ? (
              <div className="h-20 flex justify-center items-center m-2">
                此群組沒有正在運作的升降台
              </div>
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
              <div className="h-20 flex justify-center items-center m-2">
                此群組沒有正在運作的儲存槽
              </div>
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
      )}
    </div>
  );
};

export default SetHook;
