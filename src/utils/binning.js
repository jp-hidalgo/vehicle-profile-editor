import { parse, parser } from 'mathjs'
import { convertUnits } from './conversions'
import { ATTR_TYPE_DEPENDENT } from '../constants'
import ATTRIBUTES from '../data/attributes_numo.json'

export function mapAttributeValuesToLevel (attributes) {
  if (!attributes) return null

  const levels = ATTRIBUTES.reduce((obj, definition) => {
    const key = definition.id
    const attribute = attributes[key]

    // Only map dependent variables
    if (definition.type !== ATTR_TYPE_DEPENDENT) {
      return obj
    }

    const inputValue = Number.parseFloat(
      typeof attribute === 'object' ? attribute.value : attribute
    )

    // Bail if not a number
    // Returns level 0
    if (Number.isNaN(inputValue)) {
      obj[key] = 0
      return obj
    }

    // Convert to units if they don't match; if no conversion method is found, log it but use default
    // TODO: also use mathjs to do units conversion
    let normalizedValue = inputValue
    if (
      (typeof attribute === 'object'
        ? attribute.units
        : definition.defaultUnit) !== definition.defaultUnit
    ) {
      normalizedValue = convertUnits(
        inputValue,
        attribute.units,
        definition.defaultUnit
      )
    }

    // Run calculation (using mathjs package to calculate) if `calc` is defined
    // Otherwise the input value passes through as-is
    let value
    if (definition.calc) {
      const math = parser()

      // Determine what variables (symbols in mathjs) we need to set
      const tree = parse(definition.calc)
      const symbols = tree.filter(node => node.isSymbolNode)

      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        if (symbol.name === 'x') {
          math.set('x', normalizedValue)
        } else {
          // Default to value of 0 if not present
          const variable = attributes[symbol.name] || { value: 0 }
          // Ensure that variable.value is a number, otherwise
          // math.evaluate() will throw an error. NaN is acceptable
          math.set(symbol.name, Number.parseFloat(variable.value))
        }
      }

      value = math.evaluate(definition.calc)
      math.clear()
    } else {
      value = normalizedValue
    }

    // Run min and max boundaries
    if (typeof definition.max !== 'undefined') {
      value = Math.min(value, definition.max)
    }
    if (typeof definition.min !== 'undefined') {
      value = Math.max(value, definition.min)
    }

    let level = 0
    if (definition) {
      const thresholds = definition.thresholds
      for (let i = 0; i < thresholds.length; i++) {
        if (i === 0) {
          // First level lower bound is inclusive
          if (value >= thresholds[i][0] && value <= thresholds[i][1]) {
            level = i + 1
          }
        } else {
          if (typeof thresholds[i][1] === 'undefined') {
            if (value > thresholds[i][0]) {
              level = i + 1
            }
          } else {
            if (value > thresholds[i][0] && value <= thresholds[i][1]) {
              level = i + 1
            }
          }
        }
      }
    }
    obj[key] = level
    return obj
  }, {})

  return levels
}
