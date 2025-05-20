import React from 'react';
import { Button, Alert } from '@mui/material';
import { useGoogleAPI } from './GoogleAPIProvider';

export const UserComponent: React.FC = () => {
  const { isSignedIn, userEmail, signIn, signOut } = useGoogleAPI();
  // const userEmail_local = localStorage.getItem("userEmail");

  // const BackUp = () => {
  //   const mail = prompt("Gメールアドレスを入力してください","**********@gmail.com" );
  //   const right_mail = prompt(`Gメールアドレスをもう一度入力してください \n入力したGメールアドレス：${mail}`,"**********@gmail.com" );
  //   if(right_mail != null){
  //     localStorage.setItem("BackUpEmail", right_mail);
  //   }
  // }
  return (
    <div>
      <h2>ユーザー</h2>
      {isSignedIn && userEmail ? (
        <>
          <Alert severity="success">ようこそ {userEmail} さん</Alert>
          <Button onClick={signOut} variant="outlined">ログアウト</Button>
        </>
      ) : (
        <>
        <Alert severity="warning">ログインしてください</Alert>
              <Button onClick={signIn} variant="outlined">Google でログイン</Button>
          {/* {userEmail_local == null ? (
            <>
              <Alert severity="warning">ログインしてください</Alert>
              <Button onClick={signIn} variant="outlined">Google でログイン</Button>
              <Button onClick={BackUp} variant="outlined">バックアップを設定</Button>
            </> 
          ) : ( 
            <>
              <Alert severity="warning">コネクションロスト</Alert>
              <Alert severity="warning">現在、{userEmail_local}としてデータ保存が可能ですが、googleアカウントにはログインできていません</Alert>
              <Button onClick={signIn} variant="outlined">Google でログイン</Button>
            </> 
          )}  */}
        </>
      )}
    </div>
  );
};
