import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { login } from '../actions/userActions'
import Message from '../components/Message'
import '../styles/LoginPage.css' // Asegúrate de crear y ajustar este archivo CSS según sea necesario

function LoginPage({ history }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()

    // reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { error, userInfo } = userLoginReducer

    useEffect(() => {
        if (userInfo) {
            history.push('/') // página principal
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(username, password))
    }

    return (
        <Container className="login-container">
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <Card className="login-card shadow-sm">
                        <Card.Body>
                            <h1 className="text-center mb-4">Iniciar Sesión</h1>
                            {error && <Message variant='danger'>{error}</Message>}
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='username'>
                                    <Form.Label>Nombre de usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese su nombre de usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='password'>
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingrese su contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button type="submit" variant='primary' className="w-100 mt-3">Iniciar Sesión</Button>
                            </Form>

                            <Row className="py-3">
                                <Col className="text-center">
                                    ¿No tienes una cuenta? <Link to={`/register`}>Regístrate</Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage
