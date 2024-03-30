// Importar as bibliotecas necessárias
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

// Inicializar o aplicativo Express
const app = express();
const port = process.env.PORT || 3000;
const db = new sqlite3.Database(':memory:');

// Criar uma tabela de exemplo
db.serialize(() => {
    db.run("CREATE TABLE producer (id INTEGER PRIMARY KEY AUTOINCREMENT, year TEXT, title TEXT, studios TEXT, producers TEXT, winner INTEGER)");

    // Ler o arquivo CSV
    fs.createReadStream('./movielist.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {

            // Removendo os espaços em branco antes e depois dos valores
            const cleanRow = Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key, value.trim()])
            );

            // Inserir os dados na tabela do SQLite
            db.run(`INSERT INTO producer (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`, [
                cleanRow.year,
                cleanRow.title,
                cleanRow.studios,
                cleanRow.producers,
                cleanRow.winner ? 1 : 0
            ], (err) => {
                if (err) {
                    console.error('Erro ao inserir os dados:', err);
                }
            });
        });
});

// Endpoint para obter o produtor com maior intervalo entre dois prêmios consecutivos e o que obteve dois prêmios mais rápido
app.get('/raspberries/interval', (req, res) => {
    db.all(`
    SELECT producers as producer, previous_win_year as previousWin, following_win_year as followingWin, interval
        FROM (
            SELECT
                producers,
                MIN(previous_win_year) AS previous_win_year,
                MIN(following_win_year) AS following_win_year,
                MIN(interval) AS interval
            FROM
                (
                    SELECT
                        p1.producers,
                        p1.year AS previous_win_year,
                        MIN(p2.year) AS following_win_year,
                        MIN(p2.year) - p1.year AS interval
                    FROM
                        producer p1
                    JOIN
                        producer p2 ON p1.producers = p2.producers
                    WHERE
                        p1.year < p2.year
                        AND p1.winner = 1
                        AND p2.winner = 1
                    GROUP BY
                        p1.producers, p1.year
                ) AS subquery
            GROUP BY
                producers
            ORDER BY
                interval DESC
            LIMIT 1
        )
        UNION ALL
        SELECT producers, previous_win_year, following_win_year, interval
        FROM (
            SELECT
                producers,
                MIN(previous_win_year) AS previous_win_year,
                MIN(following_win_year) AS following_win_year,
                MIN(interval) AS interval
            FROM
                (
                    SELECT
                        p1.producers,
                        p1.year AS previous_win_year,
                        MIN(p2.year) AS following_win_year,
                        MIN(p2.year) - p1.year AS interval
                    FROM
                        producer p1
                    JOIN
                        producer p2 ON p1.producers = p2.producers
                    WHERE
                        p1.year < p2.year
                        AND p1.winner = 1
                        AND p2.winner = 1
                    GROUP BY
                        p1.producers, p1.year
                ) AS subquery
            GROUP BY
                producers
            ORDER BY
                interval ASC
            LIMIT 1
    );
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            "min": rows,
            "max": rows
        });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
