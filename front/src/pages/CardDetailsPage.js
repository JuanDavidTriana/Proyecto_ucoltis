import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savedCardsList } from '../actions/cardActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import Message from "../components/Message"
import DeleteCardComponent from '../components/DeleteCardComponent'
import '../styles/CardDetailsPage.css' 

const CardDetailsPage = () => {
    let history = useHistory()
    const dispatch = useDispatch()
    const [userId, setUserId] = useState(0)
    const [runCardDeleteHandler, setRunCardDeleteHandler] = useState(false)
    const [deleteCardNumber, setDeleteCardNumber] = useState("")

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // reducer para validar el token
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // reducer para la lista de tarjetas guardadas
    const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
    const { Cards, loading } = savedCardsListReducer

    // reducer para eliminar tarjeta guardada
    const deleteSavedCardReducer = useSelector(state => state.deleteSavedCardReducer)
    const { success } = deleteSavedCardReducer

    // toggle para el manejador de eliminación de tarjeta
    const toggleRunCardDeleteHandler = () => {
        setRunCardDeleteHandler(!runCardDeleteHandler)
    }

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(savedCardsList())
        }
    }, [dispatch, history, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Sesión expirada, por favor inicie sesión nuevamente.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    // mensaje de eliminación de tarjeta
    if (success) {
        alert("Tarjeta eliminada exitosamente.")
        window.location.reload()
    }

    return (
        <div className="card-details-page">
            {loading && (
                <div className="loading-container">
                    <h5>Obteniendo información de las tarjetas</h5>
                    <Spinner animation="border" />
                </div>
            )}

            {/* Modal */}
            <DeleteCardComponent
                userId={userId}
                deleteCardNumber={deleteCardNumber}
                runCardDeleteHandler={runCardDeleteHandler}
                toggleRunCardDeleteHandler={toggleRunCardDeleteHandler}
            />

            {Cards.length > 0 ? Cards.map((each, idx) => (
                <div key={idx}>
                    <Container>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Nombre en la Tarjeta:</Col>
                            <Col className="info-value">{each.name_on_card ? each.name_on_card : "No establecido"}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Mes de Expiración:</Col>
                            <Col className="info-value">{each.exp_month ? each.exp_month : "No establecido"}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Año de Expiración:</Col>
                            <Col className="info-value">{each.exp_year ? each.exp_year : "No establecido"}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Ciudad de la Dirección:</Col>
                            <Col className="info-value">{each.address_city ? each.address_city : "No establecido"}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">País de la Dirección:</Col>
                            <Col className="info-value">{each.address_country ? each.address_country : "No establecido"}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Estado de la Dirección:</Col>
                            <Col className="info-value">{each.address_state ? each.address_state : "No establecido"}</Col>
                        </Row>
                        <Row className="info-row">
                            <Col xs={2} className="info-label">Código Postal:</Col>
                            <Col className="info-value">{each.address_zip ? each.address_zip : "No establecido"}</Col>
                        </Row>
                    </Container>
                    <div className="actions-container">
                        <Link to="/card-update/">Actualizar datos de la tarjeta</Link>
                        <span className="separator">|</span>
                        <Link to="#"
                            onClick={() => {
                                setDeleteCardNumber(each.card_number)
                                setUserId(each.user)
                                setRunCardDeleteHandler(!runCardDeleteHandler)
                            }}
                        >Eliminar tarjeta</Link>
                    </div>
                </div>
            )) : (
                <Message variant='info'>Detalles de la tarjeta no disponibles.</Message>
            )}
        </div>
    )
}

export default CardDetailsPage
