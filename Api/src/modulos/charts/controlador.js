const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'marcas_mas_vendidas';
const TABLE_NAMEI = 'perfumes_mas_vendidos';
const TABLE_NAMEII = 'ventas_ultimos_meses';
const TABLE_CATE = 'vw_top_5_categorias';
const TABLE_OLORE = 'vw_top_5_olores';

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
    async function topCategorias() {
        return db.todos(TABLE_CATE);
    }
    async function topOlores() {
        return db.todos(TABLE_OLORE);
    }
    return {
        marcasVendidas,
        perfumesVendidos, 
        ventaMeses,
        topCategorias,
        topOlores
    };
};