/**
 * Vérifie que le backend répond avant de lancer les tests.
 */
async function globalSetup() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const backendUrl = apiUrl.replace(/\/api\/?$/, '') + '/api';
  try {
    const res = await fetch(`${backendUrl}/songs/stats`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    console.log('Backend is ready');
  } catch (err) {
    console.error('\n⚠️  Backend non accessible. Lancez d\'abord:');
    console.error('   docker compose up -d');
    console.error('   cd backend && npm run seed');
    console.error('   (ou: cd backend && npm run start:dev)\n');
    throw err;
  }
}

export default globalSetup;
