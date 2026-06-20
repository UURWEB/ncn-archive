const out = document.getElementById('terminal-output');
const input = document.getElementById('command');
const CLEARANCE_KEY = 'ncn_archive_clearance';
const ROUTE_KEY = 'ncn_archive_last_route';
let level = Math.max(0, Math.min(3, Number(localStorage.getItem(CLEARANCE_KEY) || 0)));

const files = {
  'ledger-7': {
    clearance: 1,
    title: 'LEDGER 7 / NOBLECREST MUNICIPAL CONTINUITY',
    stamp: 'ARCHIVE COPY — PARTIALLY CORRUPTED',
    body: `The public evacuation order was issued twelve minutes after the continuity convoy departed Noblecrest. The convoy manifest lists eleven civil officers, three radio technicians, one Valorian observer, and four sealed CIS cases. A twelfth civil officer appears in the fuel register but not the manifest.\n\nMargin note: “Do not search the northern platform. The white corridor still answers.”`
  },
  'map-room': {
    clearance: 1,
    title: 'NOBLECREST SIGNAL MAP / SERVICE GRID',
    stamp: 'NCN INFRASTRUCTURE DIRECTORATE',
    body: `Relay NC-14 remained active after the final public broadcast. Surviving traffic crossed the Noblecrest civic exchange, the old rail ministry, and an unidentified repeater beneath Crest Hill.\n\nThe phrase CREST 14 appears on every recovered routing sheet. It is not a district number.`
  },
  'relay-log': {
    clearance: 1,
    title: 'RELAY NC-14 AUTOMATED LOG',
    stamp: 'RECOVERED FROM MIRROR 04',
    body: `22:41:09  Carrier restored.\n22:41:10  Handshake received from NOBLECREST-CIVIC.\n22:41:12  Unknown operator requested route WHITE.\n22:41:13  Request denied: corridor phrase incomplete.\n22:41:20  Seven memorial headers copied to citizen-services cache.\n22:41:27  Remote node PRES-Z ceased advertising.`
  },
  'manifest-12': {
    clearance: 1,
    title: 'CONVOY MANIFEST 12 / DISCREPANCY REPORT',
    stamp: 'MINISTRY OF RECORDS — INTERNAL',
    body: `Passenger twelve was entered only as “N.C.” The handwriting differs from the remainder of the document. The same initials appear beside a crate transferred from the old Parliament archive.\n\nDestination: NORTH PLATFORM / SERVICE ACCESS 7.\nAuthorization: WHITE CORRIDOR.`
  },
  'white-corridor': {
    clearance: 2,
    title: 'PROJECT WHITE CORRIDOR',
    stamp: 'RESTRICTED / EYES OF THE PRESIDIUM',
    body: `White Corridor was a succession protocol, not a bunker. It distributed identity records, seals, treasury keys, and prerecorded orders among civilian terminals so that no single raid could erase the Confederation.\n\nThe system was designed to recognize the phrase used at the final Noblecrest cabinet meeting. The surviving transcript omits the phrase, but the first letters of the seven public memorial notices preserve it.`
  },
  'continuity': {
    clearance: 2,
    title: 'CONTINUITY COMMITTEE — INTERNAL MINUTES',
    stamp: 'UNRELEASED DRAFT',
    body: `The committee rejected immediate restoration. Members feared that declaring a successor state would turn scattered loyalists into targets and invite another northern war. Instead, the network was ordered to become archival: preserve, observe, wait.\n\nOne member dissented and formed the Noblecrest Restoration Circle. Their emblem inverted the national flag: white-red-white.`
  },
  'presidium-minutes': {
    clearance: 2,
    title: 'FINAL PRESIDIUM MINUTES / FRAGMENT',
    stamp: 'TRANSCRIPT DAMAGED',
    body: `The Presiding Minister ordered the civic network separated from military command. The archive was to survive, but no automated decree could begin a war or proclaim a successor government.\n\nRecovered exchange:\n— “Then Noble dies tonight?”\n— “No. Noble is not dead. It is waiting to be remembered correctly.”`
  },
  'root-index': {
    clearance: 3,
    title: 'ROOT INDEX / NODE NOBLECREST',
    stamp: 'SYSTEM LEVEL: PRESIDIUM ZERO',
    body: `You have reached the continuity root. The archive was never abandoned. It was mirrored.\n\nNODE STATUS: dormant\nPUBLIC GOVERNMENT: dissolved\nLEGAL CLAIM: unresolved\nSUCCESSOR AUTHORITY: none recognized\n\nFinal instruction: “Noble is not dead. Noble is waiting to be remembered correctly.”`
  },
  'remnant-orders': {
    clearance: 3,
    title: 'REJECTED ORDER 44-B',
    stamp: 'DO NOT TRANSMIT',
    body: `Order 44-B proposed attacks on U.U.R. civil infrastructure to force recognition of an NCN successor. The continuity committee rejected the proposal as criminal, strategically useless, and contrary to the old confederate charter.\n\nThe authors were expelled. Later remnant groups continued to quote the order without its rejection page.`
  },
  'mirror-seed': {
    clearance: 3,
    title: 'MIRROR SEED / PRES-Z',
    stamp: 'ROOT ROUTE OPEN',
    body: `Mirror Seed contains no executive authority. It is a verification key proving that surviving copies descend from the final Noblecrest archive.\n\nAuthorized mirrors recorded in the final archive: NOBLECREST-04, NC14-CIVIC, CIS-LEGACY-2, VAL-OBS-1.\n\nOne modern mirror is responding without a recognized signature.`
  }
};

