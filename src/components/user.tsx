import React from 'react';
import { useGoogleAPI } from './GoogleAPIProvider';
import { Button, Alert } from '@mui/material';

export const UserComponent: React.FC = () => {
  const { isSignedIn, userEmail, signIn, signOut } = useGoogleAPI();

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
