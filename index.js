const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'raktar_db',
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.error('Hiba az adatbázis csatlakozáskor:', err);
        return;
    }
    console.log('Sikeres kapcsolat az adatbázissal!');
});

//1
app.get('/termekek', (req, res) => {
    const sql = 'SELECT termekek.*, kategoriak.nev AS kategoriak_neve FROM termekek INNER JOIN kategoriak ON termekek.kategoria_id = kategoriak.id ORDER BY termekek.ar ASC;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

//2
app.get('/termekek/elerheto', (req, res) => {
    const sql = 'SELECT * FROM termekek WHERE elerheto = 1 AND keszlet > 0;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

//3
app.get('/termekek/kereses/fej', (req, res) => {
    const sql = "SELECT * FROM termekek WHERE nev LIKE '%fej%';";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

//4
app.get('/kategoriak/statisztika', (req, res) => {
    const sql = 'SELECT kategoriak.nev, COUNT(*) AS darabszam, ROUND(AVG(termekek.ar)) AS atlagar FROM kategoriak kategoriak INNER JOIN termekek termekek ON kategoriak.id = termekek.kategoria_id GROUP BY kategoriak.nev;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

//5
app.get('/termekek/dragak', (req, res) => {
    const sql = 'SELECT nev, ar, keszlet FROM termekek WHERE ar > 10000 ORDER BY keszlet DESC;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT} címen.`);
});