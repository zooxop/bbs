import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { app } from '../../firebaseinit'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const ModalPhoto = ({form, setForm, setLoading}) => {
    const uid = sessionStorage.getItem('uid');
    const storage = getStorage(app);
    const db = getFirestore(app);

    const [fileName, setFileName] = useState(form.photo);
    const [file, setFile] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const style = {
        cursor: 'pointer',
        borderRadius: '50%',
        width: '80px',
        marginBottom: '10px'
    }

    const style1 = {
        borderRadius: '50%',
        width: 200,
        marginBottom: '10px'
    }

    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }

    const onClickSave = async () => {
        if (!file) { 
            alert("변경할 이미지를 선택해주세요");
            return;
        }

        if (!window.confirm("사진을 변경하시겠습니까?")) return;
        setLoading(true);
        // 사진 저장(업로드)
        const res = await uploadBytes(ref(storage, `/photo/${Date.now().jpg}`), file);
        const url = await getDownloadURL(res.ref);
        await setDoc(doc(db, `users/${uid}`), {...form, photo: url});
        setForm({
            ...form,
            photo: url
        });
        setLoading(false);
    }

    return (
        <>
            <img src = {form.photo || "http://via.placeholder.com/80x80" }
                alt="" 
                style={style}
                onClick={handleShow}
            />

            <Modal
                style={{top: '20%'}}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>사진 변경</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <img src = {fileName || "http://via.placeholder.com/80x80"}
                        style={style1}
                        
                    />
                    <Form.Control type='file' onChange={onChangeFile}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={onClickSave}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalPhoto
