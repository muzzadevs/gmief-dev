
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
app.use(express.urlencoded({ extended: true }));

// Función para manejar errores de las consultas
const handleQueryError = (error, res, errorMessage) => {
  console.error(errorMessage, error);
  res.status(500).json({ error: errorMessage });
};

// ==================== ZONAS API ====================
// GET - Obtener todas las zonas
app.get('/api/zonas', async (req, res) => {
  try {
    console.log('Consultando zonas en la base de datos...');
    const [rows] = await db.query('SELECT * FROM zonas ORDER BY nombre');
    console.log(`Zonas recuperadas: ${rows.length}`);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, 'Error al obtener las zonas');
  }
});

// GET - Obtener una zona por ID
app.get('/api/zonas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM zonas WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    handleQueryError(error, res, `Error al obtener la zona con ID ${req.params.id}`);
  }
});

// POST - Crear nueva zona
app.post('/api/zonas', async (req, res) => {
  try {
    const { nombre, codigo } = req.body;
    
    if (!nombre || !codigo) {
      return res.status(400).json({ error: 'Nombre y código son obligatorios' });
    }
    
    const [result] = await db.query('INSERT INTO zonas (nombre, codigo) VALUES (?, ?)', [nombre, codigo]);
    
    const [newZona] = await db.query('SELECT * FROM zonas WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newZona[0]);
  } catch (error) {
    handleQueryError(error, res, 'Error al crear la zona');
  }
});

// PUT - Actualizar zona existente
app.put('/api/zonas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    
    if (!nombre && !codigo) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
    
    // Verificar si la zona existe
    const [existingZona] = await db.query('SELECT * FROM zonas WHERE id = ?', [id]);
    
    if (existingZona.length === 0) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }
    
    // Actualizar solo los campos proporcionados
    const updateFields = [];
    const updateValues = [];
    
    if (nombre !== undefined) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    
    if (codigo !== undefined) {
      updateFields.push('codigo = ?');
      updateValues.push(codigo);
    }
    
    await db.query(`UPDATE zonas SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, id]);
    
    const [updatedZona] = await db.query('SELECT * FROM zonas WHERE id = ?', [id]);
    
    res.json(updatedZona[0]);
  } catch (error) {
    handleQueryError(error, res, `Error al actualizar la zona con ID ${req.params.id}`);
  }
});

// DELETE - Eliminar zona
app.delete('/api/zonas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay subzonas asociadas
    const [subzonas] = await db.query('SELECT * FROM subzonas WHERE zona_id = ?', [id]);
    
    if (subzonas.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la zona porque tiene subzonas asociadas',
        count: subzonas.length
      });
    }
    
    const [result] = await db.query('DELETE FROM zonas WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }
    
    res.json({ message: 'Zona eliminada correctamente' });
  } catch (error) {
    handleQueryError(error, res, `Error al eliminar la zona con ID ${req.params.id}`);
  }
});

// ==================== SUBZONAS API ====================
// GET - Obtener todas las subzonas
app.get('/api/subzonas', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, z.nombre as zona_nombre 
      FROM subzonas s 
      JOIN zonas z ON s.zona_id = z.id
      ORDER BY z.nombre, s.nombre
    `);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, 'Error al obtener las subzonas');
  }
});

// GET - Obtener subzonas por zona
app.get('/api/subzonas/:zonaId', async (req, res) => {
  try {
    const { zonaId } = req.params;
    const [rows] = await db.query(`
      SELECT s.*, z.nombre as zona_nombre 
      FROM subzonas s 
      JOIN zonas z ON s.zona_id = z.id
      WHERE s.zona_id = ?
      ORDER BY s.nombre
    `, [zonaId]);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, `Error al obtener subzonas de la zona ${req.params.zonaId}`);
  }
});

// POST - Crear subzona
app.post('/api/subzonas', async (req, res) => {
  try {
    const { nombre, zona_id } = req.body;
    
    if (!nombre || !zona_id) {
      return res.status(400).json({ error: 'Nombre y zona_id son obligatorios' });
    }
    
    // Verificar si la zona existe
    const [zona] = await db.query('SELECT * FROM zonas WHERE id = ?', [zona_id]);
    
    if (zona.length === 0) {
      return res.status(400).json({ error: 'La zona especificada no existe' });
    }
    
    const [result] = await db.query('INSERT INTO subzonas (nombre, zona_id) VALUES (?, ?)', [nombre, zona_id]);
    
    const [newSubzona] = await db.query(`
      SELECT s.*, z.nombre as zona_nombre 
      FROM subzonas s 
      JOIN zonas z ON s.zona_id = z.id
      WHERE s.id = ?
    `, [result.insertId]);
    
    res.status(201).json(newSubzona[0]);
  } catch (error) {
    handleQueryError(error, res, 'Error al crear la subzona');
  }
});

