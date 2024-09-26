import { Formik, useField } from 'formik'
import './signup.css'
import Ajv from 'ajv'
import { useEffect, useMemo, useRef, useState } from 'react'
import { JSONSchemaFaker } from 'json-schema-faker'
import { getFileContent } from './getFileContent'
import { ajvErorrsToFormikErrors } from './ajvErorrsToFormikErrors'
import { faker } from '@faker-js/faker'
import { generate } from '../json-schema-custom-faker/jsonSchemaCustomeFaker'
import { getAttributeFromPath } from '../utils/getAttributeFromPath'
import { InputsForForm } from './InputsForForm'
import { nullifyEmptyStringValues } from '../utils/nullifyEmptyStringValues'

JSONSchemaFaker.extend('faker', () => {
    return faker
})

export const SignupForm = () => {
    const [rawJsonSchema, setRawJsonSchema] = useState<string | undefined>()
    const [unexpectedErrors, setUnexpectedErrors] = useState<string[]>([])
    const formikKey = useRef(0)
    const rawJsonSchemaFormKey = useRef(0)
    const [nullifyEmptyValues, setNullifyEmptyValues] = useState(true)

    const validationSchema = useMemo(() => {
        try {
            return !!rawJsonSchema && JSON.parse(rawJsonSchema)
        } catch {
            return undefined
        }
    }, [rawJsonSchema])

    const rawJsonSchemaInitialValues = { formRawJsonSchema: rawJsonSchema }

    const initialValues = useMemo(() => {
        if (!validationSchema) return null
        // const sample = JSONSchemaFaker.generate(validationSchema)
        const sample = generate(validationSchema)
        return sample
    }, [validationSchema])

    useEffect(() => {
        if (initialValues) {
            formikKey.current++
            rawJsonSchemaFormKey.current++
        }
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

            setUnexpectedErrors(errorMessages)
        }

        return formikErrors
    }

    return (
        <div
            style={{
                height: '100%',
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
            {rawJsonSchema && (
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
                    <Formik
                        key={rawJsonSchemaFormKey.current}
                        initialValues={rawJsonSchemaInitialValues}
                        initialErrors={
                            !initialValues
                                ? {
                                      formRawJsonSchema: 'Invalid JSON',
                                  }
                                : undefined
                        }
                        validate={(values) => {
                            try {
                                if (values.formRawJsonSchema) {
                                    JSON.parse(values.formRawJsonSchema)
                                }
                                return undefined
                            } catch {
                                return {
                                    formRawJsonSchema: 'Invalid JSON',
                                }
                            }
                        }}
                        onSubmit={(values) => {
                            setRawJsonSchema(values.formRawJsonSchema)
                        }}
                    >
                        {({ handleSubmit }) => {
                            return (
                                <form
                                    style={{
                                        display: 'grid',
                                        gridTemplateRows: '1fr auto',
                                    }}
                                    className="m5"
                                    onSubmit={handleSubmit}
                                >
                                    <FormikTextarea fieldName="formRawJsonSchema" />
                                    <input
                                        style={{ justifySelf: 'center' }}
                                        type="submit"
                                        value="Load JSON"
                                    />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            )}

            <div
                style={{
                    gridArea: 'form',
                    borderTop: !rawJsonSchema ? '' : '1px solid white',
                }}
            >
                {initialValues && (
                    <>
                        <h1 style={{ fontSize: 'xx-large' }}>Generated form</h1>
                        <Formik
                            key={formikKey.current}
                            validate={(values) => {
                                if (nullifyEmptyValues) {
                                    nullifyEmptyStringValues(values)
                                }
                                return handleValidate(values)
                            }}
                            initialValues={initialValues}
                            onSubmit={(values, { setSubmitting }) => {
                                alert(JSON.stringify(values))
                                setSubmitting(false)
                            }}
                        >
                            {({
                                handleSubmit,
                                setFieldValue,
                                values,
                                setValues,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <InputsForForm
                                        initialValues={values}
                                        onAddItemToArray={({
                                            arrayItem,
                                            objectPath,
                                        }) => {
                                            // For empty path, we want to get root
                                            // object, so the values
                                            if (objectPath) {
                                                const arrayFieldValue =
                                                    getAttributeFromPath(
                                                        values,
                                                        objectPath,
                                                        '.'
                                                    ) as unknown as []
                                                setFieldValue(
                                                    objectPath,
                                                    [
                                                        ...arrayFieldValue,
                                                        arrayItem,
                                                    ],
                                                    true
                                                )

                                                return
                                            }
                                            setValues([
                                                ...(values as unknown as []),
                                                arrayItem,
                                            ] as any)
                                        }}
                                        onRemoveItemToArray={({
                                            arrayItem,
                                            objectPath,
                                        }) => {
                                            // For empty path, we want to get root
                                            // object, so the values
                                            const arrayFieldValue = (objectPath
                                                ? getAttributeFromPath(
                                                      values,
                                                      objectPath,
                                                      '.'
                                                  )
                                                : values) as unknown as []
                                            if (arrayFieldValue.length > 1) {
                                                const filteredArray =
                                                    arrayFieldValue.filter(
                                                        (x) => x !== arrayItem
                                                    )
                                                if (objectPath) {
                                                    setFieldValue(
                                                        objectPath,
                                                        filteredArray,
                                                        true
                                                    )
                                                } else {
                                                    setValues(
                                                        filteredArray as any
                                                    )
                                                }
                                            }
                                        }}
                                    />
                                    <input type="submit" value="Submit" />
                                    <br />
                                    <button
                                        className="m5"
                                        type="button"
                                        onClick={() =>
                                            setNullifyEmptyValues(
                                                !nullifyEmptyValues
                                            )
                                        }
                                    >
                                        {nullifyEmptyValues
                                            ? "Don't nullify empty strings"
                                            : 'Nullify empty strings'}
                                    </button>
                                </form>
                            )}
                        </Formik>
                    </>
                )}
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
        </div>
    )
}

const FormikTextarea = ({ fieldName }: { fieldName: string }) => {
    const [field, meta] = useField(fieldName)
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: '1fr auto',
            }}
        >
            <textarea
                wrap="off"
                style={!meta.error ? {} : { border: '1px solid red' }}
                {...field}
            ></textarea>
            {meta.error && (
                <div
                    style={{
                        color: 'red',
                    }}
                >
                    Error: {meta.error}
                </div>
            )}
        </div>
    )
}
