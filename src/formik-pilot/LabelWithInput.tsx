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
        <div
            className="m5"
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: 'auto auto',
                columnGap: '1rem',
                placeItems: 'stretch flex-end',
            }}
        >
            <label className="m5" htmlFor={fieldName}>
                {label}
            </label>
            <input
                style={!meta.error ? {} : { border: '1px solid red' }}
                {...field}
            ></input>
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
