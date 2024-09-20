import { useState } from 'react'
import { InputsForForm } from './InputsForForm'

export const InputsForArray = ({
    objectKey,
    arrayWithValues: currentValue,
    onAddItemToArray,
    onRemoveItemToArray,
}: {
    objectKey: string
    arrayWithValues: any
    onAddItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
    onRemoveItemToArray?: (addItemEvent: {
        arrayItem: any
        objectPath: string
    }) => void
}) => {
    const [showItems, setShowItems] = useState(true)
    const currentCount = currentValue.length

    return (
        <>
            {!showItems && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        columnGap: '1rem',
                    }}
                >
                    <span
                        style={{
                            placeSelf: 'center flex-end',
                        }}
                    >
                        {objectKey}
                    </span>
                    <button type="button" onClick={() => setShowItems(true)}>
                        Show all items ({currentCount})
                    </button>
                </div>
            )}
            {showItems && (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                        }}
                    >
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
                            Add item
                        </button>
                        {showItems && (
                            <button
                                type="button"
                                onClick={() => setShowItems(false)}
                            >
                                Collapse items
                            </button>
                        )}
                    </div>
                    {currentValue.map((item: any, index: number) => (
                        <div
                            key={`${objectKey}:${index}`}
                            style={{
                                border: '1px solid white',
                                margin: '5px 0',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    onRemoveItemToArray &&
                                    onRemoveItemToArray({
                                        arrayItem: item,
                                        objectPath: objectKey,
                                    })
                                }
                            >
                                Remove
                            </button>
                            <InputsForForm
                                key={`${objectKey}:${index}`}
                                initialValues={item}
                                parentName={`${objectKey}[${index}]`}
                            />
                        </div>
                    ))}
                </>
            )}
        </>
    )
}
