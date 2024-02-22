import abi from '../abis/src/contracts/TicketGateway.sol/TicketGateway.json'
import address from '../abis/contractAddress.json'
import { getGlobalState, setGlobalState } from '../store'
import { ethers } from 'ethers'

const { ethereum } = window
const contractAddress = address.address
const contractAbi = abi.abi

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWalletConnected()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}

const getEthereumContract = async () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum, "goerli")
    const signer = provider.getSigner([0])
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    setGlobalState('contract', contract)
    return contract
  } else {
    return getGlobalState('contract')
  }
}

const createEvent = async ({
  _eventHost,
  _imageURL,
  _eventName,
  _venue,
  _eventDateTime,
  _totalTickets,
  _ticketPrice,
}) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    _ticketPrice = ethers.utils.parseEther(_ticketPrice)
    await contract.createEvent(_eventHost, _imageURL, _eventName, _venue, _eventDateTime, _totalTickets, _ticketPrice)
  } catch (error) {
    reportError(error)
  }
}

const cancelEvent = async (eventId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    await contract.cancelEvent(eventId)
  } catch (error) {
    reportError(error)
  }
}

const loadEvent = async (eventId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    const contract = await getEthereumContract()
    const events = await contract.getEvent(eventId)
    const structuredEvent = {
      eventId: events[eventId].toNumber(),
      eventHost: events[eventHost].toLowerCase(),
      eventName: events[_eventName],
      eventVenue: events[_venue],
      imageURL: events[_imageURL],
      timestamp: new Date(events.timestamp.toNumber()).getTime(),
      eventDateTime: new Date(events[_eventDateTime].toNumber()).getTime(),
      eventDateTime: toDateTime(events[_eventDateTime].toNumber() * 1000),
      totalTickets: events[_totatTickets].toNumber(),
      ticketPrice: parseInt(events[_ticketPrice]._hex) / 10 ** 18,
      status: events.eventstatus,
    }

    setGlobalState(`events[${eventId}]`, structuredEvent)
  } catch (error) {
    reportError(error)
  }
}

const purchaseTicket = async (eventId, ticketQty) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    
    _ticketQty = ticketQty.toNumber()
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()
    await contract.purchaseTicket(eventId, _ticketQty, { from: connectedAccount })
  } catch (error) {
    reportError(error)
  }
}

const getTicketHolders = async (ticketId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    const contract = await getEthereumContract()
    const ticketHolders = await contract.getTicketHolders(ticketId)

    setGlobalState('ticketHolders', structuredTicketHolders(ticketHolders))
  } catch (error) {
    reportError(error)
  }
}

const transferTicket = async (ticketId, transferTo) => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    const contract = await getEthereumContract()

    // Convert transferTo to an ethereum wallet address
    const transferToAddress = ethereumjs.Util.toChecksumAddress(transferTo);

    await contract.transferTicket(ticketId, transferToAddress)
  } catch (error) {
    reportError(error)
  }
}

const refundTicketHolders = async (ticketId, eventId, ticketQty) => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    const contract = await getEthereumContract()
    await contract.refundTicketHolders(ticketId, eventId, ticketQty)
  } catch (error) {
    reportError(error)
  }
}

const withdrawEventBalance = async (eventId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    const contract = await getEthereumContract()
    await contract.withdrawEventBalance(eventId)
  } catch (error) {
    reportError(error)
  }
}

const structuredTicketHolders = (ticketHolders) => {
  const results = []

  for (let i = 0; i < ticketHolders.length; i += 2) {
    let holderAddress = ticketHolders[i]
    let ticketQty = ticketHolders[i + 1].toNumber()
    results.push({ holderAddress, ticketQty })
  }

  return results
}

const toDateTime = (timestamp) => {
  const date = new Date(timestamp)
  const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  const mm = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const yyyy = date.getFullYear()
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
  const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`
  
  return `${yyyy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`
}

const reportError = (error) => {
  console.log(error.message)
  throw new Error('No ethereum object.')
}

export {
  connectWallet,
  isWalletConnected,
  createEvent,
  cancelEvent,
  loadEvent,
  purchaseTicket,
  getTicketHolders,
  transferTicket,
  refundTicketHolders,
  withdrawEventBalance
}