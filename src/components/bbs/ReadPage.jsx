import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { app } from '../../firebaseinit';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Comments from './Comments';

const ReadPage = () => {
    const navi = useNavigate();
    const loginEmail = sessionStorage.getItem('email');
    const [post, setPost] = useState('');
    const { id } = useParams();
    const db = getFirestore(app);
    const callDB = async () => {
        const res = await getDoc(doc(db, `posts/${id}`));
        // console.log(res.data());
        setPost(res.data());
    }

    const { email, date, title, contents } = post;

    useEffect(() => {
        callDB();
    }, [])

    const onClickDelete = async() => {
        if(!window.confirm(`${id}번 게시글을 삭제하겠습니까?`)) return;
        // 게시글 삭제
        await deleteDoc(doc(db,`/posts/${id}`));
        window.location.href = '/bbs';
    }

    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1 className='mb-5'>게시글 정보</h1>
                {loginEmail === email &&
                    <div className='text-end mb-2'>
                        <Button onClick={()=>navi(`/bbs/update/${id}`)}
                            variant='success' size='sm' className='me-2'>수정</Button>
                        <Button onClick={onClickDelete} variant='danger' size='sm'>삭제</Button>
                    </div>
                }
                <Card>
                    <Card.Body>
                        <h5>{title}</h5>
                        <div className='text-muted'>
                            <span className='me-2'>{date}</span>
                            <span>{email}</span>
                        </div>
                        <hr />
                        <div style={{ whiteSpace: 'pre-wrap' }}>{contents}</div>
                    </Card.Body>
                </Card>
                <Comments></Comments>
            </Col>
        </Row>
    )
}

export default ReadPage