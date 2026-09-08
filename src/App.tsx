import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bot,
  CalendarClock,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Droplets,
  FileDown,
  Fish,
  Gauge,
  Headphones,
  History,
  Home,
  Landmark,
  Leaf,
  LifeBuoy,
  LockKeyhole,
  LogOut,
  MessageCircleMore,
  Radio,
  RefreshCw,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Thermometer,
  UserRound,
  Users,
  Waves,
  Wifi,
  X,
  Zap,
} from "lucide-react"

type Screen = "home" | "monitoring" | "pond" | "bot" | "alerts" | "profile" | "billing" | "history" | "help"
type SubscriptionPayload = {
  subscription: {
    planName: string
    pondCount: number
    monthlyAmount: number
    status: "active" | "overdue"
    nextDue: string
    installedUnits: string
  }
  invoice: {
    invoiceNumber: string
    periodStart: string
    periodEnd: string
    amount: number
    status: "pending" | "paid"
    paymentMethod?: string | null
  } | null
}
type ChatMessage = { role: "assistant" | "user"; content: string }

const defaultSubscription: SubscriptionPayload = {
  subscription: {
    planName: "HaaS Pro 3 Kolam",
    pondCount: 3,
    monthlyAmount: 1_050_000,
    status: "active",
    nextDue: "2026-09-25T00:00:00+07:00",
    installedUnits: "3 Unit Multi-Sensor + 1 IoT Gateway 4G",
  },
  invoice: {
    invoiceNumber: "INV-AG-2026-0925",
    periodStart: "2026-09-25T00:00:00+07:00",
    periodEnd: "2026-10-25T00:00:00+07:00",
    amount: 1_050_000,
    status: "pending",
  },
}

const ponds = [
  { name: "Kolam A", species: "Benih Lele", status: "normal", do: "6,8", ph: "7,2", temp: "28,1", ammonia: "0,01", score: 96 },
  { name: "Kolam B", species: "Benih Lele", status: "warning", do: "4,9", ph: "7,0", temp: "28,5", ammonia: "0,02", score: 72 },
  { name: "Kolam C", species: "Benih Nila", status: "normal", do: "6,4", ph: "7,4", temp: "27,9", ammonia: "0,01", score: 92 },
]

const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
const date = (value: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(value))

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand--compact" : ""}`}>
      <img src="/aquaguard-logo.png" alt="Logo resmi AquaGuard AI" />
    </div>
  )
}

function Splash() {
  return (
    <main className="splash">
      <div className="splash__rings" />
      <Brand />
      <p>Deteksi lebih awal, selamatkan lebih banyak benih.</p>
      <div className="splash__loader"><span /></div>
    </main>
  )
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("budi@minajaya.id")
  const [password, setPassword] = useState("aquaguard")
  return (
    <main className="login-shell">
      <section className="login-story">
        <div className="story-mark"><Waves size={22} /> Teknologi yang membumi untuk pembudidaya</div>
        <h1>Kolam sehat dimulai dari keputusan yang lebih cepat.</h1>
        <p>Pantau kualitas air, baca risiko lebih awal, dan dapatkan saran praktis dalam satu aplikasi.</p>
        <div className="story-stats">
          <span><strong>24/7</strong> pemantauan</span>
          <span><strong>2–4 jam</strong> prediksi dini</span>
          <span><strong>0 CapEx</strong> sewa perangkat</span>
        </div>
      </section>
      <section className="login-card">
        <Brand />
        <div className="login-copy">
          <span className="eyebrow">Selamat datang kembali</span>
          <h2>Masuk ke hatchery Anda</h2>
          <p>Gunakan akun demo yang sudah terisi untuk melihat seluruh fitur.</p>
        </div>
        <label>Email atau nomor HP<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Kata sandi<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <div className="login-options"><label className="check-row"><input type="checkbox" defaultChecked /> Ingat saya</label><button className="text-button">Lupa kata sandi?</button></div>
        <button className="button button--primary button--wide" onClick={onLogin} disabled={!email || !password}>Masuk ke AquaGuard</button>
        <p className="login-help"><ShieldCheck size={16} /> Data hatchery dilindungi dan hanya digunakan untuk layanan Anda.</p>
      </section>
    </main>
  )
}

