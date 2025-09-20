import React from 'react';

export default function Spinner({ size = 6 }: { size?: number }) {
    const s = `${size}rem`;

    return (
        <div className="inset-0 fixed bg-black/20 z-50 flex items-center justify-center">
            <div style={{ width: s, height: s }} className="animate-spin border-4 border-t-transparent rounded-full border-indigo-600" />
        </div>
    );
}
