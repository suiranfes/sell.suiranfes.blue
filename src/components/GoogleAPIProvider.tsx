// GoogleAPIProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
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
              localStorage.setItem('userEmail', email);
              localStorage.setItem('isUser', 'true');
            } else {
              localStorage.setItem('isUser', 'false');
              localStorage.removeItem('userEmail');
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

  return (
    <GoogleAPIContext.Provider value={{ isSignedIn, userEmail, signIn, signOut }}>
      {children}
    </GoogleAPIContext.Provider>
  );
};

export const useGoogleAPI = () => {
  const context = useContext(GoogleAPIContext);
  if (!context) throw new Error('useGoogleAPI must be used within GoogleAPIProvider');
  return context;
};
