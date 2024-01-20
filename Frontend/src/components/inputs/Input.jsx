import React from 'react'

const Input = ({ inputType = 'text', inputClassName, label, labelClassName, ...props }, ref) => {
    return (
        <>
            {label && <label className={labelClassName}>{label}</label>}
            <input type={inputType} className={inputClassName} ref={ref} {...props} />
        </>
    )
}

export default React.forwardRef(Input);