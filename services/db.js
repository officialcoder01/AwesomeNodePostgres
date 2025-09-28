const pg = require('pg');

const confiq = {
    user: 'school_reg', //this is the db user credential
    database: 'school_register',
    password: 'school_reg',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(confiq);

pool.on('connect', () => {
    console.log('connected to the db');
});

const createTables = () => {
    const schoolTable = `CREATE TABLE IF NOT EXISTS
      students(
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(128) NOT NULL,
        student_age INT NOT NULL,
        student_class VARCHAR(128) NOT NULL,
        parent_contact VARCHAR(128) NOT NULL,
        admission_date VARCHAR(128) NOT NULL
      )`;
    pool.query(schoolTable)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

//export pool and createTables to be accessible from anywhere within the application
module.exports = {
    createTables,
    pool,
};

require('make-runnable');