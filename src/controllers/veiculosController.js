const { db } = require('../database');
const marcasPermitidas = ['Chevrolet', 'Ford', 'Volkswagen', 'Fiat', 'Toyota', 'Honda', 'Hyundai', 'Nissan'];

function validarMarca(marca) {
  return marcasPermitidas.includes(marca);
}

exports.listar = (req, res) => {
  const { marca, ano, cor } = req.query;

  let sql = 'SELECT * FROM veiculos';
  const filtros = [];
  const valores = [];

  if (marca) {
    filtros.push('LOWER(marca) = ?');
    valores.push(marca.toLowerCase());
  }

  if (ano) {
    filtros.push('ano = ?');
    valores.push(Number(ano));
  }

  if (cor) {
    filtros.push('LOWER(cor) = ?');
    valores.push(cor.toLowerCase());
  }

  if (filtros.length > 0) {
    sql += ' WHERE ' + filtros.join(' AND ');
  }

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};


exports.buscarPorId = (req, res) => {
  db.get('SELECT * FROM veiculos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (!row) return res.status(404).json({ erro: 'Veículo não encontrado' });
    res.json(row);
  });
};

exports.criar = (req, res) => {
  const { veiculo, marca, ano, descricao, vendido } = req.body;
  if (!validarMarca(marca)) return res.status(400).json({ erro: 'Marca inválida' });

  const sql = `INSERT INTO veiculos (veiculo, marca, ano, descricao, vendido)
               VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [veiculo, marca, ano, descricao, vendido || 0], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ id: this.lastID });
  });
};

exports.atualizar = (req, res) => {
  const { veiculo, marca, ano, descricao, vendido } = req.body;
  if (!validarMarca(marca)) return res.status(400).json({ erro: 'Marca inválida' });

  const sql = `UPDATE veiculos SET veiculo = ?, marca = ?, ano = ?, descricao = ?, vendido = ?, updated = CURRENT_TIMESTAMP WHERE id = ?`;
  db.run(sql, [veiculo, marca, ano, descricao, vendido, req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ alterado: this.changes });
  });
};

exports.atualizarParcial = (req, res) => {
  const campos = Object.keys(req.body);
  const valores = Object.values(req.body);

  if (req.body.marca && !validarMarca(req.body.marca)) {
    return res.status(400).json({ erro: 'Marca inválida' });
  }

  const sets = campos.map(c => `${c} = ?`).join(', ') + ', updated = CURRENT_TIMESTAMP';
  const sql = `UPDATE veiculos SET ${sets} WHERE id = ?`;

  db.run(sql, [...valores, req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ alterado: this.changes });
  });
};

exports.deletar = (req, res) => {
  db.run('DELETE FROM veiculos WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(204).end();
  });
};

exports.contarNaoVendidos = (req, res) => {
  db.get('SELECT COUNT(*) as total FROM veiculos WHERE vendido = 0', [], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(row);
  });
};

exports.distribuicaoPorDecada = (req, res) => {
  db.all(`SELECT (ano / 10) * 10 as decada, COUNT(*) as total
          FROM veiculos GROUP BY decada ORDER BY decada`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows.map(r => ({ decada: `Década de ${Math.floor(r.decada)}`, total: r.total })));
  });
};

exports.distribuicaoPorMarca = (req, res) => {
  db.all('SELECT marca, COUNT(*) as total FROM veiculos GROUP BY marca', [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};

exports.cadastradosUltimaSemana = (req, res) => {
  db.all(`SELECT * FROM veiculos
          WHERE DATE(created) >= DATE('now', '-7 days')`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};
