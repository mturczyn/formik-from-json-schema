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
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                columnGap: '1rem',
            }}
        >
            <label
                className="m5"
                style={{ placeSelf: 'flex-end' }}
                htmlFor={fieldName}
            >
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
                        gridColumn: '2',
                    }}
                >
                    Error: {meta.error}
                </div>
            )}
        </div>
    )
}
