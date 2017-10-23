const mysql = require('mysql');

module.exports.create = () =>
{
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "Models",
        multipleStatements: true
    });
}