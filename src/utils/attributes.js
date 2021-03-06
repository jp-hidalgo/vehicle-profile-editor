import ATTRIBUTES from '../data/attributes.json'
export async function fetchAttributeData () {
  const vehicles = ATTRIBUTES.map(attribute => attribute)

  return vehicles
}

export async function saveAttributeData (method, data) {
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

  return fetch(ATTRIBUTES, {
    method,
    body: JSON.stringify({ vehicle })
  }).catch(err => {
    if (err) {
      console.error('Error while saving vehicle data to Google Sheets:', err)
    }

    throw new Error(err)
  })
}
