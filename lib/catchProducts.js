const mysql = require('mysql')
const config = require('./config/config.json')

module.exports = {

    p1 : function (pid) {
        return new Promise(function (resolve, reject) {
            var conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
            });
            conn.query('SELECT  *  FROM `product` WHERE  `pid` = ' + pid, function (error, results) {
                if (error) throw error;
                // product = results[0]
                resolve(results[0])
            })
            conn.end()
        })
    },

    p2 : function (product_img_dot) {
        return new Promise(function (resolve, reject) {
            var conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
            });
            if (product_img_dot) {
                conn.query('SELECT  *  FROM `bb_img` WHERE  `img_id` IN (' + product_img_dot + ')', function (error, results) {
                    if (error) throw error;
                    resolve(results)
                })
            } else {
                resolve()
                conn.end()
            }
        })
    },

    p3 : function (pid) {
        return new Promise(function (resolve, reject) {
            var conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
            });
            conn.query('SELECT  *  FROM `product_detail` WHERE  `pid` = ' + pid, function (error, results) {
                if (error) throw error;
                resolve(results)
            })
            conn.end()
        })
    },

    p4 : function (pid) {
        return new Promise(function (resolve, reject) {
            var conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
            });
            conn.query('SELECT `product_real_price`,`product_show_price` FROM `product` WHERE  `pid` = ' + pid, function (error, results) {
                if (error) throw error;
                resolve(results)
            })
            conn.end()
        })
    },

    p5 : function (pid) {
        return new Promise(function (resolve, reject) {
            var conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
            });
            conn.query('SELECT `product_plan` FROM `product` WHERE  `pid` = ' + pid, function (error, results) {
                if (error) throw error;
                resolve(results)
            })
            conn.end()
        })
    }

}