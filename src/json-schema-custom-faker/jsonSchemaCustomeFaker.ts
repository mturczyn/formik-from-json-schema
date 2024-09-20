import { Schema } from 'json-schema-faker'
import { JSONSchema4, JSONSchema7 } from 'json-schema'
import { faker } from '@faker-js/faker'
import { setAttributeFromPath } from '../utils/setAttributeFromPath'

type SchemaPropertyData = Pick<Schema, 'type' | 'properties' | 'items' | 'enum'>

export function generate(schema: Schema) {
    const data = {}

    generateObject(schema, data)

    const dataKeys = Object.keys(data)
    // If there's only key with empty name,
    // it means we generated whole value
    // for root, and here is the correction.
    if (dataKeys.length === 1 && !dataKeys[0]) {
        return data[dataKeys[0]]
    }

    return data
}

function generateObject(
    { type, properties, items, ...rest }: SchemaPropertyData,
    data: any,
    currentPropName?: string
) {
    if (type === 'object' && properties) {
        Object.keys(properties).map((x) => {
            const prop = properties[x] as JSONSchema7
            return generateObject(
                {
                    type: prop.type,
                    properties: prop.properties,
                    items: prop.items,
                    enum: prop.enum,
                },
                data,
                currentPropName ? currentPropName + '.' + x : x
            )
        })

        return
    }

    if (type === 'array' && items) {
        const arrayType = Array.isArray(items)
            ? (items[0] as JSONSchema4)
            : (items as JSONSchema4)

        if (!arrayType) return

        const arrayItem = {}
        generateObject(arrayType, arrayItem)
        setAttributeFromPath(data, currentPropName ?? '', [arrayItem], '.')
        return
    }

    // Every schema begins with object definition,
    // so always first will go into above if
    // and will populate the parameter, so by now we
    // should always have the prop name.
    if (!currentPropName) return null

    if (type === 'string' && !!rest.enum && rest.enum.length > 0) {
        setAttributeFromPath(data, currentPropName, rest.enum[0], '.')
        return
    }

    const limits = { min: 1, max: 100 }
    const randomValue =
        type === 'integer'
            ? faker.number.int(limits)
            : type === 'number'
              ? faker.number.float(limits)
              : faker.animal.type()

    setAttributeFromPath(data, currentPropName, randomValue, '.')
}
