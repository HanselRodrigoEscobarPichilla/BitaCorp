export interface Binnacle {
    id_binnacle: number,
    title: string,
    descriptions: string,
    effects: string,
    place: string,
    date_event: string,
    users_id: number
}

export interface Evidence {
    id_evidence: number,
    file_path: string,
    file_type: string,
    binnacle_id: number
}

export interface Aggressor {
    id_aggressors: number,
    aggressors_type: string,
    description_aggressors: string,
    binnacle_id: number
}

export interface CreateBinnacleDTO extends Binnacle {
    aggressors: Aggressor[],
    evidences: Evidence[]
}

export interface BinnacleResponse extends Binnacle {
    creation_date: string,
    state: string,
    manager_id: number | null,
    user_email: string,
    author_email: string,
    aggressors: Aggressor[],
    evidences: Evidence[]
}
