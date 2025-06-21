const db = require('../config/db');
const questions = require('../data/soal_jawaban_inggis_pembahasan.json');

exports.importQuestions = async (req, res) => {
  const values = questions.map(q => [
    q.id,
    q.question,
    q.options[0],
    q.options[1],
    q.options[2],
    q.options[3],
    q.answer,
    q.explanation
  ]);

  const insertQuery = `
    INSERT INTO questions 
    (id, question, a, b, c, d, answer, explanation)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      question = VALUES(question),
      a = VALUES(a),
      b = VALUES(b),
      c = VALUES(c),
      d = VALUES(d),
      answer = VALUES(answer),
      explanation = VALUES(explanation)
  `;

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('❌ Error bulk inserting:', err.message);
      return res.status(500).send('❌ Bulk import failed: ' + err.message);
    }
    res.send(`✅ ${result.affectedRows} rows processed successfully!`);
  });
};
