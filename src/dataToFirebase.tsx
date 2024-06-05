import React from 'react';
import Button from '@mui/material/Button';

//firebase
import db from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Icon
import PublicIcon from '@mui/icons-material/Public';

interface Obj {
  [prop: string]: any   // これを記述することで、どんなプロパティでも持てるようになる
}
// interface ItemNum {
//   [key: string]: number;
// }

export const PreserveDataComponent: React.FC<{ data: Obj[], data2: Obj[] }> = ({ data, data2 }) => {
  const getPassword = async () => {
    const querySnapshot = await getDocs(collection(db, "passwords"));
    const fetchedData = querySnapshot.docs.map(doc => doc.data());
    //console.log(fetchedData);
    //passwordArray
    for (let i = 0; i < fetchedData.length; i++) {
      passwordArray[i] = fetchedData[i].password;
    }
  }

  getPassword();
  // const [where, setWhere] = useState("0");
  let passwordArray: string[] = [];

  // const _setWhere = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setWhere(e.target.value);
  // }
  //コレクションとオブジェクトを指定して保存する関数
  const preserveData = () => {
    //objectの一つ目のキーの要素と二つ目のキーの要素を組み合わせて保存しやすいobjがたに（[{time:34世紀,age:451},{time:65世紀,age:21}]を{34世紀:451,65世紀:21}にする感じ）
    function convertArrayToObject(array: Obj[]): Obj {
      const obj: Obj = {};
      array.forEach(element => {
        if (typeof (element.item) != "undefined") {
          obj[element.item] = element.quantity;
          //console.log()
        } else {
          obj[element.time] = element.quantity;
        }
      });
      console.log(obj);
      return obj;
    }
    //保存
    const saveData = async (post: string, _newData: Obj) => {
      await addDoc(collection(db, post), _newData)
    };
    const createData = (_data: Obj[], post: string, where: string) => {
      console.log(_data);
      let newData: Obj = convertArrayToObject(_data);
      let d = new Date();
      let UTCtime = d.getTime().toString().slice(0, -3);
      newData.time = UTCtime;
      newData.where = passwordArray.indexOf(where) + 1;//どこのレジなのかを保存
      saveData(post, newData);
    }

    // getPassword();
    if (window.navigator.onLine) {
      let pass = prompt("パスワードを入力して下さい。");
      if (passwordArray.includes(pass)) {
        createData(data, "post", pass);
        createData(data2, "detailData", pass);
      } else {
        alert("パスワードが間違っています。")
      }
    } else {
      alert("インターネットが接続されていません。");
    }
  }
  return (
    <div>
      {/* <input type='number' value={where} onChange={_setWhere} /> */}
      <Button onClick={preserveData} endIcon={<PublicIcon />}>データを共有する</Button>
    </div>
  )
}
