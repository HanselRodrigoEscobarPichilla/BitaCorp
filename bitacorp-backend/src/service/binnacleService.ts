import db from '../config/database';
import { CreateBinnacleDTO, BinnacleResponse } from '../model/binnacleModel';

export class BinnacleService {

    private validateBinnacle(data: CreateBinnacleDTO): void {
        const { descriptions, effects, place, date_event, users_id } = data;

        if (!descriptions || !effects || !place || !date_event || !users_id) {
            throw new Error("Todos los campos obligatorios de la bitácora deben estar completos.");
        }
    }

    async listBinnacle(): Promise<BinnacleResponse[]> {
        const query = `
            SELECT 
                b.id_binnacle,
                b.descriptions,
                b.effects,
                b.place,
                b.date_event,
                b.users_id,
                u.email AS user_email
            FROM Binnacle b
            INNER JOIN Users u ON b.users_id = u.id_users;
        `;
        const [binnacles]: any = await db.query(query);

        for (const binnacle of binnacles) {
            const [aggressors]: any = await db.query(
                'SELECT id_aggressors, aggressors_type, description_aggressors FROM Aggressors WHERE binnacle_id = ?',
                [binnacle.id_binnacle]
            );
            const [evidences]: any = await db.query(
                'SELECT id_evidence, file_path FROM Evidence WHERE binnacle_id = ?',
                [binnacle.id_binnacle]
            );

            binnacle.aggressors = aggressors;
            binnacle.evidences = evidences;
        }

        return binnacles as BinnacleResponse[];
    }

    async createBinnacle(data: CreateBinnacleDTO): Promise<void> {
        this.validateBinnacle(data);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result]: any = await connection.query(
                'INSERT INTO Binnacle (descriptions, effects, place, date_event, users_id) VALUES (?, ?, ?, ?, ?)',
                [data.descriptions, data.effects, data.place, data.date_event, data.users_id]
            );

            const binnacleId = result.insertId;

            if (data.aggressors && data.aggressors.length > 0) {
                for (const aggressor of data.aggressors) {
                    await connection.query(
                        'INSERT INTO Aggressors (aggressors_type, description_aggressors, binnacle_id) VALUES (?, ?, ?)',
                        [aggressor.aggressors_type, aggressor.description_aggressors, binnacleId]
                    );
                }
            }

            if (data.evidences && data.evidences.length > 0) {
                for (const evidence of data.evidences) {
                    await connection.query(
                        'INSERT INTO Evidence (file_path, binnacle_id) VALUES (?, ?)',
                        [evidence.file_path, binnacleId]
                    );
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateBinnacle(id: number, data: CreateBinnacleDTO): Promise<void> {
        this.validateBinnacle(data);

        const [existing]: any = await db.query('SELECT id_binnacle FROM Binnacle WHERE id_binnacle = ?', [id]);
        if (existing.length === 0) {
            throw new Error("La bitácora no existe.");
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE Binnacle SET descriptions = ?, effects = ?, place = ?, date_event = ? WHERE id_binnacle = ?',
                [data.descriptions, data.effects, data.place, data.date_event, id]
            );

            if (data.aggressors) {
                await connection.query('DELETE FROM Aggressors WHERE binnacle_id = ?', [id]);
                for (const aggressor of data.aggressors) {
                    await connection.query(
                        'INSERT INTO Aggressors (aggressors_type, description_aggressors, binnacle_id) VALUES (?, ?, ?)',
                        [aggressor.aggressors_type, aggressor.description_aggressors, id]
                    );
                }
            }

            if (data.evidences) {
                await connection.query('DELETE FROM Evidence WHERE binnacle_id = ?', [id]);
                for (const evidence of data.evidences) {
                    await connection.query(
                        'INSERT INTO Evidence (file_path, binnacle_id) VALUES (?, ?)',
                        [evidence.file_path, id]
                    );
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deleteBinnacle(id: number): Promise<void> {
        const [existing]: any = await db.query('SELECT id_binnacle FROM Binnacle WHERE id_binnacle = ?', [id]);
        if (existing.length === 0) {
            throw new Error("La bitácora no existe.");
        }

        await db.query('DELETE FROM Binnacle WHERE id_binnacle = ?', [id]);
    }
}