import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Books from './book/Books';
import Cart from './book/Cart';
import Login from './login/Login';
import About from './About';
import Locals from './local/Locals';
import Bookmark from './local/Bookmark';
import Join from './user/Join';
import Mypage from './user/Mypage';

const Menu = () => {
    const navi = useNavigate();

    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm("정말로 로그아웃하실래요?")) {
            sessionStorage.clear();
            navi("/");
        }
    }

    return (
        <>
            <Navbar expand="lg" bg='primary' data-bs-theme='dark'>
                <Container fluid>
                    <Navbar.Brand href="/">HOME</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/books">도서 검색</Nav.Link>
                            <Nav.Link href="/locals">지역 검색</Nav.Link>
                            {sessionStorage.getItem('uid') &&
                                <>
                                    <Nav.Link href="/cart">장바구니</Nav.Link>
                                    <Nav.Link href="/bookmark">즐겨찾기</Nav.Link>
                                </> 
                            }
                            
                        </Nav>
                        {sessionStorage.getItem("email") ?
                            <>
                                <Nav>
                                    <Nav.Link href="/mypage">{sessionStorage.getItem('email')}</Nav.Link>
                                    <Nav.Link href="#" onClick={onLogout}>로그아웃</Nav.Link>
                                </Nav>
                            </>
                            :
                            <Nav>
                                <Nav.Link href="/login">로그인</Nav.Link>
                            </Nav>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path='/' element={<About />} />
                <Route path='/books' element={<Books />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/locals' element={<Locals />} />
                <Route path='/login' element={<Login />} />
                <Route path='/bookmark' element={<Bookmark />} />
                <Route path='/join' element={<Join />} />
                <Route path='/mypage' element={<Mypage />} />
            </Routes>
        </>
    );
}

export default Menu