// PUT - Actualizar subzona
app.put('/api/subzonas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, zona_id } = req.body;
    
    if (!nombre && !zona_id) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
    
    // Verificar si la subzona existe
    const [existingSubzona] = await db.query('SELECT * FROM subzonas WHERE id = ?', [id]);
    
    if (existingSubzona.length === 0) {
      return res.status(404).json({ error: 'Subzona no encontrada' });
    }
    
    // Si se proporciona zona_id, verificar que exista
    if (zona_id) {
      const [zona] = await db.query('SELECT * FROM zonas WHERE id = ?', [zona_id]);
      
      if (zona.length === 0) {
        return res.status(400).json({ error: 'La zona especificada no existe' });
      }
    }
    
    // Actualizar solo los campos proporcionados
    const updateFields = [];
    const updateValues = [];
    
    if (nombre !== undefined) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    
    if (zona_id !== undefined) {
      updateFields.push('zona_id = ?');
      updateValues.push(zona_id);
    }
    
    await db.query(`UPDATE subzonas SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, id]);
    
    const [updatedSubzona] = await db.query(`
      SELECT s.*, z.nombre as zona_nombre 
      FROM subzonas s 
      JOIN zonas z ON s.zona_id = z.id
      WHERE s.id = ?
    `, [id]);
    
    res.json(updatedSubzona[0]);
  } catch (error) {
    handleQueryError(error, res, `Error al actualizar la subzona con ID ${req.params.id}`);
  }
});

// DELETE - Eliminar subzona
app.delete('/api/subzonas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay iglesias asociadas
    const [iglesias] = await db.query('SELECT * FROM iglesias WHERE subzona_id = ?', [id]);
    
    if (iglesias.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la subzona porque tiene iglesias asociadas',
        count: iglesias.length
      });
    }
    
    const [result] = await db.query('DELETE FROM subzonas WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Subzona no encontrada' });
    }
    
    res.json({ message: 'Subzona eliminada correctamente' });
  } catch (error) {
    handleQueryError(error, res, `Error al eliminar la subzona con ID ${req.params.id}`);
  }
});

// ==================== IGLESIAS API ====================
// GET - Obtener todas las iglesias
app.get('/api/iglesias', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
      FROM iglesias i 
      JOIN subzonas s ON i.subzona_id = s.id 
      JOIN zonas z ON s.zona_id = z.id
      ORDER BY i.nombre
    `);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, 'Error al obtener las iglesias');
  }
});

// GET - Obtener iglesia por ID
app.get('/api/iglesias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
      FROM iglesias i 
      JOIN subzonas s ON i.subzona_id = s.id 
      JOIN zonas z ON s.zona_id = z.id
      WHERE i.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    handleQueryError(error, res, `Error al obtener la iglesia con ID ${req.params.id}`);
  }
});

// GET - Obtener iglesias por subzona
app.get('/api/iglesias/subzona/:subzonaId', async (req, res) => {
  try {
    const { subzonaId } = req.params;
    const [rows] = await db.query(`
      SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
      FROM iglesias i 
      JOIN subzonas s ON i.subzona_id = s.id 
      JOIN zonas z ON s.zona_id = z.id
      WHERE i.subzona_id = ?
      ORDER BY i.nombre
    `, [subzonaId]);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, `Error al obtener iglesias de la subzona ${req.params.subzonaId}`);
  }
});

