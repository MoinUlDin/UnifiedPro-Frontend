import React from 'react';

export default function Spinner({ size = 6 }: { size?: number }) {
    const s = `${size}rem`;
    return <div style={{ width: s, height: s }} className="animate-spin border-4 border-t-transparent rounded-full border-indigo-600" />;
}
