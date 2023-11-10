export const trimInputData = (userInput) => {

    return (
        Object.entries(userInput).reduce((acc, inputField) => {
            const [inputFieldName, inputFieldValue] = inputField;
            // Check if the email or username is empty (used in login and forgot password)
            if (inputFieldValue === '') {
                return acc;
            }

            return { ...acc, [inputFieldName]: typeof inputFieldValue === 'string' ? inputFieldValue.trim() : inputFieldValue };
        }, {})
    );
};