import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Lock, 
  Building2, 
  Info,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiSubmitVerification } from '../services/api';
import { addVerification } from '../utils/storage';

export const CnicVerificationModal = ({
  isOpen,
  onClose,
  currentUser,
  onVerificationSubmitted,
  showToast
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Form State
  const [idType, setIdType] = useState('CNIC');
  const [idNumber, setIdNumber] = useState(currentUser?.cnic || '');
  const [legalName, setLegalName] = useState(currentUser?.name || '');
  const [city, setCity] = useState(currentUser?.city || 'Lahore');
  const [districtOrArea, setDistrictOrArea] = useState(currentUser?.area || 'Gulberg III');
  
  // Document Previews / URLs
  const [documentFront, setDocumentFront] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80');
  const [documentBack, setDocumentBack] = useState('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80');

  // Format Pakistani CNIC with dashes automatically (XXXXX-XXXXXXX-X)
  const handleCnicChange = (val) => {
    if (idType === 'CNIC') {
      const clean = val.replace(/\D/g, '').slice(0, 13);
      let formatted = clean;
      if (clean.length > 5 && clean.length <= 12) {
        formatted = `${clean.slice(0, 5)}-${clean.slice(5)}`;
      } else if (clean.length > 12) {
        formatted = `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12, 13)}`;
      }
      setIdNumber(formatted);
    } else {
      setIdNumber(val);
    }
  };

  const handleFileUpload = (e, target) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'front') setDocumentFront(reader.result);
        if (target === 'back') setDocumentBack(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idNumber || !legalName) {
      if (showToast) showToast('Please enter your full legal name and ID number.', 'warning');
      return;
    }

    setSubmitting(true);
    const payload = {
      userId: currentUser?.id || currentUser?._id || `user_${Date.now()}`,
      userName: currentUser?.name || legalName,
      userEmail: currentUser?.email || 'freelancer@talentx.pk',
      userRole: currentUser?.role || 'talent',
      idType,
      idNumber,
      legalName,
      city,
      districtOrArea,
      documentFront,
      documentBack
    };

    try {
      const res = await apiSubmitVerification(payload);
      addVerification(payload);
      setSuccessSubmitted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (showToast) showToast('Pakistani CNIC / ID Verification submitted successfully!', 'success');
      if (onVerificationSubmitted) onVerificationSubmitted(res?.verification || payload);
    } catch (err) {
      // Offline fallback
      addVerification(payload);
      setSuccessSubmitted(true);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      if (showToast) showToast('Verification request recorded for Admin Review!', 'success');
      if (onVerificationSubmitted) onVerificationSubmitted(payload);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Pakistani Trust Aesthetic */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Pakistan Pro ID Verification</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GOVT ID
                </span>
              </div>
              <p className="text-xs text-slate-400">NADRA Smart CNIC & FBR NTN Identity Authentication</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {successSubmitted ? (
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-white">Verification Under Review!</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Your <strong className="text-emerald-400">{idType} #{idNumber}</strong> has been submitted to the TalentX Trust & Safety team. Verification is typically approved within 2-4 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Legal Name:</span>
                <strong className="text-white">{legalName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">City / District:</span>
                <strong className="text-white">{city}, {districtOrArea}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Badge to be awarded:</span>
                <strong className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> NADRA Verified Pro
                </strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Step Indicators */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className={`font-bold flex items-center gap-2 ${step === 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">1</span>
                Legal Identity Details
              </span>
              <ChevronRight size={14} className="text-slate-600" />
              <span className={`font-bold flex items-center gap-2 ${step === 2 ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">2</span>
                Document Photo Upload
              </span>
            </div>

            {/* STEP 1: Identification Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                  <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Verified profiles receive a green <strong>Government ID Verified</strong> badge, boosting client hiring confidence by <strong>3.5x</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Identity Document Type *</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'CNIC', label: 'Pakistani CNIC', hint: '13 Digits (NADRA)' },
                      { id: 'NTN', label: 'FBR NTN', hint: 'Business Tax ID' },
                      { id: 'Passport', label: 'Passport', hint: 'Govt Passport' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setIdType(type.id);
                          setIdNumber('');
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          idType === type.id 
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{type.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{type.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {idType === 'CNIC' ? 'CNIC Number (13 Digits) *' : idType === 'NTN' ? 'NTN Number (7+1 Digits) *' : 'Passport Number *'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder={idType === 'CNIC' ? '35201-1234567-1' : idType === 'NTN' ? '1234567-8' : 'AB1234567'}
                      value={idNumber}
                      onChange={(e) => handleCnicChange(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <Lock size={14} className="text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    {idType === 'CNIC' && 'Example format: 35201-XXXXXXX-X (NADRA Smart Card)'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Legal Name (as printed on CNIC) *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Muhammad Hamza Tariq"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">City *</label>
                    <input 
                      type="text"
                      placeholder="Lahore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">District / Area</label>
                    <input 
                      type="text"
                      placeholder="Gulberg III, DHA, F-7"
                      value={districtOrArea}
                      onChange={(e) => setDistrictOrArea(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!idNumber || !legalName) {
                        if (showToast) showToast('Please complete ID number and Legal Name.', 'warning');
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Document Upload</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Document Upload */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Document */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>CNIC Front Photo *</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Photo / JPG / PNG</span>
                    </label>
                    <div className="relative rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-800/40 p-4 text-center transition-all">
                      {documentFront ? (
                        <div className="space-y-2">
                          <img 
                            src={documentFront} 
                            alt="CNIC Front" 
                            className="w-full h-28 object-cover rounded-xl border border-slate-700"
                          />
                          <span className="text-[10px] text-emerald-400 font-semibold block flex items-center justify-center gap-1">
                            <CheckCircle2 size={11} /> Front Document Attached
                          </span>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload size={24} className="text-slate-500 mx-auto mb-2" />
                          <span className="text-xs text-slate-400 block font-medium">Upload Front Image</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Back Document */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>CNIC Back Photo</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <div className="relative rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-800/40 p-4 text-center transition-all">
                      {documentBack ? (
                        <div className="space-y-2">
                          <img 
                            src={documentBack} 
                            alt="CNIC Back" 
                            className="w-full h-28 object-cover rounded-xl border border-slate-700"
                          />
                          <span className="text-[10px] text-emerald-400 font-semibold block flex items-center justify-center gap-1">
                            <CheckCircle2 size={11} /> Back Document Attached
                          </span>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload size={24} className="text-slate-500 mx-auto mb-2" />
                          <span className="text-xs text-slate-400 block font-medium">Upload Back Image</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'back')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-2.5">
                  <Lock size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your identity data is 256-bit encrypted and only accessible by authorized TalentX Admin compliance officers.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck size={16} />
                    <span>{submitting ? 'Submitting Verification...' : 'Submit ID for Verification'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
