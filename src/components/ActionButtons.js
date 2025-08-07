// src/components/ActionButtons.js
import React from 'react';
import { Plus, CreditCard, Edit3, Calendar, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

const ActionButtons = ({ 
  handlePlay, 
  handleNewTicket, 
  handleDataEntry, 
  setShowHistory, 
  setShowCompletedHistory,
  todayPlayed, 
  isTicketFull, 
  showHistory, 
  showCompletedHistory 
}) => {
  return (
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
          <span>Vé cũ</span>
          {showCompletedHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;