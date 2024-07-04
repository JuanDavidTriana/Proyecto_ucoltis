import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { deleteSavedCard } from '../actions/cardActions'
import { useDispatch } from 'react-redux'

function DeleteCardComponent({ userId, deleteCardNumber, runCardDeleteHandler, toggleRunCardDeleteHandler }) {
    const dispatch = useDispatch()

    // confirmación de eliminación de tarjeta
    const confirmDelete = (c_number) => {
        dispatch(deleteSavedCard(c_number))
        toggleRunCardDeleteHandler()
    }

    return (
        <div>
            {/* Inicio del Modal */}
            <Modal show={runCardDeleteHandler} onHide={toggleRunCardDeleteHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                        {" "}Confirmación de Eliminación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <b>¡Advertencia!</b>{" "}Eliminar su tarjeta eliminará su cuenta y todos sus datos.
                    </p>
                    ¿Está seguro de que desea eliminar la tarjeta "{deleteCardNumber}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => confirmDelete(deleteCardNumber)}>
                        Confirmar Eliminación
                    </Button>
                    <Button variant="primary" onClick={toggleRunCardDeleteHandler}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Fin del Modal */}
        </div>
    )
}

export default DeleteCardComponent
