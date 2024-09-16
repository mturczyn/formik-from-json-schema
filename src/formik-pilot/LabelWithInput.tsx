import { useField } from 'formik'

export const LabelWithInput = ({
    fieldName,
    label,
}: {
    fieldName: string
    label: string
}) => {
    const [field, meta] = useField(fieldName)
    return (
        <div className="m5">
            <label className="m5" htmlFor={fieldName}>
                {label}
            </label>
            <input {...field}></input>
            {
                <div style={{ color: 'red' }}>
                    Error: {meta.error && meta.error}
                </div>
            }
        </div>
    )
}
