import gorila0 from './images/Gorilas/gorila.png';
import gorila1 from './images/Gorilas/gorila (1).png';
import gorila2 from './images/Gorilas/gorila (2).png';
import gorila3 from './images/Gorilas/gorila (3).png';
import gorila4 from './images/Gorilas/gorila (4).png';
import gorila5 from './images/Gorilas/gorila (5).png';
import gorila6 from './images/Gorilas/gorila (6).png';
import gorila7 from './images/Gorilas/gorila (7).png';

export type AvatarId =
  | 'gorila-0'
  | 'gorila-1'
  | 'gorila-2'
  | 'gorila-3'
  | 'gorila-4'
  | 'gorila-5'
  | 'gorila-6'
  | 'gorila-7';

export interface AvatarOption {
  id: AvatarId;
  label: string;
  src: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'gorila-0', label: 'Atlas', src: gorila0 },
  { id: 'gorila-1', label: 'Nova', src: gorila1 },
  { id: 'gorila-2', label: 'Kumo', src: gorila2 },
  { id: 'gorila-3', label: 'Tiki', src: gorila3 },
  { id: 'gorila-4', label: 'Zuri', src: gorila4 },
  { id: 'gorila-5', label: 'Roku', src: gorila5 },
  { id: 'gorila-6', label: 'Mika', src: gorila6 },
  { id: 'gorila-7', label: 'Bongo', src: gorila7 },
];

export const DEFAULT_AVATAR_ID: AvatarId = AVATAR_OPTIONS[0].id;

export function getAvatarOption(avatarId: string | null | undefined): AvatarOption {
  return AVATAR_OPTIONS.find((option) => option.id === avatarId) ?? AVATAR_OPTIONS[0];
}