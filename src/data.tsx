interface OriginProduct {
  itemName: string;
  itemPrice: number;
  itemImage: string;
}

interface Product {
  product: string;
  price: string;
}

const url = "https://suiranfes.github.io/mock-store-datas/products.json";

async function fetchData(): Promise<Product[]> {
  const response = await fetch(url);
  const data: OriginProduct[] = await response.json();

  // 変換
  const transformedData: Product[] = data.map(item => ({
    product: item.itemName,
    price: item.itemPrice.toString()
  }));

  return transformedData;
}

// データ取得を実行
let productData: Product[] = [];

fetchData().then(data => {
  console.log(data);
  productData = data;
});

export { productData };

// ここに商品のデータを入力してください
// スペースを入れないように気を付けてください
// export const productData: Product[] = [
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
