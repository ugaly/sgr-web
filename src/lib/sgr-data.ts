// Mock data for SGR Guardian command dashboard

export const RAILWAY_PATH: Array<{ lat: number; lng: number; name?: string }> = [
  { lat: -6.8174, lng: 39.2832, name: "Dar es Salaam" },
  { lat: -6.8836, lng: 39.0833, name: "Pugu" },
  { lat: -6.9130, lng: 38.9300, name: "Soga" },
  { lat: -6.8420, lng: 38.6940, name: "Ruvu" },
  { lat: -6.7560, lng: 38.1240, name: "Ngerengere" },
  { lat: -6.8235, lng: 37.6606, name: "Morogoro" },
  { lat: -6.8360, lng: 36.9840, name: "Kilosa" },
  { lat: -6.4900, lng: 36.4710, name: "Gulwe" },
  { lat: -6.3180, lng: 36.0870, name: "Igandu" },
  { lat: -6.1722, lng: 35.7395, name: "Dodoma" },
];

export type Officer = {
  id: string;
  name: string;
  team: string;
  section: string;
  status: "active" | "idle" | "offline" | "sos";
  lat: number;
  lng: number;
  avatarColor: string;
};

export const OFFICERS: Officer[] = [
  { id: "o1", name: "Hamisi Juma",    team: "Alpha-01", section: "Pugu",        status: "active", lat: -6.8836, lng: 39.0833, avatarColor: "#10367D" },
  { id: "o2", name: "Neema Mushi",    team: "Alpha-01", section: "Soga",        status: "active", lat: -6.9130, lng: 38.9300, avatarColor: "#1C50A8" },
  { id: "o3", name: "Salim Komba",    team: "Bravo-02", section: "Ruvu",        status: "idle",   lat: -6.8420, lng: 38.6940, avatarColor: "#5B9BD5" },
  { id: "o4", name: "Asha Mwakyusa",  team: "Bravo-02", section: "Ngerengere",  status: "active", lat: -6.7560, lng: 38.1240, avatarColor: "#3E74CE" },
  { id: "o5", name: "Joseph Mhina",   team: "Charlie-03", section: "Morogoro",  status: "active", lat: -6.8235, lng: 37.6606, avatarColor: "#10367D" },
  { id: "o6", name: "Lulu Mwakasege", team: "Charlie-03", section: "Kilosa",    status: "sos",    lat: -6.8360, lng: 36.9840, avatarColor: "#EF4444" },
  { id: "o7", name: "Baraka Lyimo",   team: "Delta-04", section: "Gulwe",       status: "active", lat: -6.4900, lng: 36.4710, avatarColor: "#1C50A8" },
  { id: "o8", name: "Zubeda Iddi",    team: "Delta-04", section: "Igandu",      status: "offline",lat: -6.3180, lng: 36.0870, avatarColor: "#9CA3AF" },
  { id: "o9", name: "Pendo Massawe",  team: "Echo-05",  section: "Dodoma",      status: "active", lat: -6.1722, lng: 35.7395, avatarColor: "#5B9BD5" },
];

export type Incident = {
  id: string;
  code: string;
  title: string;
  type: "Trespass" | "Track damage" | "Theft" | "Vandalism" | "Suspicious activity" | "Medical";
  priority: "high" | "medium" | "low";
  status: "Submitted" | "In Progress" | "Review" | "Resolved";
  section: string;
  reporter: string;
  team: string;
  time: string;
  lat: number;
  lng: number;
};

