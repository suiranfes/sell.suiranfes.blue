import axios from 'axios';

// Import するデータ形式
interface pulProduct {
  itemName: string,
  itemPrice: number,
  itemImage: string
}

// Export するデータ形式
interface product {
  product: string,
  price: string
}

//GitHubからデータを取得
let productData: product[] = [];

export const pullData = async () => {
  const url = "https://suiranfes.github.io/mock-store-datas/products.json";
  var responseData: product[] = [];
  try {
    const response = await axios.get(url);
    const resData = response.data;
    responseData = resData.map((data: pulProduct) => ({ product: data.itemName, price: data.itemPrice.toString() }));
    // console.log(responseData);
  } catch (error) {
    console.error('データ取得中にエラーが発生しました:', error);
    alert("もう一度読み込んでください。")
  }
  productData = responseData;
}

export { productData };

// ここに商品のデータを入力してください
// スペースを入れないように気を付けてください
// export const productData = [
//   { product: "チュロス", price: "200" },
//   { product: "かき氷", price: "200" },
//   { product: "ペットボトル", price: "150" },
//   { product: "アイスチョコバナナ", price: "300" },
//   { product: "つぶつぶアイス", price: "350" },
//   { product: "フランクフルト", price: "200" },
//   { product: "焼きそば", price: "300" },
//   { product: "ドリンク各種", price: "300" },
//   { product: "クレープ", price: "350" },
//   { product: "肉巻きおにぎり", price: "400" },
//   // {product:"サンプルデータ", price: "200"},
//   // {product:"サンプルデータ2", price: "350"},
// ];
