/**
 * This is the method used to determine if the vehicle needs risk assessment to use, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * IF weight > 1 OR speed > 2  OR exhaust-emissions efficiency > 1  OR elevation = 1
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
export function calculateRisk (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight' || element === 'emissions') {
        if (levels[element] > 1) {
          counter = 1
        }
      }
      if (element === 'elevation') {
        if (levels[element] === 1) {
          counter = 1
        }
      }
    }
  }
  return counter
}