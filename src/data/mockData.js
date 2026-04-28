export const CATEGORIES = ['Road', 'Water', 'Electricity', 'Waste', 'Other'];

export const CATEGORY_COLORS = {
  Road:        { hex: '#f97316', badge: 'badge-road' },
  Water:       { hex: '#3b82f6', badge: 'badge-water' },
  Electricity: { hex: '#eab308', badge: 'badge-electricity' },
  Waste:       { hex: '#22c55e', badge: 'badge-waste' },
  Other:       { hex: '#a855f7', badge: 'badge-other' },
};

export const DEPARTMENTS = {
  Road:        { name: 'Public Works Department (PWD)', phone: '1800-180-4325', email: 'pwd@civic.gov.in', icon: '🛣️' },
  Water:       { name: 'Municipal Water Supply Board', phone: '1800-180-5678', email: 'water@civic.gov.in', icon: '💧' },
  Electricity: { name: 'State Electricity Distribution Corp', phone: '1800-180-1234', email: 'electricity@civic.gov.in', icon: '⚡' },
  Waste:       { name: 'Solid Waste Management Division', phone: '1800-180-9988', email: 'waste@civic.gov.in', icon: '♻️' },
  Other:       { name: 'General Municipal Services', phone: '1800-180-0000', email: 'general@civic.gov.in', icon: '🏛️' },
};

export const STATUS_COLORS = {
  Pending:       { dot: 'bg-yellow-400', badge: 'badge-pending' },
  'In Progress': { dot: 'bg-blue-400',   badge: 'badge-progress' },
  Resolved:      { dot: 'bg-green-400',  badge: 'badge-resolved' },
};

export const MOCK_COMPLAINTS = [
  {
    id: 'CMP-2024-001',
    title: 'Large pothole on MG Road near bus stop',
    description: 'There is a massive pothole on MG Road near City Bus Stop 12. It has been there for 3 months and caused multiple accidents.',
    category: 'Road', status: 'In Progress',
    location: { lat: 18.5204, lng: 73.8567, address: 'MG Road, Pune' },
    aiSummary: 'Dangerous pothole on MG Road causing accidents and water logging for 3 months.',
    confidence: 97, department: 'Road',
    createdAt: new Date(Date.now() - 5*86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2*86400000).toISOString(), upvotes: 34,
  },
  {
    id: 'CMP-2024-002',
    title: 'Water supply disruption in Sector 7',
    description: 'No water supply for 4 days in Sector 7, Block B. Multiple families affected. Children and elderly are suffering.',
    category: 'Water', status: 'Pending',
    location: { lat: 18.5314, lng: 73.8446, address: 'Sector 7, Pune' },
    confidence: 99, department: 'Water', upvotes: 12,
    witnesses: 2,
    isVerified: false,
    proposals: [],
    escalationLevel: 0,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    aiSummary: 'Localized water supply interruption affecting multi-story building.',
  },
  {
    id: 'CMP-2024-003',
    title: 'Street lights not working – safety hazard',
    description: 'All 8 street lights on Nehru Street non-functional for 2 weeks. Two snatching incidents already reported.',
    category: 'Electricity', status: 'Resolved',
    location: { lat: 18.5089, lng: 73.8692, address: 'Nehru Street, Pune' },
    aiSummary: 'All 8 street lights on Nehru Street non-functional for 2 weeks, causing safety incidents.',
    confidence: 95, department: 'Electricity',
    createdAt: new Date(Date.now() - 10*86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(), upvotes: 89,
    resolution: { comment: 'Lights replaced and circuit repaired.', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), images: ['url1'] }
  },
  {
    id: 'CMP-2024-004',
    title: 'Garbage not collected for 10 days',
    description: 'Waste piling up on street corners attracting dogs and rats. Strong smell affecting residents.',
    category: 'Waste', status: 'Pending',
    location: { lat: 18.5415, lng: 73.8550, address: 'Laxmi Nagar, Pune' },
    confidence: 98, department: 'Waste', upvotes: 45,
    witnesses: 12,
    isVerified: true,
    proposals: [
      { text: "Install extra lighting to prevent future illegal dumping.", upvotes: 30, user: "Sneha P." }
    ],
    escalationLevel: 1,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    aiSummary: 'Health hazard due to accumulated uncollected organic and plastic waste.',
  },
  {
    id: 'CMP-2024-005',
    title: 'Broken water pipe flooding the road',
    description: 'A major water pipe burst near Gandhi Chowk. Water gushing out for 6 hours, flooding road and nearby shops.',
    category: 'Water', status: 'In Progress',
    location: { lat: 18.5160, lng: 73.8480, address: 'Gandhi Chowk, Pune' },
    aiSummary: 'Burst water pipe at Gandhi Chowk flooding road for 6+ hours causing traffic disruption.',
    confidence: 99, department: 'Water',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 21600000).toISOString(), upvotes: 112,
  },
  {
    id: 'CMP-2024-006',
    title: 'Road cave-in near school zone',
    description: 'Section of road near City Primary School caved in creating a 3-foot deep hole. School bus had a near miss.',
    category: 'Road', status: 'In Progress',
    location: { lat: 18.5250, lng: 73.8620, address: 'City School Road, Pune' },
    aiSummary: 'Dangerous road cave-in near school zone; school bus near-miss reported.',
    confidence: 96, department: 'Road',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 18000000).toISOString(), upvotes: 78,
  },
  {
    id: 'CMP-2024-007',
    title: 'Illegal dumping of construction waste',
    description: 'Builder dumping construction debris on public land near the park. Sharp materials dangerous to children.',
    category: 'Waste', status: 'Pending',
    location: { lat: 18.5350, lng: 73.8700, address: 'Central Park, Pune' },
    confidence: 91, department: 'Waste', upvotes: 24,
    witnesses: 5,
    isVerified: true,
    proposals: [
      { text: "Use industrial-grade sealant for the cracks.", upvotes: 12, user: "Amit K." }
    ],
    escalationLevel: 0,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    aiSummary: 'Major road surface damage creating hazard for two-wheelers.',
  },
  {
    id: 'CMP-2024-008',
    title: 'Power outage lasting 14 hours daily',
    description: 'Entire colony facing 14+ hour power cuts daily for a week. Students preparing for exams badly affected.',
    category: 'Electricity', status: 'Resolved',
    location: { lat: 18.5120, lng: 73.8400, address: 'Green Colony, Pune' },
    aiSummary: '14+ hour daily power outages in Green Colony for a week affecting WFH and students.',
    confidence: 98, department: 'Electricity',
    createdAt: new Date(Date.now() - 8*86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2*86400000).toISOString(), upvotes: 156,
  },
];

