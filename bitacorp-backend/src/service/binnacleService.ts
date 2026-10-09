import db from '../config/database';
import { CreateBinnacleDTO, BinnacleResponse } from '../model/binnacleModel';

export class BinnacleService {

    private validateBinnacle(data: CreateBinnacleDTO, requireUser: boolean = false): void {
        const { title, descriptions, effects, place, date_event, users_id } = data;

        if (!title || !descriptions || !effects || !place || !date_event) {
            throw new Error("Todos los campos obligatorios de la bitácora deben estar completos.");
        }

        if (requireUser && !users_id) {
            throw new Error("El usuario es obligatorio para crear la bitácora.");
        }
    }

    private async attachRelations(binnacles: any[]): Promise<void> {
        for (const binnacle of binnacles) {
            const [aggressors]: any = await db.query(
                'SELECT id_aggressors, aggressors_type, description_aggressors FROM Aggressors WHERE binnacle_id = ?',
                [binnacle.id_binnacle]
            );
            const [evidences]: any = await db.query(
                'SELECT id_evidence, file_path, file_type FROM Evidence WHERE binnacle_id = ?',
                [binnacle.id_binnacle]
            );

            binnacle.aggressors = aggressors;
            binnacle.evidences = evidences;
        }
    }

    private async resolveManagerId(usersId: number): Promise<number> {
        const [managers]: any = await db.query(
            'SELECT id_managers FROM Managers WHERE users_id = ?',
            [usersId]
        );
        if (managers.length === 0) {
            throw new Error("Encargado no encontrado.");
        }
        return managers[0].id_managers;
    }

    async listBinnacle(): Promise<BinnacleResponse[]> {
        const query = `
            SELECT 
                b.id_binnacle,
                b.title,
                b.descriptions,
                b.effects,
                b.place,
                b.date_event,
                b.creation_date,
                b.state_binnacle AS state,
                b.managers_id AS manager_id,
                b.users_id,
                u.email AS user_email
            FROM Binnacle b
            INNER JOIN Users u ON b.users_id = u.id_users;
        `;
        const [binnacles]: any = await db.query(query);
        await this.attachRelations(binnacles);
        return binnacles as BinnacleResponse[];
    }

    async listBinnaclesUser(userId: number, search?: string): Promise<BinnacleResponse[]> {
        let query = `
            SELECT 
                b.id_binnacle,
                b.title,
                b.descriptions,
                b.effects,
                b.place,
                b.date_event,
                b.creation_date,
                b.state_binnacle AS state,
                b.managers_id AS manager_id,
                b.users_id
            FROM Binnacle b
            WHERE b.users_id = ?
        `;

        const params: any[] = [userId];

        if (search && search.trim() !== '') {
            query += ` AND (b.title LIKE ? OR b.descriptions LIKE ?)`;
            const term = `%${search.trim()}%`;
            params.push(term, term);
        }

        const [binnacles]: any = await db.query(query, params);
        await this.attachRelations(binnacles);
        return binnacles as BinnacleResponse[];
    }

