import 'dotenv/config';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/services/firebaseConfigSeed';

// Función para obtener estadísticas de una colección
async function getCollectionStats(collectionName: string): Promise<{ name: string; count: number }> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return {
      name: collectionName,
      count: querySnapshot.size
    };
  } catch (error) {
    console.error(`Error getting stats for ${collectionName}:`, error);
    return {
      name: collectionName,
      count: 0
    };
  }
}

// Función principal para mostrar estadísticas
async function showStats() {
  console.log('\n📊 Firebase Collections Statistics\n');
  
  const collections = ['services', 'users', 'serviceRequests', 'messages', 'reviews', 'quoteRequests'];
  
  for (const collectionName of collections) {
    const stats = await getCollectionStats(collectionName);
    console.log(`${stats.name.padEnd(15)} : ${stats.count} documents`);
  }
  
  console.log('\n✅ Statistics complete\n');
}

// Ejecutar
showStats()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });