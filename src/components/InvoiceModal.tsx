import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  CreditCard, 
  FileText,
  Smartphone,
  Info
} from 'lucide-react';

export interface InvoiceData {
  invoiceNumber: string;
  transactionId: string;
  operatorRef: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  serviceDescription?: string;
  amountHt?: number;
  tva?: number;
  amountTtc?: number;
  environment?: string;
  paymentMethod: 'T-Money' | 'Flooz' | 'Carte Bancaire' | string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  taxRate?: number;
  totalAmount?: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const resolvedItems = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [
        {
          description: invoice.serviceDescription || 'Souscription / Service Numérique Galenis Togo',
          quantity: 1,
          unitPrice: invoice.amountHt || (invoice.totalAmount ? Math.round(invoice.totalAmount * 0.82) : 5000),
          total: invoice.amountHt || (invoice.totalAmount ? Math.round(invoice.totalAmount * 0.82) : 5000)
        }
      ];

  const subtotal = invoice.amountHt ?? resolvedItems.reduce((acc, item) => acc + item.total, 0);
  const tax = invoice.tva ?? (invoice.taxRate ? Math.round(subtotal * invoice.taxRate) : Math.round(subtotal * 0.18));
  const total = invoice.amountTtc ?? (invoice.totalAmount ?? (subtotal + tax));

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      
      <div className="bg-slate-100 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Facture & Reçu Fiscal FedaPay (Format A4)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Document probant certifié pour la comptabilité et la déduction fiscale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la Facture A4 (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col items-center gap-4 bg-slate-200/70">
          
          {/* Accounting & Legal Notice (Hidden when printing) */}
          <div className="w-full max-w-[720px] bg-white rounded-2xl p-4 border border-slate-300 shadow-xs print:hidden space-y-2 text-xs">
            <div className="flex items-center justify-between font-extrabold text-slate-900">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Notice Fiscale & Justificatif Comptable Déductible</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Usage Déductible OTR
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ce document constitue une <strong>facture acquittée officielle</strong> émise par la société privée <strong>Galenis HealthTech Togo SARL</strong> (NIF : 1001849201). Elle est soumise à la TVA togolaise (18%) et recevable par les services comptables et l'Office Togolais des Recettes (OTR).
            </p>
          </div>