export const INCIDENTS: Incident[] = [
  { id: "i1", code: "RPT-2841", title: "Cattle on track near KM-118",        type: "Trespass",          priority: "high",   status: "In Progress", section: "Ngerengere", reporter: "Asha Mwakyusa", team: "Bravo-02",   time: "8 min ago",  lat: -6.756, lng: 38.124 },
  { id: "i2", code: "RPT-2840", title: "Fence cut detected, eastern side",   type: "Vandalism",         priority: "high",   status: "Submitted",   section: "Kilosa",     reporter: "Lulu Mwakasege",team: "Charlie-03", time: "22 min ago", lat: -6.836, lng: 36.984 },
  { id: "i3", code: "RPT-2839", title: "Suspicious group near siding",       type: "Suspicious activity",priority: "medium",status: "Review",      section: "Morogoro",   reporter: "Joseph Mhina",  team: "Charlie-03", time: "1 hr ago",   lat: -6.8235, lng: 37.6606 },
  { id: "i4", code: "RPT-2838", title: "Loose ballast — KM-204",             type: "Track damage",      priority: "medium", status: "In Progress", section: "Gulwe",      reporter: "Baraka Lyimo",  team: "Delta-04",   time: "2 hr ago",   lat: -6.49, lng: 36.471 },
  { id: "i5", code: "RPT-2837", title: "Cable theft attempt, signal box 12", type: "Theft",             priority: "high",   status: "Resolved",    section: "Pugu",       reporter: "Hamisi Juma",   team: "Alpha-01",   time: "3 hr ago",   lat: -6.8836, lng: 39.0833 },
  { id: "i6", code: "RPT-2836", title: "Pedestrian crossing illegally",      type: "Trespass",          priority: "low",    status: "Resolved",    section: "Soga",       reporter: "Neema Mushi",   team: "Alpha-01",   time: "5 hr ago",   lat: -6.913, lng: 38.93 },
  { id: "i7", code: "RPT-2835", title: "Officer requesting medical support", type: "Medical",           priority: "high",   status: "Resolved",    section: "Dodoma",     reporter: "Pendo Massawe", team: "Echo-05",    time: "6 hr ago",   lat: -6.1722, lng: 35.7395 },
  { id: "i8", code: "RPT-2834", title: "Graffiti on station wall",           type: "Vandalism",         priority: "low",    status: "Review",      section: "Ruvu",       reporter: "Salim Komba",   team: "Bravo-02",   time: "9 hr ago",   lat: -6.842, lng: 38.694 },
];

export type Supervisor = {
  id: string;
  name: string;
  rank: string;
  zone: string;
  teams: number;
  officers: number;
  online: boolean;
  status: "On duty" | "Briefing" | "Off duty";
  rating: number;
  incidents: number;
  phone: string;
  email: string;
};

