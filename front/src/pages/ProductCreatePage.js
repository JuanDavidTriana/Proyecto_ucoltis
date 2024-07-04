import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { createProduct } from '../actions/productActions'
import { useHistory } from 'react-router'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CREATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message'

const ProductCreatePage = () => {
    let history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState(false)
    const [image, setImage] = useState(null)

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // reducer para crear producto
    const createProductReducer = useSelector(state => state.createProductReducer)
    const { product, success: productCreationSuccess, error: productCreationError } = createProductReducer

    // reducer para validar el token
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
        }
    }, [dispatch, userInfo, history])

    const onSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('stock', stock)
        formData.append('image', image)

        dispatch(createProduct(formData))
    }

    if (productCreationSuccess) {
        alert("Producto creado exitosamente.")
        history.push(`/product/${product.id}/`)
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("La sesión ha expirado, por favor inicie sesión nuevamente.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    return (
        <div>
            {productCreationError && <Message variant='danger'>{productCreationError.image[0]}</Message>}
            <h3 className="text-center text-info mb-4">Nuevo Producto</h3>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId='name'>
                    <Form.Label><b>Nombre del Producto</b></Form.Label>
                    <Form.Control
                        required
                        autoFocus={true}
                        type="text"
                        value={name}
                        placeholder="Nombre del producto"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label><b>Descripción del Producto</b></Form.Label>
                    <Form.Control
                        required
                        type="text"
                        value={description}
                        placeholder="Descripción del producto"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label><b>Precio</b></Form.Label>
                    <Form.Control
                        required
                        type="text"
                        pattern="[0-9]+(\.[0-9]{1,2})?%?"
                        value={price}
                        placeholder="199.99"
                        step="0.01"
                        maxLength="8"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='stock'>
                    <Form.Check
                        type="checkbox"
                        label="En stock"
                        checked={stock}
                        onChange={() => setStock(!stock)}
                    />
                </Form.Group>

                <Form.Group controlId='image'>
                    <Form.Label><b>Imagen del Producto</b></Form.Label>
                    <Form.Control
                        required
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Form.Group>

                <Button type="submit" variant='success' className="btn-sm">Guardar Producto</Button>
                <Button variant='primary' className="btn-sm ml-2" onClick={() => history.push("/")}>Cancelar</Button>
            </Form>
        </div>
    )
}

export default ProductCreatePage
