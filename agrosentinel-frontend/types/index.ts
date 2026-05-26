export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  crop_type: string;
  country: string;
  polygon: GeoJSON.Polygon;
  created_at: string;
}

export interface Alert {
  id: string;
  farm_id: string;
  severity: Severity;
  disease_detected: string | null;
  ndvi_score: number;
  evi_score: number;
  confidence: number;
  recommendation: string;
  satellite_image_url: string;
  analyzed_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  country: string;
  language: 'en' | 'fr' | 'sw' | 'ha' | 'yo';
  notification_method: 'sms' | 'whatsapp';
}
