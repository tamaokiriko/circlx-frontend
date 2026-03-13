
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { WaitingCustomer } from '../types';
import GlassModal from './GlassModal';

const createInitialCustomers = (): WaitingCustomer[] => {
  const now = Date.now();
  return [
    { id: '1', ticketNumber: 101, adults: 2, children: 1, seatType: 'TABLE', status: 'WAITING', arrivalTime: new Date(now - 1000 * 60 * 15) },
    { id: '2', ticketNumber: 102, adults: 4, children: 0, seatType: 'EITHER', status: 'WAITING', arrivalTime: new Date(now - 1000 * 60 * 10) },
    { id: '3', ticketNumber: 103, adults: 1, children: 0, seatType: 'COUNTER', status: 'WAITING', arrivalTime: new Date(now - 1000 * 60 * 5) },
    { id: '4', ticketNumber: 104, adults: 2, children: 2, seatType: 'TABLE', status: 'WAITING', arrivalTime: new Date(now - 1000 * 60 * 2) },
  ];
};

const StoreView: React.FC = () => {
  const [customers, setCustomers] = useState<WaitingCustomer[]>(() => createInitialCustomers());

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; targetId: string | null; type: 'CANCEL' | 'HOLD' }>({
    isOpen: false,
    targetId: null,
    type: 'CANCEL'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const getWaitTime = (arrival: Date) => {
    const diff = Math.floor((currentTime.getTime() - arrival.getTime()) / (1000 * 60));
    return `${diff}分`;
  };

  const handleCall = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'CALLED' } : c));
  };

  const handleHold = (id: string) => {
    setConfirmModal({ isOpen: true, targetId: id, type: 'HOLD' });
  };

  const handleCancelRequest = (id: string) => {
    setConfirmModal({ isOpen: true, targetId: id, type: 'CANCEL' });
  };

  const confirmAction = () => {
    if (confirmModal.type === 'CANCEL') {
      setCustomers(prev => prev.filter(c => c.id !== confirmModal.targetId));
    } else {
      setCustomers(prev => prev.map(c => c.id === confirmModal.targetId ? { ...c, status: 'HOLD' } : c));
    }
    setConfirmModal({ isOpen: false, targetId: null, type: 'CANCEL' });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans overflow-y-auto pb-[100px]">
      <header className="bg-[#082752] text-white p-6 lg:px-10 flex justify-between items-center shadow-2xl mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <div className="select-none">
              <Image
                src="/circlx_white.svg"
                alt="CIRCLX"
                width={150}
                height={50}
                className="brightness-0 invert"
              />
            </div>
          </div>
          <div className="border-l border-white/10 pl-6 hidden sm:block">
            <h1 className="text-xl font-black leading-none uppercase tracking-tighter">Waiting List</h1>
            <p className="mt-1 text-[10px] text-white/40 font-bold uppercase tracking-widest">CIRCLX CAFE SHIBUYA</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="bg-white/5 rounded-2xl px-6 py-2 border border-white/5 hidden sm:flex items-center space-x-6">
            <div className="text-center border-r border-white/5 pr-6">
              <span className="text-[10px] font-black text-white/40 block uppercase tracking-wider">待機中</span>
              <span className="text-xl font-bold text-white">{customers.length}組</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-white/40 block uppercase tracking-wider">予測時間</span>
              <span className="text-xl font-bold text-white/80">約{customers.length * 5}分</span>
            </div>
          </div>
          <button className="bg-white/5 w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-10">
        {customers.map((c) => (
          <div key={c.id} className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-[#082752]/20 border border-white relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${c.status === 'CALLED' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
            <button onClick={() => handleCancelRequest(c.id)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10" title="キャンセル">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex h-full flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">#{c.ticketNumber}</span>
                    {c.status === 'CALLED' && <span className="bg-green-100 text-green-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">呼出中</span>}
                    {c.status === 'HOLD' && <span className="bg-orange-100 text-[#fd780f] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">保留中</span>}
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <div className="flex items-center space-x-1 bg-gray-100 px-4 py-2 rounded-2xl">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <span className="font-bold text-gray-700">大人 {c.adults} / 子供 {c.children}</span>
                    </div>
                    <div className="bg-slate-50 text-slate-900 font-bold px-4 py-2 rounded-2xl">{c.seatType === 'TABLE' ? 'テーブル席' : c.seatType === 'COUNTER' ? 'カウンター席' : 'どちらでも可'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-gray-400 block uppercase mb-1 tracking-widest">経過</span>
                  <span className={`text-2xl font-black tabular-nums ${parseInt(getWaitTime(c.arrivalTime)) > 15 ? 'text-red-500' : 'text-gray-900'}`}>{getWaitTime(c.arrivalTime)}</span>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-4 gap-4">
                <button onClick={() => handleCall(c.id)} className={`col-span-3 py-8 rounded-[1.8rem] flex flex-col items-center justify-center space-y-2 transition-all active:scale-95 shadow-lg ${c.status === 'CALLED' ? 'bg-green-500 shadow-green-200 text-white animate-pulse' : 'bg-[#082752] shadow-blue-900/10 text-white hover:bg-[#061d3e]'}`}>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  <span className="text-2xl font-black uppercase tracking-widest">{c.status === 'CALLED' ? 'RE-CALL' : 'CALL'}</span>
                </button>
                <button onClick={() => handleHold(c.id)} className="col-span-1 bg-white border-2 border-gray-100 rounded-[1.8rem] flex items-center justify-center text-gray-400 hover:text-[#fd780f] hover:border-orange-200 hover:bg-orange-50 transition-all active:scale-95">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[10px] font-black uppercase">Hold</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmModal.isOpen && (
        <GlassModal onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmAction} title={confirmModal.type === 'CANCEL' ? '受付をキャンセルしますか？' : '保留にしますか？'} message={confirmModal.type === 'CANCEL' ? 'この操作は取り消せません。お客様の順番が完全に削除されます。' : 'お客様を一時的に待機リストの最後に移動させます。'} confirmText={confirmModal.type === 'CANCEL' ? 'キャンセルを確定' : '保留にする'} isDangerous={confirmModal.type === 'CANCEL'} />
      )}
    </div>
  );
};

export default StoreView;
