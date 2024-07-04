import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { register } from '../actions/userActions'
import Message from '../components/Message'
import '../styles/RegisterPage.css' // Asegúrate de crear y ajustar este archivo CSS según sea necesario

function RegisterPage({ history }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    const dispatch = useDispatch()

    // reducer
    const userRegisterReducer = useSelector(state => state.userRegisterReducer)
    const { error, userInfo } = userRegisterReducer

    useEffect(() => {
        if (userInfo) {
            history.push('/') // página principal
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('¡Las contraseñas no coinciden!')
        } else {
            dispatch(register(username, email, password))
        }
    }

    return (
        <Container className="register-container">
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <Card className="register-card shadow-sm">
                        <Card.Body>
                            <h1 className="text-center mb-4">Registrarse</h1>
                            {message && <Message variant='danger'>{message}</Message>}
                            {error && <Message variant='danger'>{error}</Message>}
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='username'>
                                    <Form.Label>Nombre de usuario</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese su nombre de usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='email'>
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Ingrese su correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='password'>
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Ingrese su contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='confirmPassword'>
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Confirme su contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button type="submit" variant='primary' className="w-100 mt-3">Registrarse</Button>
                            </Form>

                            <Row className="py-3">
                                <Col className="text-center">
                                    ¿Ya tienes una cuenta? <Link to={`/login`}>Iniciar sesión</Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default RegisterPage
