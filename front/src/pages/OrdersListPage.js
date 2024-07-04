import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner, Container } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'
import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'
import Message from '../components/Message'
import '../styles/OrdersListPage.css' 

function OrdersListPage() {
    let history = useHistory()
    const dispatch = useDispatch()
    const placeholderValue = "Buscar órdenes por nombre del cliente, dirección o artículo ordenado"

    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))

    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // reducer para obtener todas las órdenes
    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    // reducer para cambiar el estado de entrega
    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    // reducer para validar el token
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllOrders())
        }
    }, [userInfo, dispatch, history])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Sesión expirada, por favor inicie sesión nuevamente.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        const productData = {
            "is_delivered": status,
            "delivered_at": status ? currentDateInfo : "No Entregado"
        }
        dispatch(changeDeliveryStatus(id, productData))
    }

    if (deliveryStatusChangeSuccess) {
        alert("Estado de entrega cambiado exitosamente")
        dispatch({
            type: CHANGE_DELIVERY_STATUS_RESET
        })
        dispatch(getAllOrders())
    }

    const handleSearchTerm = (term) => {
        setCloneSearchTerm(term)
    };

    return (
        <Container>
            {loadingOrders && (
                <div className="loading-container">
                    <h5>Obteniendo órdenes</h5>
                    <Spinner animation="border" />
                </div>
            )}
            {userInfo.admin && <SearchBarForOrdersPage handleSearchTerm={handleSearchTerm} placeholderValue={placeholderValue} />}
            {orders.length > 0 ? (
                <Table className="mt-4 orders-table" bordered hover responsive>
                    <thead>
                        <tr className="table-header">
                            <th>Id de la Orden</th>
                            <th>Nombre del Cliente</th>
                            <th>Tarjeta Utilizada</th>
                            <th>Dirección de Entrega</th>
                            <th>Artículo Ordenado</th>
                            <th>Estado de Pago</th>
                            <th>Pagado el</th>
                            <th>Total</th>
                            <th>Estado de Entrega</th>
                            <th>Entregado el</th>
                            {userInfo.admin && <th>Cambiar Estado de Entrega</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter((item) =>
                            item.name.toLowerCase().includes(cloneSearchTerm) ||
                            item.ordered_item.toLowerCase().includes(cloneSearchTerm) ||
                            item.address.toLowerCase().includes(cloneSearchTerm)
                        ).map((order, idx) => (
                            <tr key={idx} className="text-center">
                                <td>{order.id}</td>
                                <td>{order.name}</td>
                                <td>{order.card_number}</td>
                                <td>{order.address}</td>
                                <td>{order.ordered_item}</td>
                                <td>{order.paid_status ? (
                                    <i className="fas fa-check-circle text-success"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-danger"></i>
                                )}</td>
                                <td>{dateCheck(order.paid_at)}</td>
                                <td>{order.total_price} Peso Col</td>
                                <td>{order.is_delivered ? (
                                    <i className="fas fa-check-circle text-success"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-danger"></i>
                                )}</td>
                                <td>{order.delivered_at}</td>
                                {userInfo.admin && (
                                    <td>
                                        {order.is_delivered ? (
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => changeDeliveryStatusHandler(order.id, false)}
                                            >
                                                {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? (
                                                    <Spinner animation="border" />
                                                ) : (
                                                    "Marcar como No Entregado"
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => changeDeliveryStatusHandler(order.id, true)}
                                            >
                                                {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? (
                                                    <Spinner animation="border" />
                                                ) : (
                                                    "Marcar como Entregado"
                                                )}
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Message variant="info">No hay órdenes aún.</Message>
            )}
        </Container>
    )
}

export default OrdersListPage
