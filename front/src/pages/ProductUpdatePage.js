import React, { useState, useEffect } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getProductDetails, updateProduct } from '../actions/productActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { UPDATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message'

const ProductUpdatePage = ({ match }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState(false)
    const [image, setImage] = useState("")
    const [newImage, setNewImage] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()

    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading: loadingPageDetails, product } = productDetailsReducer

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const updateProductReducer = useSelector(state => state.updateProductReducer)
    const { success: productUpdationSuccess, loading: loadingProductUpdations, error: productUpdationError } = updateProductReducer

    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getProductDetails(match.params.id))
        }
    }, [dispatch, userInfo, history, match])

    useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setStock(product.stock)
        }
    }, [product])

    useEffect(() => {
        if (productUpdationSuccess) {
            alert("Producto actualizado exitosamente.")
            dispatch({ type: UPDATE_PRODUCT_RESET })
            history.push(`/product/${product.id}`)
        }
    }, [dispatch, history, productUpdationSuccess, product?.id])

    useEffect(() => {
        if (userInfo && tokenError === "Request failed with status code 401") {
            alert("La sesión ha expirado, por favor inicie sesión nuevamente.")
            dispatch(logout())
            history.push("/login")
            window.location.reload()
        }
    }, [dispatch, tokenError, userInfo, history])

    const onSubmit = (e) => {
        e.preventDefault()
        const productId = product.id
        let formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('stock', stock)
        formData.append('image', image)

        dispatch(updateProduct(productId, formData))
    }

    return (
        <div>
            <h3 className="text-center text-info mb-4">Editar Producto</h3>
            {productUpdationError && (
                <div>
                    {window.scrollTo({ top: 0, behavior: "smooth" })}
                    <Message variant='danger'>{productUpdationError.image[0]}</Message>
                </div>
            )}
            {loadingPageDetails && (
                <div className="d-flex justify-content-center mb-4">
                    <Spinner animation="border" />
                </div>
            )}
            {loadingProductUpdations && (
                <div className="d-flex justify-content-center mb-4">
                    <Spinner animation="border" />
                </div>
            )}
            <Form onSubmit={onSubmit}>
                <Form.Group controlId='image'>
                    <Form.Label><b>Imagen del Producto</b></Form.Label>
                    <p>
                        <img src={product.image} alt={product.name} height="200" />
                    </p>
                    {newImage ? (
                        <div>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <Button variant="primary" size="sm" className="mt-2" onClick={() => { setNewImage(!newImage); setImage("") }}>
                                Cancelar
                            </Button>
                        </div>
                    ) : (
                        <Button variant="success" size="sm" onClick={() => setNewImage(!newImage)}>
                            Elegir otra imagen
                        </Button>
                    )}
                </Form.Group>

                <Form.Group controlId='name'>
                    <Form.Label><b>Nombre del Producto</b></Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={name}
                        placeholder="Nombre del producto"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label><b>Descripción del Producto</b></Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        placeholder="Descripción del producto"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label><b>Precio</b></Form.Label>
                    <Form.Control
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

                <Button type="submit" variant='success' className="btn-sm">
                    {loadingProductUpdations ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {" "}Guardando...
                        </>
                    ) : (
                        "Guardar Cambios"
                    )}
                </Button>
                <Button variant='primary' className="btn-sm ml-2" onClick={() => history.push(`/product/${product.id}`)}>
                    Cancelar
                </Button>
            </Form>
        </div>
    )
}

export default ProductUpdatePage
    