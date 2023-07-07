import axios from 'axios';
import '../../style/hook/setHook.scss';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils/config';

const SetHook = () => {
  const [lift, setLift] = useState(() => {});
  const [storage, setStorage] = useState(() => {});
  const [unit, setUnit] = useState({ unit: '' });
  const [group, setGroup] = useState({ group: '' });
  const [unitData, setUnitData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  function handleClick(set, v) {
    if (v.working || v.click) {
      set((prev) => {
        return prev.map((item) => {
          if (v.id === item.id) return { ...item, click: false, working: false };
          return item;
        });
      });
    } else {
      set((prev) => {
        return prev.map((item) => {
          if (v.id === item.id) return { ...item, click: true, working: false };
          return item;
        });
      });
    }
  }
  async function handleUnitClick(v) {
    setUnit({ unit: v.Unit });
    setGroup({ groupNo: '' });
  }

  async function handleGroupClick(v) {
    setGroup({ groupNo: v.GroupNo });

    let Status = await axios.get(`${API_URL}/getLSStatus`, { params: unit });
    console.log(Status.data);
    for (let i = 0; i < Status.data.length; i++){
      console.log(Status.data[i]);
    }

  }
  useEffect(() => {
    (async () => {
      let unitData = await axios.get(`${API_URL}/getUnit`);
      setUnitData(unitData.data);
      let groupData = await axios.get(`${API_URL}/getGroup`, { params: unit });
      setGroupData(groupData.data);
      let liftCount = await axios.get(`${API_URL}/getLiftCount`, { params: unit });
      let storageCount = await axios.get(`${API_URL}/getStorageCount`, { params: unit });

      setLift(() => {
        let lift = [];
        for (let i = 0; i < liftCount.data.length; i++) {
          lift.push({ id: i + 1, name: liftCount.data[i].LiftNo, click: false, working: false });
        }
        return lift;
      });
      setStorage(() => {
        let storage = [];
        for (let i = 0; i < storageCount.data.length; i++) {
          storage.push({ id: i + 1, name: storageCount.data[i].StorageNo, click: false, working: false });
        }
        return storage;
      });
    })();
  }, [unit.unit, group.group]);
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
        <div className="2xl:w-2/5 xl:w-3/5 sm:w-4/5 h-[40rem] bg-amber-100 rounded m-auto text-[#444]">
          <div className=" flex justify-center py-10">
              <div className="mx-5">機組 : {unit.unit }</div>
              <div className="mx-5">群組 : { group.groupNo}</div>
            <div className="mx-5">
              料號 :
              <select name="" id="" className="border bg-white ms-1">
                <option value="">A料</option>
              </select>
            </div>
          </div>
          <div className="mx-10">
            <div className="font-bold text-xl">升降台</div>
            <div className="m-auto grid grid-cols-10">
              {lift.map((v, i) => {
                return (
                  <div
                    className={`w-12 h-12 rounded-full font-bold text-2xl cursor-pointer flex justify-center items-center m-2 ${
                      v.click ? 'bg-green-200' : v.working ? 'bg-gray-800 text-white' : 'bg-sky-200'
                    }`}
                    onClick={() => {
                      handleClick(setLift, v);
                    }}
                    key={i}
                    name={v.id}
                  >
                    <p className="">{v.id}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mx-10">
            <div className="font-bold text-xl">儲存槽</div>
            <div className="m-auto grid grid-cols-10">
              {storage.map((v, i) => {
                return (
                  <div
                    className={`w-12 h-12 rounded-full font-bold text-2xl cursor-pointer flex justify-center items-center m-2 ${
                      v.click ? 'bg-green-200' : v.working ? 'bg-gray-800 text-white' : 'bg-sky-200'
                    }`}
                    onClick={() => {
                      handleClick(setStorage, v);
                    }}
                    key={i}
                    name={v.id}
                  >
                    <p className="">{v.id}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetHook;
