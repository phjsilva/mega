const pool = require("../database/db");

async function last(_req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM megasena ORDER BY concurso DESC LIMIT 1`,
        );
        if (result.rowCount == 0) {
            return res
                .status(404)
                .json({ error: "Nenhum concurso encontrado" });
        } else {
            return res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
}

async function getConcurso(req, res) {
    try {
        const { concurso } = req.params;
        if (/^\d+$/.test(concurso) == false) {
            return res
                .status(400)
                .json({ error: "Concurso deve ser um número inteiro" });
        }
        const result = await pool.query(
            `SELECT * FROM megasena WHERE concurso = $1`,
            [concurso],
        );
        if (result.rowCount == 0) {
            return res.status(404).json({ error: "Concurso não encontrado" });
        } else {
            return res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { last, getConcurso };
