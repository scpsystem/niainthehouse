export type ChapterId = 'bangun' | 'bersih' | 'pakaian' | 'fasa1Tamat';
export type OutfitId = 'asal' | 'pink' | 'tidur';
export type SceneId = 'bedroomMessy' | 'bedroomTidy' | 'bathroom' | 'sinkClose' | 'wardrobe';
export type Emotion = 'neutral' | 'happy' | 'sad' | 'hungry' | 'think' | 'sleepy';
export type NiaPose = 'stand' | 'sleep' | 'hidden';
export type NiaAnim = 'idle' | 'walk' | 'happy' | 'sad' | 'hungry' | 'pop' | 'wash' | 'none';
export type NiaFx = 'poof' | 'hungry' | 'sparkle' | null;
export type ActivityId = 'makeBed' | 'brushTeeth' | 'washFace' | 'shower';

/** Semua koordinat dalam peratus (0-100) ruang permainan 16:9. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface NiaView {
  /** Kedudukan kaki Nia (tengah-bawah), peratus ruang permainan. */
  x: number;
  y: number;
  /** Tinggi sprite sebagai pecahan tinggi ruang permainan (0-1). */
  h: number;
  pose: NiaPose;
  anim: NiaAnim;
  /** Tempoh pergerakan (ms). 0 = terus ke kedudukan. */
  moveMs: number;
  fx: NiaFx;
  /** Bayang samar di belakang tirai mandi. */
  silhouette: boolean;
}

export interface Camera {
  z: number;
  ox: number;
  oy: number;
  ms: number;
}

export interface Choice {
  label: string;
  icon?: string;
  correct?: boolean;
  /** Petunjuk apabila jawapan salah. */
  hint?: string;
  /** Respons Nia apabila jawapan betul. */
  reply?: string;
}

export interface Target {
  id: string;
  rect: Rect;
  label: string;
}

export type Step =
  | { t: 'scene'; scene: SceneId; nia?: Partial<NiaView>; camera?: Partial<Camera> }
  | { t: 'say'; text: string; emotion?: Emotion }
  | { t: 'ask'; text: string; choices: Choice[]; emotion?: Emotion }
  | { t: 'move'; x: number; y?: number; ms: number }
  | { t: 'nia'; patch: Partial<NiaView>; wait?: number }
  | { t: 'camera'; camera: Partial<Camera> }
  | { t: 'fg'; on: boolean }
  | { t: 'wait'; ms: number }
  | { t: 'tap'; prompt: string; targets: Target[]; emotion?: Emotion }
  | { t: 'activity'; id: ActivityId }
  | { t: 'outfit'; prompt: string; accept: OutfitId[] }
  | { t: 'applyOutfit' }
  | { t: 'stars'; n: number }
  | { t: 'chapterEnd'; next: ChapterId }
  | { t: 'end' };

export interface SaveData {
  name: string;
  chapter: ChapterId;
  stars: number;
  outfit: OutfitId;
  updatedAt: number;
}

export interface DialogueState {
  text: string;
  emotion: Emotion;
  kind: 'say' | 'ask' | 'prompt' | 'feedback';
  choices?: Choice[];
  /** Indeks pilihan yang perlu disorot (bantuan berperingkat). */
  highlight?: number | null;
}

export type Phase = 'busy' | 'say' | 'ask' | 'tap' | 'activity' | 'outfit';

/** Alat yang diberikan kepada setiap aktiviti interaktif. */
export interface ActivityCtx {
  /** Maklum balas Nia (tidak menghalang aktiviti). */
  say: (text: string, emotion?: Emotion) => void;
  setNia: (patch: Partial<NiaView>) => void;
  done: () => void;
  playerName: string;
}
