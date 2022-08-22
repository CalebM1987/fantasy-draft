import { IDraftedPlayer } from "../types/players"

export const playerDisplayName = (player: IDraftedPlayer) => {
  const name = player.name
  const parts = name.split(' ')
  const first = parts[0]
  console.log('parts: ', parts, first)
  // return name
  return [
    first.includes('.') ? first: (first[0] + '.'),
    ...parts.slice(1)
  ].join(' ')
}