import { Formik } from 'formik'
import './signup.css'
import Ajv from 'ajv'
import { useEffect, useMemo, useRef, useState } from 'react'
import { JSONSchemaFaker } from 'json-schema-faker'
import { getFileContent } from './getFileContent'
import { ajvErorrsToFormikErrors } from './ajvErorrsToFormikErrors'
import { LabelWithInput } from './LabelWithInput'
import { faker } from '@faker-js/faker'
import { generate } from '../json-schema-custom-faker/jsonSchemaCustomeFaker'

JSONSchemaFaker.extend('faker', () => {
    return faker
})

export const SignupForm = () => {
    const [rawJsonSchema, setRawJsonSchema] = useState<string | undefined>()
    const [unexpectedErrors, setUnexpectedErrors] = useState<string[]>([])
    const formikKey = useRef(0)

    const validationSchema = useMemo(
        () => !!rawJsonSchema && JSON.parse(rawJsonSchema),
        [rawJsonSchema]
    )

    const initialValues = useMemo(() => {
        if (!validationSchema) return null
        // const sample = JSONSchemaFaker.generate(validationSchema)
        const sample = generate(validationSchema)
        return sample
    }, [validationSchema])

    useEffect(() => {
        if (initialValues) formikKey.current++
        setUnexpectedErrors([])
    }, [initialValues])

    const ajvValidation = useMemo(
        () =>
            !!validationSchema &&
            new Ajv({ coerceTypes: true }).compile(validationSchema),
        [validationSchema]
    )

    const handleValidate = (values: Record<typeof initialValues, string>) => {
        if (!ajvValidation) return

        ajvValidation(values)

        if (!ajvValidation.errors) return

        const { data: formikErrors, unexpectedErrors: ajvUnexpectedErrors } =
            ajvErorrsToFormikErrors(ajvValidation.errors, values)

        if (ajvUnexpectedErrors.length > 0) {
            const errorMessages = ajvUnexpectedErrors.map(
                (e) => `Error at '${e.instancePath}': ${e.message}`
            )

            console.log('>>>', 'errorMessages', errorMessages)
            setUnexpectedErrors(errorMessages)
        }

        return formikErrors
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'auto 1fr',
                gridTemplateAreas: '"button button" "jsonSchema form"',
            }}
        >
            <button
                className="m5"
                style={{ gridArea: 'button', justifySelf: 'center' }}
                onClick={() =>
                    getFileContent().then((r) => setRawJsonSchema(r))
                }
            >
                Open file
            </button>
            {initialValues && (
                <>
                    <div
                        style={{
                            borderRight: '1px solid white',
                            borderTop: '1px solid white',
                            display: 'grid',
                            gridTemplateRows: 'auto 1fr',
                            gridArea: 'jsonSchema',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 'xx-large',
                            }}
                        >
                            Imported JSON schema
                        </h1>
                        <textarea
                            wrap="off"
                            className="m5"
                            value={rawJsonSchema}
                            onChange={(e) => setRawJsonSchema(e.target.value)}
                        ></textarea>
                    </div>
                    <div
                        style={{
                            gridArea: 'form',
                            borderTop: '1px solid white',
                        }}
                    >
                        <h1 style={{ fontSize: 'xx-large' }}>Generated form</h1>
                        <Formik
                            key={formikKey.current}
                            validate={handleValidate}
                            initialValues={initialValues}
                            onSubmit={(values, { setSubmitting }) => {
                                alert(JSON.stringify(values))
                                setSubmitting(false)
                            }}
                        >
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <InputsForForm
                                        initialValues={initialValues}
                                    />
                                    <input type="submit" value="Submit" />
                                </form>
                            )}
                        </Formik>
                    </div>
                    {unexpectedErrors.length > 0 && (
                        <div
                            className="m5"
                            style={{
                                borderRadius: '1rem',
                                gridArea: 'form',
                                background: 'red',
                                opacity: 0.85,
                                color: 'black',
                            }}
                        >
                            <h1 style={{ fontSize: 'large' }}>
                                Unexpected error outside form
                            </h1>
                            <ul>
                                {unexpectedErrors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                            <p>Please update/reload JSON schema.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

const InputsForForm = ({
    initialValues,
    parentName,
}: {
    initialValues: object
    parentName?: string
}) => {
    return Object.keys(initialValues).map((x) => {
        const currentValue = initialValues[x]

        if (typeof currentValue === 'object') {
            if (Array.isArray(currentValue)) {
                return currentValue.map((item, index) => (
                    <InputsForForm
                        key={`${x}:${index}`}
                        initialValues={item}
                        parentName={`${x}[${index}]`}
                    />
                ))
            }

            return (
                <InputsForForm
                    key={x}
                    initialValues={currentValue}
                    parentName={x}
                />
            )
        } else {
            const fullPropertyPath = !parentName ? x : parentName + '.' + x

            return (
                <LabelWithInput
                    key={fullPropertyPath}
                    fieldName={fullPropertyPath}
                    label={fullPropertyPath}
                ></LabelWithInput>
            )
        }
    })
}
