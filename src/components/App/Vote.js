import React, { useState, useEffect } from 'react'
import VoteHero from './VoteHero'
import VoteItem from './VoteItem'
import './Vote.css'
const Vote = (props) => {
  // Temporary useState for testing, should be implemented in parent
  const { event, streamerId } = props
  const [voteEvent, setVoteEvent] = useState({type: 'voteHero', data: null})
  // get votes on initial startup, if no vote event
  useEffect(() => {
    if (event == null) {
      fetch(`https://twitch-dota-extension-backend.herokuapp.com/votes/${streamerId}`)
      .then((res) => res.json())
      .then((data) => {
        const updatedVoteEvent = {
          type: 'voteHero',
          data: data
        }
        setVoteEvent(updatedVoteEvent)
      })
    }
  }, [])

  useEffect(() => {
    if (event != null && event.type == 'voteHero') {
      setVoteEvent({ type: 'voteHero', data: event.data })
    }
  }, [event])
  
  // console.log(voteEvent)
  // console.log(event)

  // cleared
  if (voteEvent.data == null) {
    return <p>No live votes</p>
  }
  const isVoteHero = (voteEvent && voteEvent.type == 'voteHero')

  console.log('isVoteHero')
  console.log(isVoteHero)
  console.log(voteEvent)
  return(
    <div className="vote">
      {isVoteHero ? <VoteHero event={voteEvent} streamerId={streamerId} /> : null}
      {/* <button className="togglevotedebug" onClick={() => setIsVoteHero(!isVoteHero)}>Toggle Type of Vote</button> */}
    </div>
  )
};

export default Vote;
