import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Modal, Button, Spinner } from 'react-bootstrap'
import { deleteUserAddress, getAllAddress, checkTokenValidation, logout } from '../actions/userActions'
import { DELETE_USER_ADDRESS_RESET, GET_SINGLE_ADDRESS_RESET } from '../constants'
import { useHistory } from 'react-router-dom'
import CreateAddressComponent from '../components/CreateAddressComponent'
import '../styles/AllAddressesOfUserPage.css' // Asegúrate de crear y ajustar este archivo CSS según sea necesario

function AllAddressesOfUserPage() {
    let history = useHistory()
    const dispatch = useDispatch()
    const [deleteAddress, setDeleteAddress] = useState("")
    const [createAddress, setCreateAddress] = useState(false)

    // estado y funciones del modal
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    // reducer para validar el token
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // reducer de inicio de sesión
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // reducer para obtener la lista de direcciones
    const getAllAddressesOfUserReducer = useSelector(state => state.getAllAddressesOfUserReducer)
    const { addresses, loading: loadingAllAddresses } = getAllAddressesOfUserReducer

    // reducer para eliminar dirección
    const deleteUserAddressReducer = useSelector(state => state.deleteUserAddressReducer)
    const { success: addressDeletionSuccess } = deleteUserAddressReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllAddress())
            dispatch({
                type: GET_SINGLE_ADDRESS_RESET
            })
        }
    }, [dispatch, history, userInfo, addressDeletionSuccess])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Sesión expirada, por favor inicie sesión nuevamente.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    if (addressDeletionSuccess) {
        alert("Dirección eliminada exitosamente.")
        dispatch({
            type: DELETE_USER_ADDRESS_RESET
        })
        dispatch(getAllAddress())
    }

    // handler para eliminar dirección
    const deleteAddressHandler = (address) => {
        setDeleteAddress(address)
        handleShow()
    }

    // confirmación de eliminación de dirección
    const confirmDelete = (id) => {
        dispatch(deleteUserAddress(id))
        handleClose()
    }

    // toggle para crear nueva dirección
    const toggleCreateAddress = () => {
        setCreateAddress(!createAddress)
    }

    return (
        <div className="all-addresses-page">
            {/* Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                        {" "} Confirmación de Eliminación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea eliminar esta dirección
                    {" "}<em>"{deleteAddress.house_no}, {deleteAddress.city}, {deleteAddress.state}"</em>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => confirmDelete(deleteAddress.id)}>
                        Confirmar Eliminación
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Cargando direcciones */}
            {loadingAllAddresses && (
                <div className="loading-container">
                    <h5>Obteniendo direcciones</h5>
                    <Spinner animation="border" />
                </div>
            )}

            {/* Crear Dirección */}
            {createAddress ? (
                <CreateAddressComponent toggleCreateAddress={toggleCreateAddress} />
            ) : (
                <button
                    className="btn btn-sm btn-primary mb-2 button-focus-css"
                    onClick={toggleCreateAddress}
                >
                    Añadir nueva dirección +
                </button>
            )}

            {/* Lista de Direcciones */}
            {addresses && !createAddress && addresses.map((address, idx) => (
                <Card key={idx} className="p-2 mb-2 address-card">
                    <div><b>Nombre: </b>{address.name}</div>
                    <div><b>Teléfono: </b>+91 {address.phone_number}</div>
                    <div><b>Dirección: </b>{address.house_no}, cerca de {address.landmark}, {address.city}, {address.state}, {address.pin_code}</div>
                    <div className="address-actions">
                        <i
                            title="Eliminar dirección"
                            className="fas fa-trash-alt fa-lg delete-button-css"
                            onClick={() => deleteAddressHandler(address)}
                        ></i>
                        <i
                            title="Editar dirección"
                            className="fas fa-edit fa-lg edit-button-css"
                            onClick={() => history.push(`/all-addresses/${address.id}/`)}
                        ></i>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default AllAddressesOfUserPage
