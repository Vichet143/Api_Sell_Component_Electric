
const RequiredField = (value, fieldName) => {
    if (!value) {
        return {
            success: false,
            message: `${fieldName} is required`
        };
    }
};

export default RequiredField;