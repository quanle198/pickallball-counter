import React, { useState, useEffect } from 'react';
import { Plus, Calendar, ChevronDown, ChevronUp, CreditCard, Trophy, History, Edit3, X } from 'lucide-react';

export default function PickleballTicketTracker() {

  // Hàm để lấy ngày hiện tại ở định dạng YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0');
  };

  const [currentTicket, setCurrentTicket] = useState({
    number: 1,
    used: 0,
    playDates: [],
    startDate: null
  });

  const [completedTickets, setCompletedTickets] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showCompletedHistory, setShowCompletedHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, date: null, type: 'date' });
  const [showDataEntry, setShowDataEntry] = useState(false);
  const [dataEntry, setDataEntry] = useState({
    ticketNumber: 1,
    playDates: [],
    startDate: getTodayString()
  });
  
  const TICKET_LIMIT = 30;

  // Hàm để format ngày hiển thị
  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short'
    });
  };

  // Khôi phục dữ liệu khi component load
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('pickleballTicketData') || '{}');
    
    if (savedData.currentTicket) {
      setCurrentTicket(savedData.currentTicket);
    }
    if (savedData.completedTickets) {
      setCompletedTickets(savedData.completedTickets);
    }
  }, []);

  // Lưu dữ liệu mỗi khi có thay đổi
  useEffect(() => {
    const dataToSave = {
      currentTicket: currentTicket,
      completedTickets: completedTickets
    };
    localStorage.setItem('pickleballTicketData', JSON.stringify(dataToSave));
  }, [currentTicket, completedTickets]);

  const handlePlay = () => {
    const today = getTodayString();
    
    // Kiểm tra xem hôm nay đã chơi chưa
    if (currentTicket.playDates.includes(today)) {
      return; // Không hiển thị alert trong sandbox
    }

    // Kiểm tra vé đã hết chưa
    if (currentTicket.used >= TICKET_LIMIT) {
      return; // Không hiển thị alert trong sandbox
    }

    const newUsed = currentTicket.used + 1;
    const newPlayDates = [...currentTicket.playDates, today].sort().reverse();
    const startDate = currentTicket.startDate || today;

    const updatedTicket = {
      ...currentTicket,
      used: newUsed,
      playDates: newPlayDates,
      startDate: startDate
    };

    setCurrentTicket(updatedTicket);

    // Nếu đã dùng hết 30 lần, tự động thông báo
    if (newUsed === TICKET_LIMIT) {
      // Không dùng alert trong sandbox
    }
  };

  const handleNewTicket = () => {
    if (currentTicket.used < TICKET_LIMIT) {
      setConfirmDelete({ show: true, date: null, type: 'newTicket' });
      return;
    }

    createNewTicket();
  };

  const createNewTicket = () => {
    // Chuyển vé hiện tại vào danh sách đã hoàn thành
    const completedTicket = {
      ...currentTicket,
      endDate: getTodayString(),
      isCompleted: currentTicket.used === TICKET_LIMIT
    };

    setCompletedTickets([completedTicket, ...completedTickets]);

    // Tạo vé mới
    setCurrentTicket({
      number: currentTicket.number + 1,
      used: 0,
      playDates: [],
      startDate: null
    });
  };

  const handleDataEntry = () => {
    setShowDataEntry(true);
    setDataEntry({
      ticketNumber: currentTicket.number,
      playDates: [...currentTicket.playDates],
      startDate: currentTicket.startDate || getTodayString()
    });
  };

  const addPlayDate = () => {
    setDataEntry(prev => ({
      ...prev,
      playDates: [...prev.playDates, getTodayString()]
    }));
  };

  const updatePlayDate = (index, value) => {
    const newPlayDates = [...dataEntry.playDates];
    newPlayDates[index] = value;
    setDataEntry(prev => ({ ...prev, playDates: newPlayDates }));
  };

  const removePlayDate = (index) => {
    const newPlayDates = dataEntry.playDates.filter((_, i) => i !== index);
    setDataEntry(prev => ({ ...prev, playDates: newPlayDates }));
  };

  const confirmDataEntry = () => {
    // Lọc ngày unique và sort reverse
    const uniquePlayDates = [...new Set(dataEntry.playDates)].filter(date => date && date <= getTodayString());
    const sortedPlayDates = uniquePlayDates.sort().reverse();
    const usedCount = sortedPlayDates.length;

    if (usedCount > TICKET_LIMIT) {
      // Không dùng alert, chỉ log hoặc xử lý
      console.log('Số ngày vượt quá giới hạn');
      return;
    }

    setCurrentTicket({
      number: parseInt(dataEntry.ticketNumber),
      used: usedCount,
      playDates: sortedPlayDates,
      startDate: dataEntry.startDate
    });

    setShowDataEntry(false);
  };

  const handleRemoveDate = (dateToRemove) => {
    setConfirmDelete({ show: true, date: dateToRemove, type: 'date' });
  };

  const confirmRemoveDate = () => {
    const dateToRemove = confirmDelete.date;
    const newPlayDates = currentTicket.playDates.filter(date => date !== dateToRemove);
    const newUsed = Math.max(0, currentTicket.used - 1);
    
    setCurrentTicket(prevTicket => ({
      ...prevTicket,
      used: newUsed,
      playDates: newPlayDates
    }));
    
    setConfirmDelete({ show: false, date: null, type: 'date' });
  };

  const todayPlayed = currentTicket.playDates.includes(getTodayString());
  const isTicketFull = currentTicket.used >= TICKET_LIMIT;
  const progressPercent = (currentTicket.used / TICKET_LIMIT) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
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

        {/* Progress Display */}
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

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Play Button */}
          <button
            onClick={handlePlay}
            disabled={todayPlayed || isTicketFull}
            className={`w-full rounded-2xl py-4 px-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
              todayPlayed || isTicketFull
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          >
            <Plus size={28} />
            <span>
              {isTicketFull ? 'Vé đã hết' : 
               todayPlayed ? 'Hôm nay đã chơi' : 'Chơi hôm nay'}
            </span>
          </button>

          {/* New Ticket Button */}
          {isTicketFull && (
            <button
              onClick={handleNewTicket}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl py-4 px-6 text-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <CreditCard size={28} />
              <span>Mua vé tháng mới</span>
            </button>
          )}

          {/* Secondary Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleDataEntry}
              className="flex-1 bg-indigo-500 text-white rounded-xl py-3 px-4 font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Edit3 size={18} />
              <span>Nhập dữ liệu</span>
            </button>
          </div>

          {/* History Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 bg-blue-500 text-white rounded-xl py-3 px-4 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Calendar size={18} />
              <span>Lịch sử</span>
              {showHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <button
              onClick={() => setShowCompletedHistory(!showCompletedHistory)}
              className="flex-1 bg-orange-500 text-white rounded-xl py-3 px-4 font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Trophy size={18} />
              <span>Các vé cũ</span>
              {showCompletedHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

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

          {/* Stats */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 text-center">
            <h3 className="font-medium text-gray-800 mb-2">📊 Thống kê</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{completedTickets.length}</div>
                <div className="text-gray-600">Vé đã mua</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {completedTickets.reduce((sum, ticket) => sum + ticket.used, 0) + currentTicket.used}
                </div>
                <div className="text-gray-600">Tổng lần chơi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          {!isTicketFull ? 'Mỗi ngày chỉ được chơi 1 lần' : 'Hãy mua vé mới để tiếp tục!'}
        </div>

        {/* Custom Confirm Modal */}
        {confirmDelete.show && (
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
        )}

        {/* Data Entry Modal */}
        {showDataEntry && (
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
        )}
      </div>
    </div>
  );
}