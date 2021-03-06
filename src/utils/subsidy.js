/**
 * This is the method used to determine if the vehicle needs for a price to be set for use, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * IF elevation = 0 AND (exhaust-emissions efficiency = 1 OR ILL-Health = 1) THEN “Yes”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */

export function calculateSubsidyRequired (levels, elevation) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = false
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'emissions' || element === 'health') {
        if (levels[element] === 1) {
          counter = true
        }
      }
    }
  }
  return counter && elevation === 0
}