const routes = {
  'relay-nc14': { clearance: 1, path: 'system/r04-nc14-17.html', title: 'Relay NC-14 service console' },
  'manifest-12': { clearance: 1, path: 'system/m12-continuity-copy.html', title: 'Convoy manifest twelve' },
  'white-corridor': { clearance: 2, path: 'system/wc7-service-status.html', title: 'White Corridor protocol page' },
  'continuity': { clearance: 2, path: 'system/committee-archive-7.html', title: 'Continuity Committee archive' },
  'presidium-zero': { clearance: 3, path: 'system/pz-root-mirror.html', title: 'Presidium Zero root mirror' },
  'order-44b': { clearance: 3, path: 'system/rejected-44b.html', title: 'Rejected Order 44-B' }
};

const nodes = {
  noblecrest: '12ms — archive mirror responding',
  'nc-14': '41ms — intermittent carrier detected',
  valoria: 'timeout — foreign observer relay closed',
  cis: '88ms — legacy handshake only',
  'uur-archive': '7ms — public preservation mirror online',
  'pres-z': () => level >= 3 ? '3ms — ROOT ROUTE OPEN' : 'denied — route not advertised'
};

const mail = [
  { id: '01', c: 0, from: 'records@ncn-gov.nc', subject: 'Archive duplication order', body: 'All provincial offices must retain a local copy of civil registers before the next transfer window.' },
  { id: '02', c: 1, from: 'relay14@ncn-gov.nc', subject: 'Carrier anomaly', body: 'The twelve-second tone is not random. It repeats whenever the northern platform circuit closes.' },
  { id: '03', c: 2, from: 'presidium@ncn-gov.nc', subject: 'Continuity is not restoration', body: 'Preservation of records does not authorize anyone to revive the state or speak in its name.' },
  { id: '04', c: 3, from: 'pres-z@localhost', subject: 'Unsigned mirror', body: 'A node calling itself NOBLE-RETURN has requested the seed. Signature mismatch. Do not answer.' }
];

function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function authorizationLevel(text) {
  const hash = fnv1a(text.trim().toUpperCase());
  if (hash === 2969824610) return 1;
  if (hash === 2661789995) return 2;
  if (hash === 1943443499) return 3;
  return 0;
}

