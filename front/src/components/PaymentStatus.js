import React from 'react'
import { Card } from 'react-bootstrap'
import { useLocation } from "react-router-dom"
import { Link } from 'react-router-dom'
import Message from "./Message"
import '../styles/PaymentStatus.css'

const PaymentStatus = () => {
    const location = useLocation()

    const renderData = () => {
        try {
            const boughtData = location.state.detail

            return (
                <div className="payment-status-container">
                    <h3 className="text-success">El pago fue exitoso</h3>
                    <Card className="p-3 mt-3">
                        <div>Comprado exitosamente:</div>
                        <div className="product-info mt-2">
                            {boughtData.name}, ${boughtData.price}
                            <i className="text-primary ml-1 fas fa-check-circle"></i>
                        </div>
                        <Link to="/all-orders/" className="btn btn-primary mt-3">
                            Ir a la página de órdenes
                        </Link>
                    </Card>
                </div>
            )
        } catch (error) {
            return <Message variant='info'>Estado del pago no disponible.</Message>
        }
    }

    return renderData()
}

export default PaymentStatus
