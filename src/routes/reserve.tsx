import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import villaInterior from "@/assets/villa-interior.jpg";
import newVilla from "@/assets/new-villa.jpg";
import spa from "@/assets/spa.jpg";
import chef from "@/assets/chef-experience.jpg";
import {
  UtensilsCrossed,
  Waves,
  Compass,
  Users,
  CalendarDays,
  Check,
  Loader2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve Your Villa — DAYEA Private Island" },
      {
        name: "description",
        content:
          "Reserve one of sixteen all-inclusive villas at DAYEA. Gourmet dining, unlimited activities, and a private guide — included.",
      },
    ],
  }),
  component: ReservePage,
});

// ─── Mock data (ready to be replaced by Cloudbeds/Lambda) ────────────────
type Room = {
  id: string;
  name: string;
  category: string;
  maxOccupancy: number;
  description: string;
  nightlyRate: number;
  image: string;
};

const ROOMS: Room[] = [
  {
    id: "lagoon-villa",
    name: "Lagoon Villa",
    category: "Overwater",
    maxOccupancy: 2,
    description:
      "A serene overwater retreat opening onto the house reef, with a private sundeck cantilevered above the lagoon.",
    nightlyRate: 2850,
    image: villaInterior,
  },
  {
    id: "beach-residence",
    name: "Beach Residence",
    category: "Beachfront",
    maxOccupancy: 3,
    description:
      "Sand-floor garden, plunge pool, and an outdoor pavilion framed by tropical palms steps from the shoreline.",
    nightlyRate: 3450,
    image: newVilla,
  },
  {
    id: "sanctuary-suite",
    name: "Sanctuary Suite",
    category: "Wellness",
    maxOccupancy: 2,
    description:
      "Adjacent to the spa pavilion, designed for deep restoration — twin treatment beds and a sunken meditation court.",
    nightlyRate: 3950,
    image: spa,
  },
  {
    id: "chef-residence",
    name: "Chef's Residence",
    category: "Two-Bedroom",
    maxOccupancy: 4,
    description:
      "Two-bedroom estate with a private culinary studio, an outdoor wood-fired kitchen, and full butler service.",
    nightlyRate: 5400,
    image: chef,
  },
];

