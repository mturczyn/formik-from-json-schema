import { Formik } from 'formik'
import './signup.css'
import Ajv from 'ajv'
import { useEffect, useRef, useState } from 'react'
import jsf from 'json-schema-faker'
import { schema } from './exampleJsonSchema'
import { getFileContent } from './getFileContent'
import { ajvErorrsToFormikErrors } from './ajvErorrsToFormikErrors'
import { LabelWithInput } from './LabelWithInput'

export const SignupForm = () => {
    const ajv = useRef(new Ajv({ coerceTypes: true }))
    const [rawJsonSchema, setRawJsonSchema] = useState<string | undefined>()

    const validationSchema = rawJsonSchema && JSON.parse(rawJsonSchema)
    const initialValues = rawJsonSchema && jsf.generate(validationSchema)

    console.log('initialValues', initialValues)

    const handleValidate = (values) => {
        console.log('validting values', values)
        console.log('validting values, schema', validationSchema)
        const validate = ajv.current.compile(validationSchema)
        const valid = validate(values)

        console.log('ajv errors', ajv.current.errors)
        console.log('valid', valid)
        console.log('validate', validate.errors)

        if (!validate.errors) return

        const formikErrors = ajvErorrsToFormikErrors(validate.errors)

        console.log('formikErrors', formikErrors)

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
                    validate={handleValidate}
                    initialValues={initialValues}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log('submitting', values)
                        alert(JSON.stringify(values))
                        setSubmitting(false)
                    }}
                >
                    {({ touched, errors, getFieldProps, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            {Object.keys(initialValues).map((x) => (
                                <LabelWithInput
                                    key={x}
                                    fieldName={x}
                                    label={x}
                                ></LabelWithInput>
                            ))}
                            <input type="submit" value="Submit" />
                        </form>
                    )}
                </Formik>
            )}
        </>
    )
}
