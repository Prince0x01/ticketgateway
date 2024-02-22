import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PurchaseTicketComponent from '../PurchaseTicket';
import CancelEventComponent from '../components/CancelEvent';
import EventComponent from '../components/Event';
import RefundTicketHoldersComponent from '../components/RefundTicketHolders';
import TransferTicketComponent from '../components/TransferTicket';
import { getTicketHolders, loadEvent, transferTicket } from '../services/blockchain';
import { useGlobalState } from '../store';
import { purchaseTicket, cancelEvent, refundTicketHolders } from '../services/blockchain';

const Event = () => {
  const { eventId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [eventData] = useGlobalState('Event');
  const [purchaseTicketData] = useGlobalState('PurchaseTicket');
  const [cancelEventData] = useGlobalState('CancelEvent');
  const [ticketHoldersData] = useGlobalState('TicketHolders');
  const [refundTicketHoldersData] = useGlobalState('RefundTicketHolders');

  useEffect(() => {
    const fetchData = async () => {
      await loadEvent(eventId);
      await purchaseTicket(eventId);
      await cancelEvent(eventId);
      await getTicketHolders(eventId);
      await refundTicketHolders(ticketId, eventId, ticketQty);
      await transferTicket(ticketId);

      setLoaded(true);
    };
    fetchData();
  }, []);

  return loaded ? (
    <>
      <EventComponent eventData={eventData} />
      <CancelEventComponent cancelEventData={cancelEventData} />
      <PurchaseTicketComponent purchaseTicketData={purchaseTicketData} />
      <TicketHoldersComponent ticketHoldersData={ticketHoldersData} />
      <RefundTicketHoldersComponent refundTicketHoldersData={refundTicketHoldersData} />
      <TransferTicketComponent />
    </>
  ) : null;
};

export default Event;
