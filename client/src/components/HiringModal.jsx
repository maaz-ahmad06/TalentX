import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Lock,
  Award,
  CreditCard,
  Smartphone,
  Building2,
  Receipt,
  ArrowRight,
  Printer,
  Check,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HiringModal = ({ 
  talent, 
  job = null,
  currentUser = null,
  onClose, 
  onContractCreated 
}) => {
  // Step State: 1 = Contract Terms Setup, 2 = Pakistani Escrow Payment Checkout, 3 = Success / Digital Tax Invoice
  const [step, setStep] = useState(1);

  // Step 1 Form States
  const [contractTitle, setContractTitle] = useState(job ? job.title : `Direct Project with ${talent.name}`);
  const [amount, setAmount] = useState(job ? job.budget : (talent.dailyRate || 35000));
  const [deadline, setDeadline] = useState('2026-10-05');
  const [milestone1, setMilestone1] = useState('First Deliverable / Prototype / Initial Draft');
  const [milestone2, setMilestone2] = useState('Final Polish, Source Code & Complete Handover');

  // Step 2 Checkout States (Pakistani Gateways)
  const [selectedMethod, setSelectedMethod] = useState('jazzcash'); // 'jazzcash' | 'easypaisa' | 'card' | 'raast'
  const [mobileNumber, setMobileNumber] = useState('03001234567');
  const [cnicDigits, setCnicDigits] = useState('654321');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Maaz Ahmad');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  if (!talent) return null;

  const totalAmount = Number(amount);
  const halfAmount = Math.round(totalAmount / 2);
  const depositAmount = halfAmount; // Milestone 1 funded into Escrow on creation

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayAndFundEscrow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const txRef = `TX-ESC-${Math.floor(100000 + Math.random() * 900000)}`;
      const clientDisplayName = currentUser?.companyName || currentUser?.name || 'Client Employer';

      const paymentMethodName = 
        selectedMethod === 'jazzcash' ? 'JazzCash' : 
        selectedMethod === 'easypaisa' ? 'EasyPaisa' : 
        selectedMethod === 'card' ? 'PayFast 3D Card' : 'Raast Bank Transfer';

      const finalReceipt = {
        transactionRef: txRef,
        amount: depositAmount,
        totalContractAmount: totalAmount,
        method: paymentMethodName,
        account: selectedMethod === 'card' ? `Card ending in ${cardCvc}` : mobileNumber,
        contractTitle,
        clientName: clientDisplayName,
        talentName: talent.name,
        date: new Date().toLocaleString(),
        status: 'Funded in Escrow'
      };

      const newContract = {
        jobId: job ? job.id : `direct_${Date.now()}`,
        jobTitle: contractTitle,
        clientName: clientDisplayName,
        talentId: talent.id,
        talentName: talent.name,
        talentAvatar: talent.avatar,
        amount: totalAmount,
        currency: 'PKR',
        escrowStatus: 'Funded in Escrow',
        escrowFundedAmount: depositAmount,
        paymentMethod: paymentMethodName,
        transactionRef: txRef,
        deadline: deadline,
        status: 'In Progress',
        milestones: [
          { 
            id: `m1_${Date.now()}`, 
            title: milestone1, 
            amount: halfAmount, 
            isPaid: false, 
            status: 'Funded in Escrow',
            fundedAt: new Date().toISOString()
          },
          { 
            id: `m2_${Date.now()}`, 
            title: milestone2, 
            amount: totalAmount - halfAmount, 
            isPaid: false, 
            status: 'Pending Deposit' 
          }
        ]
      };

      // Confetti Fireworks Celebration
      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
      setReceiptData(finalReceipt);
      setStep(3);

      onContractCreated(newContract);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[92vh] overflow-y-auto" 
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

        {/* STEP 1: Contract Setup Form */}
        {step === 1 && (
          <>
            <div className="space-y-1 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck size={13} /> Step 1: Safe Milestone Escrow Setup
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Create Hiring Offer for {talent.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Define milestones and protect both parties with automated Pakistani PKR escrow.
              </p>
            </div>

            {/* Talent Preview Pill */}
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <img src={talent.avatar} alt={talent.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30" />
                <div>
                  <div className="font-bold text-sm text-white">{talent.name}</div>
                  <div className="text-xs text-slate-400">{talent.headline} &bull; {talent.city}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
                Verified Pro
              </span>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contract / Project Title</label>
                <input 
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Total Contract Budget (PKR)</label>
                  <input 
                    type="number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Completion Date</label>
                  <input 
                    type="date"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Milestone Setup */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-indigo-400" />
                    <span>Milestone Release Schedule (50% / 50%)</span>
                  </div>
                  <span className="text-emerald-400">Milestone 1 funded now into Escrow</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">1</span>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    value={milestone1}
                    onChange={(e) => setMilestone1(e.target.value)}
                    required
                  />
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/30 shrink-0">
                    PKR {halfAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">2</span>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    value={milestone2}
                    onChange={(e) => setMilestone2(e.target.value)}
                    required
                  />
                  <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 font-bold text-xs border border-slate-600 shrink-0">
                    PKR {(totalAmount - halfAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Escrow Guarantee Note */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <Lock size={14} className="shrink-0" />
                <span>Next: Deposit Milestone 1 (PKR {halfAmount.toLocaleString()}) via JazzCash, EasyPaisa, Card or Raast to activate contract.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <span>Proceed to Escrow Deposit</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 2: Pakistani Local Payment Gateway Checkout */}
        {step === 2 && (
          <>
            <div className="space-y-1 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck size={13} /> Step 2: Milestone 1 Escrow Deposit
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Secure Escrow Checkout
              </h2>
              <p className="text-xs text-slate-400">
                Deposit Milestone 1 amount into TalentX Escrow Vault. Freelancer is paid only upon your deliverable approval.
              </p>
            </div>

            {/* Deposit Summary Pill */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Deposit Amount (Milestone 1)</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">PKR {depositAmount.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-0.5">{contractTitle}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Contract Total</span>
                <div className="text-sm font-bold text-slate-200">PKR {totalAmount.toLocaleString()}</div>
                <div className="text-[11px] text-indigo-400 font-medium mt-0.5">50% Escrow Funded</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-slate-300">Select Pakistani Payment Gateway</label>
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

                {/* PayFast 3D Card */}
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
                  <span className="text-[9px] text-slate-400">Visa / Master</span>
                </button>

                {/* Raast / 1Link */}
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
                  <span className="font-bold text-xs">Raast / Bank</span>
                  <span className="text-[9px] text-slate-400">Instant Transfer</span>
                </button>
              </div>
            </div>

            {/* Dynamic Form for Selected Gateway */}
            <form onSubmit={handlePayAndFundEscrow} className="space-y-4">
              {selectedMethod === 'jazzcash' && (
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-red-300 font-bold">
                    <Smartphone size={14} /> JazzCash Mobile Account
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">JazzCash Mobile Number</label>
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
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">CNIC Last 6 Digits</label>
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
                </div>
              )}

              {selectedMethod === 'easypaisa' && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                    <Smartphone size={14} /> EasyPaisa Mobile Wallet
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">EasyPaisa Account Number</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500 text-sm text-white font-mono outline-none"
                      placeholder="03331234567"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold">
                    <CreditCard size={14} /> PayFast 3D Secure Card Gateway
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-indigo-500 text-sm text-white outline-none"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Card Number (16 Digits)</label>
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
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'raast' && (
                <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/40 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                      <Building2 size={15} /> 1Link (1Bill) & SBP Raast Direct Bank Transfer
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      0% Bank Fee
                    </span>
                  </div>

                  {/* Account / Invoice Details */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-slate-400">Beneficiary Bank:</span>
                      <strong className="text-white">Meezan Bank Ltd (Pakistan)</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-slate-400">Account Title:</span>
                      <strong className="text-white">TalentX Pakistan Escrow Treasury</strong>
                    </div>

                    {/* Option A: 1Bill Invoice Number */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">1Bill Invoice / Voucher No:</div>
                        <div className="text-amber-400 font-mono font-black text-sm">1009823908123</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('1009823908123');
                          setCopiedField('1bill');
                          setTimeout(() => setCopiedField(null), 2000);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition-all cursor-pointer"
                      >
                        {copiedField === '1bill' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedField === '1bill' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Option B: Raast IBAN */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">Raast IBAN (Instant Transfer):</div>
                        <div className="text-emerald-400 font-mono font-bold text-xs">PK36MEZN0001009823908123</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('PK36MEZN0001009823908123');
                          setCopiedField('iban');
                          setTimeout(() => setCopiedField(null), 2000);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition-all cursor-pointer"
                      >
                        {copiedField === 'iban' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedField === 'iban' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Step Instruction Guide */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20 text-[11px] text-slate-300 space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>📌 How to pay via your Bank App:</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed text-[11px]">
                      <li>Open any Bank App (<em className="text-slate-200">Meezan, HBL, Alfalah, SadaPay, NayaPay, JazzCash</em>).</li>
                      <li>Go to <strong className="text-white">Bill Payments &rarr; 1Bill / Invoices</strong> (or <strong className="text-white">Raast Instant Transfer</strong>).</li>
                      <li>Enter the <strong className="text-amber-300">1Bill Ref</strong> or <strong className="text-emerald-300">Raast IBAN</strong> above. Your bill of <strong className="text-white">PKR {depositAmount.toLocaleString()}</strong> will auto-fetch.</li>
                      <li>Click the button below to confirm escrow lock!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer" 
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  Back to Terms
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Securing in Escrow...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Deposit PKR {depositAmount.toLocaleString()} & Activate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 3: Digital Escrow Tax Invoice & Receipt */}
        {step === 3 && receiptData && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Payment Verified & Escrow Locked</span>
              <h2 className="text-2xl font-black text-white">Contract Activated Successfully!</h2>
              <p className="text-xs text-slate-400">
                Milestone 1 funds have been deposited in the TalentX Escrow Vault. Freelancer has been notified to start work.
              </p>
            </div>

            {/* Invoice Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 text-left space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-white font-sans text-sm">
                  <Receipt size={16} className="text-indigo-400" />
                  <span>TalentX Official Escrow Tax Receipt</span>
                </div>
                <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                  PAID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Transaction ID</span>
                  <span className="font-bold text-white text-xs">{receiptData.transactionRef}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Method</span>
                  <span className="font-bold text-white">{receiptData.method}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Client (Payer)</span>
                  <span className="text-white">{receiptData.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Hired Talent</span>
                  <span className="text-white">{receiptData.talentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Project Title</span>
                  <span className="text-white truncate block">{receiptData.contractTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Date & Time</span>
                  <span className="text-slate-400">{receiptData.date}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-sans">
                <div>
                  <span className="text-[11px] text-slate-400">Milestone 1 Deposit Amount:</span>
                </div>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  PKR {depositAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button 
                type="button" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print Tax Invoice</span>
              </button>
              <button 
                type="button" 
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                onClick={onClose}
              >
                <span>Done & View Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
