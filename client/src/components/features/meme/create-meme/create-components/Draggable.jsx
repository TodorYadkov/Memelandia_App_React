/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// This code is from:
// https://engineering.salesforce.com/hooking-your-audience-using-drag-drop-in-react-6ba1118dab84/
export default function Draggable({ children, }) {
    const POSITION = { x: 10, y: 10 };                                                                  // Initial position on the element

    const [state, setState] = useState({                                                                // Initial state
        isDragging: false,
        origin: POSITION,
        translation: POSITION,
    });

    const divElementRef = useRef(null);                                                                 // A reference to an element that can be dragged across the screen

    const handleMouseDown = useCallback(({ clientX, clientY }) => {                                     // Mouse down event handler                                                                      
        startDragging(clientX, clientY);
    }, []);

    const handleMouseMove = useCallback(({ clientX, clientY }) => {                                     // Mouse move event handler
        if (state.isDragging) {
            const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
            setState((state) => ({
                ...state,
                translation,
            }));
        }
    }, [state.isDragging, state.origin]);

    const handleMouseUp = useCallback(() => {                                                           // Mouse up event handler
        stopDragging();
    }, []);

    const handleTouchStart = useCallback((event) => {                                                   // Touch start event handler
        const touch = event.touches[0];
        if (touch) {
            startDragging(touch.clientX, touch.clientY);
        }
    }, []);

    const handleTouchMove = useCallback((event) => {                                                    // Touch move event handler
        const touch = event.touches[0];
        if (touch && state.isDragging) {
            const translation = { x: touch.clientX - state.origin.x, y: touch.clientY - state.origin.y };
            setState((state) => ({
                ...state,
                translation,
            }));
        }

    }, [state.isDragging, state.origin]);

    const handleTouchEnd = useCallback(() => {                                                          // Touch end event handler
        stopDragging();

    }, []);

    const startDragging = (clientX, clientY) => {                                                       // Start dragging function
        const currentDivEl = divElementRef.current;
        const divRect = currentDivEl.getBoundingClientRect();

        const mouseX = clientX - divRect.left;
        const mouseY = clientY - divRect.top;
        const positionInPixels = {
            x: divRect.left + mouseX,
            y: divRect.top + mouseY,
        };

        const computedStyle = window.getComputedStyle(currentDivEl);
        const transformValue = computedStyle.getPropertyValue('transform');
        const matrixValues = transformValue.match(/matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/) || [, 1, 0, 0, 1, 0, 0];

        const translateX = parseFloat(matrixValues[5]);
        const translateY = parseFloat(matrixValues[6]);

        const origin = {
            x: positionInPixels.x - translateX,
            y: positionInPixels.y - translateY,
        };

        setState((state) => ({
            ...state,
            isDragging: true,
            origin,
        }));
    };

    const stopDragging = () => {                                                                        // Stop dragging function
        setState((state) => ({
            ...state,
            isDragging: false,
        }));
    };

    useEffect(() => {                                                                                   // Effect to add and remove event listeners based on the dragging state
        const clear = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        if (state.isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        } else {
            clear();
        }

        return () => clear();
    }, [state.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const styles = useMemo(                                                                             // Styles memoized for performance
        () => ({
            cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
            transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
            zIndex: 1000,
        }),
        [state.isDragging, state.translation]
    );

    return (
        <div ref={divElementRef} style={styles} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
            {children}
        </div>
    );
}