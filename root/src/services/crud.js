import { ID } from 'node-appwrite';
import { DATABASE, DB_ID } from '../config/config.js';

const metaData = {
    VERSION: 'readAll 1'
}

function toString(object){
  return JSON.stringify(object, null, 2);
}

let log = ()=>{};
let error = ()=>{};

function setLogAndError(logToSet, errorToSet){
  log   = logToSet;
  error = errorToSet;
}

import { getResponseOK, getResponseError, getResponseNotFound } from '../responses/responses.js'

const create = async (payload, collectionId) => {
    const documentId = ID.unique();
    try {
        const rawResult = await DATABASE.createDocument(DB_ID, collectionId, documentId, payload);
        const data = {
          id: rawResult.$id,
          name: rawResult.name
        };
        log('data: ' + toString(data));
        return getResponseOK({ metaData, data });
    } catch (errorData) {
        error('Error: ' + toString(errorData));
        return getResponseError('createDocument', errorData);
    }
};

const readAll = async (collectionId) => {
    try {
        const { documents } = await DATABASE.listDocuments(DB_ID, collectionId);
        const filteredDocuments = documents.map(doc => ({
        id: doc.$id,
        name: doc.name
        }));
        const data = filteredDocuments;
        return getResponseOK({ metaData, data });
    } catch (errorData) {
        error(JSON.stringify(errorData));
        return getResponseError('readAll', errorData);
    }
};

/*
/group/66958f8c1de5ca1dd3e1
*/
const readById = async (id, collectionId) => {
  try {
    log('readById');
    log('DB_ID ' + DB_ID);
    log('collectionId ' + collectionId);
    log('id ' + id);
    log('CALL TO DATABASE')
      const result = await DATABASE.getDocument(DB_ID, collectionId, id);
      log('result: ' + toString(result));
    
      const data = {
        id: result.$id,
        name: result.name
      }
      return getResponseOK({ metaData, data:{} });

  } catch (errorData) {
    log('errorData: ' + toString(errorData));
    const isNotFound = 404 == errorData.code;
    log('isNotFound: ' + isNotFound);

    if(isNotFound){
      log('Document not found');
      return getResponseOK({error:404, description:`readById: the id ${id} was not found in collection: ${collectionId}.`})
    }else{
        error('errorData: ' + toString(errorData));
        return getResponseError(toString(errorData), errorData)
      }
  }
};


const update = async (id, payload, collectionId) => {

  try {
    const data = await DATABASE.updateDocument(DB_ID, collectionId, id, payload);
    data.requestedId = id;
    return getResponseOK({ metaData, data });
  } catch (errorData) {
    return getResponseError('updateDocument', errorData);
  }
};
  
  const deleteDocument = async (id, collectionId) => {
    try {
      const data = await DATABASE.deleteDocument(DB_ID, collectionId, id);
      data.requestedId = id;
      return getResponseOK({ metaData, data });
    } catch (errorData) {
      return getResponseError('deleteDocument', errorData);
    }
  };

  export { 
            setLogAndError,
            create,
            readAll, 
            readById,
            update,
            deleteDocument
        }