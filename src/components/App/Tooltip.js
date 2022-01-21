import React from 'react'
import { HERO_ID_MAPPING } from './helper'
import TooltipQuery from './TooltipQuery'

const Tooltip = (props) => {
  const { event, streamerId } = props
  console.log(event)
  let eventString = 'Waiting for event'
  let variables = null
  if (event){
    switch (event.type){
      case 'levelup':
        eventString = `Now level ${event.data}`
        break
      case 'kill':
        const { killList, kills } = event.data
        if (kills == 0) break
        const latestKillKey = Object.keys(killList).pop()
        const latestKillHeroId = killList[latestKillKey]
        eventString = `You killed ${HERO_ID_MAPPING[latestKillHeroId]}\nTotal Kills: ${kills}`
        break
      case 'pick':
        const pickedHeroId = event.data
        eventString = `You picked ${HERO_ID_MAPPING[pickedHeroId]}`
        variables = { heroId: pickedHeroId, steamAccountId: Number(streamerId) }
        break
      case 'outcome':
        const isVictory = event.data
        if (isVictory) {
          eventString = `Chat carried.`
        } else {
          eventString = `Noob.`
        }
        break
      default:
        eventString = 'Something happened'
        break
    }
  }
  console.log(`eventString: ${eventString}`)
  return (
    <>
      <p>{eventString}</p>
      {event ? <TooltipQuery type={event.type} variables={variables} /> : null}
    </>
  )
}

export default Tooltip;
