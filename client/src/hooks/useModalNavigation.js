import { useNavigate, useLocation } from 'react-router-dom';

export function useModalNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = (modalPath) => {
    navigate(modalPath, { state: { background: location } });
  };

  const closeModal = () => {
    navigate(-1); 
  };

  const isModalOpen = () => {
    return location.pathname.includes('/addStudent') || 
           location.pathname.includes('/editStudent') || 
           location.pathname.includes('/deleteStudent');
  };

  return { openModal, closeModal, isModalOpen };
}