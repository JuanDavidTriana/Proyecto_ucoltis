import React, { useEffect } from 'react'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, logout, checkTokenValidation } from '../actions/userActions'
import Message from '../components/Message'
import '../styles/AccountPage.css' 

function AccountPage() {
    let history = useHistory()
    const dispatch = useDispatch()

    // reducer para validar el token
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // reducer para los detalles del usuario
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            try {
                dispatch(checkTokenValidation())
                dispatch(userDetails(userInfo.id))
            } catch (error) {
                history.push("/")
            }
        }
    }, [history, userInfo, dispatch])

    // cerrar sesión
    const logoutHandler = () => {
        dispatch(logout()) // acción
        history.push("/login")
        window.location.reload()
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Sesión expirada, por favor inicie sesión nuevamente.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const renderData = () => {
        try {
            return (
                <div className="account-page">
                    {loading && (
                        <div className="loading-container">
                            <h5>Obteniendo información del usuario</h5>
                            <Spinner animation="border" />
                        </div>
                    )}
                    <Container>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Nombre:</Col>
                            <Col className="info-value">{userAccDetails.username}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Correo:</Col>
                            <Col className="info-value">{userAccDetails.email}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Privilegios de Admin:</Col>
                            <Col className="info-value">{userAccDetails.admin ? "Sí" : "No"}</Col>
                        </Row>
                    </Container>
                    <div className="actions-container">
                        <Link to={`/account/update`}>Actualizar datos de la cuenta</Link>
                        <span className="separator">|</span>
                        <Link to={`/account/delete/`}>Eliminar cuenta</Link>
                    </div>
                </div>
            )
        } catch (error) {
            return (
                <Message variant='danger'>
                    Algo salió mal, regrese a la página de 
                    <Link onClick={logoutHandler} to={`/login`}> inicio de sesión</Link>.
                </Message>
            )
        }
    }

    return renderData()
}

export default AccountPage
