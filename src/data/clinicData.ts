export const WHATSAPP_CONFIG = {
  // Ganti nomor di bawah ini dengan nomor WhatsApp admin Klinik Sunat Nano yang aktif (format internasional tanpa '+' atau spasi)
  phoneNumber: '628XXXXXXXXXX',
  defaultMessage:
    'Halo Admin, saya ingin konsultasi gratis tentang sunat anak.',
};

export function buildWhatsAppLink(customMessage?: string): string {
  const message = customMessage ?? WHATSAPP_CONFIG.defaultMessage;
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
}

export const ASSETS = {
  mascotLogo: '/assets/aistudio/WhatsApp_Image_2026-07-15_at_14.33.22_7ea65c16.jpeg',
  pricelistPoster: '/assets/aistudio/Pricelist_lengkap_2c1365d3.jpg',
};

export type PatientCategory = 'reguler' | 'gemuk' | 'abk' | 'dewasa';

export interface CategoryOption {
  id: PatientCategory;
  label: string;
  description: string;
}

export const PATIENT_CATEGORIES: CategoryOption[] = [
  {
    id: 'reguler',
    label: 'Anak Reguler',
    description: 'Usia balita hingga remaja dengan kondisi standar yang nyaman dan ceria.',
  },
  {
    id: 'gemuk',
    label: 'Sunat Gemuk',
    description: 'Penanganan khusus anak bertubuh gemuk agar hasil tetap rapi tanpa perlu diet ketat dulu.',
  },
  {
    id: 'abk',
    label: 'Sunat ABK',
    description: 'Pendekatan ekstra sabar dan lembut untuk Anak Berkebutuhan Khusus.',
  },
  {
    id: 'dewasa',
    label: 'Sunat Dewasa',
    description: 'Layanan privat, higienis, dan cepat pulih untuk remaja akhir hingga dewasa.',
  },
];

export interface MethodPackage {
  id: string;
  name: string;
  shortTag: string;
  highlight?: string;
  summary: string;
  features: string[];
  prices: Partial<Record<PatientCategory, string>>;
}

export const METHOD_PACKAGES: MethodPackage[] = [
  {
    id: 'bipolar-vip',
    name: 'Glans Pro Bipolar Pen Sealer VIP',
    shortTag: 'Tanpa Jahitan · Minim Rasa Tidak Nyaman',
    highlight: 'Pilihan Favorit Orang Tua',
    summary:
      'Teknologi Bipolar Pen Sealer presisi tinggi dengan pemulihan paling cepat, tanpa jahitan, tanpa perban, dan pendampingan penuh.',
    features: [
      'Bius tanpa jarum suntik (nyaman untuk anak)',
      'Teknologi Bipolar Pen Sealer minim perdarahan',
      'Tanpa jahitan dan tanpa lepas alat kontrol',
      'Bonus langsung Mobil Remote & paket perawatan lengkap',
    ],
    prices: {
      reguler: 'Rp 2.700.000',
      gemuk: 'Rp 2.900.000',
      abk: 'Rp 3.000.000',
      dewasa: 'Rp 3.500.000',
    },
  },
  {
    id: 'bipolar-reg',
    name: 'Glans Pro Bipolar Pen Sealer REG',
    shortTag: 'Tanpa Jahitan · Praktis & Rapi',
    summary:
      'Menggunakan alat Bipolar Pen Sealer modern yang menyegel jaringan secara lembut agar anak lebih cepat kembali bermain.',
    features: [
      'Bius tanpa jarum suntik yang ramah anak',
      'Proses tindakan singkat 10–20 menit',
      'Tanpa jahitan, hasil estetik dan bersih',
      'Bonus langsung Mobil Remote untuk si kecil',
    ],
    prices: {
      reguler: 'Rp 2.400.000',
      gemuk: 'Rp 2.600.000',
      abk: 'Rp 2.700.000',
      dewasa: 'Rp 3.200.000',
    },
  },
  {
    id: 'klamp-vip',
    name: 'Nano Klamp VIP',
    shortTag: 'Klamp Ringan · Anak Bebas Aktivitas',
    summary:
      'Metode klamp generasi terbaru dengan pelindung ringan sehingga anak dapat langsung mandi dan memakai celana dengan nyaman.',
    features: [
      'Bius tanpa jarum suntik bebas rasa cemas',
      'Pelindung klamp ringan, aman saat bergerak',
      'Pendampingan kontrol dan perawatan lengkap',
      'Bonus langsung Mobil Remote pilihan anak',
    ],
    prices: {
      reguler: 'Rp 1.900.000',
      gemuk: 'Rp 2.100.000',
      abk: 'Rp 2.200.000',
    },
  },
  {
    id: 'klamp-reg',
    name: 'Nano Klamp REG',
    shortTag: 'Ekonomis · Aman & Higienis',
    summary:
      'Pilihan metode modern yang tetap mengutamakan kenyamanan anak tanpa jahitan dan dengan biaya yang terjangkau.',
    features: [
      'Bius tanpa jarum suntik',
      'Tanpa jahitan konvensional',
      'Panduan perawatan luka rumah yang mudah diikuti',
      'Bonus langsung Mobil Remote untuk anak',
    ],
    prices: {
      reguler: 'Rp 1.600.000',
      gemuk: 'Rp 1.800.000',
      abk: 'Rp 1.900.000',
    },
  },
];

