import './RoutineTimeline.css'

function TimelineDots({ count, active = false }) {
  return (
    <div className={`routineTimeline__dots routineTimeline__dots--${count}`}>
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={`routineTimeline__dot ${
            active ? 'routineTimeline__dot--active' : ''
          }`}
        />
      ))}
    </div>
  )
}

function RoutineTimeline({ sunImage, moonImage }) {
  return (
    <div className='routineTimeline'>
      <div className='routineTimeline__start'>
        <img src={sunImage} alt='' className='routineTimeline__sun' />
        <span className='routineTimeline__time'>06:00</span>
      </div>

      <TimelineDots count={4} active />
      <span className='routineTimeline__now'>Now</span>
      <TimelineDots count={4} active />
      <span className='routineTimeline__time'>12:00</span>
      <TimelineDots count={5} />
      <span className='routineTimeline__time'>15:00</span>
      <TimelineDots count={5} />
      <span className='routineTimeline__time'>18:00</span>
      <TimelineDots count={5} />
      <span className='routineTimeline__time'>21:00</span>
      <TimelineDots count={3} />

      <div className='routineTimeline__end'>
        <img src={moonImage} alt='' className='routineTimeline__moon' />
        <span className='routineTimeline__time'>24:00</span>
      </div>
    </div>
  )
}

export default RoutineTimeline
