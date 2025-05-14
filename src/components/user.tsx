import React from 'react';
import { useGoogleAPI } from './GoogleAPIProvider';
import { Button, Alert } from '@mui/material';

import { LocalStorageLib } from './localStorageLib';


export const UserComponent: React.FC = () => {
  const { isSignedIn, userEmail, signIn, signOut } = useGoogleAPI();

  const b = new LocalStorageLib();
  const a = b.local_total_array();
  console.log(a);

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
          <Button onClick={signIn} variant="outlined">Googleでログイン</Button>
        </>
      )}
    </div>
  );
};
