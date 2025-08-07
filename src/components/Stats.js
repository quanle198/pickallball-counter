// src/components/Stats.js
import React from 'react';

const Stats = ({ completedTickets, currentTicket }) => {
  const totalCompleted = completedTickets.length;
  const totalGamesPlayed = completedTickets.reduce((sum, ticket) => sum + ticket.used, 0) + currentTicket.used;

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 text-center mt-6">
      <h3 className="font-medium text-gray-800 mb-2">📊 Thống kê</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-2xl font-bold text-indigo-600">{totalCompleted}</div>
          <div className="text-gray-600">Vé đã mua</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{totalGamesPlayed}</div>
          <div className="text-gray-600">Tổng lần chơi</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;