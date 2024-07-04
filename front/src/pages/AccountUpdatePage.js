import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, userUpdateDetails, checkTokenValidation, logout } from '../actions/userActions'
import Message from '../components/Message'
import { UPDATE_USER_DETAILS_RESET } from '../constants'
import '../styles/AccountPage.css' 

function AccountUpdatePage() {
    let history = useHistory()
    const dispatch = useDispatch()

    // reducer para validar el token
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // reducer para los detalles del usuario
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    // reducer para actualizar los detalles del usuario
    const userDetailsUpdateReducer = useSelector(state => state.userDetailsUpdateReducer)
    const { success } = userDetailsUpdateReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(userDetails(userInfo.id))
        }
    }, [dispatch, history, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("La sesión ha expirado, por favor inicie sesión nuevamente.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const updatedUsername = username === "" ? userAccDetails.username : username
        const updatedEmail = email === "" ? userAccDetails.email : email

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden")
        } else {
            const userData = {
                'username': updatedUsername,
                'email': updatedEmail,
                'password': password,
            }
            dispatch(userUpdateDetails(userData))
        }
    }

    // cerrar sesión
    const logoutHandler = () => {
        history.push("/login")
        dispatch(logout()) // acción        
    }

    if(success) {
        alert("Cuenta actualizada exitosamente.")
        dispatch({
            type: UPDATE_USER_DETAILS_RESET
        })
        history.push("/account/")
        dispatch(userDetails(userInfo.id))
    }

    const renderData = () => {
        try {
            return (
                <div className="account-page">
                    <Row className='justify-content-md-center'>
                        <Col xs={12} md={6}>
                            <span className="d-flex justify-content-center" style={{ marginBottom: "15px", color: "#008080" }}>
                                <em>Actualizar detalles del usuario</em>
                            </span>
                            {loading && <Spinner animation="border" />}
                            <Form onSubmit={onSubmit}>
                                <Form.Group controlId='username'>
                                    <Form.Label>Nombre de usuario</Form.Label>
                                    <Form.Control
                                        autoFocus={true}
                                        type="text"
                                        defaultValue={userAccDetails.username}
                                        placeholder="Nombre de usuario"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='email'>
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingrese correo electrónico"
                                        defaultValue={userAccDetails.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='password'>
                                    <Form.Label>Restablecer contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingrese nueva contraseña"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='confirmPassword'>
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirme la nueva contraseña"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button type="submit" variant='success' className="btn-sm">Guardar cambios</Button>
                                <Link to={`/account`}>
                                    <button className="btn btn-primary btn-sm ml-2" type="button">
                                        Cancelar
                                    </button>
                                </Link>
                            </Form>
                        </Col>
                    </Row>
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

export default AccountUpdatePage
