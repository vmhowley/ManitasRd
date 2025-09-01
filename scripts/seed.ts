#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno ANTES de cualquier otra importación
dotenv.config(); // Carga .env
dotenv.config({ path: '.env.local' }); // Carga .env.local

// Debug: Verificar que las variables se cargaron
console.log('🔧 Environment Variables Check:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'LOADED' : 'MISSING');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY ? 'LOADED' : 'MISSING');

// Importar SeedService DESPUÉS de cargar las variables de entorno
import { SeedService } from '../src/services/seedService';

/**
 * Script para ejecutar el seeding de Firebase desde línea de comandos
 * 
 * Uso:
 * npm run seed              - Ejecuta seeding completo
 * npm run seed:services     - Solo servicios
 * npm run seed:users        - Solo usuarios
 * npm run seed:clear        - Solo limpiar datos
 * npm run seed:stats        - Ver estadísticas
 */

const args = process.argv.slice(2);
const command = args[0] || 'full';

async function main() {
  try {
    console.log('🚀 Iniciando script de seeding...');
    console.log(`📋 Comando: ${command}`);
    console.log('=' .repeat(50));

    switch (command) {
      case 'full':
      case 'all':
        await SeedService.runFullSeed({
          clearExisting: true,
          seedServices: true,
          seedUsers: true,
        });
        break;

      case 'services':
        await SeedService.clearCollection('services');
        await SeedService.seedServices();
        break;

      case 'users':
        await SeedService.clearCollection('users');
        await SeedService.seedUsers();
        break;

      case 'clear':
        console.log('🧹 Limpiando todas las colecciones...');
        await SeedService.clearCollection('services');
        await SeedService.clearCollection('users');
        await SeedService.clearCollection('serviceRequests');
        await SeedService.clearCollection('messages');
        console.log('✅ Limpieza completada');
        break;

      case 'stats':
        await SeedService.getCollectionStats();
        break;

      case 'help':
      case '--help':
      case '-h':
        console.log(`
📖 Comandos disponibles:

  full, all     - Ejecuta seeding completo (servicios + usuarios)
  services      - Solo siembra servicios
  users         - Solo siembra usuarios
  clear         - Limpia todas las colecciones
  stats         - Muestra estadísticas de las colecciones
  help          - Muestra esta ayuda

💡 Ejemplos:
  npm run seed
  npm run seed services
  npm run seed users
  npm run seed clear
  npm run seed stats
`);
        break;

      default:
        console.error(`❌ Comando desconocido: ${command}`);
        console.log('💡 Usa "npm run seed help" para ver comandos disponibles');
        process.exit(1);
    }

    console.log('=' .repeat(50));
    console.log('🎯 Script completado exitosamente');
    
    // Mostrar estadísticas finales si no es el comando stats
    if (command !== 'stats' && command !== 'help' && command !== '--help' && command !== '-h') {
      console.log('\n📊 Estadísticas finales:');
      await SeedService.getCollectionStats();
    }

  } catch (error) {
    console.error('💥 Error ejecutando script:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

export { main as runSeedScript };