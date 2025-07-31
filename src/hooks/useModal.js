import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpen = (item = null) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  return { isOpen, selectedItem, handleOpen, handleClose };
};