🎟️ TicketGateway Smart Contract

Overview

TicketGateway is a decentralized event ticketing smart contract written in Solidity that enables event hosts to create and manage events, while allowing users to securely purchase, transfer, and refund tickets on the blockchain. It is designed to ensure transparency, prevent double-selling, and automate refunds through trustless, verifiable transactions.

The contract leverages Ethereum’s Sepolia Testnet for deployment and uses OpenZeppelin’s SafeMath library to handle arithmetic operations safely.


---

⚙️ Key Features

Event Creation: Event hosts can create new events by specifying details such as event name, venue, ticket price, and number of tickets available.

Ticket Purchase: Buyers can securely purchase tickets directly through the blockchain.

Ticket Transfer: Purchased tickets can be transferred to another user in a verifiable, tamper-proof way.

Refunds & Event Cancellation: Buyers can request refunds before an event starts, and hosts can cancel events with automatic mass refunds to ticket holders.

Host Withdrawals: Event hosts can withdraw event proceeds after the event concludes, with a 5% gateway fee automatically deducted.

Security: Implements access control, reentrancy prevention via Solidity patterns, and safe mathematical operations using OpenZeppelin’s SafeMath.



---

🧩 Contract Details

State Variables

gatewayOwner: Address of the platform or contract owner.

gatewayFee: The platform’s commission fee (5% of total event earnings).

events: Mapping of event IDs to Event structs.

tickets: Mapping of ticket IDs to Ticket structs.

buyerToTicketIds, eventToTicketIds, hostToEventIds: Relationship mappings for easy data retrieval.



---

Structs

Event

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

Ticket

struct Ticket {
    uint ticketQty;
    uint timestamp;
    uint totalTickets;
    uint soldTickets;
    uint ticketPrice;
    uint256[] ticketId;
    TicketStatus ticketstatus;
}


---

Enums

Status: OPEN, CANCELED, SOLDOUT, CLOSED

TicketStatus: Sold, Transferred, Refunded



---

🚀 Core Functions

Function	Description	Access

createEvent()	Creates a new event with details such as name, venue, date, and ticket price.	Public
purchaseTicket()	Allows users to buy tickets for a specific event by paying Ether.	Payable
transferTicket()	Enables ticket holders to transfer ownership of their ticket.	External
refundTicketHolders()	Allows buyers to request a refund before the event starts.	Public
cancelEvent()	Lets the event host cancel an event and automatically refund all buyers.	External
withdrawEventBalance()	Allows the event host to withdraw collected funds after the event, minus gateway fees.	Public
isEventSoldOut()	Checks if an event is sold out.	Public
getEvent()	Retrieves event details.	View
getTicket()	Retrieves ticket details.	View



---

💰 Payment Flow

1. Ticket Purchase: Buyers pay Ether equivalent to the ticket cost.


2. Fund Storage: Funds are securely held in the contract’s balance.


3. Event Refunds: In case of cancellations or refunds, funds are automatically sent back to buyers.


4. Host Withdrawal: After the event ends, the host withdraws proceeds minus a 5% platform fee sent to gatewayOwner.




---

🧠 Events (Logs)

The contract emits the following events for transparency and monitoring:

eventCreated(address _eventHost, uint256 eventId, uint256 eventDateTime)

ticketPurchased(address buyer, uint256 ticketId, uint256 eventId)

eventCancelled(uint256 eventId)

ticketRefunded(address ticketHolder, uint256 eventId, uint256 ticketId, uint refundAmount)

ticketTransferred(address transferTo, uint256 ticketId)

eventClosed(address _eventHost, uint256 eventId, string _eventName)

PaidOut(address _eventHost, uint256 eventId, uint eventBalance)



---

🧪 Deployment & Testing

Network: Ethereum Sepolia Testnet

Tools Used: Remix IDE / Hardhat / Truffle

Compiler Version: ^0.8.11

Dependencies:

OpenZeppelin SafeMath (@openzeppelin/contracts/utils/math/SafeMath.sol)

Metamask or WalletConnect for testing transactions



Steps to Deploy

1. Open the contract in Remix IDE or your preferred environment.


2. Compile with Solidity version ^0.8.11.


3. Deploy using a Sepolia testnet account with sufficient ETH.


4. Interact using the deployed contract address and ABI.




---

🧩 Future Enhancements

Implement NFT-based ticket representation (ERC-721 standard).

Add metadata verification for events and tickets.

Integrate an off-chain frontend for ticket browsing and event management.

Include additional event categories and multi-host collaboration features.



---

📄 License

This project is licensed under the MIT License — you’re free to use, modify, and distribute with attribution.




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
