const express = require('express');
const app = express();
const { pool } = require('./services/db');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to Our School Registration API');
});

app.get('/student', (req, res) => {
    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM students';

        client.query(query, (err, result) => {
            done();
            if (err) {
                return res.status(400).json(err);
            }
            if (!result.rows || result.rows.length < 1) {
                return res.status(404).send({
                    status: 'Failed',
                    message: 'No student information found'
                })
            } else {
                return res.status(200).send({
                    status: 'Success',
                    message: 'Students information retrieved',
                    students: result.rows
                });
            }
        });

    });
});

app.post('/student', (req, res) => {
    const data = {
        name: req.body.studentName,
        age: req.body.studentAge,
        classroom: req.body.studentClass,
        parents: req.body.parentContact,
        admission: req.body.admissionDate
    };

    pool.connect((err, client, done) => {
        const query = 'INSERT INTO students(student_name, student_age, student_class, parent_contact, admission_date) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [data.name, data.age, data.classroom, data.parents, data.admission];

        client.query(query, values, (err, result) => {
            done();
            if (err) {
                return res.status(400).json(err);
            }
            return res.status(201).send({
                status: 'Success',
                message: 'Student information added successfully',
                student: result.rows[0]
            });
        });
    });
});

app.get('/student/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        return res.status(404).send({
            status: 'Failed',
            message: 'Not a valid student ID'
        });
    }
    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM students WHERE id=$1';
        const values = [id];

        client.query(query, values, (err, result) => {
            done();
            if (err) {
                return res.status(400).json(err);
            }
            if (!result.rows || result.rows.length < 1) {
                return res.status(404).send({
                    status: 'Failed',
                    message: 'No student infomation found'
                })
            }

            return res.status(200).send({
                status: 'Success',
                message: 'Student infomation retrieved',
                student: result.rows[0]
            });
        });
    });
});

app.listen(port, () => {
    console.log(`We are live at 127.0.0.1:${port}`);
});

