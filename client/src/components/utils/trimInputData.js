export const trimInputData = (userInput) => {                                                           // This function trims any string inputs in the provided                                                     
                                                                                                        // user input object and returns the updated object
    return (
        Object.entries(userInput).reduce((acc, inputField) => {                                         // Using Object.entries to process each key-value pair in the input object                                        
            const [inputFieldName, inputFieldValue] = inputField;

            if (inputFieldValue === '') {                                                               // If the value of the input field is an empty string, skip it in the result
                return acc;
            }

            return { ...acc, [inputFieldName]: typeof inputFieldValue === 'string' ? inputFieldValue.trim() : inputFieldValue };
        }, {})
    );
};