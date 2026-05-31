
const RequiredField = (value, fieldName) => {
    if (!value) {
        throw new Error(`${fieldName} is required`);
    }
};

export default RequiredField;