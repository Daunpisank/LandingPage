import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { APIProvider } from '@vis.gl/react-google-maps';
import {
  Award,
  Baby,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Gift,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  User,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  ASSETS,
  CLINIC_BRANCHES,
  CORE_METHODS,
  FAQ_ITEMS,
  HERO_GALLERY_PHOTOS,
  METHOD_PACKAGES,
  PATIENT_CATEGORIES,
  SERVICE_CATEGORIES,
  WHATSAPP_CONFIG,
  buildWhatsAppLink,
  type ClinicBranchConfig,
  type PatientCategory,
} from './data/clinicData';
import { PricelistModal, WhatsAppModal } from './components/WhatsAppModal';
import {
  BranchLocationsSection,
  GoogleReviewsSection,
  useClinicGooglePlaces,
} from './components/GoogleReviewsAndMap';
import { SunatNanoWordmark } from './components/SunatNanoWordmark';

declare const __GOOGLE_MAPS_API_KEY__: string;

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '') ||
  '';

const NAV_LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#metode', label: 'Metode' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#testimoni', label: 'Testimoni' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontak', label: 'Kontak' },
];

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return <LandingContent hasApiKey={false} quotaExceeded={quotaExceeded} />;
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="id" region="ID">
      <LandingContent hasApiKey={true} quotaExceeded={quotaExceeded} />
    </APIProvider>
  );
}

function LandingContent({
  hasApiKey,
  quotaExceeded,
}: {
  hasApiKey: boolean;
  quotaExceeded: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waContextTopic, setWaContextTopic] = useState<string | null>(null);
  const [pricelistModalOpen, setPricelistModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PatientCategory>('reguler');
  const [selectedBranchId, setSelectedBranchId] =
    useState<ClinicBranchConfig['id']>('bangkalan');
  const [mascotError, setMascotError] = useState(false);

  const branchesData = useClinicGooglePlaces(hasApiKey);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openConsultation = (topic?: string) => {
    setWaContextTopic(topic ?? null);
    setWaModalOpen(true);
    setMobileMenuOpen(false);
  };

  const activePackages = METHOD_PACKAGES.filter((pkg) => Boolean(pkg.prices[selectedCategory]));
  const activeCategoryMeta = PATIENT_CATEGORIES.find((cat) => cat.id === selectedCategory);

  const loadedRatings = CLINIC_BRANCHES.map((b) => branchesData[b.id]?.rating).filter(
    (r): r is number => typeof r === 'number'
  );
  const averageGoogleRating =
    loadedRatings.length > 0
      ? (loadedRatings.reduce((acc, val) => acc + val, 0) / loadedRatings.length).toFixed(1)
      : null;

  const renderMethodIcon = (iconKey: (typeof CORE_METHODS)[number]['iconKey']) => {
    switch (iconKey) {
      case 'sealer':
        return <Zap className="h-6 w-6 text-[#489BE2]" />;
      case 'painless':
        return <ShieldCheck className="h-6 w-6 text-[#D97706]" />;
      case 'stitchfree':
        return <CheckCircle2 className="h-6 w-6 text-[#EA580C]" />;
    }
  };

  const renderServiceIcon = (iconKey: (typeof SERVICE_CATEGORIES)[number]['iconKey']) => {
    switch (iconKey) {
      case 'baby':
        return <Baby className="h-6 w-6 text-[#489BE2]" />;
      case 'child':
        return <Smile className="h-6 w-6 text-[#D97706]" />;
      case 'teen':
        return <Users className="h-6 w-6 text-[#EA580C]" />;
      case 'adult':
        return <User className="h-6 w-6 text-[#489BE2]" />;
      case 'revision':
        return <Wrench className="h-6 w-6 text-[#D97706]" />;
      case 'home':
        return <Home className="h-6 w-6 text-[#EA580C]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F2942]">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 1. NAVBAR */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm'
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Brand Wordmark + Maskot */}
          <a
            href="#beranda"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7]"
          >
            {!mascotError ? (
              <img
                src={ASSETS.mascotLogo}
                alt="Maskot Sunat Nano"
                referrerPolicy="no-referrer"
                onError={() => setMascotError(true)}
                className="h-9 w-9 rounded-xl object-cover border border-[#E2E8F0]"
              />
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0284C7] text-white font-heading font-bold text-sm">
                SN
              </span>
            )}
            <SunatNanoWordmark className="text-xl sm:text-[22px]" />
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-7 text-base font-semibold text-[#334155]"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#489BE2] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-[#489BE2] after:transition-transform after:duration-200 hover:after:scale-x-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openConsultation()}
              className="typo-cta hidden sm:inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-5 py-2 text-[15px] text-white shadow-sm hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Konsultasi Gratis</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F2942] lg:hidden hover:bg-[#EBF5FD] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E2E8F0] bg-white px-4 py-4 shadow-lg lg:hidden">
            <nav aria-label="Navigasi Seluler" className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-semibold text-[#0F2942] hover:bg-[#EBF5FD] hover:text-[#489BE2] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => openConsultation()}
                className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#489BE2] px-5 py-3 text-base font-bold text-white hover:bg-[#3182CE] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konsultasi Gratis</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section
          id="beranda"
          className="relative overflow-hidden bg-[#F8FAFC] pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 right-0 h-[420px] w-[420px] rounded-full bg-[#489BE2]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 -left-24 h-[340px] w-[340px] rounded-full bg-[#F2B029]/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Hero Left Copy */}
              <div className="flex flex-col justify-center lg:col-span-6">
                <div className="flex flex-col items-start gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-1 text-xs sm:text-sm font-bold text-[#B45309]">
                    <Star className="h-3.5 w-3.5 fill-[#F2B029] text-[#F97316]" />
                    <span>Pilihan Terbaik Ayah &amp; Bunda · Klinik &amp; Home Visit</span>
                  </span>

                  <SunatNanoWordmark
                    className="mt-1 text-3xl sm:text-4xl"
                    showCircumcision
                    circumcisionClassName="text-base sm:text-lg"
                  />
                </div>

                <h1 className="typo-h1 mt-4">
                  Sunat Modern,{' '}
                  <span className="hero-marker-highlight">Anak Senang</span>,{' '}
                  <span className="text-[#EA580C]">Orang Tua Tenang.</span>
                </h1>

                <p className="typo-subheadline mt-5">
                  Layanan sunat ramah anak dengan{' '}
                  <strong className="font-bold text-[#0B4F6C]">bius tanpa jarum suntik</strong>,
                  metode presisi{' '}
                  <strong className="font-bold text-[#0B4F6C]">
                    Bipolar Teknosealer &amp; Nano Klamp
                  </strong>{' '}
                  tanpa jahitan, dan ditangani dokter berpengalaman.
                </p>

                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#EA580C] font-semibold">
                  Anak boleh membawa mainan favorit, tetap ceria selama tindakan, dan pulang membawa
                  hadiah Mobil Remote gratis.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openConsultation()}
                    className="typo-cta inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-[#489BE2] px-7 py-3.5 text-base text-white shadow-md hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Konsultasi Gratis</span>
                  </button>

                  <a
                    href="#layanan"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#FDBA74] bg-[#FFF7ED] px-7 py-3.5 text-base font-bold text-[#EA580C] hover:bg-[#FFEDD5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
                  >
                    Lihat Layanan Kami
                  </a>
                </div>

                {/* Unboxed Trust Line */}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[#E2E8F0] pt-6 text-sm font-semibold text-[#475569]">
                  <span className="inline-flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-[#489BE2]" />
                    Dokter Berpengalaman
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#F2B029]" />
                    Bius Tanpa Jarum
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Gift className="h-4 w-4 text-[#F97316]" />
                    Gratis Mobil Remote
                  </span>
                </div>
              </div>

              {/* Hero Right Visual: Galeri Foto Slider (Fade-to-White) + Maskot Kucing */}
              <div className="flex flex-col justify-center lg:col-span-6">
                <div className="hero-gallery-frame border-2 border-[#BFDBFE]">
                  <div className="hero-gallery-fade-left" aria-hidden="true" />
                  {HERO_GALLERY_PHOTOS.map((photo) => (
                    <img
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      referrerPolicy="no-referrer"
                      className="hero-gallery-slide"
                    />
                  ))}
                </div>

                {/* Strip Identitas Maskot Kucing & Hadiah */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    {!mascotError ? (
                      <img
                        src={ASSETS.mascotLogo}
                        alt="Maskot Kucing Sunat Nano Circumcision"
                        referrerPolicy="no-referrer"
                        onError={() => setMascotError(true)}
                        className="h-12 w-12 rounded-xl object-cover border border-[#FDE68A] shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF5FD] text-[#489BE2] shrink-0">
                        <Smile className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-heading text-sm font-bold text-[#0F2942]">
                        Maskot Sahabat Anak Sunat Nano
                      </p>
                      <p className="text-xs text-[#475569]">
                        Suasana klinik ceria, bebas cemas &amp; boleh bawa mainan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#EA580C]">
                    <Gift className="h-4 w-4 shrink-0 text-[#F97316]" />
                    <span>Gratis Mobil Remote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST BAR / STATISTIK */}
        <section aria-label="Statistik Kepercayaan Sunat Nano" className="border-y border-[#E2E8F0] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EBF5FD] text-[#489BE2]">
                  <Smile className="h-5 w-5" />
                </div>
                <div>
                  <p className="typo-stat-number text-2xl text-[#0B4F6C]">10.000+</p>
                  <p className="typo-stat-label">Pasien Anak &amp; Keluarga</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFFBEB] text-[#D97706]">
                  <MapPin className="h-5 w-5 text-[#F2B029]" />
                </div>
                <div>
                  <p className="typo-stat-number text-2xl text-[#0B4F6C]">5 Kota Besar</p>
                  <p className="typo-stat-label">Jangkauan Klinik &amp; Home Visit</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F97316]">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="typo-stat-number text-xl sm:text-2xl text-[#0B4F6C]">
                    Dokter Ahli
                  </p>
                  <p className="typo-stat-label">Berpengalaman &amp; Ramah Anak</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EBF5FD] text-[#489BE2]">
                  <Star className="h-5 w-5 fill-[#F2B029] text-[#F2B029]" />
                </div>
                <div>
                  <p className="typo-stat-number text-2xl text-[#0B4F6C]">
                    {averageGoogleRating ? `${averageGoogleRating} / 5.0` : '4.9 / 5.0'}
                  </p>
                  <p className="typo-stat-label">Rating Kepuasan Google Maps</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECTION METODE ("Metode Sunat Nano") */}
        <section id="metode" className="bg-[#F8FAFC] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-base font-bold text-[#489BE2]">Teknologi Sunat Modern</p>
              <h2 className="typo-h2 mt-2">
                Metode <span className="typo-accent-word">Sunat Nano</span>
              </h2>
              <p className="typo-subheadline mt-3">
                Tiga keunggulan utama yang membuat proses sunat berlangsung lebih tenang, minim
                nyeri, dan cepat pulih tanpa trauma untuk si kecil.
              </p>
            </div>

            {/* 3 Kartu Keunggulan Metode (Biru, Kuning, Orange) */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {CORE_METHODS.map((method, idx) => {
                const topAccent =
                  idx === 0
                    ? 'border-t-4 border-t-[#489BE2]'
                    : idx === 1
                    ? 'border-t-4 border-t-[#F2B029]'
                    : 'border-t-4 border-t-[#F97316]';
                const iconTile =
                  idx === 0
                    ? 'bg-[#EBF5FD] border-[#BFDBFE]'
                    : idx === 1
                    ? 'bg-[#FFFBEB] border-[#FDE68A]'
                    : 'bg-[#FFF7ED] border-[#FDBA74]';
                const subColor =
                  idx === 0
                    ? 'text-[#489BE2]'
                    : idx === 1
                    ? 'text-[#D97706]'
                    : 'text-[#EA580C]';

                return (
                  <motion.article
                    key={method.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`flex flex-col justify-between rounded-3xl border border-[#E2E8F0] ${topAccent} bg-white p-7 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5`}
                  >
                    <div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${iconTile}`}
                      >
                        {renderMethodIcon(method.iconKey)}
                      </div>
                      <p className={`mt-5 text-xs font-bold uppercase tracking-wider ${subColor}`}>
                        {method.subtitle}
                      </p>
                      <h3 className="typo-card-title mt-1.5">{method.title}</h3>
                      <p className="typo-card-desc mt-3">{method.description}</p>
                    </div>

                    <div className="mt-6 border-t border-[#E2E8F0] pt-4 text-sm font-bold text-[#0F2942]">
                      {method.highlight}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Transparansi Paket & Biaya Sunat Nano */}
            <div className="mt-16 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-[var(--shadow-card)]">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold text-[#EA580C]">Transparansi Biaya &amp; Paket</p>
                  <h3 className="headline-balance mt-1.5 font-heading text-2xl sm:text-3xl font-bold text-[#0F2942]">
                    Pilihan Paket &amp; Estimasi Biaya Resmi
                  </h3>
                  <p className="mt-2 text-base text-[#475569]">
                    Semua paket sudah termasuk{' '}
                    <strong className="text-[#0F2942]">bius tanpa jarum suntik</strong> dan{' '}
                    <strong className="text-[#0F2942]">hadiah Mobil Remote gratis</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPricelistModalOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2.5 text-sm font-bold text-[#B45309] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
                >
                  <span>Lihat Brosur Harga Resmi</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              {/* Segmented Category Selector */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div
                  role="tablist"
                  aria-label="Kategori Pasien Sunat Nano"
                  className="inline-flex flex-wrap gap-1.5 rounded-2xl bg-[#EBF5FD] p-1.5 border border-[#BFDBFE]"
                >
                  {PATIENT_CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`min-h-[40px] rounded-xl px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-[#489BE2] text-white shadow-sm'
                            : 'text-[#475569] hover:text-[#0F2942]'
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                {activeCategoryMeta && (
                  <p className="text-sm text-[#475569]">{activeCategoryMeta.description}</p>
                )}
              </div>

              {/* Package Cards */}
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {activePackages.map((pkg) => {
                  const price = pkg.prices[selectedCategory];
                  const isFavorite = Boolean(pkg.highlight);
                  return (
                    <div
                      key={pkg.id}
                      className={`flex flex-col justify-between rounded-2xl border p-6 transition-shadow duration-200 ${
                        isFavorite
                          ? 'border-[#489BE2] bg-[#EBF5FD]/60 shadow-sm'
                          : 'border-[#E2E8F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                          <span className="text-[#489BE2]">{pkg.shortTag}</span>
                          {pkg.highlight && (
                            <span className="rounded-full bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 text-[#EA580C]">
                              {pkg.highlight}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
                          <h4 className="font-heading text-xl font-bold text-[#0F2942]">
                            {pkg.name}
                          </h4>
                          <p className="font-heading text-2xl font-bold text-[#EA580C] tabular-nums">
                            {price}
                          </p>
                        </div>

                        <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                          {pkg.summary}
                        </p>

                        <ul className="mt-4 space-y-2 border-t border-[#E2E8F0] pt-4">
                          {pkg.features.map((feat) => (
                            <li
                              key={feat}
                              className="flex items-start gap-2.5 text-sm text-[#0F2942]"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F2B029]" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            openConsultation(
                              `${pkg.name} - ${activeCategoryMeta?.label ?? ''} (${price})`
                            )
                          }
                          className={`inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                            isFavorite
                              ? 'bg-[#489BE2] text-white hover:bg-[#3182CE]'
                              : 'bg-white border border-[#FDBA74] text-[#EA580C] hover:bg-[#FFF7ED]'
                          }`}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Konsultasi Paket Ini</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 5. SECTION LAYANAN ("Layanan Kami") */}
        <section id="layanan" className="border-y border-[#E2E8F0] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-base font-bold text-[#EA580C]">
                  Layanan Lengkap Sesuai Usia &amp; Kebutuhan
                </p>
                <h2 className="typo-h2 mt-2">
                  Layanan <span className="typo-accent-word">Kami</span>
                </h2>
                <p className="typo-subheadline mt-3">
                  Mulai dari sunat bayi, anak-anak, remaja, dewasa, hingga sunat perbaikan dan
                  layanan Home Visit ke rumah Anda.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openConsultation('Tanya Rekomendasi Layanan Sunat')}
                className="typo-cta inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-6 py-3 text-sm sm:text-base text-white hover:bg-[#3182CE] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_CATEGORIES.map((service, idx) => {
                const cycle = idx % 3;
                const iconBox =
                  cycle === 0
                    ? 'bg-[#EBF5FD] border-[#BFDBFE]'
                    : cycle === 1
                    ? 'bg-[#FFFBEB] border-[#FDE68A]'
                    : 'bg-[#FFF7ED] border-[#FDBA74]';
                const tagText =
                  cycle === 0
                    ? 'text-[#489BE2]'
                    : cycle === 1
                    ? 'text-[#D97706]'
                    : 'text-[#EA580C]';

                return (
                  <article
                    key={service.id}
                    className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[var(--shadow-card)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs ${iconBox}`}
                        >
                          {renderServiceIcon(service.iconKey)}
                        </div>
                        <span className={`text-xs font-bold ${tagText}`}>
                          {service.ageOrScope}
                        </span>
                      </div>

                      <h3 className="typo-card-title mt-5">{service.title}</h3>
                      <p className="typo-card-desc mt-2.5">{service.description}</p>
                    </div>

                    <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                      <button
                        type="button"
                        onClick={() => openConsultation(service.topicPrompt)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#489BE2] hover:text-[#EA580C] transition-colors"
                      >
                        <span>Konsultasi {service.title}</span>
                        <Sparkles className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. SECTION TESTIMONI ("Kata Ayah & Bunda") */}
        <GoogleReviewsSection
          branchesData={branchesData}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          onConsult={openConsultation}
        />

        {/* 7. SECTION FAQ (Native HTML <details> & <summary>) */}
        <section id="faq" className="border-y border-[#E2E8F0] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-base font-bold text-[#489BE2]">Informasi Untuk Orang Tua</p>
              <h2 className="typo-h2 mt-2">
                Tanya Jawab Seputar <span className="typo-accent-word">Sunat</span>
              </h2>
              <p className="typo-subheadline mx-auto mt-3">
                Jawaban jujur dan menenangkan sebelum Ayah dan Bunda menentukan jadwal terbaik
                untuk si kecil.
              </p>
            </div>

            <div className="mt-10 divide-y divide-[#E2E8F0] rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC]">
              {FAQ_ITEMS.map((faq, idx) => (
                <details
                  key={faq.id}
                  open={idx === 0}
                  className="faq-details px-6 py-1 transition-colors"
                >
                  <summary className="typo-faq-question flex min-h-[60px] w-full items-center justify-between gap-4 py-4 text-left hover:text-[#489BE2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#489BE2]">
                    <span>{faq.question}</span>
                    <ChevronDown className="faq-chevron h-5 w-5 shrink-0 text-[#489BE2] transition-transform duration-200" />
                  </summary>
                  <div className="typo-faq-answer pb-5 pr-4 sm:pr-8">{faq.answer}</div>
                </details>
              ))}
            </div>

            {/* FAQ Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="text-base font-semibold text-[#334155]">
                Masih ada pertanyaan khusus? Diskusikan langsung bersama dokter kami.
              </p>
              <button
                type="button"
                onClick={() => openConsultation('Tanya Dokter Seputar Persiapan Sunat')}
                className="typo-cta mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-7 py-3.5 text-base text-white shadow-sm hover:bg-[#3182CE] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>
          </div>
        </section>

        {/* LOKASI & JANGKAUAN CABANG */}
        <BranchLocationsSection
          hasApiKey={hasApiKey}
          branchesData={branchesData}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          onConsult={openConsultation}
        />
      </main>

      {/* 8. FOOTER */}
      <footer className="typo-footer border-t-4 border-t-[#F2B029] bg-[#0F2942] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand & Tagline */}
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                {!mascotError ? (
                  <img
                    src={ASSETS.mascotLogo}
                    alt="Sunat Nano Circumcision"
                    referrerPolicy="no-referrer"
                    onError={() => setMascotError(true)}
                    className="h-11 w-11 rounded-xl object-cover border border-[#E2E8F0]"
                  />
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#489BE2] font-heading font-semibold text-white">
                    SN
                  </span>
                )}
                <SunatNanoWordmark
                  className="text-xl sm:text-2xl"
                  showCircumcision
                  circumcisionClassName="text-xs sm:text-sm"
                />
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#E2E8F0]">
                Sunat Canggih &amp; Modern untuk Anak Indonesia. Metode tanpa jahitan, bius tanpa
                jarum suntik, dan pendampingan dokter yang ramah anak.
              </p>

              <button
                type="button"
                onClick={() => openConsultation()}
                className="typo-cta mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#489BE2] px-5 py-2.5 text-sm text-white hover:bg-[#3182CE] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="md:col-span-3">
              <h3 className="font-heading text-base font-semibold text-[#F2B029]">Navigasi</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#E2E8F0]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-[#F2B029] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak & Sosmed */}
            <div className="md:col-span-4">
              <h3 className="font-heading text-base font-semibold text-[#F2B029]">
                Hubungi Kami
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#E2E8F0]">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#489BE2]" />
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F2B029] transition-colors tabular-nums font-semibold"
                  >
                    WhatsApp Admin: {WHATSAPP_CONFIG.displayNumber}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#F2B029]" />
                  <span>halo@sunatnano.id</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F97316]" />
                  <span>Cabang Bangkalan · Surabaya · Sidoarjo (Klinik &amp; Home Visit)</span>
                </li>
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-semibold text-[#CBD5E1]">
                <a
                  href="https://www.instagram.com/sunat_nano_circumcision/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram @sunat_nano_circumcision
                </a>
                <span aria-hidden="true">·</span>
                <span>TikTok @nano.circumcision</span>
                <span aria-hidden="true">·</span>
                <span>FB @Sunat_nano_circumcision</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-[#CBD5E1]">
            <p>© {new Date().getFullYear()} Sunat Nano Circumcision. Seluruh hak cipta dilindungi.</p>
            <p className="inline-flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-[#F97316]" />
              <span>Sunat Anak Modern · Tenang untuk Orang Tua, Ceria untuk Si Kecil</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Pop-up Modal Konsultasi Gratis via WhatsApp */}
      <WhatsAppModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        contextTopic={waContextTopic}
      />

      {/* Modal Brosur Pricelist Resmi */}
      <PricelistModal
        isOpen={pricelistModalOpen}
        onClose={() => setPricelistModalOpen(false)}
        onConsult={(topic) => openConsultation(topic)}
      />
    </div>
  );
}
