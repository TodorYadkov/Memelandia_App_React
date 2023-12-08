import { useEffect, useState } from 'react';

export const useDebounce = (value, milliSeconds) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, milliSeconds);

        return () => {
            clearTimeout(handler);
        };
    }, [value, milliSeconds]);

    const resetDebouncedValue = () => {
        setDebouncedValue('');
    };

    return [debouncedValue, resetDebouncedValue];
};