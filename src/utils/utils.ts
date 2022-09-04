import { IDraftedPlayer } from "../types/players"

export const playerDisplayName = (player: IDraftedPlayer) => {
  const name = player.name
  if (player.position === 'DEF'){
    console.log('player name for defense: ', player.name)
    return player.name.replace('Defense', 'D/ST')
  } else {
    const parts = name.split(' ')
    const first = parts[0]
    return [
      first.includes('.') ? first: (first[0] + '.'),
      ...parts.slice(1)
    ].join(' ')
  }
}

/**
 * Sorts an Array of objects by property. This will 
 * @see https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
 * @param {Object[]} arr - input array to sort
 * @param {String} prop - property to sort by
 * @param {String} order - order asc (ascending, default) or desc (descending)
 */
 export function sortByPropertyInPlace<T>(arr: T[], prop: keyof T, order: 'asc'|'desc' = 'asc'): void {
  let first = 1
  let second = -1
  if (order == 'desc'){
    first = first * -1
    second = second * -1
  }
  arr.sort((a, b) => (a[prop] > b[prop] ? first : second));
}

export function localeDateTime(d?: Date | number): string {
  if (!d){
    d = new Date()
  }
  if (typeof d === 'number'){
    // d is milliseconds
    d = new Date(d)
  }
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

function isExtendable(val: any): boolean {
  return (
    (typeof val === "object" && [null, undefined].indexOf(val) < 0) ||
    typeof val === "function" ||
    Array.isArray(val)
  );
}

/**
 * Returns true if `val` is an object or function.
 *
 * @param  {any} val
 * @return {Boolean}
 */
export function isObject(val: any): boolean {
  return isExtendable(val) && !Array.isArray(val);
}