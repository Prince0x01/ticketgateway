import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify/dist/ReactToastify.min';
import { createEvent } from '../services/blockchain';
import { useGlobalState, setGlobalState } from '../store';

const CreateEvent = () => {
  const [createModal] = useGlobalState('createModal');
  const [_eventHost, setEventHost] = useState('');
  const [_imageURL, setImageURL] = useState('');
  const [_eventName, setEventName] = useState('');
  const [_venue, setVenue] = useState('');
  const [_eventDateTime, setEventDateTime] = useState('');
  const [_totalTickets, setTotalTickets] = useState('');
  const [_ticketPrice, setTicketPrice] = useState('');

  const onClose = () => {
    setGlobalState('createModal', 'scale-0');
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !_eventHost ||
      !_imageURL ||
      !_eventName ||
      !_venue ||
      !_eventDateTime ||
      !_totalTickets ||
      !_ticketPrice
    ) {
      toast.error('Please fill all the fields.');
      return;
    }

    const ticketPrice = parseFloat(_ticketPrice);
    const totalTickets = parseInt(_totalTickets);

    if (isNaN(ticketPrice) || ticketPrice < 0) {
        toast.error('Ticket price should be a positive number.');
        return;
      }
      
      if (isNaN(totalTickets) || totalTickets <= 0) {
        toast.error('Total tickets should be a positive number.');
        return;
      }

    const params = {
      _eventHost,
      _imageURL,
      _eventName,
      _venue,
      _eventDateTime,
      _totalTickets,
      _ticketPrice,
    };

    try {
      await createEvent(params);

      toast.success('Event created successfully, will reflect in 30sec.');

      onClose();
    } catch (err) {
      // Display any errors thrown by the smart contract
      toast.error(err.message);
    }
  };

  const reset = () => {
    setEventHost('');
    setImageURL('');
    setEventName('');
    setVenue('');
    setEventDateTime('');
    setTotalTickets('');
    setTicketPrice('');
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
            items-center justify-center bg-black bg-opacity-50
            transform transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-white shadow-xl rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Add Event</p>
            <button
              onClick={onClose}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-center items-center mt-5">
            <div className="rounded-xl overflow-hidden h-20 w-20">
              <img
                src={
                  _imageURL ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFpuV8SaXR9Cy8CaocWZWc1i_ScGPoFCJCfw&usqp=CAU'
                }
                alt="event name"
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5">
            <input
              className="block w-full bg-transparent
                                border-0 text-sm text-slate-500 focus:outline-none
                                focus:ring-0"
              type="text"
              name="eventHost"
              placeholder="Event Host"
              onChange={(e) => setEventHost(e.target.value)}
              value={_eventHost}
              required
            />
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5">
            <input
              className="block w-full bg-transparent
                            border-0 text-sm text-slate-500 focus:outline-none
                            focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="ticketPrice"
              placeholder="Ticket Price (ETH)"
              onChange={(e) => setTicketPrice(e.target.value)}
              value={_ticketPrice}
              required
            />
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5">
            <input
              className="block w-full bg-transparent
                            border-0 text-sm text-slate-500 focus:outline-none
                            focus:ring-0"
              type="datetime-local"
              name="eventDateTime"
              onChange={(e) => setEventDateTime(e.target.value)}
              value={_eventDateTime}
              required
            />
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5">
            <input
              className="block w-full bg-transparent
                            border-0 text-sm text-slate-500 focus:outline-none
                            focus:ring-0"
              type="url"
              name="imageURL"
              placeholder="Image URL"
              onChange={(e) => setImageURL(e.target.value)}
              value={_imageURL}
              required
            />
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5">
            <input
              className="block w-full bg-transparent
                            border-0 text-sm text-slate-500 focus:outline-none
                            focus:ring-0"
              type="text"
              name="venue"
              placeholder="Venue"
              onChange={(e) => setVenue(e.target.value)}
              value={_venue}
              required
            />
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5">
            <input
              className="block w-full bg-transparent
                            border-0 text-sm text-slate-500 focus:outline-none
                            focus:ring-0"
              type="number"
              name="totalTickets"
              placeholder="Total Tickets"
              onChange={(e) => setTotalTickets(e.target.value)}
              value={_totalTickets}
              required
            />
          </div>

          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-green-600
                        text-white font-medium text-md leading-tight
                        rounded-full shadow-md hover:bg-green-700 mt-5"
          >
            Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;