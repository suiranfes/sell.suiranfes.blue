import { productData } from './data'; 
import { gapi } from 'gapi-script';

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

export const writeToSheet = async (
  quantities: Record<string, string>
) => {
  const authInstance = gapi.auth2.getAuthInstance();
  const user = authInstance.currentUser.get();
  const email = user.getBasicProfile().getEmail();

  const now = new Date();
  const formattedDate = now.toLocaleString(); 

  const productNames = productData.map((item) => item.product);
  
  //業の作成
  const row: (string | number)[] = [formattedDate];
    for (const name of productNames) {
    row.push(quantities[name] || 0); 
  }
  row.push(email);
  
  const body = {
    values:[row],
  };

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: '購入情報!A1', // 「購入情報」シートの先頭
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: body,
    });
    console.log('書き込み成功:', response);
  } catch (error) {
    console.error('書き込み失敗:', error);
  }
};