const navItems = [
  { screen: "home" as Screen, label: "Home", icon: Home },
  { screen: "monitoring" as Screen, label: "Monitoring", icon: Activity },
  { screen: "bot" as Screen, label: "AquaBot", icon: MessageCircleMore, featured: true },
  { screen: "alerts" as Screen, label: "Peringatan", icon: Bell },
  { screen: "profile" as Screen, label: "Profil", icon: UserRound },
]

function Navigation({ screen, navigate }: { screen: Screen; navigate: (screen: Screen) => void }) {
  return (
    <>
      <aside className="sidebar">
        <Brand compact />
        <nav>{navItems.map(({ screen: target, label, icon: Icon }) => <button key={target} className={screen === target ? "active" : ""} onClick={() => navigate(target)}><Icon size={20} /><span>{label}</span>{label === "Peringatan" && <b>2</b>}</button>)}</nav>
        <div className="sidebar__signal"><span><Wifi size={15} /> Gateway online</span><small>Sinkron 08 Sep 2026, 14:32 WIB</small></div>
      </aside>
      <nav className="bottom-nav">{navItems.map(({ screen: target, label, icon: Icon, featured }) => <button key={target} className={`${screen === target ? "active" : ""} ${featured ? "featured" : ""}`} onClick={() => navigate(target)}><span><Icon size={21} />{label === "Peringatan" && <b>2</b>}</span><small>{label}</small></button>)}</nav>
    </>
  )
}

function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: () => void; action?: React.ReactNode }) {
  return <header className="page-header"><div>{back && <button className="icon-button" onClick={back}><ArrowLeft size={20} /></button>}<div><span className="eyebrow">Mina Jaya · Sukabumi</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>{action}</header>
}

function StatusPill({ status }: { status: string }) {
  const normal = status === "normal" || status === "active" || status === "paid"
  const label = status === "paid" ? "Lunas" : status === "active" ? "Aktif" : status === "normal" ? "Normal" : status === "overdue" ? "Menunggak" : "Perlu perhatian"
  return <span className={`status-pill ${normal ? "status-pill--normal" : "status-pill--warning"}`}>{normal ? <Check size={14} /> : <AlertTriangle size={14} />}{label}</span>
}

