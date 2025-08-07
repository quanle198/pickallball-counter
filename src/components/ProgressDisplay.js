// src/components/ProgressDisplay.js
import React from 'react';

const ProgressDisplay = ({ currentTicket, TICKET_LIMIT }) => {
  const progressPercent = (currentTicket.used / TICKET_LIMIT) * 100;
  const isTicketFull = currentTicket.used >= TICKET_LIMIT;

  return (
    <div className="text-center mb-8">
      <div className="bg-gray-100 rounded-2xl p-6 mb-4">
        <div className="text-5xl font-bold text-gray-800 mb-2">
          {currentTicket.used}<span className="text-2xl text-gray-500">/{TICKET_LIMIT}</span>
        </div>
        <p className="text-gray-600 mb-4">lần đã sử dụng</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              progressPercent >= 90 ? 'bg-red-500' :
              progressPercent >= 70 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">
          Còn lại: {TICKET_LIMIT - currentTicket.used} lần
        </p>

        {isTicketFull && (
          <div className="mt-3 p-2 bg-red-100 rounded-lg">
            <p className="text-red-600 font-medium">🎉 Vé đã sử dụng hết!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDisplay;