import React, { useState, useEffect } from 'react'
import { PLAYER_PICK_QUERY } from './queries'
import { useLazyQuery } from '@apollo/client'

const TooltipQuery = (props) => {
  const { variables, type } = props
  let queryString
  const [statString, setStatString] = useState('Nothing yet')
  const [pickQuery, pickQueryResult] = useLazyQuery(PLAYER_PICK_QUERY)
  const handleOnCompleted = (data) => {
    switch (type){
      case 'pick':
        const heroPerformance = data.player.heroPerformance
        if (heroPerformance != null) {
          const winRate = Math.round(heroPerformance.winCount / heroPerformance.matchCount * 100)
          setStatString(`You have a ${winRate}% win rate with this hero in the last 4 patches`)
        }
        break
      default:
        setStatString('placeholder')
        break
    }
  }
  useEffect(() => {
    if (type != null) {
      switch (type){
        case 'pick':
          pickQuery({ variables })
          break
        default:
          queryString = null
          break
      }
    }
  }, [type])

  // Once query data is ready
  useEffect(() => {
    if (pickQueryResult.data) {
      handleOnCompleted(pickQueryResult.data)
    }
  }, [pickQueryResult.data])
  

  return (
    <>
      {pickQueryResult.called && !pickQueryResult.loading}<p>{statString}</p>
    </>
  )

};

export default TooltipQuery;