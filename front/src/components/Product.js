import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/Product.css' // Asegúrate de crear y ajustar este archivo CSS según sea necesario

function Product({ product }) {
    return (
        <Card className="mb-4 rounded product-card shadow-sm">
            <Link to={`/product/${product.id}`}>
                <Card.Img variant="top" src={product.image} className="product-image" />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.id}`}>
                    <Card.Title as="div" className="text-center product-title">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as="div" className="text-center text-muted product-description">
                    {product.description.substring(0, 50)}...
                </Card.Text>
                <Card.Text as="h4" className="text-center my-3 product-price">
                    $ {product.price}
                </Card.Text>
                <div className="d-flex justify-content-center">
                    <Link to={`/product/${product.id}`}>
                        <Button variant="primary" className="btn-sm buy-now-button">Comprar</Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    )
}

export default Product
