// src/components/HistorySection.js
import React from 'react';

const HistorySection = ({ 
  showHistory, 
  showCompletedHistory, 
  currentTicket, 
  completedTickets, 
  formatDateDisplay, 
  handleRemoveDate 
}) => {
  return (
    <>
      {/* Current Ticket History */}
      {showHistory && (
        <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
          <h3 className="font-medium text-gray-800 mb-3">Vé #{currentTicket.number} - Các ngày đã chơi:</h3>
          {currentTicket.playDates.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa chơi lần nào</p>
          ) : (
            <div className="space-y-2">
              {currentTicket.playDates.map((date) => (
                <div key={date} className="flex items-center justify-between bg-white rounded-lg p-2">
                  <span className="text-sm font-medium text-gray-700">
                    {formatDateDisplay(date)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveDate(date);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Tickets History */}
      {showCompletedHistory && (
        <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
          <h3 className="font-medium text-gray-800 mb-3">Các vé đã sử dụng:</h3>
          {completedTickets.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa có vé nào hoàn thành</p>
          ) : (
            <div className="space-y-2">
              {completedTickets.map((ticket) => (
                <div key={ticket.number} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Vé #{ticket.number}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      ticket.isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.used}/30
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {ticket.startDate && formatDateDisplay(ticket.startDate)} - {ticket.endDate && formatDateDisplay(ticket.endDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HistorySection;