export interface WhyChooseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  detail: string;
  tone: 'sky' | 'warm' | 'teal' | 'indigo';
  featured?: boolean;
}

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: 'minim-nyeri',
    number: '01',
    title: 'Bius Tanpa Jarum Suntik & Bipolar Sealer',
    description:
      'Kami memahami ketakutan terbesar anak adalah jarum suntik. Sunat Nano menggunakan teknik bius tanpa jarum suntik bertekanan lembut, dipadukan dengan metode Glans Pro Bipolar Pen Sealer atau Nano Klamp.',
    detail: 'Minim rasa tidak nyaman · Pendarahan sangat minimal',
    tone: 'sky',
    featured: true,
  },
  {
    id: 'ramah-anak',
    number: '02',
    title: 'Anak Nyaman, Boleh Bawa Mainan & Nonton',
    description:
      'Suasana klinik dirancang ceria dan hangat, bukan seperti ruang tindakan medis yang kaku. Anak boleh membawa mainan kesayangan, menonton film favorit, bermain konsol, dan pulang membawa hadiah Mobil Remote gratis.',
    detail: 'Ruang bermain ramah anak · Free Mobil Remote',
    tone: 'warm',
  },
  {
    id: 'tanpa-jahitan',
    number: '03',
    title: 'Tanpa Jahitan & Tanpa Perban Rumit',
    description:
      'Dengan teknologi Bipolar Pen Sealer maupun Nano Klamp, anak tidak perlu melalui proses cabut benang atau ganti perban yang merepotkan. Pemulihan lebih cepat dan anak bisa beraktivitas ringan lebih awal.',
    detail: 'Proses singkat 10–20 menit · Perawatan praktis',
    tone: 'teal',
  },
  {
    id: 'pendampingan',
    number: '04',
    title: 'Pendampingan Penuh dari Awal hingga Pulih',
    description:
      'Mulai dari konsultasi gratis sebelum hari H, tim dokter yang sabar mengajak ngobrol si kecil, hingga pemantauan pasca tindakan via WhatsApp sampai Ayah dan Bunda merasa tenang.',
    detail: 'Melayani Anak Reguler, Gemuk, ABK & Home Visit',
    tone: 'indigo',
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Konsultasi Gratis & Pilih Jadwal',
    duration: 'Sebelum Kunjungan',
    description:
      'Ayah dan Bunda berdiskusi santai dengan tim kami via WhatsApp mengenai usia anak, kondisi khusus (seperti anak gemuk atau ABK), serta metode yang paling sesuai.',
  },
  {
    step: '02',
    title: 'Pemeriksaan & Persiapan Ceria',
    duration: '10 Menit',
    description:
      'Anak disambut ramah, diajak memilih tontonan atau mainan kesayangan. Dokter menjelaskan setiap langkah kepada Anda dan anak sebelum memberikan bius tanpa jarum suntik.',
  },
  {
    step: '03',
    title: 'Tindakan Cepat & Tenang',
    duration: '10–20 Menit',
    description:
      'Tindakan dilakukan oleh dokter berpengalaman dengan Glans Pro Bipolar Pen Sealer atau Nano Klamp tanpa jahitan. Anak tetap santai didampingi orang tua.',
  },
  {
    step: '04',
    title: 'Pulang Bawa Mobil Remote & Kontrol Ringan',
    duration: 'Pasca Tindakan',
    description:
      'Anak mendapat hadiah Mobil Remote gratis, panduan perawatan rumah yang sederhana, serta akses konsultasi lanjutan dengan dokter hingga pulih tuntas.',
  },
];

