import { setGlobalState, useGlobalState } from '../store';

const Hero = () => {
  const [stats] = useGlobalState('stats');

  return (
    <div className="text-center bg-white text-gray-800 py-24 px-6">
      <div style={{ backgroundImage: `url('./TicketGateway.png')`, backgroundSize: 'cover', height: '500px' }}>
        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">
          <span className="capitalize">Experience the best event hosting and ticket management services powered by the blockchain.</span>
          <br />
          <span className="text-lg">Join the future of seamless and secure event hosting with</span>
          <br />
          <span className="uppercase text-green-600">TicketGateway.</span>
        </h1>
        <div className="flex justify-center items-center space-x-2">
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-green-700"
            onClick={() => setGlobalState('createModal', 'scale-100')}
          >
            Host Event
          </button>
          <button
            type="button"
            className="inline-block px-6 py-2.5 border border-green-600 font-medium text-xs leading-tight uppercase text-green-600 rounded-full shadow-md bg-transparent hover:bg-green-700 hover:text-white"
          >
            Buy Ticket
          </button>
        </div>
        <div className="flex justify-center items-center mt-10">
          <div className="flex flex-col justify-center items-center h-20 border shadow-md w-full">
            <span className="text-lg font-bold text-green-900 leading-5">
              {stats?.totalEvents || 0}
            </span>
            <span>events</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
