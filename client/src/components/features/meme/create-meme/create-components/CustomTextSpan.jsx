/* eslint-disable react/prop-types */
export default function CustomTextSpan({ top, left, fontSize, color, textOutline, text }) {
    const spanStyle = {
        top,
        left,
        fontSize: `${fontSize || 22}px`,
        color: color || '#ffffff',
        textShadow: `
            1px 1px 0 ${textOutline || '#000000'},
            -1px -1px 0 ${textOutline || '#000000'},
            1px -1px 0 ${textOutline || '#000000'},
            -1px 1px 0 ${textOutline || '#000000'}`,
    };

    return (
        <span style={spanStyle}>
            {text}
        </span>
    );
}