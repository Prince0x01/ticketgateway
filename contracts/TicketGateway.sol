contract TicketGateway {
    address public owner;
    uint public gatewayFee;
    uint public e_ventCount;
    uint public balance;
    e_ventstatsStruct public stats;
    e_ventStruct[] e_vents;

    mapping(address => e_ventStruct[]) e_ventOf;
    mapping(uint => ticketholderStruct[]) holderOf;
    mapping(uint => bool) public e_ventExists;
    mapping(uint => Ticket) tickets;

    uint e_ventId = 0;
    uint ticketId = 0;


    enum statusEnum {
        OPEN,
        RESCHEDULED,
        CANCELED,
        SOLDOUT
    }

    struct e_ventstatsStruct {
        uint totalE_vents;
        uint totalTickets;
        uint totalSold;
        uint remainingTickets;
    }

    struct ticketholderStruct {
        address owner;
        uint ticketId;
        uint quantity;
        string tickettype;
        uint timestamp;
        bool refunded;
    }

    struct e_ventStruct {
        
        uint e_ventId;
        address owner;
        string name;
        string imageURL;
        uint timestamp;
        uint date;
        uint totalTickets;
        uint soldTickets;
        uint ticketPrice;
        statusEnum status;
    }

    struct Ticket {
        uint e_ventId;
        address owner;
        bool isAvailable;
        string tickettype;
    }

    modifier ownerOnly(){
        require(msg.sender == owner, "Only Owner can Access");
        _;
    }

    event Action(uint e_ventId, uint ticketId, string actionType, address indexed executor, uint256 timestamp);

    constructor(uint _gatewayFee) {
        owner = msg.sender;
        gatewayFee = _gatewayFee;
    }

    function createEvent(string memory _name, uint _date, uint _totalTickets, uint _ticketPrice) public returns (bool) {
    require(bytes(_name).length > 0, "Event name must not be empty");
    require(_totalTickets > 0, "Total number of tickets on sale cannot be zero");
    require(_ticketPrice > 0 ether, "Price of tickets cannot be zero");

    e_ventStruct memory e_vent;
    e_vent.e_ventId = e_ventCount;
    e_vent.owner = msg.sender;
    e_vent.name = _name;
    e_vent.ticketPrice = _ticketPrice;
    e_vent.timestamp = block.timestamp;
    e_vent.date = _date;
    e_vent.totalTickets = _totalTickets;

    // Create random event tickets with unique IDs
    for (uint i = 0; i < _totalTickets; i++) {
        bytes32 ticketHash = keccak256(abi.encodePacked(e_vent.e_ventId, i, block.timestamp));
        Ticket memory newTicket = Ticket(e_vent.e_ventId, address(0), true, ticketHash);
        e_vents.tickets.push(newTicket);
    }

    e_vents.push(e_vent);
    e_ventExists[e_vent.e_ventId] = true;
    e_ventOf[msg.sender].push(e_vent);
    stats.totalE_vents += 1;

    emit Action (
        e_vent.e_ventId,
        0,
        "Event Hosted",
        msg.sender,
        block.timestamp
    );
    e_ventCount++;
    return true;
    }   
    
}
