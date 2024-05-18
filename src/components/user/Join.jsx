import React, { useState } from 'react'
import { Card, Col, Row, InputGroup, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { app } from '../../firebaseinit'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const Join = () => {
    const auth = getAuth(app);
    const navi = useNavigate();
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const { email, pass } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e)=> {
        e.preventDefault();
        if(email==="" || pass===""){
            alert("이메일 또는 비밀번호를 입력하세요!");
        } else {
            setLoading(true);
            
            createUserWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                setLoading(false);
                alert("회원가입 성공!");

                // 가입 성공 후 login 화면으로 전환
                navi('/login');                
            })
            .catch(err=>{
                alert(`회원가입 에러:${err.message}`);
                setLoading(false);
            });
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col md={6} lg={4}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>회원가입</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{ width: '100px' }} className='justify-content-center'>이메일</InputGroup.Text>
                                <Form.Control value={email} name="email" onChange={onChange} />
                            </InputGroup>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text style={{ width: '100px' }} className='justify-content-center'>비밀번호</InputGroup.Text>
                                <Form.Control value={pass} name="pass" onChange={onChange} type="password" />
                            </InputGroup>
                            <Button className='w-100' type="submit">회원가입</Button>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Join