export const MOCK_FEEDBACK = [
  { id: 'FB-001', text: 'The complaint resolution was very fast. PWD fixed the road within 2 days!', sentiment: 'Positive', rating: 5, createdAt: new Date(Date.now() - 2*86400000).toISOString() },
  { id: 'FB-002', text: 'Water supply issue still not resolved after 5 days. Very disappointed with the response.', sentiment: 'Negative', rating: 1, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'FB-003', text: 'Good initiative by the municipality. At least our complaints are being heard now.', sentiment: 'Neutral', rating: 3, createdAt: new Date(Date.now() - 3*86400000).toISOString() },
];

export const NAVIGATOR_FLOW = {
  start: {
    question: 'What type of issue are you facing?',
    options: [
      { label: '🛣️ Road / Infrastructure', next: 'road' },
      { label: '💧 Water Supply', next: 'water' },
      { label: '⚡ Electricity', next: 'electricity' },
      { label: '♻️ Waste / Sanitation', next: 'waste' },
      { label: '🏛️ Other Government Service', next: 'other' },
    ]
  },
  road: {
    question: 'What kind of road issue is it?',
    options: [
      { label: '🕳️ Pothole / Cave-in', next: 'road_result' },
      { label: '🚧 Road Damage', next: 'road_result' },
      { label: '🚦 Traffic Signal', next: 'signal_result' },
      { label: '🌉 Bridge / Footpath', next: 'bridge_result' },
    ]
  },
  water: {
    question: 'What is the water issue?',
    options: [
      { label: '🚰 No water supply', next: 'water_result' },
      { label: '💦 Pipe leakage / burst', next: 'leak_result' },
      { label: '🤢 Contaminated water', next: 'quality_result' },
      { label: '💸 Billing issue', next: 'billing_result' },
    ]
  },
  electricity: {
    question: 'What is the electricity issue?',
    options: [
      { label: '🔌 Power outage / cut', next: 'outage_result' },
      { label: '💡 Street light not working', next: 'street_result' },
      { label: '⚡ Dangerous wire / hazard', next: 'hazard_result' },
      { label: '💰 Billing problem', next: 'ebilling_result' },
    ]
  },
  waste: {
    question: 'What is the waste/sanitation issue?',
    options: [
      { label: '🗑️ Garbage not collected', next: 'garbage_result' },
      { label: '🚫 Illegal dumping', next: 'illegal_result' },
      { label: '🚽 Drain / toilet issue', next: 'drain_result' },
    ]
  },
  other: {
    question: 'What other government service do you need?',
    options: [
      { label: '📄 Document / Certificate', next: 'doc_result' },
      { label: '🌳 Park / Public Space', next: 'park_result' },
      { label: '🏗️ Unauthorized construction', next: 'construct_result' },
    ]
  },
  road_result: { result: { title: 'Report to Public Works Department', dept: 'Road', steps: ['File complaint with location photo', 'Reference PWD complaint portal', 'Follow up after 48 hours if no action'], tip: 'Include exact GPS location and photo for faster resolution.' } },
  signal_result: { result: { title: 'Traffic Signal → Traffic Police + PWD', dept: 'Road', steps: ['Report to traffic police helpline 103', 'Also log with PWD for infrastructure fix', 'Note signal ID from the pole'], tip: 'Signal ID is printed on the pole base.' } },
  bridge_result: { result: { title: 'Bridge / Footpath → PWD Structural Division', dept: 'Road', steps: ['Mark area as unsafe if dangerous', 'Submit complaint with photos', 'Escalate to district collector if no response in 72h'], tip: 'Structural damage is classified urgent.' } },
  water_result: { result: { title: 'No Water Supply → Municipal Water Board', dept: 'Water', steps: ['Call helpline immediately (24/7)', 'Log complaint online with area and duration', 'Ask for temporary tanker supply'], tip: 'Outage > 48 hours: request emergency tanker service free of cost.' } },
  leak_result: { result: { title: 'Pipe Leakage → Emergency Water Board', dept: 'Water', steps: ['Call emergency line – classified urgent', 'Note pipe location precisely', 'Keep area clear for repair crew'], tip: 'Leaks treated as emergencies – response within 4 hours.' } },
  quality_result: { result: { title: 'Water Quality → Health Dept + Water Board', dept: 'Water', steps: ['Do NOT use water for drinking', 'Collect sample in clean bottle', 'Submit for free lab testing'], tip: 'Free water testing kits available at municipal office.' } },
  billing_result: { result: { title: 'Billing Dispute → Consumer Cell', dept: 'Water', steps: ['Collect last 3 bills', 'Visit consumer cell with meter reading', 'File RTI if unresolved in 30 days'], tip: 'Online dispute portal resolves billing in 7 working days.' } },
  outage_result: { result: { title: 'Power Outage → DISCOM / State Electricity Board', dept: 'Electricity', steps: ['Check official outage map first', 'Call 24/7 helpline 1912', 'Log complaint with transformer ID if known'], tip: 'Outage > 6 hours qualifies for compensation.' } },
  street_result: { result: { title: 'Street Light → Municipal Electrical Division', dept: 'Electricity', steps: ['Note pole number (printed on pole)', 'Submit complaint with location', 'Response expected in 48 hours'], tip: 'Bulk reports from same street get priority.' } },
  hazard_result: { result: { title: '⚠️ EMERGENCY – Dangerous Wire!', dept: 'Electricity', steps: ['CALL 1912 IMMEDIATELY', 'Keep everyone away from the area', 'Emergency crew dispatched within 1 hour'], tip: 'Life-threatening emergency. Call first, report online later.' } },
  ebilling_result: { result: { title: 'Electricity Billing → DISCOM Consumer Forum', dept: 'Electricity', steps: ['Gather bills and meter reading photos', 'File dispute online or at local office', 'Escalate to Electricity Ombudsman if needed'], tip: 'DISCOM must resolve billing disputes within 15 days by law.' } },
  garbage_result: { result: { title: 'Garbage Collection → Solid Waste Management', dept: 'Waste', steps: ['Log complaint with colony/ward name', 'Mention how many days missed', 'Request immediate pickup'], tip: 'Complaints resolve faster with ward number.' } },
  illegal_result: { result: { title: 'Illegal Dumping → Solid Waste + Enforcement', dept: 'Waste', steps: ['Photograph the dumping with timestamp', 'Note vehicle number if contractor', 'File complaint + enforcement complaint together'], tip: 'Violators face ₹5000–₹50000 fine.' } },
  drain_result: { result: { title: 'Drain / Toilet Issue → Sanitation Division', dept: 'Waste', steps: ['Mark GPS location precisely', 'Describe blockage or overflow severity', 'Health emergency gets priority response'], tip: 'Overflow near school/hospital classified as health emergency.' } },
  doc_result: { result: { title: 'Documents & Certificates → Municipal Office', dept: 'Other', steps: ['Visit DigiLocker for digital certificates', 'Book appointment online to avoid queues', 'Birth/Death certs processed in 3 working days'], tip: 'DigiLocker (digilocker.gov.in) has most certificates instantly.' } },
  park_result: { result: { title: 'Parks & Public Spaces → Horticulture Dept', dept: 'Other', steps: ['Log with park name and ward', 'Submit photos of damage', 'Parks maintenance resolved in 1 week'], tip: 'Resident Welfare Associations can sponsor improvements.' } },
  construct_result: { result: { title: 'Unauthorized Construction → Town Planning', dept: 'Other', steps: ['Photograph construction with date stamp', 'Note builder name/board if visible', 'File with Town Planning Department'], tip: 'Anonymous complaints accepted. Action within 7 days.' } },
};
