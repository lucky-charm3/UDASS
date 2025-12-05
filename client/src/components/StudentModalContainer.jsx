import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from './Modal';
import AddMemberForm from './AddMemberForm';
import EditMemberForm from './EditMemberForm';
import DeleteMemberForm from './DeleteMemberForm';

export default function StudentModalContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { studentId } = params;

  const isAddModal = location.pathname.includes('/addStudent');
  const isEditModal = location.pathname.includes('/editStudent');
  const isDeleteModal = location.pathname.includes('/deleteStudent');

  const handleClose = () => {
    navigate('/dashboard/admin');
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isAddModal || isEditModal || isDeleteModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isAddModal, isEditModal, isDeleteModal]);

  if (!isAddModal && !isEditModal && !isDeleteModal) {
    return null;
  }

  return (
    <>
      {isAddModal && (
        <Modal isOpen={true} onClose={handleClose} title="Register New Member">
          <AddMemberForm onClose={handleClose} />
        </Modal>
      )}
      
      {isEditModal && studentId && (
        <Modal isOpen={true} onClose={handleClose} title="Edit Member">
          <EditMemberForm studentId={studentId} onClose={handleClose} />
        </Modal>
      )}
      
      {isDeleteModal && studentId && (
        <Modal isOpen={true} onClose={handleClose} title="Delete Member">
          <DeleteMemberForm studentId={studentId} onClose={handleClose} />
        </Modal>
      )}
    </>
  );
}