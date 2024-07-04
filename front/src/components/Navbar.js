import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory } from "react-router-dom";
import SearchBarForProducts from './SearchBarForProducts'
import logo1 from '../assets/img/logoucoltis.png'; 

function NavBar() {

    let history = useHistory()
    const dispatch = useDispatch()

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // cerrar sesión
    const logoutHandler = () => {
        dispatch(logout()) // acción
        history.push("/login")
        window.location.reload()
    }

    return (
        <header>
            <div className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#1A1A1A', padding: '15px 20%' }}>
                <img
                    src={logo1}
                    width="190"
                    height="70"
                    className="d-inline-block align-top"
                    alt="Logo 3"
                />
            </div>
            <Navbar style={{ backgroundColor: '#1A1A1A', width: '100%' }} variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="w-100 d-flex justify-content-between align-items-center">
                            <LinkContainer to="/">
                                <Nav.Link>Inicio</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/shop">
                                <Nav.Link>Tienda</Nav.Link>
                            </LinkContainer>
                            {/* New Product (Admins Only) */}

                            {userInfo && userInfo.admin ?
                                <LinkContainer to="/new-product/">
                                    <Nav.Link >Añadir nuevo producto</Nav.Link>
                                </LinkContainer>
                                : ""
                            }
                            <div className="d-flex align-items-center">
                                <SearchBarForProducts />
                                {userInfo ?
                                    <NavDropdown className="ml-3" title={userInfo.username} id='username'>
                                        <LinkContainer to="/account">
                                            <NavDropdown.Item>Configuración de la cuenta</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/all-addresses/">
                                            <NavDropdown.Item>Configuración de direcciones</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/card-details/"> 
                                            <NavDropdown.Item>Configuración de tarjetas</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/all-orders/">
                                            <NavDropdown.Item>Todas las órdenes</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Cerrar sesión
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    :
                                    <LinkContainer to="/login">
                                        <Nav.Link><i className="fas fa-user"></i> Iniciar sesión</Nav.Link>
                                    </LinkContainer>
                                }
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar
