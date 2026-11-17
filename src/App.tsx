import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { APIProvider } from '@vis.gl/react-google-maps';
import {
  Award,
  Check,
  ChevronDown,
  ExternalLink,
  Gift,
  HeartHandshake,
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
  X,
} from 'lucide-react';
import {
  ASSETS,
  CLINIC_BRANCHES,
  FAQ_ITEMS,
  METHOD_PACKAGES,
  PATIENT_CATEGORIES,
  PROCESS_STEPS,
  WHY_CHOOSE_ITEMS,
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
  { href: '#tentang', label: 'Tentang' },
  { href: '#metode', label: 'Metode' },
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
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      language="id"
      region="ID"
    >
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
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);
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

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#0F2942]">
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
      {/* 1. NAVBAR (Sticky, transparent at top, solid on scroll, 3-zone contract) */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#DCE8F5] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#beranda"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7]"
          >
            {!mascotError ? (
              <img
                src={ASSETS.mascotLogo}
                alt="Logo Sunat Nano"
                referrerPolicy="no-referrer"
                onError={() => setMascotError(true)}
                className="h-9 w-9 rounded-xl object-cover border border-[#DCE8F5]"
              />
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0284C7] text-white font-display font-bold text-sm">
                SN
              </span>
            )}
            <SunatNanoWordmark className="text-xl sm:text-[22px]" />
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-7 text-base font-medium text-[#334155]"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#0284C7] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-[#0284C7] after:transition-transform after:duration-200 hover:after:scale-x-100"
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
              className="typo-cta hidden sm:inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl bg-[#C2410C] px-5 py-2 text-[15px] text-white shadow-sm hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Konsultasi Gratis</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#DCE8F5] bg-white text-[#0F2942] lg:hidden hover:bg-[#EFF6FF] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#DCE8F5] bg-white px-4 py-4 shadow-lg lg:hidden">
            <nav aria-label="Navigasi Seluler" className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-semibold text-[#0F2942] hover:bg-[#EFF6FF] hover:text-[#0284C7] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => openConsultation()}
                className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-5 py-3 text-base font-bold text-white hover:bg-[#C2410C] transition-colors"
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
          className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
        >
          {/* Soft ambient backdrop accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-[#E0F2FE]/70 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 -left-24 h-[340px] w-[340px] rounded-full bg-[#FEF3C7]/60 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Hero Left Copy */}
              <div className="flex flex-col justify-center lg:col-span-6">
                <div className="flex flex-col items-start gap-2">
                  <SunatNanoWordmark
                    className="text-3xl sm:text-4xl"
                    showCircumcision
                    circumcisionClassName="text-base sm:text-lg"
                  />
                  <p className="text-sm sm:text-base font-semibold text-[#0B4F6C]">
                    Klinik &amp; Home Visit Ramah Anak
                  </p>
                </div>

                <h1 className="typo-h1 mt-4">
                  Sunat anak, Tanpa Drama,{' '}
                  <span className="hero-marker-highlight">Cepat Sembuh</span>, Tetap Seru.
                </h1>

                <p className="typo-subheadline mt-5">
                  Ayah dan Bunda tak perlu lagi khawatir si kecil takut jarum atau rewel. Kami
                  menghadirkan <strong className="font-bold text-[#0B4F6C]">bius tanpa jarum suntik</strong>,
                  metode modern <strong className="font-bold text-[#0B4F6C]">Bipolar Pen Sealer &amp; Nano Klamp</strong> tanpa
                  jahitan, serta pendampingan penuh yang menenangkan.
                </p>

                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#0F766E] font-semibold">
                  Anak boleh bawa mainan kesayangan—dokter kami akan memastikan ia merasa aman, dan
                  pulang membawa hadiah Mobil Remote gratis.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openConsultation()}
                    className="typo-cta inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-[#C2410C] px-7 py-3.5 text-base text-white shadow-md hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Konsultasi Gratis</span>
                  </button>

                  <a
                    href="#metode"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#BAE6FD] bg-white px-7 py-3.5 text-base font-bold text-[#0369A1] hover:bg-[#EFF6FF] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
                  >
                    Lihat Metode
                  </a>
                </div>

                {/* Unboxed Trust Highlights */}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[#DCE8F5] pt-6 text-sm font-semibold text-[#475569]">
                  <span className="inline-flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-[#0284C7]" />
                    Dokter Berpengalaman
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
                    Bius Tanpa Jarum Suntik
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Smile className="h-4 w-4 text-[#F59E0B]" />
                    1.200+ Orang Tua Puas
                  </span>
                </div>
              </div>

              {/* Hero Right Visual: Galeri Foto Slider (Fade-to-White + iPhone Crossfade) */}
              <div className="flex flex-col justify-center lg:col-span-6">
                <div className="hero-gallery-frame">
                  <div className="hero-gallery-fade-left" aria-hidden="true" />
                  {/* GANTI URL GAMBAR 1 */}
                  <img
                    src="/assets/aistudio/34_4c33e57f.jpg"
                    alt="Keluarga dan anak tersenyum ceria bersama tim medis Sunat Nano Circumcision"
                    referrerPolicy="no-referrer"
                    className="hero-gallery-slide"
                  />
                  {/* GANTI URL GAMBAR 2 */}
                  <img
                    src="/assets/aistudio/25_e5982afa.jpg"
                    alt="Anak ceria memegang sertifikat dan hadiah mobil remote di Sunat Nano Circumcision"
                    referrerPolicy="no-referrer"
                    className="hero-gallery-slide"
                  />
                  {/* GANTI URL GAMBAR 3 */}
                  <img
                    src="/assets/aistudio/28_779a9ad9.jpg"
                    alt="Momen bahagia keluarga setelah layanan sunat bayi di Sunat Nano Circumcision"
                    referrerPolicy="no-referrer"
                    className="hero-gallery-slide"
                  />
                </div>

                {/* Strip Maskot & Hadiah di bawah galeri */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#DCE8F5] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    {!mascotError ? (
                      <img
                        src={ASSETS.mascotLogo}
                        alt="Maskot Sunat Nano Circumcision"
                        referrerPolicy="no-referrer"
                        onError={() => setMascotError(true)}
                        className="h-12 w-12 rounded-xl object-cover border border-[#DCE8F5] shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7] shrink-0">
                        <Smile className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-display text-sm font-bold text-[#0F2942]">
                        Maskot Tim Kucing Nano
                      </p>
                      <p className="text-xs text-[#475569]">
                        Suasana ceria, boleh nonton &amp; main PS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#EA580C]">
                    <Gift className="h-4 w-4 shrink-0" />
                    <span>Gratis Mobil Remote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST BAR / SOCIAL PROOF RINGKAS */}
        <section aria-label="Bukti Kepercayaan Orang Tua" className="border-y border-[#DCE8F5] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#0284C7]">
                  <Smile className="h-5 w-5" />
                </div>
                <div>
                  <p className="typo-stat-number text-2xl text-[#0B4F6C]">
                    1.200+
                  </p>
                  <p className="typo-stat-label">Pasien Anak Terlayani</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFFBEB] text-[#D97706]">
                  <Star className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
                </div>
                <div>
                  <p className="typo-stat-number text-2xl text-[#0B4F6C]">
                    {averageGoogleRating ? `${averageGoogleRating} / 5.0` : 'Ulasan Asli'}
                  </p>
                  <p className="typo-stat-label">Rating Terverifikasi Google Maps</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0D9488]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="typo-stat-number text-xl sm:text-2xl text-[#0B4F6C]">
                    Tanpa Jahitan
                  </p>
                  <p className="typo-stat-label">Bius Tanpa Jarum Suntik</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#0369A1]">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="typo-stat-number text-xl sm:text-2xl text-[#0B4F6C]">
                    Resmi Kemenkes
                  </p>
                  <p className="typo-stat-label">Dokter Berpengalaman</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECTION "MENGAPA ORANG TUA MEMILIH KAMI" */}
        <section id="tentang" className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-base font-semibold text-[#0284C7]">Keunggulan Sunat Nano</p>
              <h2 className="typo-h2 mt-2">
                Mengapa Orang Tua Hebat <span className="typo-accent-word">Memilih</span> Kami
              </h2>
              <p className="typo-subheadline mt-4">
                Kami merancang setiap detail pengalaman sunat agar anak merasa tenang seperti
                bermain, dan Ayah Bunda merasa yakin sepenuhnya pada standar medis kami.
              </p>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="mt-12 grid gap-6 md:grid-cols-12">
              {WHY_CHOOSE_ITEMS.map((item, idx) => {
                const isWide = idx === 0 || idx === 3;
                const surfaceClass =
                  item.tone === 'sky'
                    ? 'bg-[#EFF6FF] border-[#BAE6FD]'
                    : item.tone === 'warm'
                    ? 'bg-[#FFFBEB] border-[#FDE68A]'
                    : item.tone === 'teal'
                    ? 'bg-[#F0FDFA] border-[#99F6E4]'
                    : 'bg-white border-[#DCE8F5]';

                const iconElement =
                  item.tone === 'sky' ? (
                    <Stethoscope className="h-6 w-6 text-[#0284C7]" />
                  ) : item.tone === 'warm' ? (
                    <Gift className="h-6 w-6 text-[#C2410C]" />
                  ) : item.tone === 'teal' ? (
                    <ShieldCheck className="h-6 w-6 text-[#0D9488]" />
                  ) : (
                    <HeartHandshake className="h-6 w-6 text-[#0369A1]" />
                  );

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className={`rounded-3xl border p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-0.5 ${surfaceClass} ${
                      isWide ? 'md:col-span-7' : 'md:col-span-5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#DCE8F5]">
                        {iconElement}
                      </div>
                      <span className="typo-stat-number text-base text-[#475569]">
                        {item.number}.
                      </span>
                    </div>

                    <h3 className="typo-card-title mt-6">
                      {item.title}
                    </h3>

                    <p className="typo-card-desc mt-3">
                      {item.description}
                    </p>

                    <p className="mt-5 text-base font-semibold text-[#0369A1]">{item.detail}</p>
                  </motion.article>
                );
              })}
            </div>

            {/* Section CTA */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-[#DCE8F5] bg-white p-6 sm:p-8 shadow-[var(--shadow-card)]">
              <div>
                <h3 className="typo-card-title">
                  Ingin tahu metode mana yang paling pas untuk usia si kecil?
                </h3>
                <p className="typo-card-desc mt-1">
                  Ceritakan kondisi anak kepada tim dokter kami—gratis dan tanpa komitmen apa pun.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openConsultation('Tanya Metode Terbaik untuk Anak')}
                className="typo-cta inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#C2410C] px-6 py-3 text-base text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. SECTION "METODE KAMI" (Edukasi 4 Langkah + Pilihan Paket & Biaya Resmi) */}
        <section id="metode" className="border-y border-[#DCE8F5] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* Sub-section 5A: 4 Langkah Proses */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-sm font-bold text-[#0D9488]">Alur Tindakan yang Menenangkan</p>
                <h2 className="headline-balance mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F2942]">
                  4 Langkah Mudah Sunat Tanpa Cemas
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base font-semibold text-[#0369A1]">
                “Dokter menjelaskan setiap langkah kepada Anda dan anak—sehingga si kecil merasa
                dihargai, aman, dan tetap tenang.”
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col justify-between rounded-3xl border border-[#DCE8F5] bg-[#F8FBFF] p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-3xl font-extrabold text-[#0284C7] tabular-nums">
                        {item.step}
                      </span>
                      <span className="text-xs font-bold text-[#0D9488]">{item.duration}</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-[#0F2942]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-section 5B: Pilihan Metode & Pricelist Resmi */}
            <div className="mt-16 pt-14 border-t border-[#DCE8F5]">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-sm font-bold text-[#0284C7]">Transparansi Biaya &amp; Metode</p>
                  <h3 className="headline-balance mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2942]">
                    Pilihan Metode &amp; Paket Sunat Nano
                  </h3>
                  <p className="mt-2 text-base text-[#475569]">
                    Semua paket sudah termasuk <strong className="text-[#0F2942]">bius tanpa jarum suntik</strong> dan{' '}
                    <strong className="text-[#0F2942]">hadiah Mobil Remote gratis</strong> untuk anak.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPricelistModalOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#DCE8F5] bg-[#F8FBFF] px-4 py-2.5 text-sm font-bold text-[#0369A1] hover:bg-[#EFF6FF] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
                >
                  <span>Lihat Brosur Harga Resmi</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              {/* Interactive Category Segmented Control */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div
                  role="tablist"
                  aria-label="Kategori Pasien Sunat Nano"
                  className="inline-flex flex-wrap gap-1.5 rounded-2xl bg-[#EFF6FF] p-1.5 border border-[#DCE8F5]"
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
                            ? 'bg-white text-[#0284C7] shadow-sm'
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

              {/* Package Cards Grid */}
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {activePackages.map((pkg) => {
                  const price = pkg.prices[selectedCategory];
                  const isFavorite = Boolean(pkg.highlight);
                  return (
                    <div
                      key={pkg.id}
                      className={`flex flex-col justify-between rounded-3xl border p-6 sm:p-8 transition-shadow duration-200 ${
                        isFavorite
                          ? 'border-[#0284C7] bg-[#F8FBFF] shadow-[var(--shadow-card)]'
                          : 'border-[#DCE8F5] bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                          <span className="text-[#0D9488]">{pkg.shortTag}</span>
                          {pkg.highlight && (
                            <span className="text-[#EA580C]">{pkg.highlight}</span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
                          <h4 className="font-display text-xl font-extrabold text-[#0F2942]">
                            {pkg.name}
                          </h4>
                          <p className="font-display text-2xl font-extrabold text-[#0284C7] tabular-nums">
                            {price}
                          </p>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                          {pkg.summary}
                        </p>

                        <ul className="mt-5 space-y-2.5 border-t border-[#DCE8F5] pt-5">
                          {pkg.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2.5 text-sm text-[#0F2942]">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0D9488]" />
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
                              ? 'bg-[#EA580C] text-white hover:bg-[#C2410C]'
                              : 'bg-[#EFF6FF] text-[#0369A1] hover:bg-[#E0F2FE]'
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

        {/* 6. SECTION "TESTIMONI ORANG TUA" (Live Google Maps Reviews) */}
        <GoogleReviewsSection
          branchesData={branchesData}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          onConsult={openConsultation}
        />

        {/* 7. SECTION "FAQ" (Accordion) */}
        <section id="faq" className="border-y border-[#DCE8F5] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-base font-semibold text-[#0284C7]">Pertanyaan Umum Orang Tua</p>
              <h2 className="typo-h2 mt-2">
                Hal yang Sering Ditanyakan Ayah &amp; Bunda
              </h2>
              <p className="typo-subheadline mx-auto mt-3">
                Jawaban jujur dan menenangkan sebelum Anda menentukan jadwal terbaik untuk si kecil.
              </p>
            </div>

            <div className="mt-10 divide-y divide-[#DCE8F5] rounded-3xl border border-[#DCE8F5] bg-[#F8FBFF]">
              {FAQ_ITEMS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="px-6 py-1">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`panel-${faq.id}`}
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      className="typo-faq-question flex min-h-[60px] w-full items-center justify-between gap-4 py-4 text-left hover:text-[#0284C7] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#0284C7] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={`panel-${faq.id}`}
                        className="typo-faq-answer pb-5 pr-4 sm:pr-8"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="text-base font-semibold text-[#334155]">
                Masih ragu? Konsultasi gratis dulu dengan tim dokter kami.
              </p>
              <button
                type="button"
                onClick={() => openConsultation('Masih Ragu / Ingin Tanya Dokter')}
                className="typo-cta mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#C2410C] px-7 py-3.5 text-base text-white shadow-sm hover:bg-[#9A3412] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8. SECTION "LOKASI DAN JANGKAUAN" (Interactive Google Map: Bangkalan, Surabaya, Sidoarjo) */}
        <BranchLocationsSection
          hasApiKey={hasApiKey}
          branchesData={branchesData}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          onConsult={openConsultation}
        />
      </main>

      {/* 9. FOOTER */}
      <footer className="typo-footer border-t border-[#DCE8F5] bg-[#0F2942] text-white">
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
                    className="h-11 w-11 rounded-xl object-cover border border-[#DCE8F5]"
                  />
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0284C7] font-heading font-semibold text-white">
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
                className="typo-cta mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#C2410C] px-5 py-2.5 text-sm text-white hover:bg-[#9A3412] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Konsultasi Gratis</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="md:col-span-3">
              <h3 className="font-heading text-base font-semibold text-[#BAE6FD]">
                Navigasi
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#E2E8F0]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-[#38BDF8] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak & Sosmed */}
            <div className="md:col-span-4">
              <h3 className="font-heading text-base font-semibold text-[#BAE6FD]">
                Hubungi Kami
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#E2E8F0]">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#38BDF8]" />
                  <span>WhatsApp Admin: 08XX-XXXX-XXXX</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#38BDF8]" />
                  <span>halo@sunatnano.id</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
                  <span>Cabang Bangkalan · Surabaya · Sidoarjo (Klinik &amp; Home Visit)</span>
                </li>
              </ul>

              <div className="mt-5 flex items-center gap-4 text-sm font-semibold text-[#CBD5E1]">
                <a
                  href="https://www.instagram.com/sunat_nano_circumcision/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram @sunat_nano_circumcision
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-[#CBD5E1]">
            <p>© {new Date().getFullYear()} Sunat Nano Circumcision. Seluruh hak cipta dilindungi.</p>
            <p>Sunat Anak Modern · Tenang untuk Orang Tua, Ceria untuk Si Kecil</p>
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
