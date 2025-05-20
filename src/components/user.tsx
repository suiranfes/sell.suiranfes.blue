import React from 'react';
import { Button, Alert } from '@mui/material';
import { useGoogleAPI } from './GoogleAPIProvider';

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
              <Button onClick={signIn} variant="outlined">Google でログイン</Button>
        </>
      )}
    </div>
  );
};