          {/* THE PRINTABLE A4 INVOICE SHEET */}
          <div 
            ref={invoiceRef}
            id="galenis-invoice-sheet"
            className="w-full max-w-[720px] bg-white text-slate-900 shadow-xl border border-slate-300 rounded-2xl p-8 sm:p-12 flex flex-col justify-between space-y-8 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none"
            style={{ minHeight: '920px' }}
          >
            {/* Header: Private Entity Legal Identity */}
            <div className="border-b-2 border-slate-900 pb-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-xs">
                      G
                    </div>
                    <span className="font-black text-lg tracking-tight text-slate-950">
                      GALENIS HEALTHTECH TOGO SARL
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Société Privée de Technologies de Santé • Capital : 5 000 000 FCFA
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                    Boulevard du 13 Janvier, Quartier Déckon, BP 4892, Lomé – TOGO<br />
                    <strong>RCCM :</strong> TG-LFW-01-2024-B12-00492 | <strong>NIF :</strong> 1001849201<br />
                    <strong>Tél :</strong> +228 90 00 12 34 / +228 22 21 00 90 | <strong>Email :</strong> facturation@galenis.tg
                  </p>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                    * Partenaires institutionnels & sectoriels : ONPT & DPML Togo
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-right sm:self-start">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Facture Acquittée</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-500 mt-2">
                    N° {invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    Date : {invoice.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Client & Gateway References Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {/* Client Info */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Facturé à (Bénéficiaire) :
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  {invoice.clientCompany || invoice.clientName}
                </h4>
                {invoice.clientName && invoice.clientCompany && (
                  <p className="text-xs text-slate-600 font-medium">
                    Attn : {invoice.clientName}
                  </p>
                )}
                {invoice.clientEmail && (
                  <p className="text-xs text-slate-600 font-mono">
                    {invoice.clientEmail}
                  </p>
                )}
                {invoice.clientPhone && (
                  <p className="text-xs text-slate-600 font-mono">
                    {invoice.clientPhone}
                  </p>
                )}
              </div>

              {/* FedaPay Transaction Settlement Info */}
              <div className="border-t sm:border-t-0 sm:border-l sm:border-slate-200 sm:pl-6 pt-3 sm:pt-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                  Règlement Sécurisé FedaPay Togo :
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Mode :</span>
                    <strong className="text-slate-900">{invoice.paymentMethod}</strong>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-slate-600">
                    <span>Réf. FedaPay :</span>
                    <strong className="text-emerald-800">{invoice.transactionId}</strong>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-slate-600">
                    <span>Réf. Opérateur :</span>
                    <strong className="text-slate-900">{invoice.operatorRef}</strong>
                  </div>
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Statut Switch :</span>
                    <span className="text-emerald-700 font-bold">Approuvé & Encaissé</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-2">Désignation de la Prestation</th>
                    <th className="py-3 px-2 text-center">Qté</th>
                    <th className="py-3 px-2 text-right">Prix Unitaire</th>
                    <th className="py-3 px-2 text-right">Montant Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {resolvedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-2">
                        <strong className="text-slate-900 font-bold block">{item.description}</strong>
                        <span className="text-[11px] text-slate-500">Service certifié plateforme Galenis Togo</span>
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono">{item.quantity}</td>
                      <td className="py-3.5 px-2 text-right font-mono">{item.unitPrice.toLocaleString()} FCFA</td>
                      <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-900">
                        {item.total.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="flex justify-end pt-4">
                <div className="w-full max-w-xs space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Sous-total HT :</span>
                    <span className="font-mono font-medium">{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA (Exonération / Prestation Tech) :</span>
                    <span className="font-mono font-medium">{tax.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-black text-slate-950">
                    <span>Total Net Payé :</span>
                    <span className="font-mono text-emerald-700">{total.toLocaleString()} FCFA</span>
                  </div>
                  <p className="text-[10px] text-slate-500 text-right italic">
                    Devise : Franc CFA (XOF) - Toutes taxes comprises
                  </p>
                </div>
              </div>
            </div>

            {/* Official Digital Stamp & Signature */}
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Security & Verification note */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Document Électronique Certifié FedaPay</span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  Cette facture tient lieu de quittance définitive. L'authenticité du paiement peut être vérifiée sur les registres Galenis et auprès du switch FedaPay Togo.
                </p>
              </div>

              {/* Official Stamp */}
              <div className="p-3 rounded-2xl border-2 border-dashed border-emerald-600 bg-emerald-50/60 text-center w-52 shrink-0">
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-800">
                  RÉPUBLIQUE DU TOGO
                </div>
                <div className="font-black text-xs text-emerald-950 mt-0.5">
                  GALENIS HEALTHTECH SARL
                </div>
                <div className="my-1 py-0.5 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-sm">
                  ★ ACQUITTÉ FEDAPAY ★
                </div>
                <div className="text-[9px] font-mono font-bold text-emerald-900">
                  RÉF : {invoice.transactionId.slice(0, 18)}
                </div>
                <div className="text-[8px] text-slate-500 mt-0.5">
                  Direction Financière & Comptable
                </div>
              </div>
            </div>

            {/* Footer Mentions */}
            <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 text-center space-y-0.5">
              <p>
                Galenis HealthTech Togo SARL • RCCM TG-LFW-01-2024-B12-00492 • NIF 1001849201
              </p>
              <p>
                Plateforme numérique privée de santé. Les partenariats institutionnels avec l'Ordre National des Pharmaciens (ONPT) et la DPML constituent des collaborations techniques et déontologiques.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
