import React, { useEffect, useState } from "react";

interface Product {
  product: string;
  price: string;
}

const AppWithJson = ( url: string ): Product[] => {
  const [data, setData] = useState<Product[]>([]);

  const tempData: Product[] = [];

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(jsonData => {
        const tempData: Product[] = jsonData.map((item: any) => ({
          product: item.itemName,
          price: item.itemPrice.toString()
        }));
        setData(tempData);
        console.log(tempData);
      })
      .catch(error => console.error('Error fetching JSON:', error));
  }, []);

  data.map((item: any) => (
    tempData.push({ product: item.itemName, price: item.itemPrice.toString() })
  ));

  return tempData;
};

export const productData = AppWithJson("https://suiranfes.github.io/mock-store-datas/products.json");

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
