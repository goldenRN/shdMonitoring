'use client';

import React from 'react';

const SupportPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Тусламж ба дэмжлэг</h1>

      <p className="mb-6 text-gray-700">
        Энэхүү вэб болон аппликейшн нь Сонгинохайрхан дүүргийн Засаг даргын Тамгын газрын захиалгаар Байнарисопт ХХК-аар хөгжүүлэгдсэн болно.
        Хэрэв танд асуудал тулгарсан бол дараах мэдээллийг ашиглан бидэнтэй холбогдоно уу.
      </p>

      <h2 className="text-xl font-semibold mb-2">Түгээмэл асуултууд</h2>
      <ul className="list-disc list-inside mb-6 text-gray-600">
        <li>Апп ажиллахгүй бол яах вэ?</li>
        <li>Хувийн мэдээлэл хэрхэн хамгаалагддаг вэ?</li>
        <li>Хэн энэхүү үйлчилгээг хариуцаж байгаа вэ?</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Холбоо барих</h2>
      <p className="text-gray-700">
        📞 Утас: <a href="tel:+97611345678" className="text-blue-600 underline">11-345678</a><br />
        ✉️ И-мэйл: <a href="mailto:info@shd.ub.gov.mn" className="text-blue-600 underline">info@shd.ub.gov.mn</a><br />
        📍 Хаяг: Сонгинохайрхан дүүргийн Засаг даргын Тамгын газар, Улаанбаатар, Монгол улс
      </p>
    </div>
  );
};

export default SupportPage;
