// Generated from src modules for the classic GitHub Pages build.

// ---- src/ui/dom.js ----
/** @param {string} id */
const $ = (id) => document.getElementById(id);

// ---- src/ui/screens.js ----
const SCREENS = ['sh', 'sprogress', 'schar', 'ssms', 'sn', 's3', 's4', 'sso'];

/** @param {string} id @param {string} [d] */
function show(id, d) {
  SCREENS.forEach((s) => {
    const el = $(s);
    if (el) el.style.display = 'none';
  });
  const target = $(id);
  if (target) target.style.display = d || 'block';
}

// ---- src/core/GameState.js ----
const SAVE_KEY = 'cl5';
const SAVE_VERSION = 1;
const SAVE_MIRROR_KEYS = ['carrowLakeSave', 'carrow-lake-save-v1'];

/** @type {{ version?: number, char: string|null, scene: number, narrIdx: number, progress: Record<string, { unlocked: boolean, at: number }>, newsSeen: boolean, newsSeenVersion?: string|null, homeWallpaper?: string }} */
let gs = { char: null, scene: 1, narrIdx: 0 };

function baseState() {
  return {
    version: SAVE_VERSION,
    char: null,
    scene: 1,
    narrIdx: 0,
    progress: {},
    newsSeen: false,
    newsSeenVersion: null,
    homeWallpaper: 'default',
  };
}

/** Remplace l'état courant (réassignation équivalente à l'ancien `gs = …`). */
function replaceGs(next) {
  Object.keys(gs).forEach((k) => delete gs[k]);
  Object.assign(gs, next);
}

replaceGs(Object.assign(baseState(), gs));

/** @type {() => void | Promise<void>} */
let afterNormalizeHook = () => {};

/** @param {() => void | Promise<void>} fn */
function setAfterNormalizeHook(fn) {
  afterNormalizeHook = fn;
}

function normalizeSave() {
  replaceGs(Object.assign(baseState(), gs || {}));
  if (!gs.version) gs.version = SAVE_VERSION;
  if (!gs.progress || typeof gs.progress !== 'object' || Array.isArray(gs.progress)) {
    gs.progress = {};
  }
  gs.newsSeen = !!gs.newsSeen;
  if (typeof gs.newsSeenVersion !== 'string') gs.newsSeenVersion = null;
  if (typeof gs.homeWallpaper !== 'string') gs.homeWallpaper = 'default';
}

async function sv() {
  const data = JSON.stringify(gs);
  try {
    localStorage.setItem(SAVE_KEY, data);
    SAVE_MIRROR_KEYS.forEach((key) => localStorage.setItem(key, data));
  } catch (e) {
    /* ignore */
  }
  try {
    if (window.storage) await window.storage.set(SAVE_KEY, data);
  } catch (e) {
    /* ignore */
  }
}

async function ld() {
  try {
    const saved =
      localStorage.getItem(SAVE_KEY) ||
      SAVE_MIRROR_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    if (saved) replaceGs(JSON.parse(saved));
  } catch (e) {
    /* ignore */
  }
  try {
    if (window.storage) {
      const r = await window.storage.get(SAVE_KEY);
      if (r) replaceGs(JSON.parse(r.value));
    }
  } catch (e) {
    /* ignore */
  }
  normalizeSave();
  await afterNormalizeHook();
}

async function cl() {
  try {
    localStorage.removeItem(SAVE_KEY);
    SAVE_MIRROR_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    /* ignore */
  }
  try {
    if (window.storage) await window.storage.delete(SAVE_KEY);
  } catch (e) {
    /* ignore */
  }
  replaceGs(baseState());
}

async function restartStoryKeepProgress() {
  const progress = gs.progress || {};
  const newsSeen = !!gs.newsSeen;
  const newsSeenVersion = typeof gs.newsSeenVersion === 'string' ? gs.newsSeenVersion : null;
  const homeWallpaper = typeof gs.homeWallpaper === 'string' ? gs.homeWallpaper : 'default';
  replaceGs(Object.assign(baseState(), { progress, newsSeen, newsSeenVersion, homeWallpaper }));
  await sv();
}

// ---- src/core/AudioBus.js ----
/** Bus audio partagé (Web Audio API). */
const s3Audio = {
  ctx: /** @type {AudioContext|null} */ (null),
  master: /** @type {GainNode|null} */ (null),
  ambientGain: /** @type {GainNode|null} */ (null),
  ambientOscs: /** @type {OscillatorNode[]} */ ([]),
  tickLive: false,
  tickTimer: /** @type {ReturnType<typeof setInterval>|null} */ (null),
  started: false,
};

let globalAudio = { started: false, gain: null, noise: null, drone: null, gustTimer: null };
let s2Audio = { started: false, gain: null, osc: null, timers: [] };

function s3Ctx() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!s3Audio.ctx) {
      s3Audio.ctx = new AC();
      s3Audio.master = s3Audio.ctx.createGain();
      s3Audio.master.gain.value = 0.55;
      s3Audio.master.connect(s3Audio.ctx.destination);
    }
    if (s3Audio.ctx.state === 'suspended') s3Audio.ctx.resume();
    return s3Audio.ctx;
  } catch (e) {
    return null;
  }
}

function s3Tone(freq, dur, type, gain) {
  const ctx = s3Ctx();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type || 'sine';
  o.frequency.value = freq;
  g.gain.value = 0;
  o.connect(g);
  g.connect(s3Audio.master);
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain || 0.035, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.start(now);
  o.stop(now + dur + 0.03);
}

function s3Noise(dur, gain, filterFreq) {
  const ctx = s3Ctx();
  if (!ctx) return;
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const f = ctx.createBiquadFilter();
  src.buffer = buf;
  f.type = 'lowpass';
  f.frequency.value = filterFreq || 700;
  g.gain.value = gain || 0.04;
  src.connect(f);
  f.connect(g);
  g.connect(s3Audio.master);
  src.start();
}

function globalStartAmbience() {
  const ctx = s3Ctx();
  if (!ctx || globalAudio.started) return;
  globalAudio.started = true;
  globalAudio.gain = ctx.createGain();
  globalAudio.gain.gain.value = 0;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 430;
  const len = Math.max(1, Math.floor(ctx.sampleRate * 4));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  globalAudio.noise = ctx.createBufferSource();
  globalAudio.noise.buffer = buf;
  globalAudio.noise.loop = true;
  globalAudio.drone = ctx.createOscillator();
  globalAudio.drone.type = 'sine';
  globalAudio.drone.frequency.value = 54;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.22;
  globalAudio.noise.connect(noiseFilter);
  noiseFilter.connect(globalAudio.gain);
  globalAudio.drone.connect(droneGain);
  droneGain.connect(globalAudio.gain);
  globalAudio.gain.connect(s3Audio.master);
  globalAudio.noise.start();
  globalAudio.drone.start();
  globalAudio.gain.gain.setTargetAtTime(0.018, ctx.currentTime, 2.8);
  globalAudio.gustTimer = setInterval(() => s3Noise(1.8, 0.018, 250), 7800);
}

function s2Timer(fn, ms) {
  const id = setTimeout(fn, ms);
  s2Audio.timers.push({ id, type: 'timeout' });
  return id;
}

function s2Interval(fn, ms) {
  const id = setInterval(fn, ms);
  s2Audio.timers.push({ id, type: 'interval' });
  return id;
}

function s2StartAmbience() {
  if (s2Audio.started) return;
  const ctx = s3Ctx();
  if (!ctx) return;
  s2Audio.started = true;
  s2Audio.gain = ctx.createGain();
  s2Audio.gain.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 360;
  s2Audio.osc = ctx.createOscillator();
  s2Audio.osc.type = 'sine';
  s2Audio.osc.frequency.value = 86;
  s2Audio.osc.connect(filter);
  filter.connect(s2Audio.gain);
  s2Audio.gain.connect(s3Audio.master);
  s2Audio.osc.start();
  s2Audio.gain.gain.setTargetAtTime(0.035, ctx.currentTime, 2.5);
  s2Interval(() => {
    s3Tone(3200 + Math.random() * 700, 0.045, 'sine', 0.01);
  }, 2400);
  s2Interval(() => {
    s3Noise(0.45, 0.024, 520);
  }, 5200);
}

function s2StopAmbience() {
  if (!s2Audio.started) return;
  const ctx = s3Audio.ctx;
  s2Audio.timers.forEach((t) =>
    t.type === 'interval' ? clearInterval(t.id) : clearTimeout(t.id)
  );
  if (s2Audio.gain && ctx) s2Audio.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.45);
  if (s2Audio.osc && ctx) {
    try {
      s2Audio.osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      /* ignore */
    }
  }
  s2Audio = { started: false, gain: null, osc: null, timers: [] };
}

function uiClick() {
  s3Ctx();
  s3Tone(620, 0.05, 'triangle', 0.018);
  setTimeout(() => s3Tone(860, 0.075, 'sine', 0.014), 24);
}