function HomeScreen({ navigate, subscription }: { navigate: (screen: Screen) => void; subscription: SubscriptionPayload }) {
  return <div className="page"><PageHeader title="Selamat siang, Pak Budi" subtitle="Berikut kondisi hatchery Anda hari ini." action={<button className="header-alert" onClick={() => navigate("alerts")}><Bell size={20} /><span>2</span></button>} />
    <section className="warning-banner"><div className="warning-banner__icon"><AlertTriangle /></div><div><span className="eyebrow">Prediksi dini · Kolam B</span><h2>DO berpotensi turun dalam 2 jam</h2><p>Nyalakan aerator tambahan dan cek kembali dalam 30 menit.</p></div><button onClick={() => navigate("pond")}>Lihat tindakan <ChevronRight size={18} /></button></section>
    <section className="section-heading"><div><span className="eyebrow">Ringkasan kolam</span><h2>Semua yang penting, sekilas</h2></div><button className="text-button" onClick={() => navigate("monitoring")}>Lihat semua</button></section>
    <div className="pond-grid">{ponds.map((pond) => <button className={`pond-card pond-card--${pond.status}`} key={pond.name} onClick={() => navigate("pond")}><div className="pond-card__top"><div><span>{pond.species}</span><h3>{pond.name}</h3></div><StatusPill status={pond.status} /></div><div className="health-score"><span style={{ "--score": `${pond.score}%` } as React.CSSProperties}>{pond.score}</span><div><strong>Skor kesehatan</strong><small>{pond.status === "normal" ? "Kondisi stabil" : "DO sedang menurun"}</small></div></div><div className="metric-row"><span><Droplets />DO <strong>{pond.do}</strong> mg/L</span><span><Thermometer />Suhu <strong>{pond.temp}°</strong></span></div></button>)}</div>
    <section className="home-columns"><div className="panel quick-panel"><div className="section-heading"><div><span className="eyebrow">Aksi cepat</span><h2>Apa yang ingin dilakukan?</h2></div></div><div className="quick-grid"><button onClick={() => navigate("bot")}><span><Bot /></span><strong>Tanya AquaBot</strong><small>Saran berbasis sensor</small></button><button onClick={() => navigate("history")}><span><History /></span><strong>Lihat riwayat</strong><small>Tren 7 hari</small></button><button onClick={() => navigate("billing")}><span><CreditCard /></span><strong>Kelola sewa</strong><small>Tagihan perangkat</small></button><button onClick={() => navigate("help")}><span><LifeBuoy /></span><strong>Pusat bantuan</strong><small>Panduan & teknisi</small></button></div></div>
      <div className="panel rental-summary"><div className="rental-summary__head"><span><Radio size={20} /> Sewa perangkat HaaS</span><StatusPill status={subscription.subscription.status} /></div><h3>{subscription.subscription.planName}</h3><p>{subscription.subscription.installedUnits}</p><div className="rental-due"><div><small>Jatuh tempo berikutnya</small><strong>{date(subscription.subscription.nextDue)}</strong></div><div><small>Total bulanan</small><strong>{rupiah(subscription.subscription.monthlyAmount)}</strong></div></div><button className="button button--soft button--wide" onClick={() => navigate("billing")}>Kelola tagihan <ChevronRight size={17} /></button></div></section>
  </div>
}

function MonitoringScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const [filter, setFilter] = useState("semua")
  const filtered = ponds.filter((pond) => filter === "semua" || pond.status === filter)
  return <div className="page"><PageHeader title="Monitoring Kolam" subtitle="Data sensor diperbarui setiap 5 menit." action={<span className="live-chip"><span /> LIVE</span>} /><div className="filter-row">{[["semua", "Semua (3)"], ["normal", "Normal (2)"], ["warning", "Perhatian (1)"]].map(([value, label]) => <button className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div><div className="monitor-list">{filtered.map((pond) => <button key={pond.name} onClick={() => navigate("pond")} className="monitor-card"><div className="monitor-card__identity"><span className={`pond-symbol pond-symbol--${pond.status}`}><Fish /></span><div><small>{pond.species}</small><h3>{pond.name}</h3><p><Wifi size={13} /> Sensor terhubung · 1 menit lalu</p></div></div><StatusPill status={pond.status} /><div className="monitor-metrics"><span><small>DO</small><strong>{pond.do}</strong><em>mg/L</em></span><span><small>pH</small><strong>{pond.ph}</strong><em>pH</em></span><span><small>Suhu</small><strong>{pond.temp}</strong><em>°C</em></span><span><small>Amonia</small><strong>{pond.ammonia}</strong><em>mg/L</em></span></div><ChevronRight /></button>)}</div></div>
}

function TrendChart() {
  return <div className="chart"><div className="chart__labels"><span>7,0</span><span>6,0</span><span>5,0</span><span>4,0</span></div><svg viewBox="0 0 560 190" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#18a7a0" stopOpacity=".28" /><stop offset="1" stopColor="#18a7a0" stopOpacity="0" /></linearGradient></defs><path className="gridline" d="M0 25H560M0 75H560M0 125H560M0 175H560" /><path className="area" d="M0 45 C70 40 80 52 140 55 S220 72 280 82 S360 92 420 120 S500 138 560 154 L560 190 L0 190Z" /><path className="line" d="M0 45 C70 40 80 52 140 55 S220 72 280 82 S360 92 420 120 S500 138 560 154" /><circle cx="560" cy="154" r="6" /></svg><div className="chart__times"><span>06.00</span><span>09.00</span><span>12.00</span><span>15.00</span><span>18.00</span></div></div>
}

function PondScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const [metric, setMetric] = useState("DO")
  return <div className="page"><PageHeader title="Kolam B" subtitle="Benih Lele · 20 m² · 18.500 ekor" back={() => navigate("monitoring")} action={<StatusPill status="warning" />} /><section className="pond-hero"><div><span className="eyebrow">Status saat ini</span><h2>Perlu perhatian, belum kritis</h2><p>Kadar oksigen terlarut menurun konsisten selama 2 jam terakhir.</p></div><div className="big-reading"><small>DO saat ini</small><strong>4,9</strong><span>mg/L</span><em>↓ 0,7 dari 2 jam lalu</em></div></section><div className="parameter-grid"><article className="parameter parameter--warning"><Droplets /><small>Oksigen / DO</small><strong>4,9 <em>mg/L</em></strong><span>Di bawah target</span></article><article className="parameter"><Gauge /><small>Keasaman / pH</small><strong>7,0 <em>pH</em></strong><span>Normal</span></article><article className="parameter"><Thermometer /><small>Suhu air</small><strong>28,5 <em>°C</em></strong><span>Normal</span></article><article className="parameter"><Leaf /><small>Amonia</small><strong>0,02 <em>mg/L</em></strong><span>Normal</span></article></div><section className="panel trend-panel"><div className="section-heading"><div><span className="eyebrow">Tren 24 jam</span><h2>Perubahan parameter</h2></div><div className="metric-tabs">{["DO", "pH", "Suhu", "Amonia"].map((item) => <button className={metric === item ? "active" : ""} key={item} onClick={() => setMetric(item)}>{item}</button>)}</div></div><TrendChart /><div className="prediction-note"><Sparkles size={18} /><div><strong>Prediksi AquaGuard</strong><p>DO dapat mencapai 4,2 mg/L sekitar pukul 17.00 bila aerasi tidak ditambah.</p></div></div></section><section className="action-plan"><div><span className="action-plan__number">1</span><p><strong>Nyalakan aerator tambahan selama 60 menit.</strong><small>Prioritas utama · lakukan sekarang</small></p></div><div><span className="action-plan__number">2</span><p><strong>Kurangi porsi pakan sebesar 40%.</strong><small>Mengurangi akumulasi bahan organik</small></p></div><div><span className="action-plan__number">3</span><p><strong>Pantau DO kembali dalam 30 menit.</strong><small>AquaGuard mengirim pengingat otomatis</small></p></div><button className="button button--primary" onClick={() => navigate("bot")}><Bot size={18} /> Tanya dosis ke AquaBot</button><button className="button button--outline"><Check size={18} /> Saya sudah melakukan</button></section></div>
}

function BotScreen({ locked }: { locked: boolean }) {
  const [tab, setTab] = useState<"ai" | "expert">("ai")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Halo Pak Budi! Sensor Kolam B menunjukkan DO menurun menjadi 4,9 mg/L. Ada gejala ikan atau tindakan budidaya yang ingin didiskusikan?" }])
  const quickPrompts = ["Berapa dosis probiotik untuk Kolam B?", "Kenapa benih lele menggantung di permukaan?", "Berapa lama aerator harus dinyalakan?"]
  const send = async (prompt = input) => {
    if (!prompt.trim() || loading || locked) return
    setMessages((current) => [...current, { role: "user", content: prompt }])
    setInput("")
    setLoading(true)
    try {
      const response = await fetch("/api/aquabot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt, userId: "AG-USER-4412" }) })
      const payload = await response.json()
      setMessages((current) => [...current, { role: "assistant", content: payload.answer || payload.error }])
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "Koneksi AquaBot terganggu. Silakan coba lagi atau beralih ke konsultasi ahli." }])
    } finally { setLoading(false) }
  }
  return <div className="page page--chat"><PageHeader title="AquaBot Assistant" subtitle="Konsultasi cerdas budidaya & jaringan ahli" /><div className="segment"><button className={tab === "ai" ? "active" : ""} onClick={() => setTab("ai")}><Bot size={18} /> Tanya AquaBot</button><button className={tab === "expert" ? "active" : ""} onClick={() => setTab("expert")}><Users size={18} /> Tanya Ahli / PPL</button></div>{tab === "ai" ? <section className="chat-panel"><div className="sensor-context"><span><Radio size={17} /> Terhubung ke Sensor Kolam B</span><div><b>DO 4,9</b><b>pH 7,0</b><b>28,5°C</b></div></div><div className="messages">{messages.map((message, index) => <div className={`message message--${message.role}`} key={`${message.role}-${index}`}>{message.role === "assistant" && <span className="bot-avatar"><Waves size={17} /></span>}<p>{message.content}</p></div>)}{loading && <div className="message message--assistant"><span className="bot-avatar"><Waves size={17} /></span><p className="typing"><i /><i /><i /></p></div>}</div>{messages.length < 3 && <div className="quick-prompts">{quickPrompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>}<div className="chat-input"><button aria-label="Unggah foto"><Camera size={20} /></button><input disabled={locked} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder={locked ? "AquaBot terkunci karena sewa menunggak" : "Ketik pertanyaan budidaya..."} /><button className="send-button" disabled={!input.trim() || loading || locked} onClick={() => send()}><Send size={19} /></button></div><small className="ai-note">AquaBot memberi saran pendamping, bukan pengganti diagnosis dokter hewan ikan.</small></section> : <ExpertPanel />}</div>
}