export const SUPERVISORS: Supervisor[] = [
  { id: "s1",  name: "Col. Emmanuel Mwita",   rank: "Corridor Lead",   zone: "Dar — Ruvu",        teams: 3, officers: 24, online: true,  status: "On duty",  rating: 4.9, incidents: 2, phone: "+255 712 000 101", email: "e.mwita@sgr.tz" },
  { id: "s2",  name: "Maj. Rehema Sanga",     rank: "Section Command", zone: "Ruvu — Morogoro",   teams: 2, officers: 16, online: true,  status: "On duty",  rating: 4.7, incidents: 1, phone: "+255 712 000 102", email: "r.sanga@sgr.tz" },
  { id: "s3",  name: "Capt. John Mwakalinga", rank: "Section Command", zone: "Morogoro — Kilosa", teams: 2, officers: 14, online: false, status: "Off duty", rating: 4.5, incidents: 0, phone: "+255 712 000 103", email: "j.mwakalinga@sgr.tz" },
  { id: "s4",  name: "Capt. Faraja Mbwambo",  rank: "Section Command", zone: "Kilosa — Gulwe",    teams: 2, officers: 12, online: true,  status: "On duty",  rating: 4.8, incidents: 1, phone: "+255 712 000 104", email: "f.mbwambo@sgr.tz" },
  { id: "s5",  name: "Lt. Mariam Kessy",      rank: "Field Officer",   zone: "Gulwe — Dodoma",    teams: 2, officers: 10, online: true,  status: "On duty",  rating: 4.6, incidents: 0, phone: "+255 712 000 105", email: "m.kessy@sgr.tz" },
  { id: "s6",  name: "Maj. Daniel Ngowi",     rank: "Section Command", zone: "Dar — Pugu",        teams: 3, officers: 18, online: true,  status: "Briefing", rating: 5.0, incidents: 1, phone: "+255 712 000 106", email: "d.ngowi@sgr.tz" },
  { id: "s7",  name: "Capt. Fatma Said",      rank: "Section Command", zone: "Pugu — Soga",       teams: 2, officers: 12, online: true,  status: "On duty",  rating: 4.4, incidents: 3, phone: "+255 712 000 107", email: "f.said@sgr.tz" },
  { id: "s8",  name: "Lt. Hamida Juma",       rank: "Field Officer",   zone: "Soga — Ruvu",       teams: 1, officers: 8,  online: false, status: "Off duty", rating: 4.3, incidents: 0, phone: "+255 712 000 108", email: "h.juma@sgr.tz" },
  { id: "s9",  name: "Capt. Rehema Bakari",   rank: "Section Command", zone: "Ngerengere",        teams: 4, officers: 20, online: true,  status: "On duty",  rating: 4.8, incidents: 0, phone: "+255 712 000 109", email: "r.bakari@sgr.tz" },
  { id: "s10", name: "Maj. Joseph Lyimo",     rank: "Section Command", zone: "Morogoro Yard",     teams: 3, officers: 17, online: true,  status: "Briefing", rating: 4.6, incidents: 2, phone: "+255 712 000 110", email: "j.lyimo@sgr.tz" },
  { id: "s11", name: "Lt. Asha Mwakyusa",     rank: "Field Officer",   zone: "Kilosa Station",    teams: 1, officers: 9,  online: true,  status: "On duty",  rating: 4.5, incidents: 1, phone: "+255 712 000 111", email: "a.mwakyusa@sgr.tz" },
  { id: "s12", name: "Capt. Salim Komba",     rank: "Section Command", zone: "Gulwe — Igandu",    teams: 2, officers: 13, online: false, status: "Off duty", rating: 4.2, incidents: 0, phone: "+255 712 000 112", email: "s.komba@sgr.tz" },
  { id: "s13", name: "Maj. Pendo Massawe",    rank: "Section Command", zone: "Igandu — Dodoma",   teams: 3, officers: 19, online: true,  status: "On duty",  rating: 4.9, incidents: 1, phone: "+255 712 000 113", email: "p.massawe@sgr.tz" },
  { id: "s14", name: "Lt. Baraka Lyimo",      rank: "Field Officer",   zone: "Dodoma Central",    teams: 1, officers: 7,  online: true,  status: "On duty",  rating: 4.4, incidents: 0, phone: "+255 712 000 114", email: "b.lyimo@sgr.tz" },
  { id: "s15", name: "Capt. Zubeda Iddi",     rank: "Section Command", zone: "Makutupora",        teams: 2, officers: 11, online: false, status: "Off duty", rating: 4.1, incidents: 0, phone: "+255 712 000 115", email: "z.iddi@sgr.tz" },
  { id: "s16", name: "Maj. Neema Mushi",      rank: "Section Command", zone: "Corridor Reserve",  teams: 2, officers: 15, online: true,  status: "Briefing", rating: 4.7, incidents: 2, phone: "+255 712 000 116", email: "n.mushi@sgr.tz" },
];

export type RosterOfficer = {
  id: string;
  name: string;
  role: string;
  team: string;
  section: string;
  status: "Active" | "Idle" | "SOS" | "Offline";
  checkin: string;
  phone: string;
};