// POST - Crear iglesia
app.post('/api/iglesias', async (req, res) => {
  try {
    const { nombre, direccion, municipio, provincia, subzona_id, cp } = req.body;
    
    if (!nombre || !subzona_id || !municipio || !provincia) {
      return res.status(400).json({ error: 'Nombre, subzona_id, municipio y provincia son obligatorios' });
    }
    
    // Verificar si la subzona existe
    const [subzona] = await db.query('SELECT * FROM subzonas WHERE id = ?', [subzona_id]);
    
    if (subzona.length === 0) {
      return res.status(400).json({ error: 'La subzona especificada no existe' });
    }
    
    const [result] = await db.query(
      `INSERT INTO iglesias (nombre, direccion, municipio, provincia, subzona_id, cp) 
       VALUES (?, ?, ?, ?, ?, ?)`, 
      [nombre, direccion || 'NULL', municipio, provincia, subzona_id, cp || null]
    );
    
    const [newIglesia] = await db.query(`
      SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
      FROM iglesias i 
      JOIN subzonas s ON i.subzona_id = s.id 
      JOIN zonas z ON s.zona_id = z.id
      WHERE i.id = ?
    `, [result.insertId]);
    
    res.status(201).json(newIglesia[0]);
  } catch (error) {
    handleQueryError(error, res, 'Error al crear la iglesia');
  }
});

// PUT - Actualizar iglesia
app.put('/api/iglesias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, municipio, provincia, subzona_id, cp } = req.body;
    
    if (!nombre && !direccion && !municipio && !provincia && !subzona_id && cp === undefined) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
    
    // Verificar si la iglesia existe
    const [existingIglesia] = await db.query('SELECT * FROM iglesias WHERE id = ?', [id]);
    
    if (existingIglesia.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }
    
    // Si se proporciona subzona_id, verificar que exista
    if (subzona_id) {
      const [subzona] = await db.query('SELECT * FROM subzonas WHERE id = ?', [subzona_id]);
      
      if (subzona.length === 0) {
        return res.status(400).json({ error: 'La subzona especificada no existe' });
      }
    }
    
    // Actualizar solo los campos proporcionados
    const updateFields = [];
    const updateValues = [];
    
    if (nombre !== undefined) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    
    if (direccion !== undefined) {
      updateFields.push('direccion = ?');
      updateValues.push(direccion || 'NULL');
    }
    
    if (municipio !== undefined) {
      updateFields.push('municipio = ?');
      updateValues.push(municipio);
    }
    
    if (provincia !== undefined) {
      updateFields.push('provincia = ?');
      updateValues.push(provincia);
    }
    
    if (subzona_id !== undefined) {
      updateFields.push('subzona_id = ?');
      updateValues.push(subzona_id);
    }
    
    if (cp !== undefined) {
      updateFields.push('cp = ?');
      updateValues.push(cp || null);
    }
    
    await db.query(`UPDATE iglesias SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, id]);
    
    const [updatedIglesia] = await db.query(`
      SELECT i.*, s.nombre as subzona_nombre, z.nombre as zona_nombre 
      FROM iglesias i 
      JOIN subzonas s ON i.subzona_id = s.id 
      JOIN zonas z ON s.zona_id = z.id
      WHERE i.id = ?
    `, [id]);
    
    res.json(updatedIglesia[0]);
  } catch (error) {
    handleQueryError(error, res, `Error al actualizar la iglesia con ID ${req.params.id}`);
  }
});

// DELETE - Eliminar iglesia
app.delete('/api/iglesias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay ministerios asociados
    const [ministerios] = await db.query('SELECT * FROM ministerios WHERE iglesia_id = ?', [id]);
    
    if (ministerios.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la iglesia porque tiene ministerios asociados',
        count: ministerios.length
      });
    }
    
    const [result] = await db.query('DELETE FROM iglesias WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }
    
    res.json({ message: 'Iglesia eliminada correctamente' });
  } catch (error) {
    handleQueryError(error, res, `Error al eliminar la iglesia con ID ${req.params.id}`);
  }
});

// ==================== MINISTERIOS API ====================
// GET - Obtener todos los ministerios
app.get('/api/ministerios', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
      ORDER BY m.nombre
    `);
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, 'Error al obtener los ministerios');
  }
});

// GET - Obtener ministerio por ID
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
    handleQueryError(error, res, `Error al obtener el ministerio con ID ${req.params.id}`);
  }
});

// GET - Obtener ministerios por iglesia
app.get('/api/ministerios/iglesia/:iglesiaId', async (req, res) => {
  try {
    const { iglesiaId } = req.params;
    const [ministerios] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
      WHERE m.iglesia_id = ?
      ORDER BY m.nombre
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
    handleQueryError(error, res, `Error al obtener los ministerios de la iglesia ${req.params.iglesiaId}`);
  }
});

