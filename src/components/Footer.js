// src/components/Footer.js
import React from 'react';

const Footer = ({ isTicketFull }) => {
  return (
    <>
      <div className="text-center mt-6 text-sm text-gray-500">
        {!isTicketFull ? 'Mỗi ngày chỉ được chơi 1 lần' : 'Hãy mua vé mới để tiếp tục!'}
      </div>
      <div className="text-center mt-6 text-sm text-gray-500">
        ver: 1.0.2 - <a href="https://www.facebook.com/quanfx/" style={{ textDecoration: 'underline' }}>QuanFX</a>
      </div>
    </>
  );
};

export default Footer;