// ---- src/data/progressItems.js ----
const CL_PROGRESS_ITEMS = [
  { id: 'intro_sms', title: 'Le message de l’Inconnu', desc: 'Un premier avertissement apparaît avant même que Carrow Lake ne révèle son vrai visage.', scene: 1 },
  { id: 'scene2_arrival', title: 'Arrivée à Carrow Lake', desc: 'Elyos découvre une ville plus silencieuse qu’elle ne devrait l’être.', scene: 2 },
  { id: 'scene2_hotel', title: 'Hôtel des Pins', desc: 'La chambre 12 et le vieux couloir de l’hôtel commencent à fissurer le vernis du réel.', scene: 2 },
  { id: 'scene2_cafe', title: 'Café / regard derrière la vitre', desc: 'Au Café du Port, quelqu’un observe Elyos alors que personne d’autre ne semble le voir.', scene: 2 },
  { id: 'scene3_room', title: 'La chambre', desc: 'À 02:13, l’Inconnu revient et transforme la chambre 12 en piège.', scene: 3 },
  { id: 'scene3_bathroom', title: 'La salle de bain', desc: 'Un clapotis épais et un frottement humide révèlent que quelque chose approche.', scene: 3 },
  { id: 'scene3_flight', title: 'La fuite / route', desc: 'Elyos tente de quitter Carrow Lake, mais la ville refuse de le laisser partir.', scene: 3 },
  { id: 'scene4_cemetery', title: 'Le cimetière', desc: 'La colline mène Elyos jusqu’au cimetière noyé de brume.', scene: 4 },
  { id: 'scene4_meet_lou', title: 'Rencontre avec Lou', desc: 'Une jeune femme en robe à fleurs attend devant une tombe dans la nuit.', scene: 4 },
  { id: 'scene4_forest_run', title: 'Course dans la forêt', desc: 'Lou guide Elyos sur des sentiers où la forêt semble presque vivante.', scene: 4 },
  { id: 'scene4_gouffre', title: 'Le Gouffre des Murmures', desc: 'Une voix blessée appelle depuis une faille qui ne devrait pas parler.', scene: 4 },
  { id: 'scene4_cave_path', title: 'Chemin du gouffre', desc: 'Elyos descend dans l’obscurité pour sauver une voix qui l’attendait déjà.', scene: 4 },
  { id: 'scene4_bag_path', title: 'Chemin du sac ensanglanté', desc: 'Un sac abandonné révèle que tous les visages de Carrow Lake ne disent pas la vérité.', scene: 4 },
  { id: 'scene4_fake_lou', title: 'La vraie/fausse Lou', desc: 'Un message impossible dévoile l’existence de deux Lou.', scene: 4 },
  { id: 'scene4_siren', title: 'La sirène', desc: 'Une vieille alarme municipale arrache soudain la créature à sa proie.', scene: 4 },
  { id: 'scene4_hunt', title: 'La Chasse commence', desc: 'La ville entière s’allume d’un rouge sang et se met en marche.', scene: 4 },
  { id: 'scene5_hunt', title: 'La ville monte', desc: 'Depuis la corniche, Elyos voit Carrow Lake obéir à la Chasse.', scene: 5 },
  { id: 'scene5_cold_road', title: 'La route froide', desc: 'Les traces sur l’asphalte montrent une foule qui marche comme un seul corps.', scene: 5 },
  { id: 'scene5_black_stream', title: 'Le ruisseau noir', desc: 'L’eau remonte vers la forêt, comme si le monde refusait son propre sens.', scene: 5 },
  { id: 'scene5_northgate', title: 'Les clôtures de Northgate', desc: 'Les haut-parleurs rouillés donnent encore des ordres à la battue.', scene: 5 },
  { id: 'scene5_white_room', title: 'La chambre blanche', desc: 'Rejoindre la marche mène à une porte sans poignée et à une ville trop silencieuse.', scene: 5 },
  { id: 'scene5_brambles', title: 'Le prix des ronces', desc: 'La douleur garde Elyos hors de portée de la foule.', scene: 5 },
  { id: 'scene5_true_lou', title: 'La vraie Lou', desc: 'Au pied de l’arbre géant, Lou respire, tremble et révèle les chemins interdits.', scene: 5 },
  { id: 'scene5_forbidden_road', title: 'La Route forestière interdite', desc: 'La lampe blanche remplace le téléphone, et le noir de Northgate répond enfin.', scene: 5 },
];

// ---- src/data/wallpaperItems.js ----
const CL_WALLPAPERS = [
  {
    id: 'default',
    title: 'Carrow Lake',
    file: './assets/home/home-carrow-lake.webp',
    required: 0,
  },
  {
    id: 'morning',
    title: 'Carrow Lake au matin',
    file: './assets/wallpapers/wallpaper-carrow-morning.webp',
    required: 6,
  },
  {
    id: 'hunt',
    title: 'La Chasse',
    file: './assets/wallpapers/wallpaper-carrow-hunt.webp',
    required: 12,
  },
  {
    id: 'trail',
    title: 'Sentier de trail',
    file: './assets/wallpapers/wallpaper-carrow-trail.webp',
    required: 18,
  },
  {
    id: 'giant_tree',
    title: 'L’arbre géant',
    file: './assets/wallpapers/wallpaper-carrow-giant-tree.webp',
    required: 24,
  },
];

// ---- src/data/newsItems.js ----
const CURRENT_NEWS_VERSION = 'v0.5.2-organisation';

const NEWS_ITEMS = [
  {
    id: CURRENT_NEWS_VERSION,
    versionLabel: 'Version actuelle : V0.5.2 — Scène 5, fonds d’écran et préparation des événements',
    title: 'Mise à jour — Scène 5 disponible',
    paragraphs: [
      { text: 'La scène 5 est maintenant jouable. La Chasse est lancée.' },
      {
        label: 'Nouveautés',
        text: 'nouveaux lieux, nouvelles ambiances sonores, fins ratées et révélations majeures sur Lou, Northgate et l’Inconnu.',
      },
      {
        label: 'Progression',
        text: 'de nouveaux fragments ont été ajoutés. Découvrez-les dans votre journal.',
      },
      {
        label: 'Fonds d’écran',
        text: 'une nouvelle galerie permet de changer l’image d’accueil. De nouveaux fonds se débloquent avec la route des progrès.',
      },
      {
        label: 'Organisation',
        text: 'les actus, événements et fonds d’écran sont maintenant rangés dans des fichiers dédiés pour faciliter les futures mises à jour.',
      },
      {
        label: 'Et après ?',
        text: 'La Route forestière interdite est désormais ouverte… mais ce n’est que le début.',
      },
    ],
  },
];

function currentNewsItem() {
  return NEWS_ITEMS[0];
}

// ---- src/data/eventItems.js ----
const EVENTS_AVAILABLE = false;

const CL_EVENT_ITEMS = [
  {
    id: 'events_future_update',
    title: 'Événements de Carrow Lake',
    status: 'soon',
    locked: true,
    label: 'Bientôt',
    desc: 'Ce panneau accueillera les événements temporaires, annonces spéciales et mises à jour jouables.',
  },
];

// ---- src/game/sceneRegistry.js ----
function getNarrScene(sceneNumber) {
  return window.CL_SCENES && window.CL_SCENES[sceneNumber];
}

function getHybridScene(sceneNumber) {
  return window.CL_HYBRID_SCENES && window.CL_HYBRID_SCENES[sceneNumber];
}

function getStoryScene(sceneNumber) {
  return window.CL_STORY_SCENES && window.CL_STORY_SCENES[sceneNumber];
}

function hasNarrScene(sceneNumber) {
  return !!getNarrScene(sceneNumber);
}

function hasHybridScene(sceneNumber) {
  return !!getHybridScene(sceneNumber);
}

function hasStoryScene(sceneNumber) {
  return !!getStoryScene(sceneNumber);
}

function hasScene(sceneNumber) {
  return hasNarrScene(sceneNumber) || hasHybridScene(sceneNumber) || hasStoryScene(sceneNumber);
}

// ---- src/game/storyConfig.js ----
const STORY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function storyDefaults(sceneNumber) {
  if (sceneNumber === 4) {
    return {
      progress: {
        start: 'scene4_cemetery',
        meet: 'scene4_meet_lou',
        run: 'scene4_forest_run',
        path: { cave: 'scene4_cave_path', bag: 'scene4_bag_path' },
        end: 'scene4_hunt',
        cues: {
          gouffre: 'scene4_gouffre',
          fakeLou: 'scene4_fake_lou',
          siren: 'scene4_siren',
        },
      },
      nextScene: 5,
    };
  }
  return { progress: {}, nextScene: sceneNumber + 1 };
}

function storyProgressId(data, defaults, key, subkey) {
  const progress = Object.assign({}, defaults.progress, (data && data.progress) || {});
  const value = progress[key];
  if (value && typeof value === 'object' && subkey) return value[subkey] || null;
  return typeof value === 'string' ? value : null;
}

function storyNextScene(data, defaults) {
  return data && data.nextScene !== undefined ? data.nextScene : defaults.nextScene;
}

function storyPlace(data, key) {
  return (data && data.places && data.places[key]) || key;
}

function storyText(text, characterName) {
  return characterName && characterName !== 'Elyos'
    ? String(text).replace(/Elyos/g, characterName)
    : String(text);
}

// ---- src/core/Progress.js ----
function progressItem(id) {
  return CL_PROGRESS_ITEMS.find((item) => item.id === id);
}

function ensureProgress(id, at) {
  if (!gs.progress) gs.progress = {};
  if (gs.progress[id]) return false;
  gs.progress[id] = { unlocked: true, at: at || Date.now() };
  return true;
}

function unlockProgress(id) {
  if (ensureProgress(id)) {
    sv();
    updateProgressHomeButton();
    showProgressToast(id);
  }
}

