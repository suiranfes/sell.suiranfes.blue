import { productData } from "./data";
import { LocalStorageLib } from "./localStorageLib";
const localStorageLib = new LocalStorageLib();

const reflectLocal = async () => {
  if (localStorage.getItem("isUser") == "true") {
    const GAS_URL = import.meta.env.VITE_GAS_API_URL;

    // ラベル作成
    let to_top_data: string[] = ["UTC", "時間"];
    for (let i = 0; i < productData.length; i++) {
      to_top_data.push(productData[i].product);
    }

    const local_all_data = localStorageLib.local_all_array();
    const labeles_all_data = local_all_data.unshift(to_top_data);
    console.log(local_all_data);

    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ID: localStorage.getItem("ID"), data: local_all_data })
    });
  }
};

export { reflectLocal };
