import React from 'react';

const Select = ({
    name,
    label,
    value,
    onChange,
    children,
    error = ""
}) => {
    return (
        <div className="form-group">
            <label htmlFor={name} className="form-label mt-4">{label}</label>
            <select
                name={name}
                id={name}
                className={"form-control" + (error && " is-invalid")}
                value={value}
                onChange={onChange}
            >
                {children}
            </select>
            {error && <p className="invalid-feedback">{error}</p>}
        </div>
    );
}

export default Select;