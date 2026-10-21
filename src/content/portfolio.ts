// All site copy lives here. Source: ../../source-pack.md.
// Public-safety rules (source pack, Appendix D): the employer is named as on the resume (Energy In Motion);
// no vendor names, hostnames or customer names. Anything marked [CONFIRM: …] must be checked before launch.

export const person = {
  name: 'Aakash Gupta',
  role: 'Systems engineer',
  city: 'Mumbai',
  line: 'I make complicated systems simple to run.',
  intro: 'I’m Aakash. I design how everything fits together, from the data underneath to the apps people use.',
  now: 'Assistant Manager, Software Development at Energy In Motion',
  before: 'Founding engineer at Praan',
  email: 'contact@aakashgupta.dev',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aakashgupta2001/' },
    { label: 'GitHub', href: 'https://github.com/Aakashgupta2001' },
  ],
};


export const chapters = [
  {
    years: '2020 – 23',
    place: 'Woobblr Technologies',
    role: 'Co-founder, technical lead',
    body: 'A dev studio I co-founded in college. I led the technical side of 12+ client projects, from marketing sites to LMS platforms and CRMs. One custom ERP removed a full-time manual role for an MSME and cut another person’s daily workload by 70%.',
  },
  {
    years: '2023 – 26',
    place: 'Praan',
    role: 'Founding engineer, senior full-stack developer',
    body: 'The first software hire at a climate-hardware startup. I built HIVE, the IoT platform behind thousands of connected air purifiers, then hired and led a team of five developers and ran DevOps for every product. Two patent applications came out of that work.',
  },
  {
    years: '2026 – now',
    place: 'Energy In Motion',
    role: 'Assistant Manager, Software Development',
    body: 'Brought in to replace sixteen separate apps with one platform without switching anything off. I work across operations, finance, vendors and leadership: the architecture, the written decisions behind it, and plans that leadership can follow.',
  },
  {
    years: 'Ongoing',
    place: 'Noxio',
    role: 'Open-source, founder',
    body: 'A local-first desktop app that runs LLM chat, image generation and voice on a single GPU, with no cloud involved.',
  },
];

/** Selected work, written for anyone (not just engineers): what was wrong, what I did, what changed. Facts match the resume. */
export type Work = {
  id: string;
  title: string;
  line: string;
  before: string;
  did: string;
  after: string;
  outcome: { value: string; label: string };
  /** Shown when the work isn't live yet, so nothing is overclaimed. */
  status?: string;
};

export const work: Work[] = [
  {
    id: 'platform',
    title: 'One platform instead of sixteen apps',
    line: 'Energy In Motion’s software, rebuilt so everyone works from the same numbers.',
    before: 'Every team had its own app, its own login and its own version of the truth. When two screens disagreed, nobody knew which one to trust.',
    did: 'I designed one platform at the centre, with a single sign-in and clear rules about who can see what, then moved the work onto it while the old apps kept running.',
    after: 'About 11 services now share the same foundation, built in three and a half months, and anyone’s access can be switched off in seconds.',
    outcome: { value: '16 → 1', label: 'apps brought onto one platform' },
  },
  {
    id: 'hive',
    title: 'An app for thousands of air purifiers',
    line: 'The platform and app behind a climate-hardware startup’s connected devices.',
    before: 'A new hardware company needed everything at once: devices online, a cloud behind them, and an app hundreds of customers could rely on.',
    did: 'As the first engineer, I built the platform and the app, then hired and led the team of five that grew them.',
    after: 'Customers monitor and control their purifiers in real time, and setting up a new one went from about a minute and a half to twenty seconds.',
    outcome: { value: '90s → 20s', label: 'to set up a new device' },
  },
  {
    id: 'store',
    title: 'An online store, live in under a week',
    line: 'Praan’s own store, built to replace Shopify.',
    before: 'The company sold its products through Shopify and paid for it every month.',
    did: 'I built its own store, with two payment gateways and shipping built in, and had it live in under a week.',
    after: 'The Shopify bill went away, saving thousands of dollars a year.',
    outcome: { value: '< 1 week', label: 'from start to a live store' },
  },
  {
    id: 'erp',
    title: 'Software that freed up a full-time role',
    line: 'A custom ERP that took a small business’s manual work off people’s desks.',
    before: 'A small business ran its day-to-day processes by hand, and one full-time job existed just to keep that work going.',
    did: 'I built a lightweight custom ERP that automated those processes from start to finish.',
    after: 'The manual role was no longer needed, saving ₹15–20K a month, and another person’s daily workload fell by 70%.',
    outcome: { value: '70%', label: 'less daily manual work' },
  },
  {
    id: 'noxio',
    title: 'AI that runs on your own computer',
    line: 'Chat, images and voice in one desktop app, with nothing leaving your machine.',
    before: 'Getting chat, image and voice AI usually means three subscriptions, like ChatGPT, Midjourney and ElevenLabs, and sending your data to all of them.',
    did: 'I’m building one app that runs all three on your own graphics card, handing it to whichever one needs it.',
    after: 'One install, no subscriptions, and no data leaving the machine.',
    outcome: { value: '3 → 1', label: 'subscriptions replaced by one app' },
    status: 'In progress, open source',
  },
];