function ExpertPanel() {
  const experts = [{ name: "Dr. Ir. Haryo Sutrisno", role: "Pakar Kesehatan Ikan Air Tawar", tags: ["Penyakit", "Kualitas air"], initials: "HS" }, { name: "Siti Rahma, S.Pi", role: "Penyuluh Perikanan Lapangan", tags: ["Lele", "Manajemen pakan"], initials: "SR" }]
  return <section className="expert-panel"><div className="expert-benefit"><ShieldCheck /><div><strong>Termasuk dalam HaaS Pro</strong><p>Konsultasi teks dengan ahli tersedia gratis untuk pelanggan aktif.</p></div></div>{experts.map((expert) => <article className="expert-card" key={expert.name}><span className="expert-avatar">{expert.initials}<i /></span><div><span className="online">Online sekarang</span><h3>{expert.name}</h3><p>{expert.role}</p><div>{expert.tags.map((tag) => <small key={tag}>{tag}</small>)}</div><span className="rating">★ 4,9 · Terverifikasi</span></div><button className="button button--soft"><MessageCircleMore size={17} /> Mulai konsultasi</button></article>)}<button className="button button--outline button--wide"><CalendarClock size={18} /> Jadwalkan konsultasi</button></section>
}

function AlertsScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const [read, setRead] = useState(false)
  return <div className="page"><PageHeader title="Peringatan & Notifikasi" subtitle="Prioritas tindakan untuk kolam dan layanan Anda." action={<button className="text-button" onClick={() => setRead(true)}>Tandai dibaca</button>} /><div className="filter-row"><button className="active">Semua</button><button>Kondisi air</button><button>Tagihan sewa</button></div><section className="notification-list"><button className={read ? "read" : ""} onClick={() => navigate("pond")}><span className="notification-icon notification-icon--urgent"><AlertTriangle /></span><div><span><b>Air · Mendesak</b><time>5 menit lalu</time></span><h3>DO Kolam B diprediksi turun dalam 2 jam.</h3><p>Nyalakan aerator tambahan untuk mencegah stres pada benih.</p></div><ChevronRight /></button><button className={read ? "read" : ""} onClick={() => navigate("billing")}><span className="notification-icon notification-icon--billing"><CreditCard /></span><div><span><b>Tagihan HaaS</b><time>1 jam lalu</time></span><h3>Tagihan sewa jatuh tempo pada 25 September 2026.</h3><p>Bayar lebih awal agar pemantauan sensor tidak terputus.</p></div><ChevronRight /></button><button className="read" onClick={() => navigate("monitoring")}><span className="notification-icon notification-icon--done"><Check /></span><div><span><b>Air · Selesai</b><time>3 jam lalu</time></span><h3>DO Kolam A kembali normal (6,8 mg/L).</h3><p>Tidak ada tindakan lanjutan yang diperlukan.</p></div><ChevronRight /></button></section></div>
}

