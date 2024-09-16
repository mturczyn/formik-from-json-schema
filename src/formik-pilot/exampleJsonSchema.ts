import { JSONSchema } from 'json-schema-to-ts'

export const schema: JSONSchema = {
    type: 'object',
    properties: {
        foo: { type: 'integer' },
        bar: { type: 'string' },
        barw: { type: 'string' },
        barww: { type: 'string' },
    },
    required: ['foo'],
    additionalProperties: false,
}
