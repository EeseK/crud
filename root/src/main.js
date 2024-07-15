import { DATABASE, DB_ID } from './config/config.js'
import { getResponseNotContent, getResponseNotAllowed } from './responses/responses.js'
import { create, readAll, readById, setLogAndError } from './services/crud.js'

const VERSION = 'CRUD 14 - Get by Id - 1';
const metaData = {
  VERSION
};

const COLLECTION_GROUP_ID = 'group';

export default async ({ req, res, log, error }) => {
  setLogAndError(log, error);
  log('VERSION: ' + VERSION)
  if (req.method === 'OPTIONS') {
    log('OPTIONS: ' + VERSION)
    return getResponseNotContent();
  }

  const parameters = req.path.split('/');
  if (req.method === 'POST') {
    const { payload, action } = JSON.parse(req.body);
    if (!action) {
      return await create(payload, COLLECTION_GROUP_ID);
    }
  }
  
  if (req.method === 'GET') {
    const { none, collection, id } = parameters;
    if(null == id){
      return await readAll( COLLECTION_GROUP_ID );
    }else{
      return await readById(id, COLLECTION_GROUP_ID);
    }
  }

  if (req.method === 'PUT') {
    const { id, payload, action } = JSON.parse(req.body);
    return await updateDocument(id, payload);
  }

  return getResponseNotAllowed({ error: 'Method not allowed' });
};