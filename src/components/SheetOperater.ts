import { productData } from './data'; 
import { gapi } from 'gapi-script';
import { getSheetIdByName } from './GoogleAPIProvider';

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const sheetName = '購入情報';

export const writeToSheet = async (
  quantities: Record<string, string>, 
  date:string
) => {
  const authInstance = gapi.auth2.getAuthInstance();
  const user = authInstance.currentUser.get();
  const email = user.getBasicProfile().getEmail();

  const productNames = productData.map((item) => item.product);
  
  //業の作成
  const row: (string | number)[] = [date];
    for (const name of productNames) {
    row.push(Number(quantities[name]) || 0); 
  }
  row.push(email);
  
  const body = {
    values:[row],
  };

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`, // 「購入情報」シートの先頭
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: body,
    });
    console.log('書き込み成功:', response);
  } catch (error) {
    const sheetMeta = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheets = sheetMeta.result.sheets || [];
    const sheetExists = sheets.some(
      (sheet: { properties: { title: string; }; }) => sheet.properties?.title === sheetName
    );
    if (!sheetExists) {
      await generateSheet(sheetName);
      writeToSheet(quantities,date)  
    }else{
    console.error('書き込み失敗:', error);
    }
  }
};


export const deleteRowFromSheet = async (time:string) => {

  try {
    // 1. シートの全データを取得
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:Z`, // A1:Zならヘッダー含むが、ここではデータのみ
    });

    const rows = response.result.values || [];
    // console.log(rows);
    // console.log(time);
    // console.log(localStorage.getItem("userEmail"));
    
    // 2. 対象行を探す（全て文字列で比較）
    const matchIndex = rows.findIndex((row: any[]) =>
      row[0] === time &&
      row[row.length - 1] === localStorage.getItem("userEmail")
    );

    if (matchIndex === -1) {
      console.warn('一致する行が見つかりませんでした');
      return;
    }

    const rowNumber = matchIndex + 2; // A2: なので +2 が実際の行番号

    // 3. batchUpdate で削除
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await getSheetIdByName(sheetName),
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    console.log(`行 ${rowNumber} を削除しました`);
  } catch (err) {
    console.error('行削除失敗:', err);
  }
};

const generateSheet = async (sheetName:string) => {
  const productNames = productData.map((item) => item.product);
  const header = [
  "日時",
  ...productNames,
  "メールアドレス",
  ];
  await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        },
      ],
    },
    });
  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    resource: {
      values: [header],
    },
  });
      console.log(`シート「${sheetName}」を作成しました`);
}
