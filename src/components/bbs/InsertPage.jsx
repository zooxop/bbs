import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { app } from '../../firebaseinit'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import moment from 'moment'

const InsertPage = () => {
    const db = getFirestore(app);
    const [form, setForm] = useState({
        title: '',
        contents: ''
    });
    const { title, contents } = form;

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onInsert = async () => {
        if (title === '' || contents === '') {
            alert("제목과 내용을 입력하세요!");
            return;
        }
        if (!window.confirm('등록하시겠습니까?')) return;
        // 게시글 등록
        const data = {
            email: sessionStorage.getItem('email'),
            title,
            contents,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }

        await addDoc(collection(db, 'posts'), data);
        alert('게시글 등록 완료');
        window.location.href = '/bbs';
    }

    const onBack = () => {
        window.location.href = '/bbs';
    }

    return (
        <div>
            <Row className='my-5 justify-content-center'>
                <Col xs={12} md={10} lg={8}>
                    <h1>글쓰기</h1>
                    <div className='mt-5'>
                        <Form.Control name='title' value={title} onChange={onChangeForm} className='mb-2' placeholder='제목을 입력하세요~.~' />
                        <Form.Control name='contents' value={contents} onChange={onChangeForm} as='textarea' rows={10} placeholder='내용을 입력하세요~.~' />
                        <div className='text-center mt-3'>
                            <Button onClick={onInsert} className='px-5 me-2'>등록</Button>
                            <Button onClick={onBack} className='px-5' variant='secondary'>취소</Button>
                        </div>
                    </div>
                </Col>
            </Row>

        </div>
    )
}

export default InsertPage