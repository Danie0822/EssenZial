const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'marcas_mas_vendidas';
const TABLE_NAMEI = 'perfumes_mas_vendidos';
const TABLE_NAMEII = 'ventas_ultimos_meses';

// Funciones y llamada de db 
module.exports = function (db) {

    async function marcasVendidas() {
        return db.todos(TABLE_NAME);
    }
    async function perfumesVendidos() {
        return db.todos(TABLE_NAMEI);
    }
    async function ventaMeses() {
        return db.todos(TABLE_NAMEII);
    }


    return {
        marcasVendidas,
        perfumesVendidos, 
        ventaMeses
    };
};