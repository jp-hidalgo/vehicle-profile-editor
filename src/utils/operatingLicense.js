/**
 * This is the method used to determine if the vehicle needs a operating licence, at the moment
 * it only has a need/does not need binary result
 * it is calculated by:
 * IF use = commercial OR elevation = 1 THEN “Required"
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import React from 'react'
import i18n from '../i18n'
import { Grid, Segment } from 'semantic-ui-react'
export function calculateOperatingLevelRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'use' && levels[element] === 'commercial') {
        counter++
      } else if (element === 'elevation' && levels[element] === 1) {
        counter++
      }
    }
  }

  if (counter > 0) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment textAlign="center" basic>
            {i18n.t('resultOptions.operatingLicense')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment inverted color="red" textAlign="center">
            {i18n.t('resultOptions.application')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
  return (
    <Grid.Row columns={2}>
      <Grid.Column>
        <Segment basic textAlign="center">
          {i18n.t('resultOptions.operatingLicense')}
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment textAlign="center">
          {i18n.t('resultOptions.notNecessary')}
        </Segment>
      </Grid.Column>
    </Grid.Row>
  )
}
