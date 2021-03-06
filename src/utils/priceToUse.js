/**
 * This is the method used to determine if the vehicle needs for a price to be set for use, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * IF weight > 2 OR speed > 2 OR space efficiency > 2 OR exhaust-emissions efficiency > 2 THEN = “High”
 * IF weight <= 2 OR speed <= 2 OR space efficiency <= 2 OR exhaust-emissions efficiency <= 2 THEN = “Low”
 * IF weight =1 AND speed =1 AND space efficiency =1 AND exhaust-emissions efficiency 1 THEN = “NA”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
export function calculatePriceRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  let cont = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (
        element === 'footprint' ||
        element === 'speed' ||
        element === 'weight' ||
        element === 'emissions'
      ) {
        if (levels[element] > 2) {
          counter = 2
          break
        } else if (levels[element] === 1) {
          cont++
        } else if (levels[element] < 3) {
          counter = 1
          break
        }
      }
    }
    if (cont === 4) counter = 0
  }
  return counter
}
