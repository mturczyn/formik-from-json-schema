import { Formik } from 'formik'
import './signup.css'
import Ajv from 'ajv'
import { useMemo, useState } from 'react'
import jsf from 'json-schema-faker'
import { getFileContent } from './getFileContent'
import { ajvErorrsToFormikErrors } from './ajvErorrsToFormikErrors'
import { LabelWithInput } from './LabelWithInput'

export const SignupForm = () => {
    const [rawJsonSchema, setRawJsonSchema] = useState<string | undefined>()

    const validationSchema = rawJsonSchema && JSON.parse(rawJsonSchema)
    const initialValues = rawJsonSchema && jsf.generate(validationSchema)
    const ajvValidation = useMemo(
        () =>
            !!validationSchema &&
            new Ajv({ coerceTypes: true }).compile(validationSchema),
        [validationSchema]
    )

    console.log('initialValues', initialValues)

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
                    validate={handleValidate}
                    initialValues={initialValues}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log('submitting', values)
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
    initialValues: any
    parentName?: string
}) => {
    return Object.keys(initialValues).map((x) => {
        const currentValue = initialValues[x]
        console.log(
            '>>>',
            'generating input field for',
            x,
            'is string',
            typeof currentValue === 'string',
            'typeof',
            typeof currentValue
        )

        if (typeof currentValue === 'string') {
            return (
                <LabelWithInput
                    key={x}
                    fieldName={!parentName ? x : parentName + '.' + x}
                    label={x}
                ></LabelWithInput>
            )
        } else {
            return <InputsForForm initialValues={currentValue} parentName={x} />
        }
    })
}
