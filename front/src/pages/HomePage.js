import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import projectImage from '../assets/img/proyecto.jpg'
import member1 from '../assets/img/JuanTriana.png' 
import member2 from '../assets/img/JuanTriana.png'
import member3 from '../assets/img/JuanTriana.png'
import { FaReact, FaPython, FaDatabase } from 'react-icons/fa'
import '../styles/HomePage.css' 

const HomePage = () => {
    return (
        <Container>
            <h1 className="text-center my-4 neon-title">Proyecto Ecommerce</h1>
            
            <section className="my-5">
                <h2 className="section-title">¿Qué es el proyecto?</h2>
                <Row>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <img src={projectImage} alt="Imagen del Proyecto" className="img-fluid project-image" />
                    </Col>
                    <Col md={6} className="d-flex flex-column justify-content-center">
                        <p className="project-description">
                            Nuestro objetivo es desarrollar una plataforma de comercio electrónico innovadora que facilite a los usuarios 
                            la navegación, búsqueda y compra de productos de manera eficiente. Esta plataforma está siendo creada por un equipo 
                            de programadores, quienes están adquiriendo y aplicando conocimientos en tecnologías modernas para construir 
                            una solución robusta y escalable. Con este proyecto, buscamos no solo ofrecer una experiencia de compra superior, 
                            sino también proporcionar un entorno de aprendizaje práctico y enriquecedor para nuestros desarrolladores en formación.
                        </p>
                    </Col>
                </Row>
            </section>

            <section className="my-5">
                <h2 className="section-title">Tecnologías Utilizadas</h2>
                <div className="tech-carousel">
                    <div className="tech-carousel-content">
                        <FaReact size={70} color="#61DBFB" className="tech-icon" />
                        <FaPython size={70} color="#306998" className="tech-icon" />
                        <FaDatabase size={70} color="#f0db4f" className="tech-icon" />
                        <FaReact size={70} color="#61DBFB" className="tech-icon" />
                        <FaPython size={70} color="#306998" className="tech-icon" />
                        <FaDatabase size={70} color="#f0db4f" className="tech-icon" />
                    </div>
                </div>
            </section>

            <section className="my-5">
                <h2 className="section-title">Equipo de Desarrollo</h2>
                <Row>
                    <Col md={4} className="d-flex align-items-stretch">
                        <Card className="mb-4 shadow-sm team-member-card">
                            <Card.Img variant="top" src={member1} alt="Miembro del equipo 1" />
                            <Card.Body>
                                <Card.Title>Miembro del Equipo 1</Card.Title>
                                <Card.Text>
                                    Desarrollador Full Stack con experiencia en React y Django.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="d-flex align-items-stretch">
                        <Card className="mb-4 shadow-sm team-member-card">
                            <Card.Img variant="top" src={member2} alt="Miembro del equipo 2" />
                            <Card.Body>
                                <Card.Title>Miembro del Equipo 2</Card.Title>
                                <Card.Text>
                                    Desarrollador Frontend especializado en React y Bootstrap.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="d-flex align-items-stretch">
                        <Card className="mb-4 shadow-sm team-member-card">
                            <Card.Img variant="top" src={member3} alt="Miembro del equipo 3" />
                            <Card.Body>
                                <Card.Title>Miembro del Equipo 3</Card.Title>
                                <Card.Text>
                                    Desarrollador Backend con experiencia en Django y bases de datos SQL.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>
        </Container>
    )
}

export default HomePage