export interface ClinicBranchConfig {
  id: 'bangkalan' | 'surabaya' | 'sidoarjo';
  cityLabel: string;
  searchQuery: string;
  areaDescription: string;
  mapsSearchUrl: string;
}

export const CLINIC_BRANCHES: ClinicBranchConfig[] = [
  {
    id: 'bangkalan',
    cityLabel: 'Bangkalan',
    searchQuery: 'Sunat Nano Circumcision Bangkalan',
    areaDescription:
      'Melayani kunjungan klinik di wilayah Bangkalan & Madura serta layanan Home Visit.',
    mapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Sunat+Nano+Circumcision+Bangkalan',
  },
  {
    id: 'surabaya',
    cityLabel: 'Surabaya',
    searchQuery: 'Sunat Nano Circumcision Surabaya',
    areaDescription:
      'Melayani area Surabaya Barat, Timur, Selatan, Utara, Pusat, dan Home Visit.',
    mapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Sunat+Nano+Circumcision+Surabaya',
  },
  {
    id: 'sidoarjo',
    cityLabel: 'Sidoarjo',
    searchQuery: 'Sunat Nano Circumcision Sidoarjo',
    areaDescription:
      'Melayani area Sidoarjo Kota, Waru, Taman, Gedangan, Candi, dan sekitarnya.',
    mapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Sunat+Nano+Circumcision+Sidoarjo',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-durasi',
    question: 'Berapa lama proses sunat berlangsung?',
    answer:
      'Tindakan inti berjalan sangat singkat, sekitar 10 hingga 20 menit saja. Secara keseluruhan, Ayah dan Bunda cukup meluangkan waktu sekitar 45 menit termasuk sesi perkenalan agar anak rileks, pemeriksaan ringan, serta penjelasan perawatan di rumah.',
  },
  {
    id: 'faq-nyeri',
    question: 'Apakah anak akan merasakan sakit saat dibius atau saat tindakan?',
    answer:
      'Kami menggunakan teknologi bius tanpa jarum suntik sehingga anak tidak merasakan tusukan jarum yang menakutkan. Saat bius bekerja, area tindakan menjadi kebas dan anak hanya merasakan sentuhan ringan, sambil tetap ditemani orang tua atau menonton tayangan kesukaannya.',
  },
  {
    id: 'faq-metode',
    question: 'Metode apa yang digunakan dan mana yang paling aman untuk anak?',
    answer:
      'Seluruh metode kami aman, higienis, dan menggunakan alat steril sekali pakai. Tersedia dua pilihan utama: Glans Pro Bipolar Pen Sealer (tanpa jahitan, tanpa alat menempel, pemulihan sangat cepat) dan Nano Klamp (pelindung ringan tanpa jahitan). Dokter akan merekomendasikan metode terbaik sesuai usia dan kondisi anak saat konsultasi.',
  },
  {
    id: 'faq-perawatan',
    question: 'Bagaimana perawatan luka di rumah agar anak cepat pulih?',
    answer:
      'Perawatannya sangat praktis karena tanpa jahitan konvensional dan tanpa perban tebal. Orang tua akan dibekali panduan tertulis yang jelas serta obat pereda nyeri ringan. Tim kami juga tetap mendampingi melalui WhatsApp jika Ayah atau Bunda ingin berkirim foto perkembangan pemulihan.',
  },
  {
    id: 'faq-khusus',
    question: 'Apakah tersedia layanan untuk anak gemuk, anak ABK, atau home visit ke rumah?',
    answer:
      'Ya, tersedia. Kami memiliki penanganan khusus untuk Sunat Gemuk (tanpa harus menunda atau memaksa anak diet dulu) serta pendekatan khusus yang sangat sabar untuk Anak Berkebutuhan Khusus (ABK). Tersedia pula layanan Home Visit bagi keluarga yang menginginkan privasi dan kenyamanan penuh di rumah.',
  },
  {
    id: 'faq-hadiah',
    question: 'Apakah anak boleh membawa mainan dan benar-benar mendapat Mobil Remote gratis?',
    answer:
      'Tentu saja! Anak sangat dianjurkan membawa mainan, boneka, atau bantal kesayangan agar merasa seperti di rumah sendiri. Setiap anak yang selesai menjalani tindakan di Sunat Nano berhak memilih dan membawa pulang hadiah Mobil Remote gratis sebagai apresiasi keberaniannya.',
  },
];
