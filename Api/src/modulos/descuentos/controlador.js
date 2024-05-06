const FIELDS = ['id_descuento', 'cantidad_descuento'];
const ID_FIELD = 'id_descuento';
const TABLE_NAME = 'tb_descuentos';


module.exports = function(db){
    async function todos(){
        return db.todos(TABLE_NAME);
    }

    async function uno(id){
        return db.uno(TABLE_NAME, id, ID_FIELD);
    }

    async function querySelect(){
        return db.querySelect(FIELDS, TABLE_NAME);
    }
    async function agregar(body){
        return db.agregar(TABLE_NAME, body);
    }

    async function actualizar(body){
        const {id_descuento, ...datos} = body;
        return db.actualizar(TABLE_NAME, datos, ID_FIELD, id_descuento);
    }

    async function eliminar(id_descuento){
        return db.eliminar(TABLE_NAME, id_descuento, ID_FIELD);
    }

    return{
        todos, 
        uno,
        querySelect, 
        agregar, 
        actualizar,
        eliminar
    }
}