    async createBinnacle(data: CreateBinnacleDTO): Promise<void> {
        this.validateBinnacle(data, true);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result]: any = await connection.query(
                'INSERT INTO Binnacle (title, descriptions, effects, place, date_event, users_id) VALUES (?, ?, ?, ?, ?, ?)',
                [data.title, data.descriptions, data.effects, data.place, data.date_event, data.users_id]
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
                        'INSERT INTO Evidence (file_path, file_type, binnacle_id) VALUES (?, ?, ?)',
                        [evidence.file_path, evidence.file_type || 'Documento', binnacleId]
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
                'UPDATE Binnacle SET title = ?, descriptions = ?, effects = ?, place = ?, date_event = ? WHERE id_binnacle = ?',
                [data.title, data.descriptions, data.effects, data.place, data.date_event, id]
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

            if (data.evidences && data.evidences.length > 0) {
                await connection.query('DELETE FROM Evidence WHERE binnacle_id = ?', [id]);
                for (const evidence of data.evidences) {
                    await connection.query(
                        'INSERT INTO Evidence (file_path, file_type, binnacle_id) VALUES (?, ?, ?)',
                        [evidence.file_path, evidence.file_type || 'Documento', id]
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

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('DELETE FROM Evidence WHERE binnacle_id = ?', [id]);
            await connection.query('DELETE FROM Aggressors WHERE binnacle_id = ?', [id]);
            await connection.query('DELETE FROM Binnacle WHERE id_binnacle = ?', [id]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getBinnacleById(id: number): Promise<BinnacleResponse> {
        const query = `
            SELECT 
                b.id_binnacle,
                b.title,
                b.descriptions,
                b.effects,
                b.place,
                b.date_event,
                b.creation_date,
                b.state_binnacle AS state,
                b.managers_id AS manager_id,
                b.users_id
            FROM Binnacle b
            WHERE b.id_binnacle = ?
        `;

        const [binnacles]: any = await db.query(query, [id]);
        if (binnacles.length === 0) {
            throw new Error("Bitácora no encontrada.");
        }

        await this.attachRelations(binnacles);
        return binnacles[0] as BinnacleResponse;
    }

    async listBinnaclesManager(search?: string): Promise<BinnacleResponse[]> {
        let query = `
            SELECT 
                b.id_binnacle,
                b.title,
                b.descriptions,
                b.effects,
                b.place,
                b.date_event,
                b.creation_date,
                b.state_binnacle AS state,
                b.managers_id AS manager_id,
                b.users_id,
                u.email AS author_email
            FROM Binnacle b
            JOIN Users u ON b.users_id = u.id_users
            WHERE b.managers_id IS NULL AND (b.state_binnacle = 'Pendiente' OR b.state_binnacle = 'En revision')
        `;
        const params: any[] = [];

        if (search && search.trim() !== '') {
            query += ` AND (b.title LIKE ? OR b.descriptions LIKE ?)`;
            const term = `%${search.trim()}%`;
            params.push(term, term);
        }

        const [binnacles]: any = await db.query(query, params);
        await this.attachRelations(binnacles);
        return binnacles as BinnacleResponse[];
    }

    async inReview(binnacleId: number): Promise<void> {
        await db.query(
            "UPDATE Binnacle SET state_binnacle = 'En revision' WHERE id_binnacle = ? AND state_binnacle = 'Pendiente'",
            [binnacleId]
        );
    }

    async takeCase(binnacleId: number, managerUserId: number): Promise<void> {
        const managerId = await this.resolveManagerId(managerUserId);

        const [activeCases]: any = await db.query(
            "SELECT COUNT(*) as count FROM Binnacle WHERE managers_id = ? AND state_binnacle = 'En proceso'",
            [managerId]
        );

        if (activeCases[0].count >= 5) {
            throw new Error("Has alcanzado el límite máximo de 5 casos activos simultáneos.");
        }

        const [binnacle]: any = await db.query(
            "SELECT managers_id, state_binnacle FROM Binnacle WHERE id_binnacle = ?",
            [binnacleId]
        );

        if (binnacle.length === 0) throw new Error("La bitácora no existe.");
        if (binnacle[0].managers_id !== null) throw new Error("Este caso ya fue tomado por otro agente.");

        await db.query(
            "UPDATE Binnacle SET managers_id = ?, state_binnacle = 'En proceso' WHERE id_binnacle = ?",
            [managerId, binnacleId]
        );
    }

    async cancelCase(binnacleId: number, managerUserId: number): Promise<void> {
        const managerId = await this.resolveManagerId(managerUserId);
        await db.query(
            "UPDATE Binnacle SET managers_id = NULL, state_binnacle = 'En revision' WHERE id_binnacle = ? AND managers_id = ?",
            [binnacleId, managerId]
        );
    }

    async resolveCase(binnacleId: number, managerUserId: number): Promise<void> {
        const managerId = await this.resolveManagerId(managerUserId);
        await db.query(
            "UPDATE Binnacle SET state_binnacle = 'Resuelto' WHERE id_binnacle = ? AND managers_id = ?",
            [binnacleId, managerId]
        );
    }

    async listBinnaclesManagerHistory(managerUserId: number, search?: string): Promise<BinnacleResponse[]> {
        const managerId = await this.resolveManagerId(managerUserId);

        let query = `
            SELECT 
                b.id_binnacle,
                b.title,
                b.descriptions,
                b.effects,
                b.place,
                b.date_event,
                b.creation_date,
                b.state_binnacle AS state,
                b.managers_id AS manager_id,
                b.users_id,
                u.email AS author_email
            FROM Binnacle b
            JOIN Users u ON b.users_id = u.id_users
            WHERE b.managers_id = ?
        `;
        const params: any[] = [managerId];

        if (search && search.trim() !== '') {
            query += ` AND (b.title LIKE ? OR b.descriptions LIKE ?)`;
            const term = `%${search.trim()}%`;
            params.push(term, term);
        }

        const [binnacles]: any = await db.query(query, params);
        await this.attachRelations(binnacles);
        return binnacles as BinnacleResponse[];
    }
}