const INCLUSIONS = [
  {
    icon: UtensilsCrossed,
    title: "Gourmet Culinary & Beverage",
    body:
      "Full-board fine dining — breakfast, lunch and dinner — alongside curated wines, spirits and non-alcoholic pairings throughout your stay.",
  },
  {
    icon: Waves,
    title: "On-Premise Activities",
    body:
      "Unlimited access to the spa hammam, free-diving, snorkel safaris, sunset sailing, yoga pavilions and all wellness equipment.",
  },
  {
    icon: Compass,
    title: "Private Tour Guide",
    body:
      "A dedicated local guide assigned to your villa, available for custom off-island excursions for the entirety of your stay.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────
function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function diffNights(a: Date | null, b: Date | null) {
  if (!a || !b) return 0;
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

// ─── Custom Calendar ─────────────────────────────────────────────────────
function LuxuryCalendar({
  checkIn,
  checkOut,
  onSelect,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (ci: Date | null, co: Date | null) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const months = [0, 1].map((offset) => {
    const m = new Date(cursor.getFullYear(), cursor.getMonth() + offset, 1);
    return m;
  });

  function renderMonth(month: Date) {
    const year = month.getFullYear();
    const mo = month.getMonth();
    const first = new Date(year, mo, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, mo + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, mo, d));

    return (
      <div key={month.toISOString()} className="flex-1 min-w-0">
        <div className="mb-4 text-center font-serif text-lg">
          {month.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const disabled = date < today;
            const isCheckIn = checkIn && date.getTime() === checkIn.getTime();
            const isCheckOut = checkOut && date.getTime() === checkOut.getTime();
            const inRange =
              checkIn && checkOut && date > checkIn && date < checkOut;
            const selected = isCheckIn || isCheckOut;

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!checkIn || (checkIn && checkOut)) {
                    onSelect(date, null);
                  } else if (date <= checkIn) {
                    onSelect(date, null);
                  } else {
                    onSelect(checkIn, date);
                  }
                }}
                className={[
                  "aspect-square text-sm transition-all duration-200 relative",
                  disabled && "text-muted-foreground/30 cursor-not-allowed",
                  !disabled && !selected && !inRange && "hover:bg-secondary",
                  inRange && "bg-secondary text-foreground",
                  selected && "bg-primary text-primary-foreground font-medium",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="card-soft p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="h-9 w-9 inline-flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <p className="eyebrow">Select Your Stay</p>
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="h-9 w-9 inline-flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">{months.map(renderMonth)}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
function ReservePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guestDetails, setGuestDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    requests: "",
  });
  const [payment, setPayment] = useState({
    card: "",
    expiry: "",
    cvc: "",
    nameOnCard: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);
  const subtotal = selectedRoom ? selectedRoom.nightlyRate * nights : 0;

  const canStep2 = checkIn && checkOut && nights > 0 && !!selectedRoom;
  const canConfirm =
    guestDetails.fullName.trim() &&
    /\S+@\S+\.\S+/.test(guestDetails.email) &&
    guestDetails.phone.trim().length >= 6 &&
    payment.card.replace(/\s/g, "").length >= 12 &&
    payment.expiry.length >= 4 &&
    payment.cvc.length >= 3 &&
    payment.nameOnCard.trim();

  function handleConfirm() {
    if (!canConfirm) return;
    setSubmitting(true);
    // Placeholder for AWS Lambda / Cloudbeds bridge
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 1600);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="h-24" />

      <main className="mx-auto max-w-7xl px-6 lg:px-12 pb-24">
        {/* Heading */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="eyebrow">Reserve</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Begin your retreat</h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Sixteen villas. Full-board dining, all activities and a private guide — included.
          </p>
        </div>

        {/* Stepper */}
        <Stepper step={step} />

        <div className="mt-12">
          {confirmed ? (
            <ConfirmationCard
              room={selectedRoom!}
              checkIn={checkIn!}
              checkOut={checkOut!}
              nights={nights}
              subtotal={subtotal}
              guest={guestDetails}
            />
          ) : step === 1 ? (
            <StepOne
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              setGuests={setGuests}
              onSelectDates={(ci, co) => {
                setCheckIn(ci);
                setCheckOut(co);
              }}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              nights={nights}
              onContinue={() => canStep2 && setStep(2)}
              canContinue={!!canStep2}
            />
          ) : step === 2 ? (
            <StepTwo
              room={selectedRoom!}
              nights={nights}
              subtotal={subtotal}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          ) : (
            <StepThree
              room={selectedRoom!}
              nights={nights}
              subtotal={subtotal}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              guestDetails={guestDetails}
              setGuestDetails={setGuestDetails}
              payment={payment}
              setPayment={setPayment}
              onBack={() => setStep(2)}
              onConfirm={handleConfirm}
              canConfirm={!!canConfirm}
              submitting={submitting}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { n: 1, label: "Dates & Villa" },
    { n: 2, label: "Your Package" },
    { n: 3, label: "Guest & Payment" },
  ];
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <div key={it.n} className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div
                className={[
                  "h-8 w-8 rounded-full border flex items-center justify-center text-xs transition-all",
                  active && "bg-primary text-primary-foreground border-primary",
                  done && "bg-accent text-accent-foreground border-accent",
                  !active && !done && "border-border text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? <Check className="h-4 w-4" /> : it.n}
              </div>
              <span
                className={[
                  "hidden sm:inline text-xs tracking-[0.25em] uppercase",
                  active ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {it.label}
              </span>
            </div>
            {i < items.length - 1 && <div className="h-px w-8 sm:w-16 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────
function StepOne({
  checkIn,
  checkOut,
  guests,
  setGuests,
  onSelectDates,
  selectedRoom,
  setSelectedRoom,
  nights,
  onContinue,
  canContinue,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  setGuests: (n: number) => void;
  onSelectDates: (ci: Date | null, co: Date | null) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (r: Room | null) => void;
  nights: number;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Date + guests */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <LuxuryCalendar checkIn={checkIn} checkOut={checkOut} onSelect={onSelectDates} />
        <div className="space-y-6">
          <div className="card-soft p-6">
            <p className="eyebrow mb-4">Your Stay</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 mt-1 text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="font-serif text-lg">{fmtDate(checkIn)}</p>
                </div>
              </div>
              <div className="hairline" />
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 mt-1 text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="font-serif text-lg">{fmtDate(checkOut)}</p>
                </div>
              </div>
              <div className="hairline" />
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-1 text-accent shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="input-line py-1 font-serif text-lg"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {nights > 0 && (
                <div className="pt-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {nights} {nights === 1 ? "Night" : "Nights"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Room gallery */}
      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow">The Collection</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">Sixteen villas. Yours to choose.</h2>
          </div>
          <p className="hidden md:block text-xs tracking-[0.2em] uppercase text-muted-foreground">
            All-Inclusive · Per Villa, Per Night
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {ROOMS.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              selected={selectedRoom?.id === room.id}
              onSelect={() => setSelectedRoom(room)}
            />
          ))}
        </div>
      </div>

      {/* Continue */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {!checkIn || !checkOut
            ? "Select your dates to continue."
            : !selectedRoom
              ? "Choose a villa to continue."
              : `${selectedRoom.name} · ${nights} nights · ${fmtMoney(selectedRoom.nightlyRate * nights)}`}
        </p>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="btn-primary group"
        >
          Continue
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function RoomCard({
  room,
  selected,
  onSelect,
}: {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={[
        "group card-soft overflow-hidden transition-all duration-500",
        selected ? "ring-1 ring-accent shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)]",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase">
          {room.category}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 bg-primary/95 text-primary-foreground px-4 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <p className="text-[10px] tracking-[0.3em] uppercase">Luxury All-Inclusive Package</p>
        </div>
      </div>
      <div className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-2xl">{room.name}</h3>
            <p className="mt-1 text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Up to {room.maxOccupancy} guests
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-2xl text-accent">{fmtMoney(room.nightlyRate)}</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">per night</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{room.description}</p>
        <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
          <div className="flex items-center gap-1.5"><UtensilsCrossed className="h-3 w-3 text-accent" /> Dining</div>
          <div className="flex items-center gap-1.5"><Waves className="h-3 w-3 text-accent" /> Activities</div>
          <div className="flex items-center gap-1.5"><Compass className="h-3 w-3 text-accent" /> Guide</div>
        </div>
        <button
          onClick={onSelect}
          className={selected ? "btn-primary w-full mt-6" : "btn-ghost w-full mt-6"}
        >
          {selected ? (
            <>
              <Check className="h-4 w-4" /> Selected
            </>
          ) : (
            "Select Villa"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────
function StepTwo({
  room,
  nights,
  subtotal,
  checkIn,
  checkOut,
  guests,
  onBack,
  onContinue,
}: {
  room: Room;
  nights: number;
  subtotal: number;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="card-soft overflow-hidden">
        <div className="relative aspect-[16/7] overflow-hidden">
          <img src={room.image} alt={room.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
            <p className="eyebrow text-white/80">Your Selection</p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl">{room.name}</h2>
            <p className="mt-2 text-white/80">
              {fmtDate(checkIn)} → {fmtDate(checkOut)} · {nights} nights · {guests} guests
            </p>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Included in Your Stay</p>
            <h3 className="mt-4 font-serif text-3xl md:text-4xl">The Luxury All-Inclusive Package</h3>
            <p className="mt-3 text-muted-foreground">
              At DAYEA, nothing meaningful is an extra. Three pillars define every stay.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-px bg-border border border-border">
            {INCLUSIONS.map((inc) => (
              <div key={inc.title} className="bg-card p-8 lg:p-10">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-6">
                  <inc.icon className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-serif text-xl">{inc.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{inc.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                {nights} Nights · All Inclusive
              </p>
              <p className="font-serif text-3xl mt-1">{fmtMoney(subtotal)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onBack} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={onContinue} className="btn-primary group">
                Continue to Guest Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────
type GuestDetails = { fullName: string; email: string; phone: string; requests: string };
type Payment = { card: string; expiry: string; cvc: string; nameOnCard: string };

function StepThree({
  room,
  nights,
  subtotal,
  checkIn,
  checkOut,
  guests,
  guestDetails,
  setGuestDetails,
  payment,
  setPayment,
  onBack,
  onConfirm,
  canConfirm,
  submitting,
}: {
  room: Room;
  nights: number;
  subtotal: number;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  guestDetails: GuestDetails;
  setGuestDetails: (g: GuestDetails) => void;
  payment: Payment;
  setPayment: (p: Payment) => void;
  onBack: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
  submitting: boolean;
}) {
  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  }

  return (
    <div className="animate-fade-in grid lg:grid-cols-[1fr_400px] gap-8">
      {/* Form */}
      <div className="space-y-10">
        <div className="card-soft p-8 lg:p-10">
          <p className="eyebrow">Guest Information</p>
          <h2 className="mt-3 font-serif text-2xl md:text-3xl">Tell us about your stay</h2>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={guestDetails.fullName}
                onChange={(e) => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
                className="input-line"
                placeholder="As shown on your passport"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                className="input-line"
                placeholder="you@domain.com"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Phone (International)</label>
              <input
                type="tel"
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                className="input-line"
                placeholder="+1 555 000 0000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Special Requests & Dietary Needs
              </label>
              <textarea
                value={guestDetails.requests}
                onChange={(e) => setGuestDetails({ ...guestDetails, requests: e.target.value })}
                className="input-line resize-none"
                rows={3}
                placeholder="Allergies, anniversaries, transfer preferences…"
              />
            </div>
          </div>
        </div>

        <div className="card-soft p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Payment</p>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl">Secure reservation</h2>
            </div>
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" /> Encrypted
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Name on Card</label>
              <input
                type="text"
                value={payment.nameOnCard}
                onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
                className="input-line"
              />
            </div>
            <div className="sm:col-span-2 relative">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Card Number</label>
              <input
                inputMode="numeric"
                value={payment.card}
                onChange={(e) => setPayment({ ...payment, card: formatCard(e.target.value) })}
                className="input-line pr-10"
                placeholder="0000 0000 0000 0000"
              />
              <CreditCard className="absolute right-0 bottom-4 h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Expiry</label>
              <input
                inputMode="numeric"
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                className="input-line"
                placeholder="MM / YY"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">CVC</label>
              <input
                inputMode="numeric"
                value={payment.cvc}
                onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className="input-line"
                placeholder="000"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={onBack} className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm || submitting}
            className="btn-primary min-w-[220px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Reserving…
              </>
            ) : (
              <>Confirm Reservation</>
            )}
          </button>
        </div>
      </div>

      {/* Summary sidebar */}
      <aside className="lg:sticky lg:top-28 self-start">
        <div className="card-soft overflow-hidden">
          <div className="relative aspect-[4/3]">
            <img src={room.image} alt={room.name} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="p-8">
            <p className="eyebrow">Booking Summary</p>
            <h3 className="mt-3 font-serif text-2xl">{room.name}</h3>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
              {room.category}
            </p>

            <dl className="mt-6 space-y-3 text-sm">
              <SummaryLine label="Check-in" value={fmtDate(checkIn)} />
              <SummaryLine label="Check-out" value={fmtDate(checkOut)} />
              <SummaryLine label="Nights" value={String(nights)} />
              <SummaryLine label="Guests" value={String(guests)} />
              <SummaryLine label="Nightly" value={fmtMoney(room.nightlyRate)} />
            </dl>

            <div className="hairline my-6" />

            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Total</span>
              <span className="font-serif text-3xl text-accent">{fmtMoney(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground italic">
              Taxes, fees, and all-inclusive elements fully included.
            </p>

            <div className="mt-6 pt-6 border-t border-border space-y-2">
              {INCLUSIONS.map((i) => (
                <div key={i.title} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 text-accent shrink-0" />
                  <span>{i.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function ConfirmationCard({
  room,
  checkIn,
  checkOut,
  nights,
  subtotal,
  guest,
}: {
  room: Room;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  subtotal: number;
  guest: GuestDetails;
}) {
  const code = useMemo(
    () => "DY-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    [],
  );
  return (
    <div className="animate-fade-in max-w-2xl mx-auto text-center">
      <div className="h-16 w-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
        <Check className="h-7 w-7 text-accent" />
      </div>
      <p className="eyebrow mt-8">Reservation Confirmed</p>
      <h2 className="mt-4 font-serif text-4xl md:text-5xl">Welcome, {guest.fullName.split(" ")[0]}.</h2>
      <p className="mt-4 text-muted-foreground">
        Your villa is being prepared. A concierge will reach out shortly to coordinate your seaplane
        transfer and personal preferences.
      </p>

      <div className="card-soft mt-12 p-8 text-left">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Confirmation</span>
          <span className="font-mono text-sm tracking-widest">{code}</span>
        </div>
        <div className="hairline my-6" />
        <h3 className="font-serif text-2xl">{room.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {fmtDate(checkIn)} → {fmtDate(checkOut)} · {nights} nights
        </p>
        <div className="hairline my-6" />
        <div className="flex items-baseline justify-between">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Total charged</span>
          <span className="font-serif text-2xl">{fmtMoney(subtotal)}</span>
        </div>
      </div>

      <Link to="/" className="btn-ghost mt-12 inline-flex">
        Return to DAYEA
      </Link>
    </div>
  );
}
