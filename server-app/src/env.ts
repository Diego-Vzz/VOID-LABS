import dotenv from 'dotenv';

// Cargamos el archivo correcto de variables de entorno antes de que el resto
// de la aplicación intente leer process.env
const envFile = process.env.NODE_ENV_PROD ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
