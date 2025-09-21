
export enum Mode {
  Image = 'Image',
  Video = 'Video',
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface AppState {
  prompt: string;
  negativePrompt: string;
  baseImage: string | null;
  baseImageMimeType: string | null;
  blendImage: string | null;
  blendImageMimeType: string | null;
  aspectRatio: AspectRatio;
  mode: Mode;
}

export interface GeneratedMedia {
  id: string;
  src: string;
  type: 'image' | 'video';
  text: string | null;
  mimeType?: string;
}

export interface Creation extends AppState {
  id?: number;
  createdAt: Date;
  generatedMedia: GeneratedMedia;
}