// POST - Crear ministerio
app.post('/api/ministerios', async (req, res) => {
  try {
    const { 
      nombre, apellidos, alias, iglesia_id, 
      codigo, estado_id, aprob, telefono, email, cargos 
    } = req.body;
    
    if (!nombre || !apellidos || !iglesia_id || !codigo || !estado_id || !aprob) {
      return res.status(400).json({ 
        error: 'Nombre, apellidos, iglesia_id, codigo, estado_id y aprob son obligatorios' 
      });
    }
    
    // Verificar si la iglesia existe
    const [iglesia] = await db.query('SELECT * FROM iglesias WHERE id = ?', [iglesia_id]);
    
    if (iglesia.length === 0) {
      return res.status(400).json({ error: 'La iglesia especificada no existe' });
    }
    
    // Verificar si el estado existe
    const [estado] = await db.query('SELECT * FROM estados WHERE id = ?', [estado_id]);
    
    if (estado.length === 0) {
      return res.status(400).json({ error: 'El estado especificado no existe' });
    }
    
    // Iniciar transacción
    await db.query('START TRANSACTION');
    
    // Insertar ministerio
    const [result] = await db.query(
      `INSERT INTO ministerios (nombre, apellidos, alias, iglesia_id, codigo, estado_id, aprob, telefono, email) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [nombre, apellidos, alias || null, iglesia_id, codigo, estado_id, aprob, telefono || null, email || null]
    );
    
    const ministerioId = result.insertId;
    
    // Si se proporcionan cargos, insertarlos en la tabla de relación
    if (cargos && Array.isArray(cargos) && cargos.length > 0) {
      for (const cargoId of cargos) {
        // Verificar si el cargo existe
        const [existingCargo] = await db.query('SELECT * FROM cargos WHERE id = ?', [cargoId]);
        
        if (existingCargo.length === 0) {
          // Hacer rollback si un cargo no existe
          await db.query('ROLLBACK');
          return res.status(400).json({ error: `El cargo con ID ${cargoId} no existe` });
        }
        
        // Insertar relación ministerio-cargo
        await db.query(
          'INSERT INTO ministerio_cargo (ministerio_id, cargo_id) VALUES (?, ?)',
          [ministerioId, cargoId]
        );
      }
    }
    
    // Confirmar transacción
    await db.query('COMMIT');
    
    // Obtener el ministerio recién creado con todos sus datos
    const [newMinisterio] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
      WHERE m.id = ?
    `, [ministerioId]);
    
    // Obtener los cargos del ministerio
    const [ministeroCargos] = await db.query(`
      SELECT c.* 
      FROM cargos c
      JOIN ministerio_cargo mc ON c.id = mc.cargo_id
      WHERE mc.ministerio_id = ?
    `, [ministerioId]);
    
    newMinisterio[0].cargos = ministeroCargos;
    
    res.status(201).json(newMinisterio[0]);
  } catch (error) {
    // Rollback en caso de error
    await db.query('ROLLBACK');
    handleQueryError(error, res, 'Error al crear el ministerio');
  }
});