function showProgressToast(id) {
  const item = progressItem(id);
  const toast = $('progressToast');
  if (!item || !toast) return;
  toast.textContent = 'Progrès débloqué : ' + item.title;
  toast.classList.add('is-visible');
  clearTimeout(showProgressToast.timer);
  showProgressToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function formatProgressDate(ts) {
  if (!ts) return 'Débloqué';
  try {
    return (
      'Débloqué · ' +
      new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    );
  } catch (e) {
    return 'Débloqué';
  }
}

function unlockedProgressCount() {
  return CL_PROGRESS_ITEMS.filter((item) => gs.progress && gs.progress[item.id]).length;
}

function wallpaperItem(id) {
  return CL_WALLPAPERS.find((item) => item.id === id) || CL_WALLPAPERS[0];
}

function isWallpaperUnlocked(item, count = unlockedProgressCount()) {
  return count >= item.required;
}

function currentWallpaper() {
  const count = unlockedProgressCount();
  const item = wallpaperItem(gs.homeWallpaper || 'default');
  return isWallpaperUnlocked(item, count) ? item : CL_WALLPAPERS[0];
}

function applyHomeWallpaper() {
  const item = currentWallpaper();
  if (gs.homeWallpaper !== item.id) {
    gs.homeWallpaper = item.id;
    sv();
  }
  document.documentElement.style.setProperty('--home-wallpaper-url', `url("${item.file.replace('./assets/', '../assets/')}")`);
}

function updateProgressHomeButton() {
  const count = unlockedProgressCount();
  const btn = $('bprogress');
  const icon = $('progressIcon');
  const label = $('progressHomeCount');
  if (!btn || !icon || !label) return;
  btn.classList.toggle('has-progress', count > 0);
  icon.className = 'ti ti-trophy';
  label.textContent =
    count > 0
      ? count + ' PASSAGE' + (count > 1 ? 'S' : '') + ' DÉBLOQUÉ' + (count > 1 ? 'S' : '')
      : 'PASSAGES DÉBLOQUÉS';
  applyHomeWallpaper();
}

function renderProgressScreen() {
  const list = $('progressList');
  const count = unlockedProgressCount();
  const total = CL_PROGRESS_ITEMS.length;
  if (!list) return;
  $('progressCount').textContent = count + ' / ' + total + ' débloqués';
  $('progressFill').style.width = Math.round((count / total) * 100) + '%';
  const ticks = $('progressRewardTicks');
  if (ticks) {
    const milestones = [Math.ceil(total * 0.25), Math.ceil(total * 0.5), Math.ceil(total * 0.75), total]
      .filter((value, index, all) => value > 0 && all.indexOf(value) === index);
    ticks.innerHTML = milestones.map((value) => {
      const left = Math.min(100, Math.max(0, Math.round((value / total) * 100)));
      const cls = count >= value ? ' unlocked' : '';
      return `<div class="progress-reward-tick${cls}" style="left:${left}%"><span>${value}</span></div>`;
    }).join('');
  }
  list.innerHTML = CL_PROGRESS_ITEMS.map((item) => {
    const state = gs.progress && gs.progress[item.id];
    const unlocked = !!state;
    const deathClass = unlocked && ['scene3_flight', 'scene5_white_room'].includes(item.id) ? ' death' : '';
    return `<article class="progress-card ${unlocked ? 'unlocked' : 'locked'}${deathClass}">
      <div class="progress-card-top">
        <div class="progress-card-title">${unlocked ? item.title : '???'}</div>
        <div class="progress-card-meta"><i class="ti ${unlocked ? 'ti-check' : 'ti-lock'}" aria-hidden="true"></i>${unlocked ? formatProgressDate(state.at) : 'Non découvert'}</div>
      </div>
      <div class="progress-card-desc">${unlocked ? item.desc : '???'}</div>
    </article>`;
  }).join('');
}

function openProgressScreen() {
  renderProgressScreen();
  show('sprogress', 'flex');
}

function renderWallpaperModal() {
  const list = $('wallpaperList');
  if (!list) return;
  const count = unlockedProgressCount();
  const active = currentWallpaper().id;
  list.innerHTML = CL_WALLPAPERS.map((item) => {
    const unlocked = isWallpaperUnlocked(item, count);
    const isActive = active === item.id;
    const meta = unlocked ? (isActive ? 'Actif' : 'Débloqué') : item.required + ' progrès';
    return `<button class="wallpaper-card ${unlocked ? 'is-unlocked' : 'is-locked'}${isActive ? ' is-active' : ''}" data-wallpaper="${item.id}" ${unlocked ? '' : 'disabled'}>
      <div class="wallpaper-thumb" style="background-image:url('${item.file}')"></div>
      <div class="wallpaper-info">
        <div class="wallpaper-title">${item.title}</div>
        <div class="wallpaper-meta"><i class="ti ${unlocked ? (isActive ? 'ti-check' : 'ti-photo') : 'ti-lock'}" aria-hidden="true"></i>${meta}</div>
      </div>
    </button>`;
  }).join('');
  list.querySelectorAll('.wallpaper-card.is-unlocked').forEach((button) => {
    button.addEventListener('click', () => {
      gs.homeWallpaper = button.getAttribute('data-wallpaper') || 'default';
      sv();
      applyHomeWallpaper();
      renderWallpaperModal();
    });
  });
}

function openWallpaperModal() {
  renderWallpaperModal();
  const modal = $('wallpaperModal');
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeWallpaperModal() {
  const modal = $('wallpaperModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function syncProgressFromSave() {
  let changed = false;
  const mark = (id) => {
    if (ensureProgress(id)) changed = true;
  };
  if (gs.char) mark('intro_sms');
  if (gs.scene === 2) syncScene2Progress(gs.narrIdx, mark);
  if (gs.scene >= 3) {
    mark('scene2_arrival');
    mark('scene2_hotel');
    mark('scene2_cafe');
    mark('scene3_room');
  }
  if (gs.scene >= 4) mark('scene4_cemetery');
  if (gs.scene >= 5) {
    mark('scene4_meet_lou');
    mark('scene4_forest_run');
    mark('scene4_gouffre');
    mark('scene4_siren');
    mark('scene4_hunt');
    mark('scene5_hunt');
  }
  if (gs.scene >= 6) {
    mark('scene5_true_lou');
    mark('scene5_forbidden_road');
  }
  if (changed) sv();
}

function syncScene2Progress(idx, markFn) {
  const mark = markFn || unlockProgress;
  if (idx >= 0) mark('scene2_arrival');
  if (idx >= 4) mark('scene2_hotel');
  if (idx >= 11) mark('scene2_cafe');
}

function updateNewsBadge() {
  const badge = $('newsBadge');
  if (badge) badge.classList.toggle('is-hidden', gs.newsSeenVersion === CURRENT_NEWS_VERSION);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderNewsModal() {
  const item = currentNewsItem();
  if (!item) return;
  const version = $('newsVersion');
  const title = $('newsTitle');
  const body = $('newsBody');
  if (version) version.textContent = item.versionLabel || '';
  if (title) title.textContent = item.title || 'Actus';
  if (!body) return;
  body.innerHTML = (item.paragraphs || [])
    .map((paragraph) => {
      const text = escapeHtml(paragraph.text || '');
      if (!paragraph.label) return `<p>${text}</p>`;
      return `<p><strong>${escapeHtml(paragraph.label)} :</strong> ${text}</p>`;
    })
    .join('');
}

function openNewsModal() {
  const modal = $('newsModal');
  if (!modal) return;
  renderNewsModal();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  if (gs.newsSeenVersion !== CURRENT_NEWS_VERSION) {
    gs.newsSeen = true;
    gs.newsSeenVersion = CURRENT_NEWS_VERSION;
    sv();
  }
  updateNewsBadge();
}

function closeNewsModal() {
  const modal = $('newsModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

// ---- src/game.js ----
// SMS
const M=()=>$('smsg'),SC=()=>{const m=M();m.scrollTop=m.scrollHeight};
function addIn(t){try{s3Notify()}catch(e){}const d=document.createElement('div');d.className='bi bin';d.textContent=t;M().appendChild(d);SC()}
function addOut(t){const d=document.createElement('div');d.className='bi bot';d.textContent=t;M().appendChild(d);SC()}
function addStatus(t,side){const d=document.createElement('div');d.className='bvu '+(side==='in'?'in':'out');d.textContent=t;M().appendChild(d);SC()}
function addVu(side){addStatus('Vu',side||'in')}
function addRemis(side){addStatus('REMIS',side||'out')}
function addSys(t){const d=document.createElement('div');d.className='bsy';d.textContent=t;M().appendChild(d);SC()}
function addBlk(){const d=document.createElement('div');d.className='bbl';d.innerHTML='<i class="ti ti-ban" style="font-size:13px" aria-hidden="true"></i> Cet utilisateur vous a bloqué(e)';M().appendChild(d);SC()}
function mkT(id){const d=document.createElement('div');d.id=id;d.style.cssText='display:flex;gap:4px;padding:10px 14px;align-items:center;background:#1d1d30;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start';d.innerHTML='<span style="width:6px;height:6px;border-radius:50%;background:#3c3c80;animation:dot 1s infinite;display:block"></span><span style="width:6px;height:6px;border-radius:50%;background:#3c3c80;animation:dot 1s .2s infinite;display:block"></span><span style="width:6px;height:6px;border-radius:50%;background:#3c3c80;animation:dot 1s .4s infinite;display:block"></span>';M().appendChild(d);SC()}
function rmT(id){const t=$(id);if(t)t.remove()}
function clrCh(){$('sch').innerHTML=''}
function addCho(txt,fn){const b=document.createElement('button');b.className='cho';b.textContent=txt;b.onclick=fn;$('sch').appendChild(b)}

function startSMS(resume){
  if(resume&&M().children.length)return;
  unlockProgress('intro_sms');
  M().innerHTML='';clrCh();
  const p=$('s1presence');if(p){p.textContent='En ligne';p.classList.add('online')}
  setTimeout(()=>mkT('t1'),700);
  setTimeout(()=>{rmT('t1');addIn('Bonjour… '+gs.char);setTimeout(()=>{clrCh();addCho('A)  Salut ?',()=>sr1('A'));addCho('B)  [Vu]',()=>sr1('B'))},900)},2400);
}
function sr1(opt){
  clrCh();
  if(opt==='A')addOut('Salut ?');
  else addVu('in');
  setTimeout(()=>mkT('t2'),1150);
  setTimeout(()=>{rmT('t2');addIn('Ne reste pas ici, tu n\'as pas ta place…');setTimeout(()=>{clrCh();addCho('A)  Qui es-tu ?',sr2)},900)},2850);
}
function sr2(){
  clrCh();addOut('Qui es-tu ?');
  setTimeout(()=>addRemis('out'),350);
  setTimeout(()=>{addBlk();setTimeout(()=>{const p=$('s1presence');if(p){p.textContent='Utilisateur bloqué';p.classList.remove('online')}addSys('Vous ne pouvez plus envoyer de messages à ce contact.');setTimeout(()=>{clrCh();addCho('→  Continuer',()=>{gs.scene=2;gs.narrIdx=0;sv();show('sn','block');startNarr(0)})},1100)},850)},1150);
}

// NARRATIVE


let nIdx=0,nBg=-1,nActive=false;
function startScene(sceneNumber,idx){
  if(hasHybridScene(sceneNumber)){s2StopAmbience();show('s3','block');startHybridScene(sceneNumber,idx||0);return}
  if(hasStoryScene(sceneNumber)){s2StopAmbience();show('s4','block');startStoryScene(sceneNumber,idx||0);return}
  show('sn','block');startNarr(idx||0)
}
function activeScene(){return getNarrScene(gs.scene)||getNarrScene(2)}
function sceneSegments(){return activeScene().segments}
function sceneBackgrounds(){return activeScene().backgrounds}
function startNarr(idx){const scene=activeScene(),segs=sceneSegments(),bgs=sceneBackgrounds();if(gs.scene===2)s2StartAmbience();else s2StopAmbience();nIdx=Math.min(idx||0,segs.length-1);nActive=true;nBg=-1;$('snlb').textContent=scene.title||'SCENE';$('snbg').innerHTML=bgs[segs[nIdx].bg];$('snbg').style.opacity='1';$('snbg2').style.opacity='0';nBg=segs[nIdx].bg;if(gs.scene===2)syncScene2Progress(nIdx);setNarrSeg(false);renderPg()}
function setNarrSeg(fade){
  const tx=$('sntx'),seg=sceneSegments()[nIdx];
  const newBg=seg.bg;
  if(gs.scene===2)syncScene2Progress(nIdx);
  if(newBg!==nBg){swapBg(newBg);nBg=newBg}
  if(fade){tx.classList.add('hid');setTimeout(()=>{fillTx(seg,tx);tx.classList.remove('hid')},750)}
  else{tx.classList.remove('hid');fillTx(seg,tx)}
  renderPg()
}
function fillTx(seg,tx){
  let t=seg.t;
  if(gs.char&&gs.char!=='Elyos')t=t.replace(/Elyos/g,gs.char);
  const cls=(seg.c||'').split(' ').map(s=>s.trim()).filter(s=>s&&s.length>0);
  tx.className=cls.join(' ');
  tx.style.fontFamily="'Palatino Linotype',Palatino,'Book Antiqua',serif";
  if(t.includes('\n')){
    tx.innerHTML=t.split('\n').map(l=>l===''?'<span style="height:6px;display:block"></span>':`<span>${l}</span>`).join('');
  }else tx.textContent=t;
}
function swapBg(bgIdx){
  const b1=$('snbg'),b2=$('snbg2');
  b2.innerHTML=sceneBackgrounds()[bgIdx];
  b2.style.transition='none';b2.style.opacity='0';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{b2.style.transition='opacity 1.4s ease';b2.style.opacity='1';b1.style.transition='opacity 1.4s ease';b1.style.opacity='0'}));
  setTimeout(()=>{b1.innerHTML=sceneBackgrounds()[bgIdx];b1.style.transition='none';b1.style.opacity='1';b2.style.opacity='0';b2.innerHTML=''},1500)
}
function renderPg(){
  const pg=$('snpg'),total=sceneSegments().length,pct=Math.round(((nIdx+1)/total)*100);
  pg.innerHTML=`<div class="narr-progress"><div style="width:${pct}%"></div></div>`;
}
function narrNext(){
  if(!nActive)return;
  nIdx++;
  if(nIdx>=sceneSegments().length){
    const nextScene=gs.scene+1;
    s2StopAmbience();
    if(hasScene(nextScene)){nActive=false;gs.scene=nextScene;gs.narrIdx=0;sv();startScene(nextScene,0);return}
    nActive=false;gs.scene=nextScene;gs.narrIdx=sceneSegments().length;sv();show('sso','flex');return
  }
  gs.narrIdx=nIdx;sv();setNarrSeg(true)
}


// SCENE 3 HYBRID
let s3State={timers:[],narr:[],narrIdx:0,narrDone:null,waitingChoice:false,scene:null,endKey:null};

function s3SceneNumber(){return s3State.scene||gs.scene||3}
function s3Data(sceneNumber){return getHybridScene(sceneNumber||s3SceneNumber())}
function s3Defaults(){
  return s3SceneNumber()===3?{
    progress:{start:'scene3_room',bathroom:'scene3_bathroom',finals:{flight:'scene3_flight'}},
    continueEnd:'cemetery',
    nextScene:4
  }:{progress:{},continueEnd:null,nextScene:s3SceneNumber()+1}
}
function s3ProgressId(key,subkey){
  const data=s3Data(),defaults=s3Defaults();
  const progress=Object.assign({},defaults.progress,(data&&data.progress)||{});
  const value=progress[key];
  if(value&&typeof value==='object'&&subkey)return value[subkey]||null;
  return typeof value==='string'?value:null;
}
function s3UnlockProgress(key,subkey){const id=s3ProgressId(key,subkey);if(id)unlockProgress(id)}
function s3ContinueEnd(data){return (data&&data.continueEnd!==undefined)?data.continueEnd:s3Defaults().continueEnd}
function s3NextScene(data){return (data&&data.nextScene!==undefined)?data.nextScene:s3Defaults().nextScene}
function s3Txt(t){return gs.char&&gs.char!=='Elyos'?String(t).replace(/Elyos/g,gs.char):String(t)}
function s3Timer(fn,ms){const id=setTimeout(fn,ms);s3State.timers.push({id,type:'timeout'});return id}
function s3Interval(fn,ms){const id=setInterval(fn,ms);s3State.timers.push({id,type:'interval'});return id}
function s3StopTimers(){if(!s3State||!s3State.timers)return;s3State.timers.forEach(t=>t.type==='interval'?clearInterval(t.id):clearTimeout(t.id));s3State.timers=[]}
function s3StopAll(){s3StopTimers();s3StopAudio()}
function s3Mode(id){['s3chat','s3narr','s3black'].forEach(x=>{const el=$(x);if(el)el.classList.toggle('is-active',x===id)})}
function s3ClearChoices(){$('s3choices').innerHTML='';$('s3narrChoices').innerHTML=''}
function startHybridScene(sceneNumber){
  const data=s3Data(sceneNumber);
  if(!data){show('sso','flex');return}
  s3StopAll();
  s3State={timers:[],narr:[],narrIdx:0,narrDone:null,waitingChoice:false,scene:sceneNumber,endKey:null};
  gs.scene=sceneNumber;gs.narrIdx=0;sv();
  s3UnlockProgress('start');
  s3StartAudio();s3SetTension(.045);
  s3RunNarrative(data.intro,()=>s3StartChat(),data.title,data.defaultBackground||'room');
}

function s3StartChat(){
  const data=s3Data(),ui=data.ui||{};
  s3Mode('s3chat');s3ClearChoices();
  $('s3msgs').innerHTML='';
  $('s3network').textContent=ui.network||'Wi-Fi Hôtel';
  $('s3presence').textContent=ui.initialPresence||'Utilisateur bloqué';
  $('s3presence').classList.remove('online');
  s3AddOut(ui.initialOut||'Qui es-tu ?');
  s3Timer(()=>{s3SetPresence('En ligne');s3Reply(data.sms.r1,()=>s3Choices([
    {text:data.choices.r1.a,fn:()=>s3ChooseR1('A')},
    {text:data.choices.r1.b,fn:()=>s3ChooseR1('B')}
  ]),{replyDelay:1450,typingDelay:650,seenDelay:360})},1800);
}

function s3SetPresence(text){const p=$('s3presence');p.style.opacity='0';s3Timer(()=>{p.textContent=text;p.classList.toggle('online',text==='En ligne');p.style.opacity='1'},300)}
function s3NetworkLost(){const n=$('s3network');n.textContent='Aucun service';s3AddSystem('Aucun service')}
function s3Scroll(){const m=$('s3msgs');m.scrollTop=m.scrollHeight}
function s3AddBubble(text,kind){
  const d=document.createElement('div');
  d.className='s3-bubble '+(kind==='out'?'s3-out':'s3-in');
  d.textContent=s3Txt(text);
  $('s3msgs').appendChild(d);s3Scroll();
}
function s3AddIn(text){s3Notify();s3AddBubble(text,'in')}
function s3AddOut(text){s3AddBubble(text,'out');setTimeout(s3AddDelivered,1000)}
function s3AddSystem(text){const d=document.createElement('div');d.className='s3-system';d.textContent=text;$('s3msgs').appendChild(d);s3Scroll()}
function s3AddDelivered(){const d=document.createElement('div');d.className='s3-seen out';d.textContent='Vu';$('s3msgs').appendChild(d);s3Scroll()}
function s3Typing(){
  const old=$('s3typing');if(old)old.remove();
  const d=document.createElement('div');d.id='s3typing';d.className='s3-typing';d.innerHTML='<span></span><span></span><span></span>';$('s3msgs').appendChild(d);s3Scroll()
}
function s3StopTyping(){const t=$('s3typing');if(t)t.remove()}
function s3Reply(text,done,opt){
  const o=Object.assign({typingDelay:1450,replyDelay:2300},opt||{});
  s3Timer(()=>s3Typing(),o.typingDelay);
  s3Timer(()=>{s3StopTyping();s3AddIn(text);if(done)done()},o.replyDelay);
}
function s3Choices(items){
  const box=$('s3choices');box.innerHTML='';
  items.forEach((item,i)=>{const b=document.createElement('button');b.className='s3-choice';b.textContent=(i===0?'A  ':'B  ')+s3Txt(item.text);b.onclick=item.fn;box.appendChild(b)});
}
function s3Continue(text,fn){
  const box=$('s3choices');box.innerHTML='';
  const b=document.createElement('button');
  b.className='s3-choice s3-continue';
  b.textContent=text||'Continuer';
  b.onclick=()=>{box.innerHTML='';fn()};
  box.appendChild(b);
  s3Timer(()=>s3Scroll(),60);
}

function s3ChooseR1(branch){
  const data=s3Data();s3ClearChoices();
  if(branch==='A'){
    s3SetTension(.075);s3AddOut(data.choices.r1.a);
    s3Reply(data.sms.r2A,()=>s3Choices([
      {text:data.choices.r2a.a,fn:()=>s3ChooseR2A(data.choices.r2a.a)},
      {text:data.choices.r2a.b,fn:()=>s3ChooseR2A(data.choices.r2a.b)}
    ]),{seenDelay:420,typingDelay:780,replyDelay:1320});
    return;
  }
  s3SetTension(.085);s3AddOut(data.choices.r1.b);
  s3Reply(data.sms.r2B,()=>{s3NetworkLost();s3Choices([
    {text:data.choices.r2b.a,fn:()=>s3ChooseR2B('A')},
    {text:data.choices.r2b.b,fn:()=>s3ChooseR2B('B')}
  ])},{seenDelay:950,typingDelay:1850,replyDelay:2900});
}
function s3ChooseR2A(text){
  const data=s3Data();
  s3ClearChoices();s3SetTension(.12);s3AddOut(text);
  s3Reply(data.sms.r3A,()=>s3Continue('Regarder par la fenêtre',s3WindowSequence),{seenDelay:420,typingDelay:760,replyDelay:1250});
}
function s3ChooseR2B(branch){
  const data=s3Data();s3ClearChoices();s3SetTension(.15);
  if(branch==='A'){
    s3AddOut(data.choices.r2b.a);
    s3Reply(data.sms.r4A,()=>s3Continue('Écouter la salle de bain',s3BathroomSequence),{seenDelay:900,typingDelay:1600,replyDelay:2600});
    return;
  }
  s3AddSystem('Elyos retient sa respiration dans le noir');
  s3PlayDripCrawl();
  s3Reply(data.sms.r3A,()=>s3Continue('Regarder par la fenêtre',s3WindowSequence),{typingDelay:2200,replyDelay:3300,seenDelay:360});
}
function s3WindowSequence(){
  const data=s3Data();s3SetTension(.17);
  s3RunNarrative(data.narratives.window,()=>{s3Mode('s3chat');s3Reply(data.sms.cemeteryThreat,()=>s3Continue('Faire un choix',s3ShowFinalChoice),{typingDelay:600,replyDelay:1300,seenDelay:360})},data.title,'window');
}
function s3BathroomSequence(){
  const data=s3Data();s3SetTension(.2);s3PlayDripCrawl();
  s3UnlockProgress('bathroom');
  s3RunNarrative(data.narratives.bathroom,()=>{s3Mode('s3chat');s3Reply(data.sms.bathroomThreat,()=>s3Continue('Faire un choix',s3ShowFinalChoice),{typingDelay:500,replyDelay:1200,seenDelay:360})},data.title,'bathroom');
}

function s3SetNarrBg(key){
  const data=s3Data(),bg=$('s3narrBg');
  if(!data||!bg||!data.backgrounds)return;
  bg.style.backgroundImage=`url("${data.backgrounds[key]||data.backgrounds.room}")`;
}
function s3RunNarrative(lines,done,label,bg){
  s3Mode('s3narr');s3ClearChoices();
  s3SetNarrBg(bg||((s3Data()&&s3Data().defaultBackground)||'room'));
  $('s3narrHint').style.display='block';
  const l=$('s3narr').querySelector('.s3-narr-label');if(l)l.textContent=label||`SCÈNE ${s3SceneNumber()}`;
  s3State.narr=lines||[];s3State.narrIdx=0;s3State.narrDone=done;s3State.waitingChoice=false;
  s3RenderNarr(true);s3RenderPg();
}
function s3RenderNarr(first){
  const text=s3Txt(s3State.narr[s3State.narrIdx]||'');
  const el=$('s3narrText');
  const paint=()=>{el.innerHTML=text.split('\n').map(line=>line?`<span>${line}</span>`:'<span style="height:8px;display:block"></span>').join('');el.classList.remove('hid');s3HandleNarrativeCue(text)};
  if(first){el.classList.add('hid');s3Timer(paint,80);return}
  el.classList.add('hid');s3Timer(paint,720);
  s3RenderPg();
}
function s3RenderPg(){
  const pg=$('s3narrPg');if(!pg)return;
  const total=Math.max(1,s3State.narr.length),pct=Math.round(((s3State.narrIdx+1)/total)*100);
  pg.innerHTML=`<div class="narr-progress"><div style="width:${pct}%"></div></div>`;
}
function s3NarrNext(){
  if($('s3').style.display==='none'||s3State.waitingChoice)return;
  s3State.narrIdx++;
  if(s3State.narrIdx>=s3State.narr.length){const done=s3State.narrDone;s3State.narrDone=null;if(done)done();return}
  s3RenderNarr(false);
}
function s3ShowFinalChoice(){
  const data=s3Data();
  s3Mode('s3narr');s3State.waitingChoice=true;s3ClearChoices();
  $('s3narrHint').style.display='none';
  $('s3narrPg').innerHTML='';
  $('s3narrText').innerHTML=s3Txt(data.finalPrompt).split('\n').map(line=>line?`<span>${line}</span>`:'<span style="height:8px;display:block"></span>').join('');
  const box=$('s3narrChoices');
  data.finalChoices.forEach((c,i)=>{const b=document.createElement('button');b.className='s3-final-choice';b.textContent=(i===0?'A  ':'B  ')+s3Txt(c.text);b.onclick=()=>s3ChooseFinal(c.end);box.appendChild(b)});
}
function s3ChooseFinal(endKey){
  const data=s3Data();s3State.waitingChoice=false;s3ClearChoices();s3SetTension(.24);
  s3State.endKey=endKey;
  s3UnlockProgress('finals',endKey);
  s3Impact(endKey);s3Mode('s3black');$('s3coming').textContent='';
  const root=$('clg');root.classList.remove('s3-shock');void root.offsetWidth;root.classList.add('s3-shock');
  s3Timer(()=>s3RunNarrative(data.finals[endKey],()=>s3EndEpisode(),data.finalLabels[endKey],endKey==='cemetery'?'cemetery':'road'),1100);
}
function s3EndEpisode(){
  const data=s3Data(),continueEnd=s3ContinueEnd(data),nextScene=s3NextScene(data);
  s3StopAll();
  if(continueEnd&&s3State.endKey===continueEnd&&nextScene){
    gs.scene=nextScene;gs.narrIdx=0;sv();
    if(hasScene(nextScene)){startScene(nextScene,0);return}
    show('sso','flex');return;
  }
  gs.scene=s3SceneNumber();gs.narrIdx=0;sv();
  s3Mode('s3black');
  const end=$('s3coming');
  end.innerHTML=`<div class="s3-end-kicker">FIN DE L'ÉPISODE</div><div class="s3-end-quote">${data.comingSoon||'“Carrow Lake garde désormais un secret de plus.”'}</div>`;
  const button=document.createElement('button');
  button.className='s3-home-btn';
  button.textContent='RECOMMENCER DEPUIS LE DÉBUT';
  button.onclick=async()=>{
    await restartStoryKeepProgress();
    show('schar','flex');
  };
  end.appendChild(button);
}

function s3StartAudio(){s3StartAmbient();s3StartTick()}
function s3StartAmbient(){
  const ctx=s3Ctx();if(!ctx||s3Audio.started)return;
  s3Audio.started=true;s3Audio.ambientGain=ctx.createGain();s3Audio.ambientGain.gain.value=0;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=130;
  s3Audio.ambientGain.connect(filter);filter.connect(s3Audio.master);
  [38,52,67].forEach((f,i)=>{const o=ctx.createOscillator();o.type=i===0?'sine':'triangle';o.frequency.value=f;const g=ctx.createGain();g.gain.value=i===0?.8:.28;o.connect(g);g.connect(s3Audio.ambientGain);o.start();s3Audio.ambientOscs.push(o)});
}
function s3SetTension(v){const ctx=s3Ctx();if(ctx&&s3Audio.ambientGain)s3Audio.ambientGain.gain.setTargetAtTime(v,ctx.currentTime,1.8)}
function s3PlayTick(){s3Tone(1120,.04,'triangle',.012);s3Timer(()=>s3Tone(760,.06,'sine',.009),55)}
function s3StartTick(){if(s3Audio.tickLive)return;s3Audio.tickLive=true;s3PlayTick();s3Audio.tickTimer=s3Interval(()=>s3PlayTick(),1000)}
function s3StopTick(){
  if(!s3Audio.tickLive)return;
  if(s3Audio.tickTimer)clearInterval(s3Audio.tickTimer);
  s3Audio.tickLive=false;s3Audio.tickTimer=null;
}
function s3StopAudio(){
  const ctx=s3Audio.ctx;
  s3StopTick();
  if(s3Audio.ambientGain&&ctx)s3Audio.ambientGain.gain.setTargetAtTime(0,ctx.currentTime,.35);
  s3Audio.ambientOscs.forEach(o=>{try{o.stop(ctx?ctx.currentTime+.5:0)}catch(e){}});
  Object.assign(s3Audio,{ambientGain:null,ambientOscs:[],tickLive:false,tickTimer:null,started:false});
}

function s3Notify(){if(navigator.vibrate)navigator.vibrate(45);s3Tone(1180,.055,'triangle',.045)}
function s3PlayCreak(){s3Noise(.55,.034,420);s3Timer(()=>s3Tone(92,.38,'sawtooth',.018),120)}
function s3PlayDripCrawl(){s3Noise(.08,.025,900);s3Timer(()=>s3Noise(.09,.028,760),850);s3Timer(()=>s3Noise(.75,.055,260),1850)}
function s3Impact(kind){s3Noise(kind==='flight'?.9:.55,kind==='flight'?.14:.1,kind==='flight'?180:260);s3Tone(kind==='flight'?48:72,.45,'sine',.09)}
function s3PlayWind(){s3Noise(1.4,.022,260)}
function s3PlayLeaves(){s3Noise(.32,.028,780);s3Timer(()=>s3Noise(.24,.018,720),120)}
function s3PlayFootsteps(){[0,230,460,690].forEach(ms=>s3Timer(()=>s3Tone(86,.08,'triangle',.032),ms))}
function s3PlayEngine(){s3Tone(54,.8,'sawtooth',.045);s3Timer(()=>s3Tone(72,.7,'triangle',.028),120)}
function s3PlayTireSkid(){s3Noise(.8,.075,1200)}
function s3PlayBlinker(){[0,620,1240].forEach(ms=>s3Timer(()=>s3Tone(880,.045,'square',.018),ms))}
function s3PlayGateSlam(){s3Noise(.36,.085,260);s3Timer(()=>s3Tone(58,.42,'sine',.07),30)}
function s3HandleNarrativeCue(text){
  if(/parquet|s'approche|marches|sentier/i.test(text))s3PlayCreak();
  if(/quitte la chambre 12/i.test(text)){s3StopTick();s3PlayWind()}
  if(/se rue dans le couloir/i.test(text)){s3StopTick();s3PlayFootsteps()}
  if(/feuilles mortes/i.test(text))s3PlayLeaves();
  if(/grilles du cimetière claquent/i.test(text))s3PlayGateSlam();
  if(/moteur démarre/i.test(text))s3PlayEngine();
  if(/pneus crissent/i.test(text))s3PlayTireSkid();
  if(/clignotant/i.test(text))s3PlayBlinker();
}

// SCENE 4+ STORY
let s4State={timers:[],narr:[],narrIdx:0,narrDone:null,talk:[],talkIdx:0,talkDone:null,scene:null,flow:null,node:null};
let s4Audio={timers:[],gain:null,oscillators:[],mode:null,started:false};
function s4SceneNumber(){return s4State.scene||gs.scene||4}
function s4Data(sceneNumber){return getStoryScene(sceneNumber||s4SceneNumber())}
function s4Defaults(){return storyDefaults(s4SceneNumber())}
function s4ProgressId(key,subkey){return storyProgressId(s4Data(),s4Defaults(),key,subkey)}
function s4UnlockProgress(key,subkey){const id=s4ProgressId(key,subkey);if(id)unlockProgress(id)}
function s4NextScene(data){return storyNextScene(data,s4Defaults())}
function s4Place(key){return storyPlace(s4Data(),key)}
function s4Txt(t){return storyText(t,gs.char)}
function s4Timer(fn,ms){const id=setTimeout(fn,ms);s4State.timers.push(id);return id}
function s4StopTimers(){if(!s4State||!s4State.timers)return;s4State.timers.forEach(clearTimeout);s4State.timers=[]}
function s4AudioTimer(fn,ms){const id=setTimeout(fn,ms);s4Audio.timers.push({id,type:'timeout'});return id}
function s4AudioInterval(fn,ms){const id=setInterval(fn,ms);s4Audio.timers.push({id,type:'interval'});return id}
function s4StopAudio(){
  const ctx=s3Audio.ctx;
  s4Audio.timers.forEach(t=>t.type==='interval'?clearInterval(t.id):clearTimeout(t.id));
  if(s4Audio.gain&&ctx)s4Audio.gain.gain.setTargetAtTime(0,ctx.currentTime,.35);
  s4Audio.oscillators.forEach(o=>{try{o.stop(ctx?ctx.currentTime+.45:0)}catch(e){}});
  s4Audio={timers:[],gain:null,oscillators:[],mode:null,started:false};
}
function s4StopAll(){s4StopTimers();s4StopAudio()}
function s4Mode(id){['s4narr','s4talk','s4sms','s4end'].forEach(x=>{const el=$(x);if(el)el.classList.toggle('is-active',x===id)})}
function s4SetBg(key){
  const data=s4Data(),bg=$('s4bg');if(!data||!bg)return;
  const image=data.backgrounds&&(data.backgrounds[key]||data.backgrounds.fallback);
  bg.style.backgroundImage=`url("${image||'./assets/scenes/04/scene-04-forest.webp'}")`;
}
function startStoryScene(sceneNumber){
  const data=s4Data(sceneNumber);
  if(!data){show('sso','flex');return}
  s3StopAll();s4StopAll();
  s4State={timers:[],narr:[],narrIdx:0,narrDone:null,talk:[],talkIdx:0,talkDone:null,scene:sceneNumber,flow:null,node:null};
  gs.scene=sceneNumber;gs.narrIdx=0;sv();
  const tag=$('s4').querySelector('.s4-scene-tag');if(tag)tag.textContent=data.sceneTag||`SCÈNE ${sceneNumber}`;
  if(data.flow){s4StartFlow(data);return}
  s4UnlockProgress('start');
  s4RunNarrative(data.intro,()=>s4ShowApproachChoice(),data.title,data.startBackground||s4Place('cemetery'));
}
function s4StartFlow(data){
  s4State.flow=data.flow;s4UnlockProgress('start');
  const saved=gs.storyScene===s4SceneNumber()&&gs.storyNode&&data.flow.nodes[gs.storyNode]?gs.storyNode:null;
  s4GotoFlow(saved||data.flow.start);
}
function s4SaveFlowNode(id){
  gs.storyScene=s4SceneNumber();gs.storyNode=id;gs.narrIdx=0;sv();
}
function s4ClearFlowSave(nextScene){
  delete gs.storyScene;delete gs.storyNode;
  if(nextScene!==undefined)gs.scene=nextScene;
  gs.narrIdx=0;sv();
}
function s4UnlockNodeProgress(node){
  const progress=node&&node.progress;
  if(Array.isArray(progress))progress.forEach(id=>id&&unlockProgress(id));
  else if(progress)unlockProgress(progress);
}
function s4FlowNext(next){
  if(next)s4GotoFlow(next);
}
function s4GotoFlow(id){
  const data=s4Data(),flow=data&&data.flow,node=flow&&flow.nodes&&flow.nodes[id];
  if(!node){show('sso','flex');return}
  s4StopTimers();s4State.node=id;s4SaveFlowNode(id);s4UnlockNodeProgress(node);
  const bg=node.bg||flow.defaultBackground||data.startBackground||'forest';
  const audio=node.audio||bg;
  if(node.type==='narrative'){
    s4RunNarrative(node.lines||[],()=>s4FlowNext(node.next),node.label||data.title,bg);
    if(audio)s4SetAudioMode(audio);
    return;
  }
  if(node.type==='dialogue'){
    s4TalkQueue(node.lines||[],()=>s4FlowNext(node.next),bg);
    if(audio)s4SetAudioMode(audio);
    return;
  }
  if(node.type==='choice'){
    s4ShowChoice(node.prompt,node.choices||[],bg,choice=>{
      if(choice.progress)unlockProgress(choice.progress);
      s4FlowNext(choice.next);
    });
    if(audio)s4SetAudioMode(audio);
    return;
  }
  if(node.type==='sms'){
    s4ShowFlowSms(node,bg,audio);
    return;
  }
  if(node.type==='ending'){
    s4ShowEndCard(node,bg,audio);
    return;
  }
  if(node.type==='coming'){
    const nextScene=node.nextScene||s4NextScene(data);
    s4UnlockNodeProgress(node);
    s4ClearFlowSave(nextScene);
    s4StopAll();
    show('sso','flex');
  }
}
function s4AddSmsBubble(text,kind){
  const d=document.createElement('div');
  if(kind==='system'){d.className='s3-system';d.textContent=s4Txt(text)}
  else{d.className='s3-bubble '+(kind==='out'?'s3-out':'s3-in');d.textContent=s4Txt(text)}
  $('s4msgs').appendChild(d);
  const m=$('s4msgs');m.scrollTop=m.scrollHeight;
}
function s4SetPhoneTime(time){
  const el=$('s4phoneTime');
  if(el)el.textContent=time||'00:00';
}
function s4AddSmsStatus(text,kind){
  const d=document.createElement('div');
  d.className='s3-seen '+(kind==='in'?'in':'out');
  d.textContent=text||'Vu';
  $('s4msgs').appendChild(d);
  const m=$('s4msgs');m.scrollTop=m.scrollHeight;
}
function s4Typing(){
  const old=$('s4typing');if(old)old.remove();
  const d=document.createElement('div');
  d.id='s4typing';
  d.className='s3-typing';
  d.innerHTML='<span></span><span></span><span></span>';
  $('s4msgs').appendChild(d);
  const m=$('s4msgs');m.scrollTop=m.scrollHeight;
}
function s4StopTyping(){const t=$('s4typing');if(t)t.remove()}
function s4FlowContinueButton(text,fn){
  const box=$('s4smsActions');box.innerHTML='';
  const b=document.createElement('button');
  b.className='s3-choice s3-continue';b.textContent=text||'Continuer';
  b.onclick=()=>{box.innerHTML='';fn()};
  box.appendChild(b);
}
function s4ShowFlowSms(node,bg,audio){
  const data=s4Data();
  s4Mode('s4sms');s4SetBg(bg);s4SetAudioMode(audio);
  s4SetPhoneTime(node.phoneTime||(data&&data.phoneTime)||'00:00');
  $('s4smsName').textContent=node.sender||'Inconnu';
  $('s4msgs').innerHTML='';$('s4smsActions').innerHTML='';
  (node.messages||[]).forEach(message=>s4AddSmsBubble(message.text||message,message.side||'in'));
  const choices=node.choices||[];
  if(choices.length){
    const box=$('s4smsActions');
    choices.forEach((choice,i)=>{
      const b=document.createElement('button');
      b.className='s3-choice';
      b.textContent=(choice.key||STORY_LETTERS[i])+'  '+s4Txt(choice.text);
      b.onclick=()=>{
        box.innerHTML='';
        if(choice.progress)unlockProgress(choice.progress);
        const shouldSend=choice.send!==false;
        const seenDelay=choice.seenDelay===undefined?300:choice.seenDelay;
        const typingDelay=choice.typingDelay===undefined?500:choice.typingDelay;
        if(shouldSend){
          s4AddSmsBubble(choice.out||choice.text,'out');
          s4Timer(()=>s4AddSmsStatus('Vu','out'),seenDelay);
        }
        if(choice.reply){
          s4Timer(()=>{
            s4Typing();
            s4Timer(()=>{
              s4StopTyping();
              s3Notify();
              s4AddSmsBubble(choice.reply,'in');
              s4FlowContinueButton(choice.continueText,()=>s4FlowNext(choice.next));
            },typingDelay);
          },shouldSend?seenDelay+80:120);
        }else{
          s4Timer(()=>s4FlowContinueButton(choice.continueText,()=>s4FlowNext(choice.next)),shouldSend?seenDelay+180:80);
        }
      };
      box.appendChild(b);
    });
    return;
  }
  if(node.next)s4FlowContinueButton(node.continueText,()=>s4FlowNext(node.next));
}
function s4ShowEndCardLegacy(node,bg,audio){
  s4Mode('s4talk');s4SetBg(bg);s4SetAudioMode(audio||bg);
  s4SetDialogue(node.title||'FIN DE L’ÉPISODE',node.quote||'Carrow Lake garde désormais un secret de plus.');
  s4Buttons([{kind:'continue',text:node.buttonText||'REVENIR AU MENU PRINCIPAL',fn:()=>{s4StopAll();goHome()}}]);
}
function s4ShowEndCard(node,bg,audio){
  s4Mode('s4end');s4SetBg(bg);s4SetAudioMode(audio||bg);
  s4ClearFlowSave(s4SceneNumber());
  const content=$('s4endContent');
  if(!content)return;
  content.innerHTML='';
  const kicker=document.createElement('div');
  kicker.className='s4-end-kicker';
  kicker.textContent=node.title||'FIN DE L’ÉPISODE';
  const quote=document.createElement('div');
  quote.className='s4-end-quote';
  quote.textContent='“'+s4Txt(node.quote||'Carrow Lake garde désormais un secret de plus.')+'”';
  const button=document.createElement('button');
  button.className='s4-end-home';
  button.textContent=node.buttonText||'REVENIR À L’ÉCRAN D’ACCUEIL';
  button.onclick=()=>{s4StopAll();if(window.goHome)window.goHome();else show('sh','block')};
  content.appendChild(kicker);
  content.appendChild(quote);
  content.appendChild(button);
}
function s4RunNarrative(lines,done,label,bg){
  s4Mode('s4narr');s4SetBg(bg);
  s4SetAudioMode(bg||s4Place('cemetery'));
  const data=s4Data();
  $('s4narrLabel').textContent=label||(data&&data.title)||`SCÈNE ${s4SceneNumber()}`;
  s4State.narr=lines||[];s4State.narrIdx=0;s4State.narrDone=done;
  s4RenderNarr(true);
}
function s4RenderNarr(first){
  const el=$('s4narrText'),text=s4Txt(s4State.narr[s4State.narrIdx]||'');
  const paint=()=>{el.innerHTML=text.split('\n').map(line=>line?`<span>${line}</span>`:'<span style="height:8px;display:block"></span>').join('');el.classList.remove('hid');s4HandleNarrativeCue(text)};
  if(first){el.classList.add('hid');s4Timer(paint,80)}else{el.classList.add('hid');s4Timer(paint,620)}
  s4RenderPg();
}
function s4RenderPg(){
  const pg=$('s4narrPg'),total=Math.max(1,s4State.narr.length),pct=Math.round(((s4State.narrIdx+1)/total)*100);
  pg.innerHTML=`<div class="narr-progress"><div style="width:${pct}%"></div></div>`;
}
function s4NarrNext(){
  if($('s4').style.display==='none')return;
  s4State.narrIdx++;
  if(s4State.narrIdx>=s4State.narr.length){const done=s4State.narrDone;s4State.narrDone=null;if(done)done();return}
  s4RenderNarr(false);
}
function s4SetDialogue(speaker,text){
  const box=$('s4dialogue');
  box.classList.add('is-changing');
  s4Timer(()=>{ $('s4speaker').textContent=speaker;box.textContent=s4Txt(text);box.classList.remove('is-changing') },180);
}
function s4Buttons(items){
  const box=$('s4talkActions');box.innerHTML='';
  items.forEach(item=>{
    const b=document.createElement('button');
    b.className='s4-btn'+(item.kind==='continue'?' continue':'');
    b.textContent=item.text;
    b.onclick=item.fn;
    box.appendChild(b);
  });
}
function s4TalkQueue(lines,done,bg){
  s4Mode('s4talk');s4SetBg(bg);
  s4State.talk=lines||[];s4State.talkIdx=0;s4State.talkDone=done;
  s4RenderTalk();
}
function s4RenderTalk(){
  const line=s4State.talk[s4State.talkIdx];
  if(!line){const done=s4State.talkDone;s4State.talkDone=null;if(done)done();return}
  s4SetDialogue(line.speaker,line.text);
  s4Buttons([{kind:'continue',text:s4State.talkIdx===s4State.talk.length-1?'Continuer':'Continuer',fn:s4TalkNext}]);
}
function s4TalkNext(){
  s4State.talkIdx++;
  if(s4State.talkIdx>=s4State.talk.length){const done=s4State.talkDone;s4State.talkDone=null;if(done)done();return}
  s4RenderTalk();
}
function s4ShowChoice(prompt,choices,bg,onPick){
  s4Mode('s4talk');s4SetBg(bg);
  s4SetDialogue('CHOIX',prompt);
  s4Buttons(choices.map((choice,i)=>({text:(STORY_LETTERS[i]||choice.key||'')+'  '+s4Txt(choice.text),fn:()=>onPick(choice)})));
}
function s4ShowApproachChoice(){
  const data=s4Data();
  s4ShowChoice(data.approach.prompt,data.approach.choices,s4Place('cemetery'),choice=>{
    const branch=data.approach[choice.key];
    s4RunNarrative(branch.narrative,()=>{s4UnlockProgress('meet');s4TalkQueue([{speaker:'LOU',text:branch.lou}],()=>s4ShowChoice2(),s4Place('cemetery'))},data.title,s4Place('cemetery'));
  });
}
function s4ShowChoice2(){
  const data=s4Data();
  s4ShowChoice(data.choice2.prompt,data.choice2.choices,s4Place('cemetery'),choice=>{
    s4TalkQueue([{speaker:'LOU',text:data.choice2[choice.key]}],()=>s4ShowCommonChoice(),s4Place('cemetery'));
  });
}
function s4ShowCommonChoice(){
  const data=s4Data();
  s4ShowChoice(data.commonChoice.prompt,[{key:'A',text:data.commonChoice.text}],s4Place('cemetery'),()=>{
    s4TalkQueue([{speaker:'LOU',text:data.commonChoice.lou}],()=>s4RunNarrative(data.morningExit,()=>s4RunNarrative(data.morning,()=>s4ShowChoice3(),data.title,s4Place('forest')),data.title,s4Place('cemetery')),s4Place('cemetery'));
  });
}
function s4ShowChoice3(){
  const data=s4Data();
  s4ShowChoice(data.choice3.prompt,data.choice3.choices,s4Place('forest'),choice=>{
    s4TalkQueue([{speaker:'LOU',text:data.choice3[choice.key]}],()=>{s4UnlockProgress('run');s4RunNarrative(data.run,()=>s4ShowChoice4(),data.title,s4Place('forest'))},s4Place('forest'));
  });
}
function s4ShowChoice4(){
  const data=s4Data();
  s4ShowChoice(data.choice4.prompt,data.choice4.choices,s4Place('forest'),choice=>{
    s4TalkQueue([{speaker:'LOU',text:data.choice4.lou}],()=>s4RunNarrative(data.finalPrompt,()=>s4ShowFinalChoice(),data.title,s4Place('forest')),s4Place('forest'));
  });
}
function s4ShowFinalChoice(){
  const data=s4Data();
  s4ShowChoice(data.finalChoice.prompt,data.finalChoice.choices,s4Place('forest'),choice=>{
    const path=choice.key,block=data[path];
    if(!block){show('sso','flex');return}
    const bg=choice.bg||block.bg||(path==='cave'?s4Place('cave'):s4Place('forest'));
    s4UnlockProgress('path',path);
    s4RunNarrative(block.intro,()=>s4ShowPathChoice(path),data.title,bg);
  });
}
function s4ShowPathChoice(path){
  const data=s4Data(),block=data[path];
  const bg=block.bg||(path==='cave'?s4Place('cave'):s4Place('forest'));
  s4ShowChoice(block.choice.prompt,block.choice.choices,bg,()=>{
    s4RunNarrative(block.reveal,()=>s4RunNarrative(block.escape,()=>s4RunNarrative(data.conclusion,()=>s4ShowSms(),data.title,s4Place('overlook')),data.title,bg),data.title,bg);
  });
}
function s4ShowSms(){
  const data=s4Data();
  s4Mode('s4sms');s4SetBg(s4Place('overlook'));
  s4SetPhoneTime((data&&data.phoneTime)||'00:00');
  $('s4smsName').textContent=data.sms.sender;
  $('s4msgs').innerHTML='';$('s4smsActions').innerHTML='';
  s4Timer(()=>{
    s3Notify();
    const d=document.createElement('div');d.className='s3-bubble s3-in';d.textContent=s4Txt(data.sms.text);$('s4msgs').appendChild(d);
    const b=document.createElement('button');b.className='s3-choice s3-continue';b.textContent=data.sms.continueText||'Regarder la ville';b.onclick=()=>s4RunNarrative(data.afterSms,()=>s4EndEpisode(),data.title,s4Place('overlook'));$('s4smsActions').appendChild(b);
  },650);
}
function s4EndEpisode(){
  s4StopAll();
  const data=s4Data(),nextScene=s4NextScene(data);
  s4UnlockProgress('end');
  gs.scene=nextScene;gs.narrIdx=0;sv();
  if(hasScene(nextScene)){startScene(nextScene,0);return}
  show('sso','flex');
}

function s4BaseAudio(){
  const ctx=s3Ctx();if(!ctx)return null;
  if(s4Audio.started)return ctx;
  s4Audio.started=true;
  s4Audio.gain=ctx.createGain();s4Audio.gain.gain.value=0;s4Audio.gain.connect(s3Audio.master);
  return ctx;
}
function s4ClearModeAudio(){
  const ctx=s3Audio.ctx;
  s4Audio.timers.forEach(t=>t.type==='interval'?clearInterval(t.id):clearTimeout(t.id));
  s4Audio.timers=[];
  s4Audio.oscillators.forEach(o=>{try{o.stop(ctx?ctx.currentTime+.2:0)}catch(e){}});
  s4Audio.oscillators=[];
  if(s4Audio.gain&&ctx)s4Audio.gain.gain.setTargetAtTime(0,ctx.currentTime,.35);
}
function s4Drone(freqs,gain){
  const ctx=s4BaseAudio();if(!ctx)return;
  freqs.forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=i===0?'sine':'triangle';o.frequency.value=f;g.gain.value=i===0?.8:.24;o.connect(g);g.connect(s4Audio.gain);o.start();s4Audio.oscillators.push(o)});
  s4Audio.gain.gain.setTargetAtTime(gain,ctx.currentTime,1.4);
}
function s4SetAudioMode(mode){
  if(s4Audio.mode===mode)return;
  s4ClearModeAudio();s4Audio.mode=mode;
  if(mode==='cemetery'){
    s4Drone([36,52,71],.04);
    s4AudioInterval(()=>s3Noise(1.15,.024,240),4200);
    return;
  }
  if(mode==='forest'){
    s4Drone([42,63],.038);
    s4AudioInterval(()=>s3Noise(.6,.02,520),3600);
    return;
  }
  if(mode==='cave'){
    s4Drone([31,46,58],.085);
    s4AudioInterval(()=>{s3Noise(.07,.028,760);s4AudioTimer(()=>s3Noise(.12,.024,520),520)},1900);
    return;
  }
  if(mode==='overlook'){
    s4Drone([34,49,67],.065);
    s4AudioInterval(()=>s3Noise(1.2,.024,260),3900);
    return;
  }
  if(mode==='siren'){
    s4Drone([28,41,57],.082);
    s4PlaySiren();
    s4AudioInterval(()=>s4PlaySiren(),5200);
    s4AudioInterval(()=>s4PlayMarch(),1850);
    return;
  }
  if(mode==='hunt'){
    s4Drone([32,48,64],.068);
    s4AudioInterval(()=>s4PlayMarch(),2100);
    s4AudioInterval(()=>s3Noise(.75,.024,300),3600);
    return;
  }
  if(mode==='forestRoad'){
    s4Drone([30,45,61],.052);
    s4AudioInterval(()=>s3Noise(1.1,.018,220),4300);
    s4AudioInterval(()=>s4PlayTwig(),5400);
    return;
  }
  if(mode==='blackStream'){
    s4Drone([35,53],.048);
    s4AudioInterval(()=>{s3Noise(.18,.026,520);s4AudioTimer(()=>s3Noise(.12,.018,760),420)},1600);
    return;
  }
  if(mode==='northgate'){
    s4Drone([39,58,76],.056);
    s4AudioInterval(()=>{s3Noise(.22,.032,1600);s4AudioTimer(()=>s3Tone(310,.09,'sawtooth',.014),90)},2300);
    return;
  }
  if(mode==='brambles'){
    s4Drone([31,47,69],.054);
    s4AudioInterval(()=>s3Noise(.32,.026,920),2200);
    return;
  }
  if(mode==='giantTree'){
    s4Drone([26,39,52],.034);
    s4AudioInterval(()=>s3Noise(1.4,.012,180),6200);
    return;
  }
  if(mode==='whiteRoom'){
    s4Drone([60,121],.028);
    s4AudioInterval(()=>s3Tone(880,.035,'sine',.006),5200);
    return;
  }
  if(mode==='silence'){
    s4BaseAudio();
  }
}
function s4PlayTwig(){s3Noise(.18,.026,920);s4AudioTimer(()=>s3Tone(128,.08,'triangle',.016),70)}
function s4PlayLeaves(){s3Noise(.4,.018,900)}
function s4PlaySteps(){[0,240,480].forEach(ms=>s4AudioTimer(()=>s3Tone(78,.07,'triangle',.022),ms))}
function s4PlayVoice(){s3Tone(410,.16,'sine',.014);s4AudioTimer(()=>s3Tone(360,.18,'triangle',.012),80)}
function s4PlayScrape(){s3Noise(.7,.045,300)}
function s4PlayZip(){s3Noise(.22,.03,1300)}
function s4PlaySiren(){
  [0,420,840].forEach(ms=>s4AudioTimer(()=>{
    s3Tone(380,.62,'sawtooth',.072);
    s3Tone(540,.56,'triangle',.048);
    s3Noise(.32,.03,620);
  },ms));
}
function s4PlayMarch(){[0,340,680,1020].forEach(ms=>s4AudioTimer(()=>s3Tone(64,.12,'triangle',.028),ms))}
function s4HandleNarrativeCue(text){
  if(/branche craque/i.test(text))s4PlayTwig();
  if(/foulées|feuilles mortes|boue/i.test(text))s4PlayLeaves();
  if(/course à toute vitesse|sprinte|se met à courir/i.test(text))s4PlaySteps();
  if(/À l'aide|plainte féminine/i.test(text))s4PlayVoice();
  if(/frottement humide/i.test(text))s4PlayScrape();
  if(/fermeture éclair/i.test(text))s4PlayZip();
  if(/Gouffre des Murmures/i.test(text))s4UnlockProgress('cues','gouffre');
  if(/IL Y A DEUX LOU/i.test(text))s4UnlockProgress('cues','fakeLou');
  if(/sirène/i.test(text)){s4UnlockProgress('cues','siren');s4PlaySiren()}
  if(/multitude de pas/i.test(text))s4PlayMarch();
}

// ---- src/ui/UI.js ----
function hi() {
  const e = $('svhi');
  if (e) e.textContent = gs.char ? 'Reprendre · ' + gs.char : 'Nouvelle partie';
}

function goHome() {
  s2StopAmbience();
  s3StopAll();
  s4StopAll();
  closeNewsModal();
  closeWallpaperModal();
  show('sh', 'block');
  hi();
  updateProgressHomeButton();
  updateNewsBadge();
}

async function handlePlay() {
  if (gs.char) {
    if (gs.scene === 1) {
      show('ssms', 'flex');
      startSMS(true);
    } else if (hasScene(gs.scene)) {
      startScene(gs.scene, gs.narrIdx);
    } else {
      show('sso', 'flex');
    }
  } else {
    show('schar', 'flex');
  }
}

async function handleRestart() {
  s2StopAmbience();
  s3StopAll();
  s4StopAll();
  await restartStoryKeepProgress();
  hi();
  updateProgressHomeButton();
  updateNewsBadge();
  show('schar', 'flex');
}

function selectChar(name) {
  gs.char = name;
  gs.scene = 1;
  gs.narrIdx = 0;
  sv();
  hi();
  show('ssms', 'flex');
  startSMS(false);
}

// ---- src/core/SceneLoader.js ----
const DEFAULT_FIRST_SCENE = 2;
const DEFAULT_MAX_SCENE = 99;
const DEFAULT_STOP_AFTER_MISSES = 3;

function sceneId(sceneNumber) {
  return String(sceneNumber).padStart(2, '0');
}

function loadClassicScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve(true);
    script.onerror = () => {
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

async function loadSceneFiles(options = {}) {
  const first = options.first || DEFAULT_FIRST_SCENE;
  const max = options.max || DEFAULT_MAX_SCENE;
  const stopAfterMisses = options.stopAfterMisses || DEFAULT_STOP_AFTER_MISSES;
  const loaded = [];
  let misses = 0;

  for (let sceneNumber = first; sceneNumber <= max; sceneNumber += 1) {
    const fileName = `scene-${sceneId(sceneNumber)}.js`;
    const didLoad = await loadClassicScript(`./scenes/${fileName}`);

    if (!didLoad) {
      misses += 1;
      if (misses >= stopAfterMisses) break;
      continue;
    }

    loaded.push(fileName);
    misses = 0;
  }

  window.CL_LOADED_SCENE_FILES = loaded;
  return loaded;
}

// ---- src/main.js ----
function applyHashShortcuts() {
  if (location.hash === '#scene3') {
    replaceGs(Object.assign(baseState(), { char: 'Elyos', scene: 3, narrIdx: 0 }));
    sv();
    hi();
    startScene(3, 0);
  }
  if (location.hash === '#scene4') {
    replaceGs(Object.assign(baseState(), { char: 'Elyos', scene: 4, narrIdx: 0 }));
    sv();
    hi();
    startScene(4, 0);
  }
  if (location.hash === '#scene5') {
    replaceGs(Object.assign(baseState(), { char: 'Elyos', scene: 5, narrIdx: 0 }));
    sv();
    hi();
    startScene(5, 0);
  }
}

setAfterNormalizeHook(async () => {
  syncProgressFromSave();
  hi();
  updateProgressHomeButton();
  updateNewsBadge();
  applyHashShortcuts();
});

const api = {
  handlePlay,
  handleRestart,
  goHome,
  selectChar,
  openProgressScreen,
  openNewsModal,
  closeNewsModal,
  openWallpaperModal,
  closeWallpaperModal,
  narrNext,
  s3NarrNext,
  s4NarrNext,
};

Object.assign(window, api);

document.addEventListener('pointerdown', () => globalStartAmbience(), true);
document.addEventListener(
  'pointerdown',
  (e) => {
    if (e.target.closest('button')) uiClick();
  },
  true
);
document.addEventListener(
  'pointerdown',
  (e) => {
    const btn = e.target.closest('#sh .hb');
    if (!btn) return;
    btn.classList.add('home-press');
    clearTimeout(btn.homePressTimer);
    btn.homePressTimer = setTimeout(() => btn.classList.remove('home-press'), 250);
  },
  true
);

async function bootGame() {
  await loadSceneFiles();
  await ld();
}

bootGame();
