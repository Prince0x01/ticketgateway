import Identicons from 'react-identicons'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { truncate, daysRemaining } from '../store'
import { FaEthereum } from 'react-icons/fa'
import { getEvent } from './blockchain.jsx'


const Events = ({ events }) => {
  const [end, setEnd] = useState(4)
  const [count] = useState(4)
  const [collection, setCollection] = useState([])

  const getCollection = () => events.slice(0, end)

  useEffect(() => {
    setCollection(getCollection())
  }, [events, end])
  
  return (
    <div className="flex flex-col px-6 mb-7">
      <div className="flex justify-center items-center flex-wrap">
        {collection.map((EventData, i) => (
          <EventCard key={i} EventData={EventData} />
        ))}
      </div>

      {EventData.length > collection.length ? (
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
  )
}

const EventCard = ({ EventData }) => {
  const ended = new Date().getTime() > Number(EventData?.eventDateTime + '1800')

  return (
    <div eventId="EventData" className="rounded-lg shadow-lg bg-white w-64 m-4">
        <Link to={'/EventData/' + EventData.eventId}>
          <img
            src={EventData.imageURL}
            alt={EventData.eventName}
            className="rounded-xl h-64 w-full object-cover"
          />

          <div className="p-4">
            <h5>{truncate(EventData.eventName, 25, 0, 28)}</h5>

            <div className="flex flex-col">
              <div className="flex justify-start space-x-2 items-center mb-3">
                <Identicons
                  className="rounded-full shadow-md"
                  string={EventData.eventHost}
                  size={15}
                />
                <small className="text-gray-700">
                  {truncate(EventData.eventHost, 4, 4, 11)}
                </small>
              </div>

              <small className="text-gray-500">
                {ended ? 'Ended' : daysRemaining(EventData.eventDateTime) + ' left'}
              </small>
            </div>

            <div className="w-full bg-gray-300 overflow-hidden">
              <div
                className="bg-green-600 text-xs font-medium
              text-green-100 text-center p-0.5 leading-none
              rounded-l-full"
                style={{ width: `${(EventData.ticketSold / EventData.totalTickets) * 100}%` }}
              ></div>
            </div>

            <div
              className="flex justify-between items-center 
          font-bold mt-1 mb-2 text-gray-700"
            >
              <small>{EventData.ticketSold} Ticket Sold</small>
              <small className="flex justify-start items-center">
                <FaEthereum />
                <span>{EventData.ticketPrice} ETH</span>
              </small>
            </div>

            <div
              className="flex justify-between items-center flex-wrap
              mt-4 mb-2 text-gray-500 font-bold"
            >
              
              <div>
                ended ? (
                  <small className="text-red-500">OPEN</small>
                ) : EventData?.status == 0 ? (
                  <small className="text-gray-500">CANCELED</small>
                ) : EventData?.status == 1 ? (
                  <small className="text-green-500">SOLDOUT</small>
                ) : EventData?.status == 2 ? (
                  <small className="text-gray-500">CLOSED</small>
                ) : EventData?.status == 3?
                
              </div>
            </div>

          </div>
        </Link>
    </div>
  )
}

export default Events
