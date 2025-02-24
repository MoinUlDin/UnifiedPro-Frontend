import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiMove } from 'react-icons/fi';
import { WebPart } from '../types';

interface DraggableWebPartProps {
    webPart: WebPart;
    index: number;
    moveWebPart: (dragIndex: number, hoverIndex: number) => void;
    children: React.ReactNode;
}

export const DraggableWebPart: React.FC<DraggableWebPartProps> = ({
    webPart,
    index,
    moveWebPart,
    children
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'WEB_PART',
        item: { type: 'WEB_PART', id: webPart.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ handlerId }, drop] = useDrop({
        accept: 'WEB_PART',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!item) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveWebPart(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div
            ref={(node) => drag(drop(node))}
            style={{ opacity }}
            className="relative"
            data-handler-id={handlerId}
        >
            <div className="absolute top-2 left-2 cursor-move text-gray-400 hover:text-gray-600 z-10">
                <FiMove className="h-5 w-5" />
            </div>
            {children}
        </div>
    );
};

export default DraggableWebPart;
