import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'
import { app } from '../../firebaseinit'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import ModalAddress from './ModalAddress'
import ModalPhoto from './ModalPhoto'

const Mypage = () => {
    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');

    const db = getFirestore(app);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address1: '',
        address2: '',
        photo: ''
    });
    const {name, phone, address1, address2} = form;

    const onChangeForm = (e) => {
        setForm({
            ...form, 
            [e.target.name]: e.target.value
        });
    }

    const getUser = async () => {
        setLoading(true);
        const res = await getDoc(doc(db, `users/${uid}`), form);

        if (res.data()) { 
            setForm(res.data());
        }

        setLoading(false);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (name==='') {
            alert("이름을 입력하세요");
            return
        }

        if(!window.confirm("변경된 내용을 저장하시겠습니까?")) return;

        setLoading(true);
        await setDoc(doc(db, `users/${uid}`), form);
        setLoading(false);
    }

    const onAddress = (address) => {
        setForm({
            ...form,
            address1: address
        });
    }

    useEffect(() => {
        getUser();
    }, []);

    if(loading) return <h1 className='my-5'>로딩중입니다......</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <ModalPhoto setLoading={setLoading} form={form} setForm={setForm} />
                        </div>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>이름</InputGroup.Text>
                                <Form.Control name="name" value={name} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>전화</InputGroup.Text>
                                <Form.Control name="phone" value={phone} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>주소</InputGroup.Text>
                                <Form.Control name="address1" value={address1} onChange={onChangeForm}/>
                                <ModalAddress onAddress={onAddress}/>
                            </InputGroup>
                            <Form.Control placeholder='상세주소' name="address2" value={address2} onChange={onChangeForm}/>
                            <div className='text-center mt-3'>
                                <Button className='px-5' type='submit'>저장</Button>
                                <Button variant='secondary' className='ms-2 px-5'>취소</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

    )
}

export default Mypage
