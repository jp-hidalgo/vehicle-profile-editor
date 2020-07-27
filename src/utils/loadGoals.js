const CITY_GOALS_URL = 'http://localhost:8080/api/citygoals'

export async function fetchGoalData () {
  const result = await fetch(CITY_GOALS_URL).catch(err => {
    if (err) {
      console.error(
        'Error while retrieving vehicle profile data from Google Sheets:',
        err
      )
    }

    throw new Error(err)
  })

  if (!result) return

  const myJson = await result.json()
  const goals = myJson.data.map(mapToGoal)

  return goals
}

export async function saveData (method, data) {
  if (!data) {
    throw new Error('No data to save')
  }

  const vehicle = {
    // These values are validated in this manner on the API
    // so they can't easily be updated to match the profile definition
    key: data.id,
    text: data.name,
    value: data.name // This property is deprecated but still required by the save-api
  }

  const meta = ['id', 'app:edited', 'save', 'del', '_xml']

  Object.keys(data.attributes).forEach(attribute => {
    if (meta.includes(attribute)) return
    vehicle[`attr${attribute}`] = data.attributes[attribute].value
    vehicle[`units${attribute}`] = data.attributes[attribute].units || ''
  })

  return fetch(CITY_GOALS_URL, {
    method,
    body: JSON.stringify({ vehicle })
  }).catch(err => {
    if (err) {
      console.error('Error while saving vehicle data to Google Sheets:', err)
    }

    throw new Error(err)
  })
}

function mapToGoal (row) {
  return {
    ...row,
    id: row.id,
    name: row.name,
    editdate: row.editdate,
    text: row.text,
    environment: row.environment,
    publicHealth: row.publicHealth,
    equity: row.equity,
    joyfulness: row.joyfulness,
    personalsafety: row.personalsafety
  }
}
