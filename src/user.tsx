import React, { useEffect, useState } from 'react';
import './user.css';
import axios from 'axios';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Alert, CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export const UserComponent: React.FC<{}> = () => {
  type SheetRow = (string | number)[]; // 1行のデータ

  interface Sheet {
    sheetName: string; // シート名
    rows: SheetRow[];  // 複数行データ
  }

  type ResponseData = Sheet[]; // 全体のレスポンスデータ

  const [userData, setUserData] = useState<number[]>([]);
  const [purchaseData, setPurchaseData] = useState<ResponseData>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [effectLoader,setEffectLoader] = useState<number>(0); //これが変わると↓のが呼び出される
  const [isResponseEnd,setIsResponseEnd] = useState<boolean>(true);

  const GAS_URL = import.meta.env.VITE_GAS_API_URL;

  useEffect(() => {
    // console.log("OK");
    const fetchData = async () => {
      setIsResponseEnd(false);
      try {
        const response = await axios.get(GAS_URL);
        setIsResponseEnd(true);
        const data = response.data; 
        //  fetchでGETしたいけどできなかったです。( ;∀;)
        // const response = await fetch(GAS_URL,{
        //   method : "GET",
        //   // mode: 'no-cors',
        //   //mode: 'cors',
        //   headers:{ 'Content-Type': 'application/json' ,},
        // });
        // console.log(response);
        // const data = await response.json();
        
        
        const studentIDArray: number[] = [];
        for (const sheet of data) {
          if (sheet.sheetName === 'user') {
            for (let i = 0; i < sheet.rows.length - 1; i++) {
              studentIDArray[i] = sheet.rows[i + 1][0];
            }
          }
        }
        setPurchaseData(data);
        setUserData(studentIDArray);
      } catch (error) {
        console.error('データ取得中にエラーが発生しました:', error);
      }
    };

    fetchData();

    // ローカルストレージのログイン情報を読み込む
    const storedID = localStorage.getItem('ID');
    const storedIsUser = localStorage.getItem('isUser') === 'true';
    if (storedID) {
      setInputValue(storedID);
      setIsAuthenticated(storedIsUser);
    }
  }, [effectLoader]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

  };

  const handleLoginLogout = async () => {
    //ログアウト
    if (isAuthenticated) {
      const now_id = localStorage.getItem("ID");
      logout();
      setIsResponseEnd(false);
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID: now_id, data: "logout" })
      }).then(()=>{
        setEffectLoader(effectLoader + 1);
      });
    }
    //ログイン
    else {
      const userID = parseInt(inputValue);

      for (var i = 0; i < purchaseData.length; i++) {
        if (purchaseData[i].sheetName == "user") {
          for (var j = 0; j < purchaseData[i].rows.length; j++) {
            if (purchaseData[i].rows[j][0] == userID) {
              if (purchaseData[i].rows[j][2] == "login") {
                //すでにログインされている番号にログインしようとしています。
                alert("その番号は他端末でログインされている可能性があります。該当端末でログアウトしてから、または違う番号でお試しください。");
                return;//二重ログインさせない
              }
            }
          }
        }
      }
      localStorage.clear();

      const isUserValid = userData.includes(userID);
      if (isUserValid) {
        localStorage.setItem('ID', inputValue);
        localStorage.setItem('isUser', "true");
        setIsAuthenticated(true);
        setIsResponseEnd(false);
        refreshLocal();
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ID: localStorage.getItem("ID"), data: "login" })
        }).then(()=>{
          setEffectLoader(effectLoader + 1);
        });
      }
      else {
        localStorage.setItem('isUser', "false");
        setIsAuthenticated(false);
      }
    }
    //alert(isUserValid ? 'ログイン成功！' : 'ログイン失敗：無効なユーザーIDです。');
  };

  const logout = () => {

    localStorage.clear();
    localStorage.setItem('isUser', "false");
    setInputValue('');
    setIsAuthenticated(false);
  }

  //ログインしたときにスプレッドシートのデータをlocalstorageに入れる。（もともとのlocalstorageはリセット）
  const refreshLocal = () => {
    const id = localStorage.getItem("ID");
    var this_id_data: SheetRow[] = [];
    for (const sheet of purchaseData) {
      if (sheet.sheetName === id.toString()) {
        this_id_data = sheet.rows;
      }
    }
    const header = this_id_data[0];
    const mainData = this_id_data.slice(1);
    mainData.forEach(row => {
      const [UTC, time, ...quantities] = row;
      const formattedTime = formatDate(time as string); // 時間をフォーマット
      const purchases = header.slice(2) // 最初の2列を除く（'UTC', '時間'）
        .map((item, index) => [item, quantities[index] as number])
        .filter(([, quantity]) => quantity as number > 0); // 購入量が0のものを除外

      // ローカルストレージに保存するキーと値を構築
      const storageKey = `${UTC})${formattedTime}`; // キー
      const storageValue = purchases // 一番外側の[]を取り除く
        .map(([item, quantity]) => `["${item}",${quantity}]`)
        .join(','); // カンマで連結
      //console.log(storageKey + storageValue);
      localStorage.setItem(storageKey, storageValue);
    })
  }

  // 日時フォーマット関数
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月は0始まり
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // ↓の形式でフォーマット
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  return (
    <div>
      <h2>ユーザー</h2>
      {(localStorage.getItem("isUser") == "true") ?
        <Alert severity='success'>ようこそ {localStorage.getItem("ID")} さま。</Alert>
      :
        <Alert severity='warning'>ログインされていません。</Alert>
      }

      {/*
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {inputValue === '' ? '入力してください' : isAuthenticated ? '認証成功' : '認証失敗'}
      </p>
      */}

      {/* <div>{String(isResponseEnd)}</div> */}
      <div style={{ display: 'flex', alignItems: 'center'}}>
        <TextField
          variant="outlined"
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="パスワードを入力"
          style={{ fontSize: '16px', padding: '8px', margin: '10px' }}
          disabled={isAuthenticated} // ログイン時は編集不可
        />
        {!isResponseEnd ? 
          <Button
            disabled
            endIcon={<CircularProgress size="24px" color='inherit' />}
            size='large'
            variant="outlined">
            ロード中
          </Button>
          :
          <Button
            onClick={handleLoginLogout}
            endIcon={<LoginIcon />}
            size='large'
            variant="outlined">
            {isAuthenticated ? 'ログアウト' : 'ログイン'}
          </Button>
        }
      </div>
    </div>
  );
};
