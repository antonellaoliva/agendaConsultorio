const db = require('../config/db');

const Sucursal = {
    getSucursales: async () => {
        try {
            const [results] = await db.query('SELECT * FROM sucursal');
            return results;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Sucursal;
