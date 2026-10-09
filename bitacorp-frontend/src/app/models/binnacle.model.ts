export interface Aggressor {
  id_aggressors?: number;
  aggressors_type: string;
  description_aggressors: string;
  binnacle_id?: number;
}

export interface Evidence {
  id_evidence?: number;
  file_path: string;
  binnacle_id?: number;
}

export interface BinnacleBase {
  id_binnacle?: number;
  descriptions: string;
  effects: string;
  place: string;
  date_event: string;
  users_id: number;
  state?: string;
  manager_id?: number | null;
}

export interface CreateBinnacleDTO {
  descriptions: string;
  effects: string;
  place: string;
  date_event: string;
  users_id: number;
  aggressors?: Aggressor[];
  evidences?: Evidence[];
}

export interface BinnacleResponse extends BinnacleBase {
  user_email?: string;
  author_email?: string;
  aggressors: Aggressor[];
  evidences: Evidence[];
}