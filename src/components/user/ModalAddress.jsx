import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import DaumPostcodeEmbed from 'react-daum-postcode';

const ModalAddress = ({onAddress}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onCompleted = (e) => {
        const address = e.buildingName ? `${e.address} (${e.buildingName})` : e.address;
        onAddress(address);
        handleClose();
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                검색
            </Button>

            <Modal
                style={{top: '20%'}}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>주소 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DaumPostcodeEmbed onComplete={ (e)=>onCompleted(e) } />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalAddress
