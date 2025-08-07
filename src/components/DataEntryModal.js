// src/components/DataEntryModal.js
import React from 'react';
import { Plus, X } from 'lucide-react';

const DataEntryModal = ({ 
  showDataEntry, 
  setShowDataEntry, 
  dataEntry, 
  setDataEntry, 
  addPlayDate, 
  updatePlayDate, 
  removePlayDate, 
  confirmDataEntry, 
  getTodayString,
  TICKET_LIMIT 
}) => {
  if (!showDataEntry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full overflow-y-auto max-h-[80vh]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📝 Nhập dữ liệu vé hiện tại
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số vé:
            </label>
            <input
              type="number"
              min="1"
              value={dataEntry.ticketNumber}
              onChange={(e) => setDataEntry({...dataEntry, ticketNumber: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu vé:
            </label>
            <input
              type="date"
              value={dataEntry.startDate}
              onChange={(e) => setDataEntry({...dataEntry, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Các ngày đã chơi:
            </label>
            <div className="space-y-2 mb-3">
              {dataEntry.playDates.map((date, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={date}
                    max={getTodayString()}
                    onChange={(e) => updatePlayDate(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => removePlayDate(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addPlayDate}
              className="w-full bg-green-500 text-white rounded-lg py-2 px-4 font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              disabled={dataEntry.playDates.length >= TICKET_LIMIT}
            >
              <Plus size={18} />
              <span>Thêm ngày</span>
            </button>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDataEntry(false)}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={confirmDataEntry}
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEntryModal;