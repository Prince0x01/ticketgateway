import { FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { cancelEvent } from '../services/blockchain'
import { useGlobalState, setGlobalState } from '../store'

const CancelEvent = ({ project }) => {
  const [deleteModal] = useGlobalState('deleteModal')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    await cancelEvent(events[eventId])
    toast.success('Project deleted successfully, will reflect in 30sec.')
    setGlobalState('deleteModal', 'scale-0')
    navigate.push('/')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
        items-center justify-center bg-black bg-opacity-50
        transform transition-transform duration-300 ${cancelModal}`}
    >
      <div className="bg-white shadow-xl shadow-black rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{eventId}</p>
            <button
              onClick={() => setGlobalState('cancelModal', 'scale-0')}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-center items-center mt-5">
            <div className="rounded-xl overflow-hidden h-20 w-20">
              <img
                src="https://via.placeholder.com/150"
                alt="event name"
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center rounded-xl mt-5">
            <p>Are you sure?</p>
            <small className="text-red-400">This is irreversible!</small>
          </div>

          <button
            className="inline-block px-6 py-2.5 bg-red-600
              text-white font-medium text-md leading-tight
              rounded-full shadow-md hover:bg-red-700 mt-5"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Canceling Event...' : 'Cancel Event'}
          </button>

          {error && <div className="text-red-400 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CancelEvent;
