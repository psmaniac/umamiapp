import { useState } from 'react';

export const useLocalCRUD = (initialData) => {
  const [documents, setDocuments] = useState(initialData);

  const add = (doc) => {
    setDocuments([doc, ...documents]);
  };

  const update = (id, updatedDoc) => {
    setDocuments(documents.map((doc) => (doc.id === id ? updatedDoc : doc)));
  };

  const remove = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return { documents, add, update, remove };
};