import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Books from './book/Books';
import Cart from './book/Cart';
import Login from './login/Login';
import About from './About';

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
                            <Nav.Link href="/cart">장바구니</Nav.Link>
                        </Nav>
                        {sessionStorage.getItem("email") ?
                            <>
                                <Nav>
                                    <Nav.Link href="#">{sessionStorage.getItem('email')}</Nav.Link>
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
                <Route path='/login' element={<Login />} />
            </Routes>
        </>
    );
}

export default Menu
