import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Zap, 
  ArrowRight, 
  Download, 
  Printer, 
  Sparkles,
  Receipt,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentCheckoutModal = ({
  contractData,
  talent,
  currentUser,
  onClose,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState('jazzcash'); // 'jazzcash' | 'easypaisa' | 'card' | 'raast'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Form states for Pakistani payment methods
  const [mobileNumber, setMobileNumber] = useState('03001234567');
  const [cnicDigits, setCnicDigits] = useState('654321');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Maaz Ahmad');

  const totalAmount = Number(contractData?.amount || 50000);
  const milestone1Amount = Array.isArray(contractData?.milestones) && contractData.milestones[0]?.amount 
    ? Number(contractData.milestones[0].amount) 
    : Math.round(totalAmount / 2);

  const depositAmount = milestone1Amount;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 3D Secure / Payment Gateway processing
    setTimeout(async () => {
      const txRef = `TX-ESC-${Math.floor(100000 + Math.random() * 900000)}`;
      const receiptData = {
        transactionRef: txRef,
        amount: depositAmount,
        totalContractAmount: totalAmount,
        method: selectedMethod === 'jazzcash' ? 'JazzCash Mobile Account' : selectedMethod === 'easypaisa' ? 'EasyPaisa Wallet' : selectedMethod === 'card' ? 'PayFast 3D Secure Card' : 'Raast Instant Bank Transfer',
        account: selectedMethod === 'card' ? `Card ending in ${cardCvc}` : mobileNumber,
        contractTitle: contractData?.jobTitle || `Project with ${talent?.name || 'Talent'}`,
        clientName: currentUser?.name || contractData?.clientName || 'Client Employer',
        talentName: talent?.name || contractData?.talentName || 'Freelance Specialist',
        date: new Date().toLocaleString(),
        status: 'Funded in Escrow'
      };

      // Confetti Fireworks Celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
      setPaymentSuccessData(receiptData);

      if (onPaymentSuccess) {
        onPaymentSuccess(receiptData);
      }
    }, 1500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[92vh] overflow-y-auto" 
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

        {!paymentSuccessData ? (
          <>
            {/* Header */}
            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck size={14} /> TalentX PKR Escrow Checkout
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Secure Milestone Payment
              </h2>
              <p className="text-xs text-slate-400">
                Funds are held in secure Escrow and only released when you approve the milestone.
              </p>
            </div>

            {/* Project Summary Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Target Project</span>
                  <h4 className="font-bold text-sm text-white">{contractData?.jobTitle || 'Custom Milestone Contract'}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Milestone 1 Escrow</span>
                  <div className="text-base font-black text-emerald-400 font-mono">PKR {depositAmount.toLocaleString()}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Hiring Professional: <strong className="text-slate-200">{talent?.name || contractData?.talentName || 'Talent'}</strong></span>
                <span className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1"><Lock size={11} /> 100% Milestone Protected</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-300">Select Local Payment Method (Pakistan)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === 'jazzcash'
                      ? 'bg-gradient-to-b from-red-600/25 to-red-950/40 border-red-500 text-white shadow-lg shadow-red-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    JC
                  </div>
                  <span className="font-bold text-xs">JazzCash</span>
                  <span className="text-[9px] text-slate-400">Mobile Account</span>
                </button>

                {/* EasyPaisa */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === 'easypaisa'
                      ? 'bg-gradient-to-b from-emerald-600/25 to-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                    EP
                  </div>
                  <span className="font-bold text-xs">EasyPaisa</span>
                  <span className="text-[9px] text-slate-400">Instant Wallet</span>
                </button>

                {/* PayFast Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'bg-gradient-to-b from-indigo-600/25 to-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <CreditCard size={20} className={selectedMethod === 'card' ? 'text-indigo-400' : 'text-slate-400'} />
                  <span className="font-bold text-xs">Card Pay</span>
                  <span className="text-[9px] text-slate-400">Visa/Mastercard</span>
                </button>

                {/* Raast / Bank */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('raast')}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === 'raast'
                      ? 'bg-gradient-to-b from-amber-600/25 to-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Building2 size={20} className={selectedMethod === 'raast' ? 'text-amber-400' : 'text-slate-400'} />
                  <span className="font-bold text-xs">1Link / Raast</span>
                  <span className="text-[9px] text-slate-400">Direct Bank</span>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Details Input Form */}
            <form onSubmit={handlePayNow} className="space-y-4">
              {selectedMethod === 'jazzcash' && (
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-red-300 font-bold">
                    <Smartphone size={14} /> JazzCash Direct Mobile Checkout
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">JazzCash Account Number</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-red-500 text-sm text-white font-mono outline-none"
                      placeholder="03001234567"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">CNIC Last 6 Digits (Security Verification)</label>
                    <input 
                      type="password" 
                      maxLength="6"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-red-500 text-sm text-white font-mono outline-none"
                      placeholder="••••••"
                      value={cnicDigits}
                      onChange={(e) => setCnicDigits(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">You will receive an MPIN prompt on your mobile to confirm payment.</p>
                </div>
              )}

              {selectedMethod === 'easypaisa' && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                    <Smartphone size={14} /> EasyPaisa Mobile Wallet Deposit
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">EasyPaisa Registered Mobile Number</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500 text-sm text-white font-mono outline-none"
                      placeholder="03331234567"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Approve the instant push notification in your EasyPaisa app to lock milestone funds.</p>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold">
                    <CreditCard size={14} /> PayFast 3D Secure Card Processing
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Cardholder Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white outline-none"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Card Number (Visa / Mastercard / PayPak)</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white font-mono outline-none"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white font-mono outline-none"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">CVV / CVC</label>
                      <input 
                        type="password" 
                        maxLength="4"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white font-mono outline-none"
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'raast' && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                    <Building2 size={14} /> 1Link & Raast Instant Pakistani Transfer
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Beneficiary Bank:</span>
                      <strong className="text-white">Meezan Bank Ltd</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Title:</span>
                      <strong className="text-white">TalentX Pakistan Escrow Treasury</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">1Bill Invoice Ref:</span>
                      <strong className="text-amber-400 font-mono">1009823908123</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">Instant automatic detection via Raast / 1Link within 15 seconds.</p>
                </div>
              )}

              {/* Fee Breakdown & Submit Button */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>TalentX Escrow Protection:</span>
                  <span className="text-emerald-400 font-bold">FREE (0% Client Fee)</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white">
                  <span>Total Due Today:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">PKR {depositAmount.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span>Verifying with {selectedMethod.toUpperCase()} & Locking Escrow...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Lock PKR {depositAmount.toLocaleString()} in Escrow & Start Project</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Payment Success & Digital Tax Invoice View */
          <div className="text-center space-y-6 animate-fadeIn py-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                100% Milestone Secured
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Funds Deposited in Escrow!
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                PKR {depositAmount.toLocaleString()} is safely locked in TalentX Escrow. Freelancer has been notified to begin work.
              </p>
            </div>

            {/* Official Digital Invoice Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-indigo-400" />
                  <span className="font-bold text-white">TalentX Escrow Deposit Invoice</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ref: #{paymentSuccessData.transactionRef}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Employer Client:</span>
                  <span className="font-semibold text-slate-200">{paymentSuccessData.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Talent:</span>
                  <span className="font-semibold text-slate-200">{paymentSuccessData.talentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Method:</span>
                  <span className="font-semibold text-slate-200">{paymentSuccessData.method}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Escrow Vault Status:</span>
                  <span className="font-bold text-emerald-400">🟢 Secured in Vault</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold text-white">
                <span>Funded Amount:</span>
                <span className="font-mono text-emerald-400 font-black">PKR {paymentSuccessData.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={handlePrintReceipt}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </button>

              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <span>Go to Active Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
