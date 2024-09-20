import { useState } from 'react'
import { InputsForForm } from './InputsForForm'

export const InputsForArray = ({
    objectKey,
    currentValue,
    onAddItemToArray,
}: {
    objectKey: string
    currentValue: any
    onAddItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
}) => {
    const [showItems, setShowItems] = useState(true)

    return (
        <>
            {showItems && (
                <>
                    {currentValue.map((item: any, index: number) => (
                        <div
                            style={{
                                border: '1px solid white',
                                margin: '5px 0',
                            }}
                        >
                            <InputsForForm
                                key={`${objectKey}:${index}`}
                                initialValues={item}
                                parentName={`${objectKey}[${index}]`}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            onAddItemToArray &&
                            onAddItemToArray({
                                arrayItem: { ...currentValue[0] },
                                objectPath: objectKey,
                            })
                        }
                    >
                        Add
                    </button>
                </>
            )}
            {showItems ? (
                <button type="button" onClick={() => setShowItems(false)}>
                    Hide
                </button>
            ) : (
                <div>
                    {objectKey}{' '}
                    <button type="button" onClick={() => setShowItems(true)}>
                        Show all items
                    </button>
                </div>
            )}
        </>
    )
}
