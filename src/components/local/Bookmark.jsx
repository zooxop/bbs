import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseinit'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap'

const Bookmark = () => {
    const [loading, setLoading] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');

    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `bookmark/${uid}`), snapshot => {
            const rows = [];
            snapshot.forEach(row => {
                rows.push({...row.val()});
            });
            setBookmarks(rows);
            setLoading(false);
        });
    }

    const onClickDelete = async (local) => {
        setLoading(true);
        if (window.confirm("삭제하시겠습니까?")) {
            await remove(ref(db, `bookmark/${uid}/${local.id}`));
        }
        setLoading(false);
    }

    useEffect(() => {
        callAPI();
    }, []);

    if (loading) return <h1>로딩중입니다........</h1>
    return (
        <div>
            <h1 className='my-5'>즐겨찾기</h1>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {bookmarks.map(bookmark => 
                        <tr key={bookmark.id}>
                            <td>{bookmark.id}</td>
                            <td>{bookmark.place_name}</td>
                            <td>{bookmark.road_address_name}</td>
                            <td>{bookmark.phone}</td>
                            <td className='text-center'>
                                <Button
                                    variant='light'
                                    onClick={()=>onClickDelete(bookmark)}
                                >
                                    🗑
                                </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Bookmark
