
export interface Location {
  id: string;
  name: string;
  region: 'North' | 'Central' | 'South';
  description?: string;
}

export interface Costume {
  id: string;
  name: string;
  ethnicGroup: string;
}

export interface PhotoState {
  images: string[];
  selectedLocation: string;
  customLocation: string;
  selectedCostume: string;
  isGenerating: boolean;
  resultImage: string | null;
  error: string | null;
}
