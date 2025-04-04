
const express = require('express');
const cors = require('cors');
const db = require('./dbConnection');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes for Zones
app.get('/api/zonas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM zonas');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching zonas:', error);
    res.status(500).json({ message: 'Error al obtener zonas' });
  }
});

// Routes for Subzones
app.get('/api/subzonas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subzonas');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching subzonas:', error);
    res.status(500).json({ message: 'Error al obtener subzonas' });
  }
});

app.get('/api/subzonas/:zonaId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subzonas WHERE zona_id = ?', [req.params.zonaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching subzonas by zona:', error);
    res.status(500).json({ message: 'Error al obtener subzonas' });
  }
});

// Routes for Churches
app.get('/api/iglesias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM iglesias');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching iglesias:', error);
    res.status(500).json({ message: 'Error al obtener iglesias' });
  }
});

app.get('/api/iglesias/subzona/:subzonaId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM iglesias WHERE subzona_id = ?', [req.params.subzonaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching iglesias by subzona:', error);
    res.status(500).json({ message: 'Error al obtener iglesias' });
  }
});

// Routes for Ministers
app.get('/api/ministerios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ministerios');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ministerios:', error);
    res.status(500).json({ message: 'Error al obtener ministerios' });
  }
});

app.get('/api/ministerios/iglesia/:iglesiaId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT m.*, GROUP_CONCAT(c.cargo) AS cargos FROM ministerios m LEFT JOIN ministerio_cargo mc ON m.id = mc.ministerio_id LEFT JOIN cargos c ON mc.cargo_id = c.id WHERE m.iglesia_id = ? GROUP BY m.id', [req.params.iglesiaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ministerios by iglesia:', error);
    res.status(500).json({ message: 'Error al obtener ministerios' });
  }
});

// Get Minister roles
app.get('/api/ministerio/:ministerioId/cargos', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT c.id, c.cargo FROM ministerio_cargo mc JOIN cargos c ON mc.cargo_id = c.id WHERE mc.ministerio_id = ?', 
      [req.params.ministerioId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cargos for ministerio:', error);
    res.status(500).json({ message: 'Error al obtener cargos del ministerio' });
  }
});

// Get observations for a minister
app.get('/api/ministerio/:ministerioId/observaciones', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM observaciones WHERE ministerio_id = ?',
      [req.params.ministerioId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching observaciones:', error);
    res.status(500).json({ message: 'Error al obtener observaciones' });
  }
});

// Get all role types
app.get('/api/cargos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cargos');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cargos:', error);
    res.status(500).json({ message: 'Error al obtener cargos' });
  }
});

// Get all status types
app.get('/api/estados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estados');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching estados:', error);
    res.status(500).json({ message: 'Error al obtener estados' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
