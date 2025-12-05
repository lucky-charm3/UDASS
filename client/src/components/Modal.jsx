import { FiX} from 'react-icons/fi';

export default function Modal({isOpen,onClose ,title,children}){
  if (!isOpen) return null;
    return(
        <div className="overflow-y-auto fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-md relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX className="w-6 h-6" />
                </button>
                <h1 className='font-semibold text-2xl text-center bg-primary-50 py-4'>{title}</h1>
                <div className='p-6'>
            {children}
            </div>
                </div>
                </div>
    )
}