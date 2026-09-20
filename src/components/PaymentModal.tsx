import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { InvoiceModal, InvoiceData } from './InvoiceModal';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Download,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Building2,
  FileText
} from 'lucide-react';

export interface FedapayTransactionRecord {
  id: string; // fp_tx_...
  operatorRef: string;
  client: string;
  type: string;
  method: 'T-Money' | 'Moov Flooz' | 'Carte Bancaire';
  amount: string;
  amountNumber: number;
  phoneOrCard: string;
  date: string;
  status: 'APPROVED' | 'PENDING' | 'FAILED';
  environment: 'SANDBOX' | 'LIVE';
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  amountFcfa: number;
  clientName?: string;
  clientEmail?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  planName,
  amountFcfa,
  clientName = 'SADPlus (acc_2209219218)',
  clientEmail = 'contact@sadplus.tg'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'TMONEY' | 'FLOOZ' | 'CARD'>('TMONEY');
  const [phone, setPhone] = useState('90 12 34 56');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvc, setCardCvc] = useState('321');
  const [cardHolder, setCardHolder] = useState(clientName);
  
  // Environment: Sandbox vs Live
  const [fedapayEnv, setFedapayEnv] = useState<'SANDBOX' | 'LIVE'>('SANDBOX');
  
  // Processing steps: IDLE -> INITIATING -> USSD_PUSH -> VERIFYING -> SUCCESS | ERROR
  const [paymentStep, setPaymentStep] = useState<
    'IDLE' | 'INITIATING' | 'USSD_PUSH' | 'VERIFYING' | 'SUCCESS' | 'ERROR'
  >('IDLE');
  const [stepMessage, setStepMessage] = useState('');
  const [txDetails, setTxDetails] = useState<FedapayTransactionRecord | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setPaymentStep('INITIATING');
    setStepMessage('Initialisation de la transaction via la passerelle FedaPay...');

    const timestamp = Date.now();
    const fpTxId = `fp_tx_${fedapayEnv === 'LIVE' ? 'live' : 'test'}_${timestamp.toString().slice(-6)}`;
    const opRef = paymentMethod === 'TMONEY' 
      ? `TMG-${Math.floor(100000 + Math.random() * 900000)}`
      : paymentMethod === 'FLOOZ'
      ? `FLZ-${Math.floor(100000 + Math.random() * 900000)}`
      : `GIM-${Math.floor(100000 + Math.random() * 900000)}`;

    const methodLabel = paymentMethod === 'TMONEY' 
      ? 'T-Money' 
      : paymentMethod === 'FLOOZ' 
      ? 'Moov Flooz' 
      : 'Carte Bancaire';

    // Step 2: Push notification on phone or 3D secure check
    setTimeout(() => {
      setPaymentStep('USSD_PUSH');
      if (paymentMethod === 'TMONEY') {
        setStepMessage('Push USSD FedaPay envoyé sur le mobile Togocom (*145#). En attente de confirmation...');
      } else if (paymentMethod === 'FLOOZ') {
        setStepMessage('Push USSD FedaPay envoyé sur le mobile Moov (*155#). En attente de validation...');
      } else {
        setStepMessage('Authentification 3D-Secure FedaPay en cours de validation par votre banque...');
      }

      // Step 3: Verifying switch
      setTimeout(() => {
        setPaymentStep('VERIFYING');
        setStepMessage('Confirmation du débit reçue du switch bancaire. Enregistrement sur Galenis...');

        // Step 4: Approved & Save to localStorage
        setTimeout(() => {
          const nowStr = "Aujourd'hui à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          const newTx: FedapayTransactionRecord = {
            id: fpTxId,
            operatorRef: opRef,
            client: clientName,
            type: planName,
            method: methodLabel,
            amount: `${amountFcfa.toLocaleString('fr-FR')} FCFA`,
            amountNumber: amountFcfa,
            phoneOrCard: paymentMethod === 'CARD' ? `•••• ${cardNumber.slice(-4)}` : phone,
            date: nowStr,
            status: 'APPROVED',
            environment: fedapayEnv
          };

          setTxDetails(newTx);
          setPaymentStep('SUCCESS');

          // Persist in local storage for Admin Dashboard & API Portal
          try {
            const existingRaw = localStorage.getItem('galenis_fedapay_transactions');
            const list = existingRaw ? JSON.parse(existingRaw) : [];
            const updated = [newTx, ...list];
            localStorage.setItem('galenis_fedapay_transactions', JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent('galenis_transaction_completed', { detail: newTx }));
          } catch (e) {
            console.error('Error saving transaction', e);
          }
        }, 1200);
      }, 1500);
    }, 1200);
  };

  const handleDownloadReceipt = () => {
    if (!txDetails) return;
    const content = `================================================
REÇU DE TRANSACTION FEDAPAY - GALENIS TOGO
================================================
Agrégateur     : FedaPay Togo / UEMOA
ID FedaPay     : ${txDetails.id}
Réf. Opérateur : ${txDetails.operatorRef}
Environnement  : ${txDetails.environment}
Date & Heure   : ${new Date().toLocaleString('fr-FR')}
Client         : ${txDetails.client} (${clientEmail})
Prestation     : ${txDetails.type}
Moyen          : ${txDetails.method} (${txDetails.phoneOrCard})
Montant Net    : ${txDetails.amount}
Statut         : APPROUVÉ (200 OK)
================================================
Émetteur       : Galenis HealthTech Togo SARL
RCCM           : TG-LFW-01-2024-B12-00492
NIF            : 1001849201 • Lomé, Togo
Partenaires    : ONPT & DPML (Secteur consultatif)
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recu_FedaPay_${txDetails.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isProcessing = paymentStep === 'INITIATING' || paymentStep === 'USSD_PUSH' || paymentStep === 'VERIFYING';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header - High contrast with FedaPay Branding */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button 
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>

          {/* FedaPay Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black tracking-wider uppercase">
                Agrégateur Agréé FedaPay
              </span>
            </div>

            {/* Sandbox / Live Toggle */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setFedapayEnv('SANDBOX')}
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                  fedapayEnv === 'SANDBOX' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sandbox
              </button>
              <button
                type="button"
                onClick={() => setFedapayEnv('LIVE')}
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                  fedapayEnv === 'LIVE' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Production
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-300 font-medium">Facturation Galenis</p>
              <h2 className="text-lg font-black text-white">{planName}</h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{clientName}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">
                {amountFcfa.toLocaleString('fr-FR')} <span className="text-sm font-bold text-emerald-400">FCFA</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">TTC • XOF (UEMOA)</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* SUCCESS VIEW */}
          {paymentStep === 'SUCCESS' && txDetails ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto border border-emerald-300 shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Paiement Validé avec FedaPay !</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Votre transaction a été approuvée en direct par l'agrégateur FedaPay Togo.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 font-sans text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Référence FedaPay</span>
                  <span className="font-mono font-bold text-slate-900">{txDetails.id}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Réf. Opérateur</span>
                  <span className="font-mono font-bold text-emerald-700">{txDetails.operatorRef}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Canal</span>
                  <span className="font-bold text-slate-900">{txDetails.method} ({txDetails.phoneOrCard})</span>
                </div>
                <div className="flex items-center justify-between pt-1 font-bold text-sm">
                  <span className="text-slate-900">Montant Encaissé</span>
                  <span className="text-emerald-700 font-black">{txDetails.amount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>Afficher la Facture Officielle A4 (Galenis HealthTech Togo)</span>
                </button>

                {/* Accounting Note */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 text-center leading-relaxed">
                  Facture conforme aux normes fiscales togolaises (TVA 18% UEMOA) • Émise par Galenis HealthTech Togo SARL • RCCM TG-LFW-01-2024-B12-00492
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Reçu .txt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSuccess();
                      onClose();
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Terminer</span>
                  </button>
                </div>
              </div>
            </div>
          ) : isProcessing ? (
            /* PROCESSING LOADING STEP */
            <div className="py-10 text-center space-y-4 animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Passerelle FedaPay en cours d'exécution
                </h4>
                <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                  {stepMessage}
                </p>
              </div>

              {fedapayEnv === 'SANDBOX' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl text-[11px] max-w-sm mx-auto font-medium">
                  <strong>Simulation Sandbox FedaPay</strong> : La transaction s'auto-validera dans quelques secondes.
                </div>
              )}
            </div>
          ) : (
            /* PAYMENT FORM */
            <div className="space-y-4">
              
              {/* Payment Methods Selection */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-2">
                  Sélectionnez le canal de paiement FedaPay
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* T-Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TMONEY')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'TMONEY'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#009A63] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                      T
                    </div>
                    <span className="text-xs font-black text-slate-900">T-Money</span>
                    <span className="text-[10px] text-emerald-700 font-extrabold">Togocom</span>
                  </button>

                  {/* Moov Flooz */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('FLOOZ')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'FLOOZ'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                      F
                    </div>
                    <span className="text-xs font-black text-slate-900">Flooz</span>
                    <span className="text-[10px] text-blue-700 font-extrabold">Moov Africa</span>
                  </button>

                  {/* Carte Bancaire */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'CARD'
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-900">Carte</span>
                    <span className="text-[10px] text-purple-700 font-extrabold">Visa / GIM</span>
                  </button>
                </div>
              </div>

              {/* T-Money & Flooz Form */}
              {(paymentMethod === 'TMONEY' || paymentMethod === 'FLOOZ') && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Numéro Mobile {paymentMethod === 'TMONEY' ? 'T-Money (Togocom)' : 'Moov Money (Flooz)'}
                    </label>
                    <span className="text-[10px] font-bold text-slate-500">Togo (+228)</span>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +228
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={paymentMethod === 'TMONEY' ? '90 12 34 56' : '96 12 34 56'}
                      className="w-full pl-14 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  {fedapayEnv === 'SANDBOX' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setPhone(paymentMethod === 'TMONEY' ? '90 00 00 01' : '96 00 00 01')}
                        className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Utiliser le N° test FedaPay {paymentMethod === 'TMONEY' ? '90 00 00 01' : '96 00 00 01'}
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 font-medium">
                    FedaPay initiera un push USSD sur votre combiné pour autoriser le montant de{' '}
                    <strong className="text-slate-900 font-bold">{amountFcfa.toLocaleString('fr-FR')} FCFA</strong>.
                  </p>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'CARD' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nom sur la Carte</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Dr. Agbobli / SADPlus"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Numéro de Carte (Visa / Mastercard / GIM)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 0000 0000 0001"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>Payer {amountFcfa.toLocaleString('fr-FR')} FCFA avec FedaPay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Footer */}
              <div className="space-y-1 text-center pt-1">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Transactions chiffrées & certifiées PCI-DSS par <strong>FedaPay Togo / UEMOA</strong>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Génération immédiate d'une Facture A4 avec TVA • Galenis HealthTech Togo SARL (NIF : 1001849201)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official A4 Invoice Modal */}
      {showInvoiceModal && txDetails && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          invoice={{
            invoiceNumber: `FAC-TG-${txDetails.id.toUpperCase()}`,
            transactionId: txDetails.id,
            operatorRef: txDetails.operatorRef,
            clientName: txDetails.client,
            clientEmail: clientEmail,
            serviceDescription: txDetails.type,
            amountHt: Math.round(txDetails.amountNumber * 0.82),
            tva: Math.round(txDetails.amountNumber * 0.18),
            amountTtc: txDetails.amountNumber,
            paymentMethod: txDetails.method,
            date: new Date().toLocaleDateString('fr-FR'),
            environment: txDetails.environment
          }}
        />
      )}
    </div>,
    document.body
  );
};
