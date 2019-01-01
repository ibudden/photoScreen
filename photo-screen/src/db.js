import Dexie from 'dexie';

const db = new Dexie('PhotoScreenMedia');

db.version(1).stores({ 
    media: '++id,googleId,accessCount,timeAdded,mediaType'
});

export default db;
