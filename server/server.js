const express = require('express');
const cors = require('cors');
const db = require('./dbConnection');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = config.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Función para manejar errores de las consultas
const handleQueryError = (error, res, errorMessage) => {
  console.error(errorMessage, error);
  res.status(500).json({ error: errorMessage });
};

// API Endpoints
app.get('/api/zonas', async (req, res) => {
  try {
    console.log('Consultando zonas en la base de datos...');
    const [rows] = await db.query('SELECT * FROM zonas');
    console.log(`Zonas recuperadas: ${rows.length}`);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, 'Error al obtener las zonas');
  }
});

app.get('/api/subzonas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT s.*, z.nombre as zona_nombre FROM subzonas s JOIN zonas z ON s.zona_id = z.id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching subzonas:', error);
    res.status(500).json({ error: 'Error al obtener las subzonas' });
  }
});

app.get('/api/subzonas/:zonaId', async (req, res) => {
  try {
    const { zonaId } = req.params;
    const [rows] = await db.query('SELECT * FROM subzonas WHERE zona_id = ?', [zonaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching subzonas by zona:', error);
    res.status(500).json({ error: 'Error al obtener las subzonas por zona' });
  }
});

app.get('/api/iglesias', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
      FROM iglesias i 
      JOIN subzonas s ON i.subzona_id = s.id 
      JOIN zonas z ON s.zona_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching iglesias:', error);
    res.status(500).json({ error: 'Error al obtener las iglesias' });
  }
});

app.get('/api/iglesias/subzona/:subzonaId', async (req, res) => {
  try {
    const { subzonaId } = req.params;
    const [rows] = await db.query(
      `SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
       FROM iglesias i 
       JOIN subzonas s ON i.subzona_id = s.id 
       JOIN zonas z ON s.zona_id = z.id
       WHERE i.subzona_id = ?`, 
      [subzonaId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching iglesias by subzona:', error);
    res.status(500).json({ error: 'Error al obtener las iglesias por subzona' });
  }
});

app.get('/api/iglesias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
       FROM iglesias i 
       JOIN subzonas s ON i.subzona_id = s.id 
       JOIN zonas z ON s.zona_id = z.id
       WHERE i.id = ?`, 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching iglesia by id:', error);
    res.status(500).json({ error: 'Error al obtener la iglesia' });
  }
});

app.get('/api/ministerios', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ministerios:', error);
    res.status(500).json({ error: 'Error al obtener los ministerios' });
  }
});

app.get('/api/ministerios/iglesia/:iglesiaId', async (req, res) => {
  try {
    const { iglesiaId } = req.params;
    const [ministerios] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
      WHERE m.iglesia_id = ?
    `, [iglesiaId]);
    
    // Para cada ministerio, obtener sus cargos
    for (let ministerio of ministerios) {
      const [cargos] = await db.query(`
        SELECT c.* 
        FROM cargos c
        JOIN ministerio_cargo mc ON c.id = mc.cargo_id
        WHERE mc.ministerio_id = ?
      `, [ministerio.id]);
      
      ministerio.cargos = cargos;
    }
    
    res.json(ministerios);
  } catch (error) {
    console.error('Error fetching ministerios by iglesia:', error);
    res.status(500).json({ error: 'Error al obtener los ministerios por iglesia' });
  }
});

app.get('/api/ministerios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [ministerios] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
      WHERE m.id = ?
    `, [id]);
    
    if (ministerios.length === 0) {
      return res.status(404).json({ error: 'Ministerio no encontrado' });
    }
    
    const ministerio = ministerios[0];
    
    // Obtener los cargos del ministerio
    const [cargos] = await db.query(`
      SELECT c.* 
      FROM cargos c
      JOIN ministerio_cargo mc ON c.id = mc.cargo_id
      WHERE mc.ministerio_id = ?
    `, [ministerio.id]);
    
    ministerio.cargos = cargos;
    
    res.json(ministerio);
  } catch (error) {
    console.error('Error fetching ministerio by id:', error);
    res.status(500).json({ error: 'Error al obtener el ministerio' });
  }
});

// Cargos endpoints
app.get('/api/cargos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cargos');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cargos:', error);
    res.status(500).json({ error: 'Error al obtener los cargos' });
  }
});

// Serve static assets in production
if (config.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
  console.log('Database connection established');
});