function line(text = '', className = '') {
  const div = document.createElement('div');
  div.className = `term-line ${className}`.trim();
  div.textContent = text;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

function block(text = '', className = '') {
  String(text).split('\n').forEach(part => line(part, className));
}

function saveLevel(next) {
  level = Math.max(level, next);
  localStorage.setItem(CLEARANCE_KEY, String(level));
}

function visibleFiles() {
  return Object.entries(files).filter(([, file]) => file.clearance <= level);
}

function visibleRoutes() {
  return Object.entries(routes).filter(([, route]) => route.clearance <= level);
}

function statusObject() {
  return {
    ok: true,
    node: 'NOBLECREST-ARCHIVE-04',
    mode: 'STATIC MIRROR RECONSTRUCTION',
    capture: 'UNDATED ARCHIVE MIRROR',
    clearance: level,
    mirrored: true,
    network: 'SIMULATED FROM RECOVERED RECORDS',
    message: level ? 'Authenticated archive session active.' : 'Public archive session.'
  };
}

function printHelp() {
  block(`HELP                   Show command list
STATUS                 Display archive node status
WHOAMI                  Show current reconstructed user
AUTH <passphrase>       Request higher archive clearance
DIR or LIST             List readable files
OPEN <file-id>          Read a recovered file
ROUTES                  List restored hidden web routes
ROUTE <route-id>        Open a restored hidden page
NODES                   List known legacy nodes
PING <node>             Query a legacy node
TRACE <node>            Reconstruct a route trace
LOGS [system|relay]     Read simulated service logs
MAIL                    List readable archived messages
READMAIL <id>           Read an archived message
HISTORY                 Show recent commands
CLEAR                   Clear terminal
LOGOUT                  Clear archive authorization
REBOOT                  Restart terminal display`);
}

function printDirectory() {
  const visible = visibleFiles();
  if (!visible.length) {
    block('No restricted files visible. Public archive only.\nUse AUTH <passphrase> after finding an access phrase.');
    return;
  }
  block(`CLEARANCE ${level} FILE INDEX:`);
  visible.forEach(([id, file]) => line(`${id.padEnd(20)} [C${file.clearance}] ${file.title}`));
}

function printRoutes() {
  const visible = visibleRoutes();
  if (!visible.length) {
    line('No reconstructed web routes visible at current clearance.');
    return;
  }
  block(`RESTORED ROUTES AT CLEARANCE ${level}:`);
  visible.forEach(([id, route]) => line(`${id.padEnd(20)} [C${route.clearance}] ${route.title}`));
  line('Use ROUTE <route-id> to open a page.');
}

function printLogs(type = 'system') {
  if (type === 'relay') {
    block(`RELAY NC-14 / LAST 8 EVENTS
22:40:58 carrier idle
22:41:09 civic handshake accepted
22:41:12 route WHITE requested
22:41:13 phrase fragment rejected
22:41:20 memorial cache duplicated
22:41:27 PRES-Z route withdrawn
22:42:04 foreign observer node timed out
22:44:00 archive mirror entered dormant mode`);
    return;
  }
  block(`NOBLECREST-ARCHIVE-04 / SERVICE LOG
[OK] public mirror mounted
[OK] Noblecrest records indexed
[WARN] six routes excluded from public sitemap
[WARN] identity service replaced by local reconstruction
[INFO] current clearance ${level}
[INFO] no live government network connected`);
}

function listMail() {
  const visible = mail.filter(message => message.c <= level);
  block(`ARCHIVED MAILBOX — ${visible.length} MESSAGE(S)`);
  visible.forEach(message => line(`${message.id}  [C${message.c}]  ${message.from.padEnd(25)}  ${message.subject}`));
  line('Use READMAIL <id>.');
}

function traceNode(node) {
  const key = node.toLowerCase();
  if (!nodes[key]) return line(`TRACE FAILED: ${node} is not in the recovered host table.`);
  if (key === 'pres-z' && level < 3) return block('TRACE pres-z\n  1 noblecrest-public [12ms]\n  2 route withheld [DENIED]\nTrace terminated by archive policy.');
  const endings = {
    noblecrest: 'NOBLECREST-ARCHIVE-04',
    'nc-14': 'CREST-HILL-RELAY/NC14',
    valoria: 'VAL-OBS-1 [NO RESPONSE]',
    cis: 'CIS-LEGACY-2 [HANDSHAKE ONLY]',
    'uur-archive': 'UUR-PUBLIC-RECORDS',
    'pres-z': 'PRESIDIUM-ZERO/ROOT'
  };
  block(`TRACE ${key}\n  1 local-reconstruction [0ms]\n  2 noblecrest-civic [12ms]\n  3 ${endings[key]} [${key === 'pres-z' ? '3' : '41'}ms]\nTrace complete.`);
}

function boot() {
  out.innerHTML = '';
  block('NCN CIVIL ARCHIVE TERMINAL 3.1.7');
  block('Northern Confederate Nations Civil Systems');
  block('Recovered Noblecrest command interpreter');
  block('--------------------------------------------');
  block(`NODE: NOBLECREST-ARCHIVE-04\nARCHIVE CAPTURE: UNDATED MIRROR\nSESSION CLEARANCE: ${level}\nNETWORK MODE: STATIC RECONSTRUCTION\n`);
  block('Type HELP for available commands.');
}

function run(raw) {
  const original = raw.trim();
  if (!original) return;
  line(`NCN:\\ARCHIVE> ${original}`, 'command-echo');
  const parts = original.split(/\s+/);
  const cmd = parts.shift().toUpperCase();
  const arg = parts.join(' ');

  if (cmd === 'HELP' || cmd === '?') return printHelp();
  if (cmd === 'CLEAR' || cmd === 'CLS') { out.innerHTML = ''; return; }
  if (cmd === 'REBOOT') return boot();
  if (cmd === 'HISTORY') return block(JSON.parse(localStorage.getItem('ncn_history') || '[]').join('\n') || 'No command history.');
  if (cmd === 'STATUS') return block(JSON.stringify(statusObject(), null, 2));
  if (cmd === 'WHOAMI') return block(`USER: ${level ? `ARCHIVE-CLEARANCE-${level}` : 'PUBLIC-MIRROR'}\nNODE: NOBLECREST-ARCHIVE-04\nAUTHORITY: historical reconstruction only`);
  if (cmd === 'DATE') return block('No calendar metadata was preserved in this archive mirror.');
  if (cmd === 'AUTH') {
    if (!arg) return line('USAGE: AUTH <passphrase>');
    const next = authorizationLevel(arg);
    if (!next) return line('ACCESS PHRASE REJECTED.');
    const previous = level;
    saveLevel(next);
    return block(`CLEARANCE ${level} ACCEPTED.\n${level > previous ? 'New files and routes are now visible.' : 'Session already holds equal or higher clearance.'}`);
  }
  if (cmd === 'DIR' || cmd === 'LIST') return printDirectory();
  if (cmd === 'OPEN' || cmd === 'TYPE') {
    if (!arg) return line('USAGE: OPEN <file-id>');
    const id = arg.toLowerCase();
    const file = files[id];
    if (!file) return line('FILE NOT FOUND.');
    if (level < file.clearance) return line('INSUFFICIENT CLEARANCE.');
    return block(`\n=== ${file.title} ===\n${file.stamp}\n\n${file.body}\n\n=== END FILE ===`);
  }
  if (cmd === 'ROUTES' || (cmd === 'DIR' && arg.toUpperCase() === 'WEB')) return printRoutes();
  if (cmd === 'ROUTE' || cmd === 'CONNECT') {
    if (!arg) return line('USAGE: ROUTE <route-id>');
    const id = arg.toLowerCase();
    const route = routes[id];
    if (!route) return line('ROUTE NOT FOUND IN RECOVERED TABLE.');
    if (level < route.clearance) return line('ROUTE EXISTS BUT IS NOT ADVERTISED AT THIS CLEARANCE.');
    localStorage.setItem(ROUTE_KEY, id);
    line(`OPENING ${id} ...`);
    window.location.href = route.path;
    return;
  }
  if (cmd === 'NODES') {
    block('RECOVERED HOST TABLE:');
    Object.keys(nodes).forEach(node => line(`  ${node}`));
    return;
  }
  if (cmd === 'PING') {
    if (!arg) return line('USAGE: PING <node>');
    const key = arg.toLowerCase();
    const result = nodes[key];
    return line(`${key}: ${result ? (typeof result === 'function' ? result() : result) : 'unresolved host'}`);
  }
  if (cmd === 'TRACE' || cmd === 'TRACERT') {
    if (!arg) return line('USAGE: TRACE <node>');
    return traceNode(arg);
  }
  if (cmd === 'LOGS') return printLogs((arg || 'system').toLowerCase());
  if (cmd === 'MAIL') return listMail();
  if (cmd === 'READMAIL') {
    if (!arg) return line('USAGE: READMAIL <id>');
    const message = mail.find(item => item.id === arg.padStart(2, '0'));
    if (!message) return line('MESSAGE NOT FOUND.');
    if (level < message.c) return line('INSUFFICIENT CLEARANCE.');
    return block(`FROM: ${message.from}\nSUBJECT: ${message.subject}\nCLEARANCE: ${message.c}\n\n${message.body}`);
  }
  if (cmd === 'LOGOUT') {
    localStorage.removeItem(CLEARANCE_KEY);
    localStorage.removeItem(ROUTE_KEY);
    level = 0;
    return line('SESSION CLEARED. PUBLIC MIRROR ACCESS ONLY.');
  }
  if (cmd === 'MAN' && arg.toUpperCase() === 'PRESIDIUM') return block('MANUAL PAGE MISSING. RECOVERY NOTE: the root phrase was spoken, not typed into the original system.');
  if (cmd === 'RESTORE' && arg.toUpperCase() === 'NOBLECREST') {
    if (level < 3) return line('RESTORE DENIED: PRESIDIUM ZERO CLEARANCE REQUIRED.');
    return block('RESTORE REQUEST RECORDED.\nNo sovereign authority is attached to this archive.\nOperation cancelled by final cabinet safeguard.');
  }
  return line(`'${cmd}' is not recognized. Type HELP.`);
}

input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const raw = input.value;
    input.value = '';
    const history = JSON.parse(localStorage.getItem('ncn_history') || '[]');
    history.push(raw);
    localStorage.setItem('ncn_history', JSON.stringify(history.slice(-40)));
    run(raw);
  }
});

boot();
input.focus();
document.addEventListener('click', () => input.focus());
