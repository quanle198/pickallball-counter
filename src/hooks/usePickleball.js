// src/hooks/usePickleball.js
import { useState, useEffect } from 'react';
import { saveData, loadData } from '../utils/storage';

const TICKET_LIMIT = 30;

export const usePickleball = () => {
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
    (async () => {
      const savedData = await loadData();
      if (savedData.currentTicket) setCurrentTicket(savedData.currentTicket);
      if (savedData.completedTickets) setCompletedTickets(savedData.completedTickets);
    })();
  }, []);

  // Lưu dữ liệu mỗi khi có thay đổi
  useEffect(() => {
    const dataToSave = {
      currentTicket,
      completedTickets
    };
    saveData(dataToSave);
  }, [currentTicket, completedTickets]);

  const handlePlay = () => {
    const today = getTodayString();
    
    // Kiểm tra xem hôm nay đã chơi chưa
    if (currentTicket.playDates.includes(today)) {
      return;
    }

    // Kiểm tra vé đã hết chưa
    if (currentTicket.used >= TICKET_LIMIT) {
      return;
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

  return {
    // State
    currentTicket,
    completedTickets,
    showHistory,
    showCompletedHistory,
    confirmDelete,
    showDataEntry,
    dataEntry,
    todayPlayed,
    isTicketFull,
    
    // Functions
    handlePlay,
    handleNewTicket,
    createNewTicket,
    handleDataEntry,
    addPlayDate,
    updatePlayDate,
    removePlayDate,
    confirmDataEntry,
    handleRemoveDate,
    confirmRemoveDate,
    formatDateDisplay,
    getTodayString,
    
    // Setters
    setShowHistory,
    setShowCompletedHistory,
    setConfirmDelete,
    setShowDataEntry,
    setDataEntry,
    
    // Constants
    TICKET_LIMIT
  };
};