import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import type { Fields, Files } from 'formidable';
const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    console.log('Método no permitido:', req.method);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Verificar autenticación
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.mi_token;

  if (!token) {
    console.log('No hay token en las cookies');
    return res.status(401).json({ error: 'No autenticado' });
  }

  let studentId: number;
  try {
    const user = JSON.parse(token);
    studentId = user.id;
    console.log(`Procesando record para estudiante ID: ${studentId}`);
  } catch (err) {
    console.error('Error parseando token:', err);
    return res.status(400).json({ error: 'Token inválido' });
  }

  // Configurar formidable
  const form = new formidable.IncomingForm({
    uploadDir: './tmp',
    keepExtensions: true,
  });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err || !files.record) {
      console.error('Error en formidable:', err);
      return res.status(400).json({ 
        error: 'Archivo no recibido', 
        detalle: err?.message 
      });
    }

    const fileField = Array.isArray(files.record) ? files.record[0] : files.record;
    const filePath = fileField.filepath;
    console.log(`Archivo temporal guardado en: ${filePath}`);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      console.error('El archivo temporal no existe:', filePath);
      return res.status(500).json({ error: 'Error al procesar archivo' });
    }

    try {
      // Configurar entorno para Python
      const env = {
        ...process.env,
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        PDF_CO_API_KEY: process.env.PDF_CO_API_KEY,
        PATH: process.env.PATH // Mantener el PATH original
      };

      // Ruta absoluta al script Python
      const scriptPath = path.join(process.cwd(), 'scripts', 'process_record.py');
      console.log(`Ejecutando script Python: ${scriptPath}`);

      const python = spawn('python', [scriptPath, filePath, studentId.toString()], { 
        env 
      });

      console.log(`Proceso Python iniciado (PID: ${python.pid})`);

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log(`Python stdout: ${output.trim()}`);
      });

      python.stderr.on('data', (data) => {
        const error = data.toString();
        stderr += error;
        console.error(`Python stderr: ${error.trim()}`);
      });

      python.on('close', (code) => {
        console.log(`Proceso Python terminado con código ${code}`);
        
        // Limpieza del archivo temporal
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Archivo temporal ${filePath} eliminado`);
          }
        } catch (e) {
          console.warn('Error al eliminar archivo temporal:', e);
        }

        if (code === 0) {
          console.log('Proceso completado exitosamente');
          return res.status(200).json({ 
            success: true,
            message: 'Record académico procesado correctamente',
            output: stdout
          });
        } else {
          console.error('Error en el script Python');
          return res.status(500).json({
            success: false,
            error: 'Error procesando el archivo PDF',
            detalle: stderr,
            output: stdout
          });
        }
      });

      python.on('error', (err) => {
        console.error('Error al ejecutar Python:', err);
        return res.status(500).json({
          success: false,
          error: 'No se pudo ejecutar el script Python',
          detalle: err.message
        });
      });

    } catch (error) {
      console.error('Error general:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
      });
    }
  });
};

export default handler;