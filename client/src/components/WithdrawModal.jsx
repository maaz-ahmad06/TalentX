import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Wallet,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WithdrawModal = ({
  availableBalance = 0,
  currentUser,
  onClose,
  onWithdrawSubmit
}) => {
  const [method, setMethod] = useState('jazzcash'); // 'jazzcash' | 'easypaisa' | 'bank'
  const [withdrawAmount, setWithdrawAmount] = useState(Math.min(availableBalance, 25000));
  const [accountTitle, setAccountTitle] = useState(currentUser?.name || 'Hamza Tariq');
  const [accountNumber, setAccountNumber] = useState('03009876543');
  const [bankName, setBankName] = useState('Meezan Bank Ltd');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [payoutRef, setPayoutRef] = useState('');

  const maxAmount = Math.max(0, Number(availableBalance));

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    if (amountNum <= 0 || amountNum > maxAmount) {
      alert(`Please enter a valid amount between PKR 500 and PKR ${maxAmount.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const ref = `TX-WDR-${Math.floor(100000 + Math.random() * 900000)}`;
      setPayoutRef(ref);

      confetti({
        particleCount: 130,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
      setIsSuccess(true);

      if (onWithdrawSubmit) {
        onWithdrawSubmit({
          amount: amountNum,
          payoutMethod: method === 'jazzcash' ? 'JazzCash' : method === 'easypaisa' ? 'EasyPaisa' : `Bank Transfer (${bankName})`,
          accountTitle,
          accountNumber,
          bankName: method === 'bank' ? bankName : undefined,
          transactionRef: ref
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" 
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <>
            <div className="space-y-1 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <Wallet size={14} /> Instant Earnings Payout
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Withdraw Your Earnings
              </h2>
              <p className="text-xs text-slate-400">
                Direct instant payout to your Pakistani mobile wallet or local bank account.
              </p>
            </div>

            {/* Available Balance Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Available For Withdrawal</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">PKR {maxAmount.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Processing Time</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Zap size={12} /> Instant 24/7</span>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-slate-300">Select Payout Destination</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('jazzcash')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    method === 'jazzcash'
                      ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Smartphone size={18} className={method === 'jazzcash' ? 'text-red-400' : 'text-slate-400'} />
                  <span className="text-xs font-bold">JazzCash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('easypaisa')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    method === 'easypaisa'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Smartphone size={18} className={method === 'easypaisa' ? 'text-emerald-400' : 'text-slate-400'} />
                  <span className="text-xs font-bold">EasyPaisa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    method === 'bank'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Building2 size={18} className={method === 'bank' ? 'text-indigo-400' : 'text-slate-400'} />
                  <span className="text-xs font-bold">Bank Transfer</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Withdrawal Amount (PKR)</label>
                  <button 
                    type="button" 
                    onClick={() => setWithdrawAmount(maxAmount)}
                    className="text-[10px] text-indigo-400 hover:underline font-bold"
                  >
                    Withdraw All
                  </button>
                </div>
                <input 
                  type="number"
                  max={maxAmount}
                  min="500"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500 text-base font-mono font-bold text-white outline-none"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Account Title (As per CNIC/Bank)</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500 text-xs text-white outline-none"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  required
                />
              </div>

              {method === 'bank' && (
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Bank Name</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500 text-xs text-white outline-none cursor-pointer"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option value="Meezan Bank Ltd">Meezan Bank Ltd</option>
                    <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                    <option value="Bank Alfalah">Bank Alfalah</option>
                    <option value="United Bank Limited (UBL)">United Bank Limited (UBL)</option>
                    <option value="MCB Bank">MCB Bank</option>
                    <option value="Standard Chartered Pakistan">Standard Chartered Pakistan</option>
                    <option value="Faysal Bank">Faysal Bank</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                  {method === 'bank' ? 'Account Number / IBAN (PK..)' : 'Registered Mobile Number'}
                </label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500 text-xs text-white font-mono outline-none"
                  placeholder={method === 'bank' ? 'PK00MEZN000123456789' : '03001234567'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || maxAmount < 500}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Instant Payout...</span>
                  ) : (
                    <>
                      <span>Confirm & Transfer PKR {Number(withdrawAmount).toLocaleString()}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success View */
          <div className="text-center space-y-5 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Withdrawal Processed!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                PKR {Number(withdrawAmount).toLocaleString()} has been transferred to your {method === 'bank' ? bankName : method.toUpperCase()} account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-indigo-300 font-bold">#{payoutRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-semibold text-white">{accountTitle} ({accountNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">Completed & Settled</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs cursor-pointer"
            >
              Done & Return to Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
