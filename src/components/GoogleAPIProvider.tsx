// GoogleAPIProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfirmLogin } from './ConfirmLogin';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

interface GoogleAPIContextType {
  isSignedIn: boolean;
  userEmail: string | null;
  signIn: () => void;
  signOut: () => void;
}

const GoogleAPIContext = createContext<GoogleAPIContextType | null>(null);

export const GoogleAPIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [defaultEmail, setDefaultEmail] = useState<string | null>(null);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPE,
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          const updateSigninStatus = (isSignedIn: boolean) => {
            setIsSignedIn(isSignedIn);
            if (isSignedIn) {
              const profile = auth.currentUser.get().getBasicProfile();
              const email = profile.getEmail();
              setUserEmail(email);
              const _defaultEmail = localStorage.getItem("defaultEmail");
              if(_defaultEmail == null){
                localStorage.setItem('defaultEmail', email);
              }
              else if(email != _defaultEmail){
                setTempEmail(email);
                setDefaultEmail(_defaultEmail);
                setModalOpen(true);//ログイン前にメールアドレスを取得できないようなので、ログイン後に違うアカウントだったら確認しています。
              }
            } 
          };
          updateSigninStatus(auth.isSignedIn.get());
          auth.isSignedIn.listen(updateSigninStatus);
        });
    }

    gapi.load('client:auth2', start);
  }, []);

  const signIn = () => gapi.auth2.getAuthInstance().signIn();
  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setUserEmail(null);
  };
//modalからの処理
  const handleConfirm = () => {
    if (tempEmail) {
      setUserEmail(tempEmail);
      setIsSignedIn(true);
    }
    setModalOpen(false);
  };
  
  const handleCancel = () => {
    const auth = gapi.auth2.getAuthInstance();
    auth.signOut();
    setUserEmail(null);
    setIsSignedIn(false);
    setModalOpen(false);
  };
  return (
    <GoogleAPIContext.Provider value={{ isSignedIn, userEmail, signIn, signOut }}>
      {children}
      {modalOpen && tempEmail && defaultEmail && (
        <ConfirmLogin
          open={modalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          email={tempEmail}
          defaultEmail={defaultEmail}
        />
      )}
    </GoogleAPIContext.Provider>
  );
};

export const useGoogleAPI = () => {
  const context = useContext(GoogleAPIContext);
  if (!context) throw new Error('useGoogleAPI must be used within GoogleAPIProvider');
  return context;
};

export const getSheetIdByName = async (sheetName: string): Promise<number> => {
  const response = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheet = response.result.sheets?.find(
    (s: { properties: { title: string; }; }) => s.properties?.title === sheetName
  );

  if (!sheet || sheet.properties?.sheetId === undefined) {
    throw new Error(`シート "${sheetName}" が見つかりません`);
  }

  return sheet.properties.sheetId;
};
