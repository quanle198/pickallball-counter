// src/components/ConfirmModal.js
import React from 'react';

const ConfirmModal = ({ 
  confirmDelete, 
  setConfirmDelete, 
  confirmRemoveDate, 
  createNewTicket, 
  formatDateDisplay, 
  currentTicket,
  TICKET_LIMIT 
}) => {
  if (!confirmDelete.show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {confirmDelete.type === 'date' ? 'Xác nhận xóa' : 'Xác nhận mua vé mới'}
        </h3>
        <p className="text-gray-600 mb-6">
          {confirmDelete.type === 'date' 
            ? `Bạn có chắc muốn xóa ngày ${confirmDelete.date ? formatDateDisplay(confirmDelete.date) : ''}?`
            : `Vé hiện tại mới dùng ${currentTicket.used}/${TICKET_LIMIT} lần. Bạn có chắc muốn mua vé mới?`
          }
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setConfirmDelete({ show: false, date: null, type: 'date' })}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (confirmDelete.type === 'date') {
                confirmRemoveDate();
              } else {
                createNewTicket();
                setConfirmDelete({ show: false, date: null, type: 'date' });
              }
            }}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;