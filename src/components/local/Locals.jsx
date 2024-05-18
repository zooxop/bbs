import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { app } from '../../firebaseinit'
import { getDatabase, ref, get, set } from 'firebase/database'
import { useNavigate } from 'react-router-dom';

const Locals = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const [bookmarkList, setBookmarkList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('인하대학교');
    const [page, setPage] = useState(1);
    const [locals, setLocals] = useState([]);
    const uid = sessionStorage.getItem('uid');

    const callAPI = async () => {
        setLoading(true);

        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
            headers: {"Authorization":"KakaoAK a9c177322b9b68faa0a497e8b4f1d4d3"}
        };
        const res = await axios.get(url, config);
        setLocals(res.data.documents);
        setLoading(false);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (query === "") {
            alert("검색어를 입력하세요!");
            return
        }
        
        setPage(1);
        callAPI();
    }

    const onInit = () => {
        get(ref(db, `bookmark/${uid}`)).then(snapshot => {
            const data = snapshot.val();
            if (!data) { return }
            const keysList = Object.keys(data);
            setBookmarkList(keysList);
        })
    }

    const onClickBookmark = async (local) => {
        if (!uid) { 
            // 로그인 페이지로 이동
            sessionStorage.setItem('target', '/locals');
            navi('/login')
            return;
        }

        if (window.confirm("즐겨찾기에 추가하실래요?")) {
            // 즐겨찾기 추가
            await get(ref(db, `bookmark/${uid}/${local.id}`)).then(snapshot => {
                if (snapshot.exists()) {
                    alert("이미 존재하는 즐겨찾기 항목입니다!");
                    return;
                }

                // if (!window.confirm(`${local.place_name} 장소를 즐겨찾기에 등록하실래요?`)) return;

                set(ref(db, `bookmark/${uid}/${local.id}`), {...local});
                
                alert("즐겨찾기 등록 완료!");
            })
        }
    }

    useEffect(() => {
        callAPI();
        onInit();
    }, []);

    if (loading) return <h1>로딩중입니다........</h1>
    return (
        <div>
            <h1 className='my-5'>지역검색</h1>
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
            
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화</td>
                        <td>즐겨찾기</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local =>
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.place_name}</td>
                            <td>{local.road_address_name}</td>
                            <td>{local.phone}</td>
                            <td className='text-center'>
                                <Button onClick={()=>onClickBookmark(local)}>
                                    {bookmarkList.includes(local.id) ? '★' : '☆'} 
                                </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
        
    )
}

export default Locals
