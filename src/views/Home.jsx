import { useEffect } from 'react'
import AddButton from '../components/AddButton'
import CreateEvent from '../components/CreateEvent'
import Hero from '../components/Hero'
import Event from '../components/Event'
import { loadEvent } from '../services/blockchain'
import { useGlobalState } from '../store'

const Home = () => {
  const [events] = useGlobalState('events')

  useEffect(async () => {
    await loadEvent()
  }, [])
  return (
    <>
      <Hero />
      <Event events={events} />
      <CreateEvent />
      <AddButton />
    </>
  )
}

export default Home