function ProfileScreen({ navigate, subscription, onLogout, updateSubscription }: { navigate: (screen: Screen) => void; subscription: SubscriptionPayload; onLogout: () => void; updateSubscription: (action: string) => void }) {
  return <div className="page"><PageHeader title="Profil Pengguna" subtitle="Kelola hatchery, perangkat, dan akun Anda." /><section className="profile-card"><span className="profile-avatar">BS</span><div><h2>Budi Santoso</h2><p>Pemilik Hatchery Mina Jaya</p><small>ID Pelanggan · AG-USER-4412</small></div><button className="icon-button"><Settings2 size={19} /></button></section><section className="panel subscription-hub"><div className="subscription-hub__head"><div><span className="eyebrow">Hub sewa perangkat</span><h2>{subscription.subscription.planName}</h2></div><StatusPill status={subscription.subscription.status} /></div><div className="subscription-spec"><span><Radio /> <small>Unit terpasang</small><strong>{subscription.subscription.installedUnits}</strong></span><span><CreditCard /> <small>Biaya sewa</small><strong>{rupiah(subscription.subscription.monthlyAmount)} / bulan</strong></span><span><CalendarClock /> <small>Jatuh tempo</small><strong>{date(subscription.subscription.nextDue)}</strong></span></div><button className="button button--primary button--wide" onClick={() => navigate("billing")}>Kelola tagihan & bayar sewa <ChevronRight size={18} /></button><button className="simulation-link" onClick={() => updateSubscription("simulate-overdue")}><AlertTriangle size={15} /> Simulasikan kondisi menunggak</button></section><section className="settings-list"><h2>Hatchery saya</h2><button><span><Fish /></span><div><strong>Mina Jaya</strong><small>3 Kolam · Lele & Nila</small></div><ChevronRight /></button><h2>Pengaturan & bantuan</h2><button><span><Bell /></span><div><strong>Notifikasi WhatsApp & Push</strong><small>Aktif untuk peringatan kritis</small></div><ChevronRight /></button><button onClick={() => navigate("help")}><span><CircleHelp /></span><div><strong>Pusat bantuan</strong><small>Panduan, video, dan dukungan teknis</small></div><ChevronRight /></button><button className="logout" onClick={onLogout}><span><LogOut /></span><div><strong>Keluar dari akun</strong><small>Akhiri sesi pada perangkat ini</small></div></button></section></div>
}

