import { gql } from '@apollo/client';

export const PLAYER_PICK_QUERY = gql`
  query getPlayerPick($steamAccountId: Long!, $heroId: Short!){
    player(steamAccountId: $steamAccountId){
      steamAccountId
      heroPerformance(heroId: $heroId, request:{minGameVersionId: 146, maxGameVersionId: 149}){
        matchCount
        winCount
      }
    }
  }
` 

export const TEST_QUERY = gql`
  query gameMode{
    constants{
      heroes{
        id
        displayName
      }
    }
  }
`
