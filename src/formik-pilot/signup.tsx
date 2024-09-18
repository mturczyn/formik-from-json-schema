import { Formik } from 'formik'
import './signup.css'
import Ajv from 'ajv'
import { useEffect, useMemo, useRef, useState } from 'react'
import { JSONSchemaFaker } from 'json-schema-faker'
import { getFileContent } from './getFileContent'
import { ajvErorrsToFormikErrors } from './ajvErorrsToFormikErrors'
import { LabelWithInput } from './LabelWithInput'
import { faker } from '@faker-js/faker'

JSONSchemaFaker.extend('faker', () => {
    return faker
})

export const SignupForm = () => {
    const [rawJsonSchema, setRawJsonSchema] = useState<string | undefined>()
    const formikKey = useRef(0)

    const validationSchema = useMemo(
        () => !!rawJsonSchema && JSON.parse(rawJsonSchema),
        [rawJsonSchema]
    )

    const initialValues = useMemo(() => {
        if (!validationSchema) return null
        const sample = JSONSchemaFaker.generate(validationSchema)

        return sample
    }, [validationSchema])

    useEffect(() => {
        if (initialValues) formikKey.current++
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

        const formikErrors = ajvErorrsToFormikErrors(ajvValidation.errors)

        return formikErrors
    }

    return (
        <>
            <button
                onClick={() =>
                    getFileContent().then((r) => setRawJsonSchema(r))
                }
            >
                Open file
            </button>
            {initialValues && (
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
                            <InputsForForm initialValues={initialValues} />
                            <input type="submit" value="Submit" />
                        </form>
                    )}
                </Formik>
            )}
        </>
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
            return (
                <InputsForForm
                    key={x}
                    initialValues={currentValue}
                    parentName={x}
                />
            )
        } else {
            return (
                <LabelWithInput
                    key={x}
                    fieldName={!parentName ? x : parentName + '.' + x}
                    label={x}
                ></LabelWithInput>
            )
        }
    })
}
