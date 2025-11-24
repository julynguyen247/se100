import { getShoesAPI } from "@/services/api";
import { Carousel, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

interface IShoesTable {
  _id: string;
  mainText: string;
  brand: string;
  price: number;
  thumbnail: string;
}

const HomePage = () => {
  const [shoes, setShoes] = useState<IShoesTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

  useEffect(() => {
    fetchShoes();
  }, [current, pageSize, filter, sortQuery]);

  const fetchShoes = async () => {
    // setIsLoading(true);
    let query = ``;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await getShoesAPI(query);

    if (res && res.data) {
      setShoes(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const ProductCard = ({
    image,
    name,
    colors,
    price,
    badge,
  }: {
    image: string;
    name: string;
    colors: string;
    price: string;
    badge?: string;
  }) => (
    <div className="flex flex-col">
      <div className="h-96 rounded-lg bg-gray-50 text-center shadow hover:shadow-lg transition-transform transform hover:scale-105 hover:border hover:border-red-400 overflow-hidden cursor-pointer">
        <img
          src={image}
          alt={name}
          className="w-full h-60 object-cover mb-2 transition-all duration-300 hover:brightness-110"
        />
      </div>
      <div className="p-4">
        {badge && (
          <div className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full mb-2">
            {badge}
          </div>
        )}
        <div className="font-semibold text-xl mb-1">{name}</div>
        <div className="text-gray-500 mb-1">{colors}</div>
        <div className="font-semibold text-lg mb-2">{price}</div>
        <div className="flex items-center gap-1 text-yellow-400">
          {"\u2B50\u2B50\u2B50\u2B50\u2B50"}
        </div>
      </div>
    </div>
  );

  const contentStyle: React.CSSProperties = {
    height: "300px",
    color: "#fff",
    lineHeight: "300px",
    textAlign: "center",
    background: "#364d79",
    borderRadius: "12px",
    overflow: "hidden",
  };

  return (
    <div className="p-12 mt-28">
      <Carousel autoplay>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} style={{ height: "300px", width: "100%" }}>
            <img
              src={`${
                import.meta.env.VITE_BACKEND_URL
              }/images/banners/banner${item}.jpg`}
              alt={`Banner ${item}`}
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </div>
        ))}
      </Carousel>

      <div className="flex-1 mt-16">
        <h1 className="text-4xl p-4 font-bold mb-8 text-center">
          Sản phẩm nổi bật
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : shoes.length === 0 ? (
          <div className="text-center text-xl text-gray-500">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
            {shoes.map((shoe) => (
              <ProductCard
                key={shoe._id}
                image={`${import.meta.env.VITE_BACKEND_URL}/images/shoes/${
                  shoe.thumbnail
                }`}
                name={shoe.mainText}
                colors={shoe.brand}
                price={Number(shoe.price).toLocaleString("vi-VN") + " đ"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
