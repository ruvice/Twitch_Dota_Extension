import React, { useMemo, useState } from 'react'
import { getHeroImageUrl, HERO_ID_MAPPING } from './helper';
import './VoteHero.css'
const VoteHero = (props) => {
  const { event, streamerId } = props
  if (event.data == null) return null
  const [search, setSearch] = useState('')
  const [hasVoted, setHasVoted] = useState(false)
  const submitVote = (votedHeroId) => {
    fetch(`https://twitch-dota-extension-backend.herokuapp.com/vote/hero`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            streamerId: streamerId,
            heroId: votedHeroId
        })
    });
    setHasVoted(true)
  }
  const heroes = useMemo(() =>{
    const heroNames = Object.keys(HERO_ID_MAPPING).map((heroId) => {
      const voteCount = event.data[heroId]
      if (hasVoted) {
        console.log(search)
        if (search !== '') {
          if (HERO_ID_MAPPING[heroId].toLowerCase().includes(search.toLowerCase())) return (
            <div className="heroVoteEntry">
              <img className="heroIcon" src={getHeroImageUrl(heroId, "icon")} />
              <p>{HERO_ID_MAPPING[heroId]}        {voteCount}</p>
            </div>
          )
        } else {
          return (
            <div className="heroVoteEntry">
              <img className="heroIcon" src={getHeroImageUrl(heroId, "icon")} />
              <p>{HERO_ID_MAPPING[heroId]}        {voteCount}</p>
            </div>
          )
        }
      }
      if (search !== '') {
        if (HERO_ID_MAPPING[heroId].toLowerCase().includes(search.toLowerCase())) return (
          <div
            className="heroVoteEntryClickable"
            onClick={() => submitVote(heroId)}
          >
            <img className="heroIcon" src={getHeroImageUrl(heroId, "icon")} />
            <p>{HERO_ID_MAPPING[heroId]}        {voteCount}</p>
          </div>
        )
      } else {
        return (
          <div
            className="heroVoteEntryClickable"
            onClick={() => submitVote(heroId)}
          >
            <img className="heroIcon" src={getHeroImageUrl(heroId, "icon")} />
            <p>{HERO_ID_MAPPING[heroId]}        {voteCount}</p>
          </div>
        )
      }
    })
    return heroNames;
  })
  const handleSearch = (event) => {
    setSearch(event.target.value)
  }
  return (
    <div>
      <div className="voteherosearch">
        <p>Search: </p>
        <input className="herosearch" value={search} onChange={(event) => handleSearch(event)} />
      </div>
      <div className="votehero">
        {heroes}
      </div>
    </div>
  )
};

export default VoteHero;
