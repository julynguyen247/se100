import React from "react";

const AppFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Giới thiệu</h3>
          <p className="text-sm text-gray-300">
            Chúng tôi cung cấp các sản phẩm giày chất lượng từ Nike, Adidas, New
            Balance và nhiều thương hiệu nổi tiếng khác. Uy tín - Chất lượng -
            Giá tốt.
          </p>
        </div>

        {/* Cột 2: Liên kết */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên kết</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#" className="hover:text-white transition">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
          <p className="text-sm text-gray-300">Email: support@giaydep.com</p>
          <p className="text-sm text-gray-300">Hotline: 0123 456 789</p>
          <p className="text-sm text-gray-300">
            Địa chỉ: 123 Nguyễn Trãi, Hà Nội
          </p>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} GiayDep. All rights reserved.
      </div>
    </footer>
  );
};

export default AppFooter;