function BillingScreen({ navigate, data, updateSubscription, loading }: { navigate: (screen: Screen) => void; data: SubscriptionPayload; updateSubscription: (action: string, method?: string) => void; loading: boolean }) {
  const [method, setMethod] = useState("QRIS")
  const invoice = data.invoice
  const paid = invoice?.status === "paid"
  return <div className="page"><PageHeader title="Tagihan Sewa Perangkat" subtitle="Langganan Hardware-as-a-Service AquaGuard AI" back={() => navigate("profile")} action={invoice && <StatusPill status={invoice.status} />} /><div className="billing-layout"><section className="invoice-card"><div className="invoice-card__brand"><Brand compact /><span>{invoice?.invoiceNumber}</span></div><div className="invoice-period"><small>Periode layanan</small><strong>{invoice ? `${date(invoice.periodStart)} – ${date(invoice.periodEnd)}` : "-"}</strong></div><div className="invoice-items"><span><Check /> 3x Sensor Multi-Parameter (DO, pH, Suhu, Amonia)</span><span><Check /> Dashboard real-time & prediksi peringatan dini</span><span><Check /> AquaBot AI & jaringan ahli PPL</span><span><Check /> Perawatan dan penggantian probe gratis</span></div><div className="invoice-total"><span>Total tagihan</span><strong>{rupiah(invoice?.amount || data.subscription.monthlyAmount)}</strong></div><div className="warranty-note"><ShieldCheck /><p><strong>Aktivasi otomatis</strong><br />Masa aktif sensor langsung diperpanjang setelah pembayaran terverifikasi.</p></div></section><section className="payment-panel"><span className="eyebrow">Metode pembayaran</span><h2>Pilih cara yang paling mudah</h2><div className="payment-methods"><button className={method === "QRIS" ? "active" : ""} onClick={() => setMethod("QRIS")}><span><Smartphone /></span><div><strong>QRIS Dinamis</strong><small>Semua mobile banking & e-wallet</small></div><em>Rekomendasi</em></button><button className={method === "Virtual Account" ? "active" : ""} onClick={() => setMethod("Virtual Account")}><span><Landmark /></span><div><strong>Virtual Account</strong><small>BRI, BCA, Mandiri, BNI</small></div></button><button className={method === "E-Wallet" ? "active" : ""} onClick={() => setMethod("E-Wallet")}><span><CreditCard /></span><div><strong>E-Wallet</strong><small>GoPay, OVO, DANA, ShopeePay</small></div></button></div>{method === "QRIS" && <div className="qris-box"><div className="fake-qr">{Array.from({ length: 81 }).map((_, index) => <i key={index} className={(index * 7 + index % 4) % 3 === 0 ? "dark" : ""} />)}<span>AG</span></div><div><strong>Pindai QRIS AquaGuard</strong><p>Berlaku untuk pembayaran simulasi selama 15 menit.</p><small><Clock3 size={14} /> 14:38 tersisa</small></div></div>}{paid ? <div className="paid-box"><Check /><div><strong>Pembayaran sudah berhasil</strong><p>Layanan sensor aktif hingga {date(data.subscription.nextDue)}.</p></div></div> : <button className="button button--primary button--wide" disabled={loading} onClick={() => updateSubscription("pay", method)}>{loading ? <RefreshCw className="spin" size={18} /> : <LockKeyhole size={18} />} {loading ? "Memverifikasi..." : `Bayar ${rupiah(invoice?.amount || 0)}`}</button>}<p className="secure-note"><ShieldCheck size={15} /> Ini adalah alur pembayaran demo. Tidak ada dana nyata yang ditagihkan.</p></section></div></div>
}

function HistoryScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return <div className="page"><PageHeader title="Riwayat Monitoring" subtitle="Telusuri perubahan kondisi dan tindakan kolam." back={() => navigate("home")} action={<button className="button button--outline"><FileDown size={17} /> Unduh laporan</button>} /><div className="filter-row"><button className="active">Kolam B</button><button>DO</button><button>7 Hari</button></div><section className="panel trend-panel"><div className="section-heading"><div><span className="eyebrow">Tren parameter</span><h2>Oksigen terlarut · 7 hari</h2></div></div><TrendChart /></section><section className="timeline"><article><time>08 Sep 2026<span>14:30</span></time><i className="warning" /><div><StatusPill status="warning" /><h3>DO 4,9 mg/L</h3><p>Prediksi penurunan aktif. Aerasi tambahan disarankan.</p></div></article><article><time>08 Sep 2026<span>13:30</span></time><i /><div><StatusPill status="normal" /><h3>DO 5,2 mg/L</h3><p>Kondisi masih dalam batas aman.</p></div></article><article><time>08 Sep 2026<span>12:30</span></time><i /><div><StatusPill status="normal" /><h3>DO 5,6 mg/L</h3><p>Kondisi stabil, tidak ada tindakan.</p></div></article></section></div>
}

function HelpScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return <div className="page"><PageHeader title="Pusat Bantuan" subtitle="Panduan praktis untuk perangkat dan aplikasi." back={() => navigate("profile")} /><div className="help-grid"><button><span><Gauge /></span><h3>Panduan penggunaan</h3><p>Cara membaca grafik dan kalibrasi sensor.</p><ChevronRight /></button><button><span><Zap /></span><h3>Video tutorial</h3><p>Pemasangan sensor dalam langkah singkat.</p><ChevronRight /></button><button><span><Headphones /></span><h3>Dukungan teknis</h3><p>Hubungi tim perangkat dan billing.</p><ChevronRight /></button></div><section className="faq"><span className="eyebrow">Pertanyaan umum</span><h2>Jawaban yang sering dicari</h2>{["Bagaimana menghubungkan sensor ke kolam baru?", "Bagaimana sistem sewa bulanan bekerja?", "Apa yang terjadi jika telat membayar?", "Bagaimana berkonsultasi dengan ahli perikanan?"].map((question) => <details key={question}><summary>{question}<ChevronRight /></summary><p>Ikuti petunjuk di aplikasi atau hubungi dukungan teknis. Tim AquaGuard membantu sampai perangkat kembali aktif.</p></details>)}</section></div>
}

function OverdueLock({ navigate }: { navigate: (screen: Screen) => void }) {
  return <div className="lock-overlay"><div className="lock-card"><button className="lock-close" aria-label="Buka halaman pembayaran" onClick={() => navigate("billing")}><X /></button><span className="lock-icon"><LockKeyhole /></span><span className="eyebrow">Layanan dalam mode siaga</span><h2>Akses sensor terkunci sementara</h2><p>Masa sewa perangkat berakhir pada 5 September 2026 dan masa tenggang telah selesai.</p><div className="lock-impact"><strong>Dampak pada hatchery</strong><span><X /> Data sensor real-time tidak diperbarui</span><span><X /> Prediksi dini AI dan AquaBot terkunci</span><span><X /> Kolam tidak dipantau sistem peringatan</span></div><div className="lock-total"><small>Total pelunasan</small><strong>Rp1.050.000</strong></div><button className="button button--danger button--wide" onClick={() => navigate("billing")}>Bayar sekarang untuk membuka akses</button><small>Pembayaran terverifikasi mengaktifkan sistem secara otomatis.</small></div></div>
}

export default function App() {
  const [booting, setBooting] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [screen, setScreen] = useState<Screen>("home")
  const [subscription, setSubscription] = useState(defaultSubscription)
  const [updating, setUpdating] = useState(false)
  const locked = subscription.subscription.status === "overdue"
  useEffect(() => { const timer = window.setTimeout(() => setBooting(false), 1100); return () => window.clearTimeout(timer) }, [])
  useEffect(() => { fetch("/api/subscription").then((response) => response.ok ? response.json() : Promise.reject()).then(setSubscription).catch(() => undefined) }, [])
  const navigate = (target: Screen) => { if (locked && !["billing", "profile"].includes(target)) return; setScreen(target); window.scrollTo({ top: 0, behavior: "smooth" }) }
  const updateSubscription = async (action: string, paymentMethod?: string) => { setUpdating(true); try { const response = await fetch("/api/subscription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, paymentMethod }) }); if (response.ok) { const payload = await response.json(); setSubscription(payload); if (action === "pay") setScreen("home") } } finally { setUpdating(false) } }
  const content = useMemo(() => {
    if (screen === "home") return <HomeScreen navigate={navigate} subscription={subscription} />
    if (screen === "monitoring") return <MonitoringScreen navigate={navigate} />
    if (screen === "pond") return <PondScreen navigate={navigate} />
    if (screen === "bot") return <BotScreen locked={locked} />
    if (screen === "alerts") return <AlertsScreen navigate={navigate} />
    if (screen === "profile") return <ProfileScreen navigate={navigate} subscription={subscription} onLogout={() => setLoggedIn(false)} updateSubscription={updateSubscription} />
    if (screen === "billing") return <BillingScreen navigate={navigate} data={subscription} updateSubscription={updateSubscription} loading={updating} />
    if (screen === "history") return <HistoryScreen navigate={navigate} />
    return <HelpScreen navigate={navigate} />
  }, [screen, subscription, locked, updating])
  if (booting) return <Splash />
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />
  return <div className="app-shell"><Navigation screen={screen} navigate={navigate} /><main className="app-main">{content}</main>{locked && screen !== "billing" && <OverdueLock navigate={setScreen} />}</div>
}
