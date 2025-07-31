import { useState, useEffect, useCallback } from 'react';
import { getAllDocuments, addDocument, updateDocument, deleteDocument } from '../firestore/firestoreService';

export const useCRUD = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await getAllDocuments(collectionName);
      setDocuments(docs);
      setError(null);
    } catch (err) {
      console.error(`Error fetching documents from ${collectionName}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const add = async (data) => {
    try {
      await addDocument(collectionName, data);
      fetchDocuments();
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      setError(err);
    }
  };

  const update = async (id, data) => {
    try {
      await updateDocument(collectionName, id, data);
      fetchDocuments();
    } catch (err) {
      console.error(`Error updating document in ${collectionName}:`, err);
      setError(err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteDocument(collectionName, id);
      fetchDocuments();
    } catch (err) {
      console.error(`Error deleting document from ${collectionName}:`, err);
      setError(err);
    }
  };

  return { documents, loading, error, add, update, remove, fetchDocuments };
};