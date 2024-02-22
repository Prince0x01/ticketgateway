import Identicons from 'react-identicons'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { truncate, daysRemaining } from '../store'
import { FaEthereum } from 'react-icons/fa'
import { getEvent } from '.blockchain.jsx'

const EventData = () => {
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      const data = await getEvent(eventId);
      setEventData(data);
      setLoading(false);
    };
    fetchEventData();
  }, [eventId]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Events events={Object.values(eventData)} />
      )}
    </div>
  );
};

const Events = ({ events }) => {
  const eventArray = Object.values(events);
  
  return (
    <div className="flex flex-col px-6 mb-7">
      <div className="flex justify-center items-center flex-wrap">
        {collection.map((event, i) => (
          <EventCard key={i} eventData={event} />
        ))}
      </div>

      {eventData.length > collection.length ? (
        <div className="flex justify-center items-center my-5">
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600
          text-white font-medium text-xs leading-tight uppercase
          rounded-full shadow-md hover:bg-green-700"
            onClick={() => setEnd(end + count)}
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
}

const EventCard = ({ eventData }) => {
  const ended = new Date().getTime() > Number(eventData?.eventDateTime + '1800')

  return (
    <div eventId={eventData.eventId} className="rounded-lg shadow-lg bg-white w-64 m-4">
        <Link to={'/event/' + eventData.eventId}>
          <img
            src={eventData.imageURL}
            alt={eventData.eventName}
            className="rounded-xl h-64 w-full object-cover"
          />

          <div className="p-4">
            <h5>{truncate(eventData.eventName, 25, 0, 28)}</h5>

            <div className="flex flex-col">
              <div className="flex justify-start space-x-2 items-center mb-3">
                <Identicons
                  className="rounded-full shadow-md"
                  string={eventData.eventHost}
                  size={15}
                />
                <small className="text-gray-700">
                  {truncate(eventData.eventHost, 4, 4, 11)}
                </small>
              </div>

              <small className="text-gray-500">
                {ended ? 'Ended' : daysRemaining(eventData.eventDateTime) + ' left'}
              </small>
            </div>

            <div className="w-full bg-gray-300 overflow-hidden">
              <div
                className="bg-green-600 text-xs font-medium
              text-green-100 text-center p-0.5 leading-none
              rounded-l-full"
                style={{ width: `${(eventData.ticketSold / eventData.totalTickets) * 100}%` }}
              ></div>
            </div>

            <div
              className="flex justify-between items-center 
                font-bold mt-1 mb-2 text-gray-700"
            >
              <small>{eventData.ticketSold} Ticket Sold</small>
              <small className="flex justify-start items-center">
                <FaEthereum />
                <span>{eventData.ticketPrice} ETH</span>
		        </small>
		    </div>
        <div
          className="flex justify-between items-center flex-wrap
          mt-4 mb-2 text-gray-500 font-bold"
        >
          {ended ? (
            <small className="text-red-500">ENDED</small>
          ) : eventData?.status == 0 ? (
            <small className="text-gray-500">CANCELED</small>
          ) : eventData?.status == 1 ? (
            <small className="text-green-500">SOLD OUT</small>
          ) : eventData?.status == 2 ? (
            <small className="text-gray-500">CLOSED</small>
          ) : eventData?.status == 3 ? (
            <small className="text-green-500">ONGOING</small>
          ) : null}

          {ended ? null : (
            <small className="ml-4 text-gray-500">
              {eventData.ticketPrice > 0 ? (
                <span>Join for {eventData.ticketPrice} ETH</span>
              ) : (
                <span>Join for Free</span>
              )}
            </small>
          )}
        </div>
      </div>
    </Link>
</div>
);
};