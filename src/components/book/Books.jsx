import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseinit'
import { getDatabase, ref, get, set } from 'firebase/database'

const Books = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const uid = sessionStorage.getItem('uid');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('리액트');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const callAPI = async () => {
        setLoading(true);

        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config = {
            headers: {"Authorization":"KakaoAK a9c177322b9b68faa0a497e8b4f1d4d3"}
        };
        const res = await axios.get(url, config);
        setBooks(res.data.documents);
        
        setLoading(false);
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onClickCart = (book) => {
        console.log(uid);
        // 로그인 상태 OK
        if (uid) {
            // 장바구니에 도서 넣기
            get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
                if (snapshot.exists()){
                    alert("이미 존재하는 도서입니다!");
                } else {
                    if(!window.confirm(`"${book.title}" 도서를 장바구니에 등록하실래요?`)) return;
                    set(ref(db, `cart/${uid}/${book.isbn}`), {...book});
                    alert('도서등록완료!');
                }
            })
        } else {
            // 로그인 페이지로 이동
            sessionStorage.setItem('target', '/books');
            navi('/login')
        }
    }

    if (loading) return <h1>로딩중입니다........</h1>
    return (
        <div className='my-5'>
            <h1>도서검색</h1>
            
            <Row className='mb-2'>
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='검색어 입력' 
                                value={query}
                                onChange={(e)=>setQuery(e.target.value)}
                            />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>

            <Row>
                {books.map(book => 
                    <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
                        <Card>
                            <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img width="90%"
                                    src={book.thumbnail || 'http://via.placeholder.com/120x170'} 
                                    alt="" 
                                />
                            </Card.Body>
                            <Card.Footer>
                                <div className='ellipsis'>{book.title}</div>
                                <FaCartPlus 
                                    style={{cursor:'pointer', fontSize:'20px', color:'orange'}}
                                    onClick={()=>onClickCart(book)}
                                />
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>

            <div className='text-center my-3'>
                <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button onClick={()=>setPage(page+1)}>다음</Button>
            </div>
        </div>
    )
}

export default Books