/** How I work, in plain words. */
export const principles = [
  { title: 'Understand before building', body: 'I start by measuring how things actually work today, so the design solves the real problem.' },
  { title: 'Keep it simple', body: 'The simplest design that works is the easiest one to run, change and hand over.' },
  { title: 'Build it with the people who use it', body: 'I design alongside the teams who’ll live with the system, and keep what already works for them.' },
  { title: 'Write it down', body: 'Every important decision is written up with its reasons, so nobody has to guess later.' },
  { title: 'Plan for things going wrong', body: 'When something fails, the system should stay safe and say so, and every problem becomes a rule that stops it happening again.' },
];

export const toolbox = [
  { area: 'Architecture', items: ['Modular monoliths', 'Event-driven systems', 'Transactional outbox', 'ADRs', 'Access models'] },
  { area: 'Backend', items: ['TypeScript', 'Node.js', 'Express', 'GraphQL', 'Java / Spring', 'Python'] },
  { area: 'Data', items: ['PostgreSQL', 'TimescaleDB', 'MySQL', 'MongoDB', 'Redis', 'Kafka'] },
  { area: 'IoT', items: ['MQTT / mTLS', 'CAN · J1939', 'OCPP 1.6-J', 'BLE', 'ESP32'] },
  { area: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Three.js', 'Tailwind'] },
  { area: 'Cloud & ops', items: ['AWS', 'Docker', 'nginx', 'pm2', 'Tailscale', 'CI gates'] },
];

/** The hero map: the parts every system I work on has. `where` says where I've built each part (no employer names). */
export type MapNode = { id: string; x: number; y: number; hub?: boolean; note: string; where: string };

export const systemMap: { w: number; h: number; nodes: MapNode[]; edges: [string, string][] } = {
  w: 480,
  h: 300,
  nodes: [
    { id: 'devices', x: 50, y: 150, note: 'Hardware that talks: firmware links over BLE, MQTT, CAN and OCPP.', where: 'Air purifiers · electric trucks · chargers' },
    { id: 'pipelines', x: 150, y: 150, note: 'Getting data in without losing it: queues, streams and batches that can be replayed.', where: 'Kafka at Praan · lossless telemetry at Energy In Motion' },
    { id: 'core', x: 265, y: 150, hub: true, note: 'One source of truth: the data model, the APIs and the rules everything else depends on.', where: 'IoT cloud · fleet platform · a client ERP' },
    { id: 'access', x: 265, y: 55, note: 'Who can see and do what, for both people and machines.', where: 'OIDC sign-in · per-person roles · audited APIs' },
    { id: 'operations', x: 265, y: 245, note: 'Running it day to day: deploys, monitoring and the rules written after each incident.', where: 'AWS · Docker · health checks that tell the truth' },
    { id: 'web', x: 410, y: 70, note: 'Dashboards and portals that people run their day on.', where: 'Operations tools · customer portals · client sites' },
    { id: 'mobile', x: 425, y: 150, note: 'Apps in people’s pockets, paired with the hardware they control.', where: 'HIVE for iOS and Android' },
    { id: 'desktop', x: 410, y: 230, note: 'Local-first software that runs heavy work on your own machine.', where: 'Noxio, an AI desktop app on one GPU' },
  ],
  edges: [['devices', 'pipelines'], ['pipelines', 'core'], ['access', 'core'], ['operations', 'core'], ['core', 'web'], ['core', 'mobile'], ['core', 'desktop']],
};
