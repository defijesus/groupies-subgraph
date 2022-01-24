import { BigInt } from "@graphprotocol/graph-ts"
import {
  SimpleERC721StakingPool,
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn
} from "../generated/SimpleERC721StakingPool/SimpleERC721StakingPool"
import { StakedGroupie } from "../generated/schema"

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {}

export function handleStaked(event: Staked): void {
  let idStaked = event.params.idList
  let from = event.params.user
  let entity = StakedGroupie.load(from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new StakedGroupie(from.toHex())
    let arr = new Array<BigInt>()
    for(let i=0; i<idStaked.length; i++) {
      arr.push(idStaked[i])
    }
    entity.idList = arr
  } else {
    let arr = entity.idList
    if (!arr) {
      arr = new Array<BigInt>()
    }
    for(let i=0; i<idStaked.length; i++) {
      arr.push(idStaked[i])
    }
    entity.idList = arr
  }
  entity.save()
}

export function handleWithdrawn(event: Withdrawn): void {
  let idUnstaked = event.params.idList
  let from = event.params.user
  let entity = StakedGroupie.load(from.toHex())
  if (!entity) {
    entity = new StakedGroupie(from.toHex())
  }
  let arr = entity.idList
  if (!arr) {
    arr = new Array<BigInt>()
  }
  for(let i=0; i<idUnstaked.length; i++) {
    let index = arr.indexOf(idUnstaked[i])
    if (index > -1) {
      arr.splice(index, 1)
    }
  }
  entity.idList = arr
  entity.save()
}
