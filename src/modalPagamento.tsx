import * as React from 'react';
import { Dialog, Portal, Text, Button } from 'react-native-paper';

interface PaymentConfirmationModalProps {
    visible: boolean;
    onDismiss: () => void;
}

const modalPagamento: React.FC<PaymentConfirmationModalProps> = ({
    visible,
    onDismiss,
}) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Content>
                    <Text>A assinatura foi realizada com sucesso!</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Fechar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default modalPagamento;