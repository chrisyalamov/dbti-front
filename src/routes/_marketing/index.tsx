import { createFileRoute, Link } from '@tanstack/react-router'
import audience from '../../public/audience.avif'
import { FiArrowUpRight } from 'react-icons/fi'
import interaction_log from '../../public/mockup-interaction-log.png'
import networking from '../../public/mockup-networking.png'
import realtime from '../../public/mockup-realtime.png'

export const Route = createFileRoute('/_marketing/')({
  component: App,
})

type FeatureBlockProps = {
  description: React.ReactElement
  image: React.ReactElement
  /**
   * How the image and descriptor elements should be ordered when 
   * the feature block is vertical (when there is a small amount 
   * of horizontal space available, e.g. on mobile, or on desktop 
   * when the elements wrap around in a grid).
   */
  verticalOrder: 'img-first' | 'desc-first',
  /**
   * How the image and descriptor elements should be ordered when 
   * the feature block is horizontal (when there is a large amount 
   * of horizontal space available, e.g. on desktop).
   */
  horizontalOrder: 'img-first' | 'desc-first',
}

const FeatureBlock = (props: FeatureBlockProps) => {
  // Manually destructuring props, since some are optional
  const { description, image } = props
  const verticalOrder = props.verticalOrder ?? 'img-first'
  const horizontalOrder = props.horizontalOrder ?? 'img-first'

  const verticalOrderClassname = verticalOrder == 'desc-first' ? 'flex-col' : 'flex-col-reverse'
  const horizontalOrderClassname = horizontalOrder == 'desc-first' ? '@2xl:flex-row' : '@2xl:flex-row-reverse'

  return (
    <div className='@container'>
      <div className={`h-full flex ${verticalOrderClassname} ${horizontalOrderClassname} justify-start @2xl:justify-around items-center bg-neutral-500/5 rounded-lg px-6 md:px-15 pt-7 md:pt-10 gap-x-20 gap-y-5`}>
        {description}
        <div className='w-full lg:w-96 @2xl:max-w-1/3 max-h-[40vh]'>
          {image}
        </div>
      </div>
    </div>
  )
}


function App() {
  return (<>
    <div className="relative w-full py-35">
      <h1 className='text-4xl leading-[90%] px-4 sm:px-12 md:px-24 lg:px-32 max-w-[35ch] text-balance font-light'>
        The events platform that <span className='text-amber-300 '>connects</span> audiences.
      </h1>
      <div className='ribbed w-full h-80 mb-10' style={{
        maskImage: 'linear-gradient(to bottom, transparent 20%, black 80%, transparent)',
      }}>
        <img src={audience} className='w-full object-cover grayscale h-full' />
      </div>
      <div className='flex items-center flex-col md:flex-row gap-5 px-4 sm:px-12 md:px-24 lg:px-32'>
        <p className='text-lg font-medium shrink leading-tight text-balance'>
          Get people talking <span className='text-amber-300'>with Carder</span>.
        </p>
        <Link to="/auth/newAccount" className='text-amber-300 h-8 px-3 leading-none border border-amber-300 rounded-md cursor-pointer hover:bg-amber-300 hover:text-black active:opacity-70 active:pt-0.5 font-semibold flex items-center gap-2 text-base shrink-0'>
          Set up your first event
          <FiArrowUpRight />
        </Link>
      </div>

      <div className='px-4 sm:px-12 md:px-24 lg:px-32 my-16 pb-5'>
        <hr className='border-neutral-400/20' />
        <h2 className='text-xl my-2'>Features</h2>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-10 my-10 content-stretch'>
          <FeatureBlock
            description={
              <div className='max-w-[65ch]'>
                <h3 className='text-2xl'>Interaction log</h3>
                <p className=' text-lg text-neutral-300'>Get people off their phones.</p>
                <p className='text-neutral-400 my-10'>
                  Scan now, <span className='text-amber-300'>connect</span> later. Carder lets your audience quickly get back to the event, while keeping track of who they spoke to, which keynotes they attended, and more.
                </p>
              </div>
            }
            image={<img src={interaction_log} className='object-contain w-full h-full' />}
            verticalOrder='desc-first'
            horizontalOrder='img-first'
          />
          <FeatureBlock
            description={
              <div className='max-w-[65ch]'>
                <h3 className='text-2xl'>Networking</h3>
                <p className=' text-lg text-neutral-300'>Spark conversations.</p>
                <p className='text-neutral-400 my-10'>
                  Attendees can <span className='text-amber-300'>find each other</span> based on the sessions they attended, mutual connections, shared interests, or through discussion boards.
                </p>
              </div>
            }
            image={<img src={networking} className='object-contain w-full h-full' />}
            verticalOrder='desc-first'
            horizontalOrder='img-first'
          />
          <FeatureBlock
            description={
              <div className='max-w-[65ch]'>
                <h3 className='text-2xl'>Realtime insight</h3>
                <p className=' text-lg text-neutral-300'>Keep a close eye.</p>
                <p className='text-neutral-400 my-10'>
                  See what's <span className='text-amber-300'>trending</span> at your event. Carder provides real-time analytics on the most popular sessions, most active attendees, and more.
                </p>
              </div>
            }
            image={<img src={realtime} className='object-contain w-full h-full' />}
            verticalOrder='desc-first'
            horizontalOrder='img-first'
          />
        </div>
      </div>
    </div>
  </>
  )
}