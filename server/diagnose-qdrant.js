import fetch from 'node-fetch';

const QDRANT_URL = 'http://localhost:6333';
const COLLECTION_NAME = 'pdf-docs';

async function setupQdrant() {
  try {
    console.log('🗑️  Deleting existing collection...');
    const deleteResponse = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Deleted existing collection');
    } else {
      console.log('ℹ️  No existing collection to delete');
    }
  } catch (error) {
    console.log('ℹ️  No existing collection to delete');
  }

  // Create new collection
  console.log('📦 Creating new collection with 768 dimensions...');
  const createResponse = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        vectors: {
          size: 3072,  // Change to 3072
          distance: 'Cosine'
        }
      })
  });

  if (createResponse.ok) {
    console.log('✅ Collection created successfully!');
    
    // Verify
    const verifyResponse = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`);
    const data = await verifyResponse.json();
    console.log('✅ Verification:', JSON.stringify(data.result, null, 2));
  } else {
    const error = await createResponse.text();
    console.error('❌ Failed to create collection:', error);
    process.exit(1);
  }
}

setupQdrant().catch(console.error);