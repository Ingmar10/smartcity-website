// Data for the homepage vertical switcher. One rail, re-skinned per business.
// "qs" verticals quote on QuoteSmart; "book" verticals run the booking stack
// (GHL + custom site, no quoting layer).

export type Row = [string, string | number, "usd" | "mo" | "text" | "num", (0 | 1)?];

export type Kiosk = {
  bg: string; text: string; rule: string; headRule: string;
  markBg: string; markInk: string; primary: string; onPrimary: string;
  num: string; meta: string; muted: string; bigLabel: string; listLabel: string;
  pole?: 1; cover?: 1;
};

export type Vertical = {
  key: string; label: string; dot: string; stack: "qs" | "book";
  brand: string; ini: string; accent: string; onAccent?: string; ink?: string;
  stats?: [string, string][]; k?: Kiosk; kicker: string; rows: Row[];
  footer: string; cta: string; out: string; inn: string; bolt: string; primary: string;
  stages: [string, string, string][];
};

export const STAGES_TRADE: [string,string,string][] = [
  ['Dead in your CRM', 'A lead you already paid for, aged out ninety days ago.', 'Your data'],
  ['DialBolt wakes it', 'Compliant SMS re-engages, handles the reply, books the slot.', 'DialBolt'],
  ['Priced to your floor', 'Dealers see a number, never your cost. Your floor enforces it.', 'QuoteSmart'],
  ['Proposal out the door', 'Branded PDF, customer view, financing attached.', 'QuoteSmart'],
  ['Signed and attributed', 'The close lands on the rep who earned it.', 'Bolt']
];
export const VERTICALS: Vertical[] = [
  { key: 'roofing', label: 'Roofing', dot: '#F28C28', stack: 'qs', brand: 'Ridgeline Roofing', ini: 'R', accent: '#F28C28', onAccent: '#1F3A5F', ink: '#C2410C',
    stats: [['FLOOR', 'Held'], ['MARGIN', '22%'], ['REP', 'Alex']], kicker: 'PROPOSAL · 32 SQ · GAF TIMBERLINE HDZ',
    rows: [['Tear-off & disposal', 3200, 'usd'], ['Shingle system', 11900, 'usd'], ['Ridge vent + flashing', 1450, 'usd'], ['Total', 16550, 'usd', 1]],
    footer: 'Floor price enforced · Rep: Alex', cta: 'Accept proposal',
    out: "Hi Maria, it's Ridgeline Roofing. Your re-roof estimate from June is still good through Friday. Want us to lock it in?", inn: 'Yes, Friday morning works',
    bolt: 'Price a 32-square re-roof with a 22% floor', primary: 'See QuoteSmart', stages: STAGES_TRADE },
  { key: 'solar', label: 'Solar', dot: '#0F766E', stack: 'qs', brand: 'SunPath Solar', ini: 'S', accent: '#0F766E', onAccent: '#FFFFFF', ink: '#0F766E',
    stats: [['FINANCING', '30.5 yr'], ['PAYMENT', '$118/mo'], ['REP', 'Tony']], kicker: 'PROPOSAL · 10.2 KW · 24 PANELS',
    rows: [['System price', 28900, 'usd'], ['Federal credit', -8670, 'usd'], ['Net cost', 20230, 'usd', 1], ['Climate First · 30.5 yr', 118, 'mo']],
    footer: 'Financing pre-attached · Rep: Tony', cta: 'Start financing',
    out: 'Hi James, SunPath here. Your 10.2 kW system now qualifies for a 30.5-year term at $118/mo. Want the updated numbers?', inn: 'Send them over',
    bolt: 'Run a 10 kW proposal on the Climate First 30.5-year term', primary: 'See QuoteSmart', stages: STAGES_TRADE },
  { key: 'insulation', label: 'Insulation', dot: '#B45309', stack: 'qs', brand: 'Northline Insulation', ini: 'N', accent: '#B45309', onAccent: '#FFFFFF', ink: '#B45309',
    stats: [['FLOOR', 'Held'], ['REBATE', '$1,200'], ['REP', 'Marisol']], kicker: 'PROPOSAL · 1,640 SQ FT · R-49 BLOWN-IN',
    rows: [['Attic air sealing', 1850, 'usd'], ['R-49 blown-in cellulose', 4720, 'usd'], ['Rim joist spray foam', 1280, 'usd'], ['Total', 7850, 'usd', 1]],
    footer: 'Utility rebate applied · Rep: Marisol', cta: 'Accept proposal',
    out: 'Hi Ruth, Northline Insulation. Your attic quote from April still stands, and the $1,200 utility rebate runs through October. Want it locked in?', inn: "Let's lock it",
    bolt: 'Price an R-49 attic with the utility rebate applied', primary: 'See QuoteSmart', stages: STAGES_TRADE },
  { key: 'barbershop', label: 'Barbershop', dot: '#D4AF37', stack: 'book', brand: 'KD Barbershop', ini: 'K', accent: '#D4AF37',
    k: { bg: '#0A0A0A', text: '#F3F3F3', rule: 'rgba(243,243,243,.09)', headRule: 'rgba(212,175,55,.28)', markBg: '#D4AF37', markInk: '#0A0A0A', primary: '#C41E3A', onPrimary: '#FFFFFF', num: '#D4AF37', meta: '#D4AF37', muted: '#8A8A8A', bigLabel: 'WAITING NOW', listLabel: 'NEXT CHAIRS', pole: 1 },
    kicker: 'WALK-IN KIOSK · TV BOARD SYNCED',
    rows: [['Kenny', 'Next chair 2:15', 'text'], ['Marco', '2:40', 'text'], ['Deshawn', '3:05', 'text'], ['Waiting now', 3, 'num', 1]],
    footer: 'Tablet kiosk · TV schedule · no front desk', cta: 'Check in',
    out: "Hey Chris, it's KD Barbershop. Kenny has a chair open Thursday at 2. Want it?", inn: 'Book it',
    bolt: 'How does the kiosk handle walk-ins when every chair is full?', primary: 'See the booking stack',
    stages: [['Missed walk-in', 'Left when the wait hit forty minutes. No number taken.', 'Your data'], ['DialBolt texts back', 'Offers the next open chair, by name.', 'DialBolt'], ['Chair held on the kiosk', 'Tablet check-in. No front desk required.', 'SmartCity'], ['TV board updates', "Every barber's queue on the wall, live.", 'SmartCity'], ['Cut done, tip paid', 'Card on file. The barber sees the tip before the client leaves.', 'Payments']] },
  { key: 'restaurant', label: 'Restaurant', dot: '#9A3412', stack: 'book', brand: 'Casa Mila', ini: 'C', accent: '#F59E0B',
    k: { bg: '#FFF7ED', text: '#1C1917', rule: 'rgba(28,25,23,.10)', headRule: 'rgba(154,52,18,.22)', markBg: '#F59E0B', markInk: '#1C1917', primary: '#9A3412', onPrimary: '#FFFFFF', num: '#9A3412', meta: '#9A3412', muted: '#57534E', bigLabel: 'OPEN TONIGHT', listLabel: 'NEXT SEATINGS', cover: 1 },
    kicker: 'HOST STAND · WAITLIST TEXTS ITSELF',
    rows: [['6:30 · Table for 2', 'Open', 'text'], ['7:00 · Table for 4', 'Open', 'text'], ['8:15 · Walk-in waitlist', '12 min', 'text'], ['Private room · Sat', 'Available', 'text', 1]],
    footer: 'Host stand kiosk · waitlist texts itself', cta: 'Reserve',
    out: "Hi Dana, Casa Mila. Table for 4 tonight at 7? Reply Y and we'll hold it.", inn: 'Y',
    bolt: 'Text the waitlist the moment a 4-top opens', primary: 'See the booking stack',
    stages: [['No-show last month', 'Booked, never came, never heard from you again.', 'Your data'], ['DialBolt texts back', 'One-tap hold on a table tonight.', 'DialBolt'], ['Table held', 'The host stand sees it the second they reply.', 'SmartCity'], ['Waitlist synced', 'Walk-ins get a text when their table clears.', 'SmartCity'], ['Seated, check closed', 'Paid at the table. Tip split on the spot.', 'Payments']] }
];
