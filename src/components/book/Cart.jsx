import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseinit'
import { getDatabase, onValue, ref, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap'

const Cart = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const uid = sessionStorage.getItem('uid');
    const db = getDatabase(app);
    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `cart/${uid}`), snapshot => {
            const rows = [];
            snapshot.forEach(row=>{
                rows.push({...row.val()});
            });
            setBooks(rows);
            setLoading(false);
        });
    }

    useEffect(()=>{
        callAPI();
    }, []);

    const onClickDelete = (book) => {
        if (window.confirm(`${book.title}\n삭제하실래요?`)) {
            // 장바구니에서 삭제
            remove(ref(db, `cart/${uid}/${book.isbn}`));
        }
    }

    if (loading) return <h1>로딩중....</h1>
    return (
        <div className='my-5'>
            <h1>장바구니</h1>
            <Table>
                <thead>
                    <tr>
                        <td colSpan={2} >도서제목</td>
                        <td>가격</td>
                        <td>저자</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => 
                        <tr key={book.isbn}>
                            <td><img src={book.thumbnail} width="50px" alt="" /></td>
                            <td>{book.title}</td>
                            <td>{book.price}</td>
                            <td>{book.authors}</td>
                            <td>
                                <Button
                                    onClick={()=>onClickDelete(book)}
                                    variant='danger' 
                                    className='btn-sm'
                                >삭제</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Cart
