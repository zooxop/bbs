import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { app } from '../../firebaseinit';
import { deleteDoc, doc, updateDoc, getFirestore, collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [contents, setContents] = useState('');
    const email = sessionStorage.getItem('email');
    const {id} = useParams();
    const db = getFirestore(app);

    const onClickInsert = () => {
        sessionStorage.setItem('target', `/bbs/read/${id}`);
        window.location.href = '/login';
    }

    const onInsert = async () => {
        if (contents === "") { 
            alert("댓글 내용을 입력하세요.");
            return;
        }

        const data = { 
            pid: id,
            email,
            contents,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }

        await addDoc(collection(db, `/comments`), data);

        alert("댓글 등록 완료~^^");

        setContents("");
    }

    const onChangeComments = (e) => { 
        setContents(e.target.value);
    }

    const callAPI = () => {
        const q = query(collection(db, 'comments'), where('pid', '==', id), orderBy('date', 'desc'));
        onSnapshot(q, snapshot => {
            let rows = [];
            snapshot.forEach(row => {
                rows.push({id: row.id, ...row.data()});
            });

            const data = rows.map(row=>row && {...row, ellipsis: true, isEdit: false, text: row.contents});

            setComments(data);
        });
    }

    const onClickContents = (id) => {
        const data = comments.map(com => com.id === id ? {...com, ellipsis: !com.ellipsis} : com);
        setComments(data);
    }

    const onClickDelete = async (id) => {
        if(!window.confirm(`${id}번 댓글을 삭제하실?`)) return;

        // 댓글 삭제
        await deleteDoc(doc(db,`/comments/${id}`));
    }

    const onClickUpdate = async (id) => {
        const data = comments.map(com => com.id === id ? {...com, isEdit: true} : com);
        setComments(data);
    }

    const onClickSubmit = async (com) => {
        if (com.text === com.contents) {
            cancelAndFoldEditForm(com.id);
            return;
        }

        if (!window.confirm("댓글을 수정하실래요?")) return;
        await updateDoc(doc(db, `/comments/${com.id}`), com);
        
    }

    const onChangeContents = (e, id) => {
        const data = comments.map(com => com.id === id ? {...com, contents: e.target.value} : com);
        setComments(data);
    }

    const onClickCancel = (comment) => {
        if (comment.contents === comment.text || window.confirm("정말로 취소할래요?")) { 
            cancelAndFoldEditForm(comment.id);
        }   
    }

    const cancelAndFoldEditForm = (id) => {
        const data = comments.map(com => com.id === id ? {...com, isEdit: false, contents: com.text} : com);

        setComments(data);
    }

    useEffect(() => {
        callAPI();
    }, []);

    return (
        <div className='my-5'>
            {email ? 
                <div>
                    <Form.Control 
                        as="textarea"
                        rows={5}
                        placeholder='댓글 내용을 입력하세요.'
                        value={contents}
                        onChange={onChangeComments}
                    />
                    <div className='text-end'>
                        <Button onClick={onInsert} className='mt-2'>등록</Button>
                    </div>
                    
                </div>
                :
                <div className='text-end'>
                    <Button
                        className='px-5'
                        onClick={onClickInsert}>
                        댓글등록
                    </Button>    
                </div>
            }
            <div className='mt-5'>
                {comments.map(com =>
                    <div key={com.id}>
                        <Row className='mb-2'>
                            <Col className='text-muted'>
                                <span className='me-2'>{com.email}</span>
                                <span>{com.date}</span>
                            </Col>
                            {email === com.email && !com.isEdit &&
                                <Col className='text-end'>
                                    <Button
                                        size='sm'
                                        className='me-2'
                                        onClick={() => onClickUpdate(com.id)}
                                    >
                                        수정
                                    </Button>

                                    <Button
                                        size='sm' 
                                        variant='danger' 
                                        onClick={() => onClickDelete(com.id)}
                                    >
                                        삭제
                                    </Button>
                                </Col>
                            }
                            {email === com.email && com.isEdit &&
                                <Col className='text-end'>
                                    <Button
                                        size='sm'
                                        className='me-2'
                                        onClick={() => onClickSubmit(com)}
                                        variant='success'
                                    >
                                        저장
                                    </Button>

                                    <Button
                                        size='sm' 
                                        variant='secondary' 
                                        onClick={() => onClickCancel(com)}
                                    >
                                        취소
                                    </Button>
                                </Col>
                            }
                        </Row>
                        {com.isEdit ?
                            <Form.Control
                                value={com.contents}
                                as="textarea"
                                rows={5}
                                onChange={(e) => onChangeContents(e, com.id)}
                            />

                            :
                            <div 
                                style={{whiteSpace: 'pre-wrap', cursor: 'pointer'}} 
                                className={com.ellipsis && 'ellipsis'}
                                onClick={() => onClickContents(com.id)}
                            >
                                {com.contents}
                            </div>
                        }
                        
                        <hr />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comments
