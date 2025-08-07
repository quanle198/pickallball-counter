// src/App.js
import React from 'react';
import { usePickleball } from './hooks/usePickleball';
import Header from './components/Header';
import ProgressDisplay from './components/ProgressDisplay';
import ActionButtons from './components/ActionButtons';
import HistorySection from './components/HistorySection';
import Stats from './components/Stats';
import Footer from './components/Footer';
import ConfirmModal from './components/ConfirmModal';
import DataEntryModal from './components/DataEntryModal';

export default function PickleballTicketTracker() {
  const {
    // State
    currentTicket,
    completedTickets,
    showHistory,
    showCompletedHistory,
    confirmDelete,
    showDataEntry,
    dataEntry,
    isOffline,
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
  } = usePickleball();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      {isOffline && (
        <div className="bg-yellow-200 p-2 text-center text-yellow-800">
          Bạn đang offline. Dữ liệu vẫn được lưu cục bộ!
        </div>
      )}
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <Header 
          currentTicket={currentTicket} 
          formatDateDisplay={formatDateDisplay} 
        />

        {/* Progress Display */}
        <ProgressDisplay 
          currentTicket={currentTicket} 
          TICKET_LIMIT={TICKET_LIMIT} 
        />

        {/* Action Buttons */}
        <ActionButtons
          handlePlay={handlePlay}
          handleNewTicket={handleNewTicket}
          handleDataEntry={handleDataEntry}
          setShowHistory={setShowHistory}
          setShowCompletedHistory={setShowCompletedHistory}
          todayPlayed={todayPlayed}
          isTicketFull={isTicketFull}
          showHistory={showHistory}
          showCompletedHistory={showCompletedHistory}
        />

        {/* History Sections */}
        <HistorySection
          showHistory={showHistory}
          showCompletedHistory={showCompletedHistory}
          currentTicket={currentTicket}
          completedTickets={completedTickets}
          formatDateDisplay={formatDateDisplay}
          handleRemoveDate={handleRemoveDate}
        />

        {/* Stats */}
        <Stats 
          completedTickets={completedTickets} 
          currentTicket={currentTicket} 
        />

        {/* Footer */}
        <Footer isTicketFull={isTicketFull} />

        {/* Modals */}
        <ConfirmModal
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          confirmRemoveDate={confirmRemoveDate}
          createNewTicket={createNewTicket}
          formatDateDisplay={formatDateDisplay}
          currentTicket={currentTicket}
          TICKET_LIMIT={TICKET_LIMIT}
        />

        <DataEntryModal
          showDataEntry={showDataEntry}
          setShowDataEntry={setShowDataEntry}
          dataEntry={dataEntry}
          setDataEntry={setDataEntry}
          addPlayDate={addPlayDate}
          updatePlayDate={updatePlayDate}
          removePlayDate={removePlayDate}
          confirmDataEntry={confirmDataEntry}
          getTodayString={getTodayString}
          TICKET_LIMIT={TICKET_LIMIT}
        />
      </div>
    </div>
  );
}