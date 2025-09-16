// src/components/Modal.tsx
import React, { ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
};

export default function Modal({ open, onClose, children, className = 'max-w-2xl' }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-xl p-6 z-10 w-full ${className}`}>{children}</div>
        </div>
    );
}
