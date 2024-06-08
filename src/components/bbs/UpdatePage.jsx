import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { app } from '../../firebaseinit'
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'

const UpdatePage = () => {
    const navi = useNavigate();
    const db = getFirestore(app);
    const {id} = useParams();
    const [form, setForm] = useState({
        title: '',
        contents: '',
        date: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const { title, contents } = form;

    const callAPI = async() => { 
        setLoading(true);
        const res = await getDoc(doc(db, `/posts/${id}`));
        setForm(res.data());
        setLoading(false);
    }

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onClickUpdate = async(e) => { 
        e.preventDefault();
        
        if (!window.confirm("게시글을 수정하실래요?")) return;

        setLoading(true);

        await updateDoc(doc(db, `/posts/${id}`), form);

        setLoading(false);

        navi(`/bbs/read/${id}`);
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onBack = () => {
        window.location.href = '/bbs';
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <div>
            <Row className='my-5 justify-content-center'>
                <Col xs={12} md={10} lg={8}>
                    <h1>수정</h1>
                    <div className='mt-5'>
                        <Form.Control name='title' value={title} onChange={onChangeForm} className='mb-2' placeholder='제목을 입력하세요~.~' />
                        <Form.Control name='contents' value={contents} onChange={onChangeForm} as='textarea' rows={10} placeholder='내용을 입력하세요~.~' />
                        <div className='text-center mt-3'>
                            <Button onClick={onClickUpdate} className='px-5 me-2'>수정</Button>
                            <Button onClick={onBack} className='px-5' variant='secondary'>취소</Button>
                        </div>
                    </div>
                </Col>
            </Row>

        </div>
    )
}

export default UpdatePage