export const ROSTER: RosterOfficer[] = [
  { id: "r1",  name: "Asha Ndimbo",      role: "Team Lead",     team: "Alpha-01",   section: "Dar es Salaam", status: "Active",  checkin: "2 min ago",  phone: "+255 713 000 201" },
  { id: "r2",  name: "Juma Kileo",       role: "Field Officer", team: "Alpha-01",   section: "Pugu",          status: "Active",  checkin: "5 min ago",  phone: "+255 713 000 202" },
  { id: "r3",  name: "Neema Massawe",    role: "K9 Handler",    team: "Alpha-01",   section: "Soga",          status: "Idle",    checkin: "14 min ago", phone: "+255 713 000 203" },
  { id: "r4",  name: "Hassan Mwakyusa",  role: "Field Officer", team: "Bravo-02",   section: "Ruvu",          status: "Active",  checkin: "1 min ago",  phone: "+255 713 000 204" },
  { id: "r5",  name: "Grace Mwakalinga", role: "Medic",         team: "Bravo-02",   section: "Ngerengere",    status: "Active",  checkin: "3 min ago",  phone: "+255 713 000 205" },
  { id: "r6",  name: "Peter Mhina",      role: "Field Officer", team: "Charlie-03", section: "Morogoro",      status: "SOS",     checkin: "Just now",   phone: "+255 713 000 206" },
  { id: "r7",  name: "Salma Othman",     role: "Field Officer", team: "Charlie-03", section: "Kilosa",        status: "Active",  checkin: "6 min ago",  phone: "+255 713 000 207" },
  { id: "r8",  name: "Brian Lema",       role: "Field Officer", team: "Delta-04",   section: "Gulwe",         status: "Offline", checkin: "1 h ago",    phone: "+255 713 000 208" },
  { id: "r9",  name: "Mariam Hamisi",    role: "Team Lead",     team: "Bravo-02",   section: "Ruvu",          status: "Active",  checkin: "4 min ago",  phone: "+255 713 000 209" },
  { id: "r10", name: "Daniel Sanga",     role: "Field Officer", team: "Delta-04",   section: "Igandu",        status: "Idle",    checkin: "19 min ago", phone: "+255 713 000 210" },
  { id: "r11", name: "Faraja Komba",     role: "K9 Handler",    team: "Echo-05",    section: "Dodoma",        status: "Active",  checkin: "7 min ago",  phone: "+255 713 000 211" },
  { id: "r12", name: "Lulu Mwakasege",   role: "Field Officer", team: "Charlie-03", section: "Kilosa",        status: "Active",  checkin: "9 min ago",  phone: "+255 713 000 212" },
  { id: "r13", name: "Baraka Iddi",      role: "Medic",         team: "Echo-05",    section: "Dodoma",        status: "Active",  checkin: "2 min ago",  phone: "+255 713 000 213" },
  { id: "r14", name: "Zainab Ally",      role: "Field Officer", team: "Alpha-01",   section: "Dar es Salaam", status: "Offline", checkin: "2 h ago",    phone: "+255 713 000 214" },
  { id: "r15", name: "Emmanuel Joseph",  role: "Team Lead",     team: "Charlie-03", section: "Morogoro",      status: "Active",  checkin: "1 min ago",  phone: "+255 713 000 215" },
  { id: "r16", name: "Rehema Paul",      role: "Field Officer", team: "Delta-04",   section: "Gulwe",         status: "Idle",    checkin: "23 min ago", phone: "+255 713 000 216" },
  { id: "r17", name: "Hamisi Bakari",    role: "Field Officer", team: "Echo-05",    section: "Igandu",        status: "Active",  checkin: "8 min ago",  phone: "+255 713 000 217" },
  { id: "r18", name: "Neema Kessy",      role: "K9 Handler",    team: "Bravo-02",   section: "Ngerengere",    status: "Active",  checkin: "11 min ago", phone: "+255 713 000 218" },
  { id: "r19", name: "John Mbwambo",     role: "Field Officer", team: "Alpha-01",   section: "Soga",          status: "Active",  checkin: "3 min ago",  phone: "+255 713 000 219" },
  { id: "r20", name: "Fatma Lyimo",      role: "Medic",         team: "Delta-04",   section: "Igandu",        status: "Active",  checkin: "5 min ago",  phone: "+255 713 000 220" },
  { id: "r21", name: "Salim Ngowi",      role: "Field Officer", team: "Charlie-03", section: "Kilosa",        status: "Offline", checkin: "3 h ago",    phone: "+255 713 000 221" },
  { id: "r22", name: "Pendo Said",       role: "Field Officer", team: "Echo-05",    section: "Dodoma",        status: "Idle",    checkin: "27 min ago", phone: "+255 713 000 222" },
  { id: "r23", name: "Asha Massawe",     role: "Team Lead",     team: "Delta-04",   section: "Gulwe",         status: "Active",  checkin: "2 min ago",  phone: "+255 713 000 223" },
  { id: "r24", name: "Brian Othman",     role: "Field Officer", team: "Bravo-02",   section: "Ruvu",          status: "Active",  checkin: "6 min ago",  phone: "+255 713 000 224" },
];

export type Team = {
  id: string;
  name: string;
  code: string;
  section: string;
  members: number;
  online: number;
  incidents: number;
  status: "operational" | "alert" | "standby";
};

export const TEAMS: Team[] = [
  { id: "t1", name: "Alpha",   code: "ALPHA-01",   section: "Dar — Soga",       members: 8, online: 7, incidents: 2, status: "operational" },
  { id: "t2", name: "Bravo",   code: "BRAVO-02",   section: "Ruvu — Ngerengere",members: 8, online: 6, incidents: 1, status: "operational" },
  { id: "t3", name: "Charlie", code: "CHARLIE-03", section: "Morogoro — Kilosa",members: 8, online: 8, incidents: 3, status: "alert"       },
  { id: "t4", name: "Delta",   code: "DELTA-04",   section: "Kilosa — Igandu",  members: 8, online: 5, incidents: 1, status: "operational" },
  { id: "t5", name: "Echo",    code: "ECHO-05",    section: "Igandu — Dodoma",  members: 8, online: 6, incidents: 0, status: "standby"     },
];

export const ACTIVITY = [
  { id: "a1", time: "Just now",  text: "SOS triggered by Lulu Mwakasege near Kilosa",            tone: "danger" as const },
  { id: "a2", time: "4 min",     text: "Train SGR-EXP-01 passed Morogoro on schedule",            tone: "info" as const },
  { id: "a3", time: "12 min",    text: "Bravo-02 completed patrol of Ngerengere section",         tone: "success" as const },
  { id: "a4", time: "28 min",    text: "Supervisor Rehema Sanga acknowledged RPT-2840",           tone: "info" as const },
  { id: "a5", time: "1 hr",      text: "Alpha-01 checked in — all members present",               tone: "success" as const },
  { id: "a6", time: "2 hr",      text: "Track maintenance request filed for KM-204",              tone: "warning" as const },
];

export const REPORTS_TREND = [
  { day: "Mon", submitted: 8,  resolved: 6 },
  { day: "Tue", submitted: 12, resolved: 10 },
  { day: "Wed", submitted: 9,  resolved: 11 },
  { day: "Thu", submitted: 14, resolved: 12 },
  { day: "Fri", submitted: 11, resolved: 9 },
  { day: "Sat", submitted: 7,  resolved: 8 },
  { day: "Sun", submitted: 10, resolved: 9 },
];

export const GOOGLE_MAPS_KEY = "AIzaSyDylBIC67mynYAU6MgrCDaPcZvaPN2efCs";

export type SosAlert = {
  id: string;
  reporter: string;
  role: string;
  team: string;
  section: string;
  phone: string;
  message: string;
  time: string;
  battery: number;
  status: "Active" | "Responding" | "Resolved";
  lat: number;
  lng: number;
};

export const SOS_ALERTS: SosAlert[] = [
  {
    id: "sos1",
    reporter: "Lulu Mwakasege",
    role: "Field Officer",
    team: "Charlie-03",
    section: "Kilosa",
    phone: "+255 712 555 901",
    message: "Confronted by armed group near signal box. Need immediate backup.",
    time: "Just now",
    battery: 64,
    status: "Active",
    lat: -6.836,
    lng: 36.984,
  },
  {
    id: "sos2",
    reporter: "Peter Mhina",
    role: "Field Officer",
    team: "Charlie-03",
    section: "Kidete · KM 287",
    phone: "+255 713 000 206",
    message: "Lone officer pressed panic button. No voice response on radio.",
    time: "3 min ago",
    battery: 12,
    status: "Responding",
    lat: -6.9,
    lng: 36.6,
  },
  {
    id: "sos3",
    reporter: "Asha Mwakyusa",
    role: "Field Officer",
    team: "Bravo-02",
    section: "Ngerengere",
    phone: "+255 713 000 204",
    message: "Medical emergency — officer collapsed during patrol.",
    time: "12 min ago",
    battery: 78,
    status: "Responding",
    lat: -6.756,
    lng: 38.124,
  },
];

export type Notification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "danger" | "warning" | "info" | "success";
  unread: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "SOS triggered", detail: "Lulu Mwakasege near Kilosa signal box", time: "Just now", tone: "danger", unread: true },
  { id: "n2", title: "High-priority incident", detail: "RPT-2840 · Fence cut detected, Kilosa", time: "22 min ago", tone: "warning", unread: true },
  { id: "n3", title: "Patrol completed", detail: "Bravo-02 cleared Ngerengere section", time: "38 min ago", tone: "success", unread: true },
  { id: "n4", title: "Supervisor acknowledged", detail: "Rehema Sanga acknowledged RPT-2840", time: "1 hr ago", tone: "info", unread: false },
  { id: "n5", title: "Maintenance request", detail: "Track maintenance filed for KM-204", time: "2 hr ago", tone: "warning", unread: false },
];
