// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TicketGateway {
    using SafeMath for uint;
    
    //Create gatewayOwner state variable
    address payable public gatewayOwner;
    uint public gatewayFee;
    
    mapping (uint256 => Event) public events;
    mapping (uint256 => Ticket) tickets;
    mapping (uint256 => bool) public eventExists;
    mapping (address => uint256[]) buyerToTicketIds;
    mapping (uint256 => address) public ticketHolders;
    mapping (uint256 => uint256[]) eventToTicketIds;
    mapping (address => uint256[]) hostToEventIds;
    mapping(uint256 => uint) public eventBalance;
    
    enum Status { OPEN, CANCELED, SOLDOUT, CLOSED}
    enum TicketStatus {Sold, Transferred, Refunded}

    struct Ticket {
        uint ticketQty;
        uint timestamp;
        uint totalTickets;
        uint soldTickets;
        uint ticketPrice;
        uint256[] ticketId;
        TicketStatus ticketstatus;
    }

    struct Event {
        uint256 eventId;
        address payable eventHost;
        string eventName;
        string eventVenue;
        string imageURL;
        uint timestamp;
        uint eventDateTime;
        uint totalTickets;
        uint soldTickets;
        uint ticketPrice;
        uint256[] ticketId;
        Status eventstatus;
    }

    /*constructor(address payable _owner) {
        gatewayOwner = _owner;
    }
    */

    event ticketPurchased(address indexed buyer, uint256 indexed _ticketId, uint256 indexed eventId);
    event eventCreated(address indexed _eventHost, uint256 indexed eventId, uint256 indexed _eventDateTime);
    event eventCancelled(uint256 indexed eventId);
    event eventSoldOut(uint256 indexed eventId);
    event eventClosed(address indexed _eventHost, uint256 indexed eventId, string indexed _eventName);
    event ticketRefunded(address indexed _eventHost, uint256 indexed eventId, uint256 ticketId, uint indexed refundAmount);
    event ticketTransferred(address indexed tranferTo, uint256 indexed ticketId);
    event PaidOut(address indexed _eventHost, uint256 indexed eventId, uint indexed eventBalance);
    
    function createEvent( 
        address payable _eventHost, 
        string memory _imageURL,
        string memory _eventName,
        string memory _venue,
        uint _eventDateTime, 
        uint _totalTickets,
        uint _ticketPrice
    ) public returns (uint256) {

        require(_eventDateTime > block.timestamp, "Event date must be in the future");
        require(bytes(_eventName).length > 0, "Name must not be empty");
        require(bytes(_imageURL).length > 0, "Event must have an image or Flyer");
        require(_totalTickets > 0, "Total tickets for event should be more than 0");
        require(_ticketPrice > 0, "Add price for the tickets");

        // Generate the eventId using keccak256
        uint256 eventId = uint256(keccak256(abi.encodePacked(_totalTickets, "_", _eventDateTime, "_", _eventHost)));

        events[eventId] = Event({
            eventId: eventId,
            eventHost: payable (msg.sender),
            eventName: _eventName,
            eventVenue: _venue,
            imageURL: _imageURL,
            timestamp: block.timestamp,
            eventDateTime: _eventDateTime,
            totalTickets: _totalTickets,
            soldTickets: 0,
            ticketPrice: _ticketPrice,
            ticketId: new uint256[](_totalTickets),
            eventstatus: Status.OPEN
        });

        hostToEventIds[_eventHost].push(eventId);
        eventExists[eventId] = true;
        emit eventCreated(_eventHost, eventId, _eventDateTime);
        return eventId;
    }

    function purchaseTicket(
        uint256 eventId,
        uint256 _ticketQty
    ) public payable returns (bool, uint256) {
        require(eventExists[eventId], "Event does not exist");
        require(events[eventId].eventstatus != Status.CLOSED, "Event is closed");
        require(events[eventId].eventstatus == Status.OPEN, "Event is not open for ticket purchase");
        require(events[eventId].totalTickets > 0, "Event is sold out");
        require(_ticketQty > 0, "Ticket quantity must be more than 0");
        require(msg.sender != events[eventId].eventHost, "You cannot purchase your own ticket");
        require(events[eventId].eventstatus != Status.SOLDOUT, "Event is sold out");

        uint ticketCost = events[eventId].ticketPrice * _ticketQty;
        uint256 ticketId = uint256(keccak256(abi.encodePacked(eventId, "_", block.timestamp, "_", _ticketQty, "-", msg.sender)));

        require(msg.value >= ticketCost, "Insufficient funds");

        tickets[ticketId] = Ticket({
            ticketQty: _ticketQty,
            timestamp: block.timestamp,
            totalTickets: events[eventId].totalTickets,
            soldTickets: events[eventId].soldTickets,
            ticketPrice: events[eventId].ticketPrice,
            ticketId: events[eventId].ticketId,
            ticketstatus: TicketStatus.Sold         });

        events[eventId].soldTickets += _ticketQty;
        events[eventId].totalTickets -= _ticketQty;
        //transfer ticket cost from buyer to contract address
        payable(msg.sender).transfer(ticketCost);
        //update buyerToTicketIds mapping
        buyerToTicketIds[msg.sender].push(ticketId);
        ticketHolders[ticketId] = msg.sender;
        eventToTicketIds[eventId].push(ticketId);

        // update the event balance by adding the ticketPrice from buyer to eventBalance
        eventBalance[eventId] = eventBalance[eventId] + ticketCost;
        emit ticketPurchased(msg.sender, ticketId, eventId);

        return (true, ticketId);
    }

    function isEventSoldOut(uint256 eventId) public returns (bool) {
        require(eventExists[eventId], "Event does not exist");
        //if all tickets for eventId are sold then set event status to closed
        if (events[eventId].soldTickets == events[eventId].totalTickets) {
            events[eventId].eventstatus = Status.SOLDOUT;
            emit eventSoldOut(eventId);
            return true;
        }
        return false;
    }

    function transferTicket (
        uint256 ticketId, 
        address payable transferTo
    ) external returns(bool) {
        require(ticketHolders[ticketId] == msg.sender, "Ticket holder does not match");
        require(buyerToTicketIds[msg.sender].length > 0, "Ticket holder does not exist");
        require(ticketHolders[ticketId] != transferTo, "You cannot transfer ticket to yourself");       

        //transfer ticket to new ticketHolder
        address previousTicketHolder = ticketHolders[ticketId];
        for (uint256 i = 0; i < buyerToTicketIds[previousTicketHolder].length; i++) {
            if (buyerToTicketIds[previousTicketHolder][i] == ticketId) {
                delete buyerToTicketIds[previousTicketHolder][i];
                break;
            }
        }
        ticketHolders[ticketId] = transferTo;
        buyerToTicketIds[transferTo].push(ticketId);

        emit ticketTransferred(transferTo, ticketId);
        return true;          
    }

    function refundTicketHolders(
        uint256 ticketId,
        uint256 eventId, 
        uint ticketQty
    ) public returns (bool) {
        require(eventToTicketIds[eventId].length > 0 && 
        events[eventId].eventstatus != Status.CLOSED, 
        "Ticket does not exist or Event is closed"
        );
        require(block.timestamp <= events[eventId].eventDateTime + 1800, "Event cannot be refunded after 30 minutes starting time");
        require(ticketHolders[ticketId] != address(0), "Invalid ticket ID");
        require(ticketQty > 0, "Ticket quantity must be more than 0"); 

        address ticketHolder = ticketHolders[ticketId];
        require(ticketHolder == msg.sender, "Ticket holder does not match");

        uint256 refundAmount = ticketQty * events[eventId].ticketPrice;
        require(refundAmount <= eventBalance[eventId], "Insufficient funds");

        // Remove ticket ID from buyerToTicketIds mapping
        uint256[] storage buyerTicketIds = buyerToTicketIds[ticketHolder];
        for (uint256 i = 0; i < buyerTicketIds.length; i++) {
            if (buyerTicketIds[i] == ticketId) {
                buyerTicketIds[i] = buyerTicketIds[buyerTicketIds.length - 1];
                buyerTicketIds.pop();
                break;
            }
        }

        // Remove ticket ID from eventToTicketIds mapping
        uint256[] storage eventTicketIds = eventToTicketIds[eventId];
        for (uint256 i = 0; i < eventTicketIds.length; i++) {
            if (eventTicketIds[i] == ticketId) {
                eventTicketIds[i] = eventTicketIds[eventTicketIds.length - 1];
                eventTicketIds.pop();
                break;
            }
        }

        // Remove ticket ID from ticketHolders mapping
        delete ticketHolders[ticketId];

        eventBalance[eventId] -= refundAmount;
        events[eventId].soldTickets -= ticketQty;
        events[eventId].totalTickets += ticketQty;
        tickets[ticketId].ticketstatus = TicketStatus.Refunded;

        payable(ticketHolder).transfer(refundAmount);

        emit ticketRefunded(ticketHolder, eventId, ticketId, refundAmount);
        return true;
    }

    function cancelEvent(uint256 eventId) external payable returns (bool) {
        require(eventExists[eventId], "Event does not exist");
        require(events[eventId].eventstatus != Status.CLOSED, "Event is closed");
        require(events[eventId].eventHost == msg.sender, "Only event host can cancel the event");

        uint256 totalRefundAmount = 0;
        for (uint256 i = 0; i < eventToTicketIds[eventId].length; i++) {
            uint256 ticketId = eventToTicketIds[eventId][i];
            totalRefundAmount += tickets[ticketId].ticketQty * events[eventId].ticketPrice;
        }
        require(eventBalance[eventId] >= totalRefundAmount, "Not enough funds to refund all ticket holders");

        events[eventId].eventstatus = Status.CANCELED;
        emit eventCancelled(eventId);

        for (uint256 i = 0; i < eventToTicketIds[eventId].length; i++) {
            uint256 ticketId = eventToTicketIds[eventId][i];
            address payable ticketHolder = payable(ticketHolders[ticketId]);
            uint256 refundAmount = tickets[ticketId].ticketQty * events[eventId].ticketPrice;

            ticketHolder.transfer(refundAmount);

            tickets[ticketId].ticketstatus = TicketStatus.Refunded;
            events[eventId].totalTickets += tickets[ticketId].ticketQty;
            events[eventId].soldTickets -= tickets[ticketId].ticketQty;
            eventBalance[eventId] -= refundAmount;

            emit ticketRefunded(ticketHolder, eventId, ticketId, refundAmount);
        }

        delete events[eventId];
        delete eventExists[eventId];
        uint256[] storage hostEventIds = hostToEventIds[msg.sender];
        for (uint256 i = 0; i < hostEventIds.length; i++) {
            if (hostEventIds[i] == eventId) {
                delete hostEventIds[i];
                break;
            }
        }
        delete eventToTicketIds[eventId];
        return true;
    }

    function closeEvent(address _eventHost, uint256 eventId, string memory _eventName) internal returns (bool) {
        require(eventExists[eventId], "Event does not exist");
        require(block.timestamp <= events[eventId].eventDateTime + 1800, "Event is closed");
        require(events[eventId].eventstatus != Status.CANCELED, "Event is cancelled");
        if (block.timestamp >= events[eventId].eventDateTime + 1800) {
            events[eventId].eventstatus = Status.CLOSED;
            // emit the eventClosed event
            emit eventClosed(_eventHost, eventId, _eventName);
        }
        return true;
    }    

    function withdrawEventBalance(uint256 eventId) public returns (bool) {
        require(eventExists[eventId], "Event does not exist");
        require(eventBalance[eventId] > 0, "Insufficient funds");
        require(hostToEventIds[msg.sender].length > 0, "You are not a host of any event");
        //require(events[eventId].eventstatus == Status.CLOSED, "You can only withdraw balance after event close");
        
        bool eventHost = false;
        for (uint i = 0; i < hostToEventIds[msg.sender].length; i++) {
            if (hostToEventIds[msg.sender][i] == eventId) {
                eventHost = true;
                break;
            }
        }
        require(eventHost, "Only event host can withdraw the balance");

        uint amountToWithdraw = eventBalance[eventId];
        eventBalance[eventId] = 0;

        gatewayFee = (amountToWithdraw * 5) / 100;
        uint eventAmount = amountToWithdraw - gatewayFee;

        payable (msg.sender).transfer(eventAmount);
        payable(gatewayOwner).transfer(gatewayFee);

        emit PaidOut(msg.sender, eventId, amountToWithdraw);
        return true;
    }

    fallback() external payable {
        revert("Fallback not allowed.");
    }

    receive() external payable {
        revert();
    }

    function getEvent(uint256 eventId) external view returns (Event memory) {
        require(eventExists[eventId], "Event does not exist");
        return events[eventId];
    }

    function getTicket(uint256 ticketId) public view returns (Ticket memory) {
        return tickets[ticketId];
    }

    function isEventExists(uint256 eventId) external view returns (bool) {
        return eventExists[eventId];
    }

    function getBuyerToTicketIds(address buyer) external view returns (uint256[] memory) {
        require(buyerToTicketIds[buyer].length > 0, "Ticket holder does not exist");
        return buyerToTicketIds[buyer];
    }

    function getTicketHolders(uint256 ticketId) external view returns (address) {
        require(ticketHolders[ticketId] != address(0), "Ticket does not exist");
        return ticketHolders[ticketId];
    }

    function getEventToTicketIds(uint256 eventId) external view returns (uint256[] memory) {
        require(eventExists[eventId], "Event does not exist");
        return eventToTicketIds[eventId];
    }

    function getHostToEventIds(address eventHost) external view returns (uint256[] memory) {
        require(hostToEventIds[eventHost].length > 0, "Host does not have any events");
        return hostToEventIds[eventHost];
    }

    function getEventBalance(uint256 eventId) external view returns (uint) {
        require(eventExists[eventId], "Event does not exist");
        return eventBalance[eventId];
    }
}