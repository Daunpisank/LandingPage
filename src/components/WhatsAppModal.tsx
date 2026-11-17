import React, { useEffect } from 'react';
import { MessageCircle, X, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { ASSETS, buildWhatsAppLink } from '../data/clinicData';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTopic?: string | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  contextTopic,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const customMessage = contextTopic
    ? `Halo Admin, saya ingin konsultasi gratis tentang sunat anak (${contextTopic}).`
    : undefined;

  const whatsappUrl = buildWhatsAppLink(customMessage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2942]/50 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DCE8F5] text-[#0F2942]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela konsultasi"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#475569] hover:bg-[#EFF6FF] hover:text-[#0F2942] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0D9488]">
          <MessageCircle className="h-6 w-6" />
        </div>

        <h3
          id="whatsapp-modal-title"
          className="font-display text-2xl font-bold tracking-tight text-[#0F2942]"
        >
          Konsultasi Gratis via WhatsApp
        </h3>

        <p className="mt-3 text-base leading-relaxed text-[#475569]">
          Tanyakan apa pun seputar sunat anak. Tim kami siap membantu—tanpa biaya, tanpa tekanan.
        </p>

        {contextTopic && (
          <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3 text-sm text-[#0369A1]">
            <span className="font-semibold">Topik pilihan:</span> {contextTopic}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2 text-xs text-[#475569]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#0D9488]" />
          <span>Privasi keluarga terjaga · Respon ramah oleh tim klinik</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0D9488] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0F766E] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
          >
            <span>Lanjut ke WhatsApp</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#DCE8F5] bg-white px-6 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#F8FBFF] hover:text-[#0F2942] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};

interface PricelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsult: (topic?: string) => void;
}

export const PricelistModal: React.FC<PricelistModalProps> = ({
  isOpen,
  onClose,
  onConsult,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2942]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricelist-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#DCE8F5]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#DCE8F5] px-6 py-4">
          <h3 id="pricelist-modal-title" className="font-display text-lg font-bold text-[#0F2942]">
            Daftar Harga Resmi Sunat Nano Circumcision
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar harga"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#475569] hover:bg-[#EFF6FF] hover:text-[#0F2942] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 bg-[#F8FBFF]">
          <img
            src={ASSETS.pricelistPoster}
            alt="Daftar harga resmi Sunat Nano Circumcision"
            referrerPolicy="no-referrer"
            className="mx-auto w-full max-w-lg rounded-2xl border border-[#DCE8F5] object-contain"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE8F5] bg-white px-6 py-4">
          <p className="text-sm text-[#475569]">
            Termasuk bius tanpa jarum suntik & hadiah Mobil Remote.
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConsult('Tanya Paket & Jadwal Sunat Nano');
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#EA580C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0"
          >
            Konsultasi Gratis
          </button>
        </div>
      </div>
    </div>
  );
};
