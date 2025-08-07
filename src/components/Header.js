// src/components/Header.js
import React from 'react';

const Header = ({ currentTicket, formatDateDisplay }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        🎫 Vé Tháng Pickleball
      </h1>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Vé #{currentTicket.number}
        </h2>
        {currentTicket.startDate && (
          <p className="text-sm text-gray-600">
            Bắt đầu: {formatDateDisplay(currentTicket.startDate)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Header;