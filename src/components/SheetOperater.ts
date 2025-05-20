import { productData } from './data';
import { gapi } from 'gapi-script';
import { getSheetIdByName } from './GoogleAPIProvider';

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const sheetName = '購入情報';

export const writeToSheet = async (
  quantities: Record<string, string>,
  date: string
) => {
  const authInstance = gapi.auth2.getAuthInstance();
  const user = authInstance.currentUser.get();
  const email = user?.getBasicProfile()?.getEmail();
  console.log(email);
  if (email == undefined) {
    console.error("ログイン状態ではありません");
    return false;
  }

  const productNames = productData.map((item) => item.product);

  //業の作成
  const row: (string | number)[] = [date];
  for (const name of productNames) {
    row.push(Number(quantities[name]) || 0);
  }
  row.push(email);

  const body = {
    values: [row],
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
    return true;

  } catch (error) {
    try {
      const sheetMeta = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      const sheets = sheetMeta.result.sheets || [];
      const sheetExists = sheets.some(
        (sheet: { properties: { title: string; }; }) => sheet.properties?.title === sheetName
      );
      if (!sheetExists) {
        await generateSheet(sheetName);
        writeToSheet(quantities, date);
      }
    } catch {
      console.error('書き込み失敗:', error);
      return false;
    }
  }
};

export const deleteRowFromSheet = async (time: string) => {
  try {
    //シートの全データを取得
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:Z`,
    });

    const rows = response.result.values || [];

    const matchIndex = rows.findIndex((row: any[]) =>
      row[0] === time &&
      row[row.length - 1] === localStorage.getItem("userEmail")
    );

    if (matchIndex === -1) {
      console.warn('一致する行が見つかりませんでした');
      return;
    }

    const rowNumber = matchIndex + 2;

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
            }
          },
        ],
      },
    });

    console.log(`行 ${rowNumber} を削除しました`);
    return true;
  } catch (err) {
    console.error('行削除失敗:', err);
    return false;
  }
};

const generateSheet = async (sheetName: string) => {
  const productNames = productData.map((item) => item.product);
  const header = [
    "日時",
    ...productNames,
    "メールアドレス",
  ];

  await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
  });

  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    resource: { values: [header] },
  });
  console.log(`シート「${sheetName}」を作成しました`);
}