// PUT - Actualizar ministerio
app.put('/api/ministerios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, apellidos, alias, iglesia_id, 
      codigo, estado_id, aprob, telefono, email, cargos 
    } = req.body;
    
    if (!nombre && !apellidos && !alias && !iglesia_id && !codigo && 
        !estado_id && aprob === undefined && !telefono && !email && !cargos) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
    
    // Verificar si el ministerio existe
    const [existingMinisterio] = await db.query('SELECT * FROM ministerios WHERE id = ?', [id]);
    
    if (existingMinisterio.length === 0) {
      return res.status(404).json({ error: 'Ministerio no encontrado' });
    }
    
    // Si se proporciona iglesia_id, verificar que exista
    if (iglesia_id) {
      const [iglesia] = await db.query('SELECT * FROM iglesias WHERE id = ?', [iglesia_id]);
      
      if (iglesia.length === 0) {
        return res.status(400).json({ error: 'La iglesia especificada no existe' });
      }
    }
    
    // Si se proporciona estado_id, verificar que exista
    if (estado_id) {
      const [estado] = await db.query('SELECT * FROM estados WHERE id = ?', [estado_id]);
      
      if (estado.length === 0) {
        return res.status(400).json({ error: 'El estado especificado no existe' });
      }
    }
    
    // Iniciar transacción
    await db.query('START TRANSACTION');
    
    // Actualizar solo los campos proporcionados
    const updateFields = [];
    const updateValues = [];
    
    if (nombre !== undefined) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    
    if (apellidos !== undefined) {
      updateFields.push('apellidos = ?');
      updateValues.push(apellidos);
    }
    
    if (alias !== undefined) {
      updateFields.push('alias = ?');
      updateValues.push(alias || null);
    }
    
    if (iglesia_id !== undefined) {
      updateFields.push('iglesia_id = ?');
      updateValues.push(iglesia_id);
    }
    
    if (codigo !== undefined) {
      updateFields.push('codigo = ?');
      updateValues.push(codigo);
    }
    
    if (estado_id !== undefined) {
      updateFields.push('estado_id = ?');
      updateValues.push(estado_id);
    }
    
    if (aprob !== undefined) {
      updateFields.push('aprob = ?');
      updateValues.push(aprob);
    }
    
    if (telefono !== undefined) {
      updateFields.push('telefono = ?');
      updateValues.push(telefono || null);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email || null);
    }
    
    if (updateFields.length > 0) {
      await db.query(`UPDATE ministerios SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, id]);
    }
    
    // Si se proporcionan cargos, actualizar la relación
    if (cargos && Array.isArray(cargos)) {
      // Eliminar todos los cargos actuales
      await db.query('DELETE FROM ministerio_cargo WHERE ministerio_id = ?', [id]);
      
      // Insertar los nuevos cargos
      for (const cargoId of cargos) {
        // Verificar si el cargo existe
        const [existingCargo] = await db.query('SELECT * FROM cargos WHERE id = ?', [cargoId]);
        
        if (existingCargo.length === 0) {
          // Hacer rollback si un cargo no existe
          await db.query('ROLLBACK');
          return res.status(400).json({ error: `El cargo con ID ${cargoId} no existe` });
        }
        
        // Insertar relación ministerio-cargo
        await db.query(
          'INSERT INTO ministerio_cargo (ministerio_id, cargo_id) VALUES (?, ?)',
          [id, cargoId]
        );
      }
    }
    
    // Confirmar transacción
    await db.query('COMMIT');
    
    // Obtener el ministerio actualizado con todos sus datos
    const [updatedMinisterio] = await db.query(`
      SELECT m.*, i.nombre as iglesia_nombre, e.nombre as estado_nombre
      FROM ministerios m
      JOIN iglesias i ON m.iglesia_id = i.id
      JOIN estados e ON m.estado_id = e.id
      WHERE m.id = ?
    `, [id]);
    
    // Obtener los cargos del ministerio
    const [ministerioCargos] = await db.query(`
      SELECT c.* 
      FROM cargos c
      JOIN ministerio_cargo mc ON c.id = mc.cargo_id
      WHERE mc.ministerio_id = ?
    `, [id]);
    
    updatedMinisterio[0].cargos = ministerioCargos;
    
    res.json(updatedMinisterio[0]);
  } catch (error) {
    // Rollback en caso de error
    await db.query('ROLLBACK');
    handleQueryError(error, res, `Error al actualizar el ministerio con ID ${req.params.id}`);
  }
});

// DELETE - Eliminar ministerio
app.delete('/api/ministerios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Iniciar transacción
    await db.query('START TRANSACTION');
    
    // Eliminar las relaciones ministerio-cargo
    await db.query('DELETE FROM ministerio_cargo WHERE ministerio_id = ?', [id]);
    
    // Eliminar el ministerio
    const [result] = await db.query('DELETE FROM ministerios WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      // Hacer rollback si el ministerio no existe
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Ministerio no encontrado' });
    }
    
    // Confirmar transacción
    await db.query('COMMIT');
    
    res.json({ message: 'Ministerio eliminado correctamente' });
  } catch (error) {
    // Rollback en caso de error
    await db.query('ROLLBACK');
    handleQueryError(error, res, `Error al eliminar el ministerio con ID ${req.params.id}`);
  }
});

// ====================== CARGOS API ======================
// GET - Obtener todos los cargos
app.get('/api/cargos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cargos ORDER BY cargo');
    res.json(rows);
  } catch (error) {
    handleQueryError(error, res, 'Error al obtener los cargos');
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT} en modo ${config.NODE_ENV}`);
  console.log('Conexión a la base de datos establecida');
});
