import { Modal, Button, Group, Text } from '@mantine/core';

interface Props {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    btnText?: string;
}

export default function ConfirmActionModal({ opened, onClose, onConfirm, title = 'Confirm Deletion', message = 'Are you sure you want to delete this item?', btnText = 'Delete' }: Props) {
    return (
        <Modal opened={opened} onClose={onClose} title={title} centered>
            <div
                // ⚠️ be very careful with user‑supplied HTML to avoid XSS!
                dangerouslySetInnerHTML={{ __html: message }}
            />
            <Group position="right" mt="md">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    variant="outline"
                    color="red"
                    size="xs"
                >
                    {btnText}
                </Button>
            </Group>
        </Modal>
    );
}
