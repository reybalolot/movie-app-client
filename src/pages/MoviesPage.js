import { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card, Modal, ListGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import UserContext from '../context/UserContext';
import swal from "sweetalert2";

const MoviesPage = () => {

    const { user } = useContext(UserContext)
    const [ getMovie, setGetMovie ] = useState({});
    const [ movies, setMovies ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
    const [ showUpdateModal, setShowUpdateModal ] = useState(false);
    const [ showCommentModal, setShowCommentModal ] = useState(false);
    const [ selectedId, setSelectedId] = useState('');
    const [ newMovieTitle, setNewMovieTitle] = useState('');
    const [ newMovieDirector, setNewMovieDirector] = useState('');
    const [ newMovieYear, setNewMovieYear] = useState(0);
    const [ newMovieDesc, setNewMovieDesc] = useState('');
    const [ newMovieGenre, setNewMovieGenre] = useState('');
    const [ movieComment, setMovieComment ] = useState('');
    const [ isChanged, setIsChanged ] = useState(false);

    const navigate = useNavigate();
    const url = process.env.REACT_APP_API_BASE_URL;


    const fetchMovies = () => {

         fetch(`${url}/movies/getMovies`, {
             headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`,
                "Content-Type": "application/json",
            }
         })
        .then(res => res.json())
        .then(data => {

            if (data.message === 'Error finding movies') {
                setMovies(<h3>NO MOVIES FOUND</h3>)
            } else {
                if (user.isAdmin === true) {
                    const moviesItems = data.movies.map(item => {
                        return (
                            <Col className="d-flex justify-content-center my-3 col-12 col-md-6 col-lg-4" key={item._id}>
                            <Card style={{width:'300px', minWidth:'300px' }}>
                                <Card.Body>
                                    <div className="d-flex flex-column justify-content-between">
                                    <div>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{item.director}</Card.Subtitle>
                                        <div className="d-flex ">
                                        <Card.Subtitle className="text-secondary p-0 mx-1 my-0">{item.year}</Card.Subtitle>
                                        <Card.Subtitle className="text-secondary p-0 mx-1 my-0">|</Card.Subtitle>
                                        <Card.Subtitle className="d-flex text-secondary p-0 mx-1 my-0">{item.genre}</Card.Subtitle>
                                        </div>
                                        <Card.Text className="m-1">{item.description}</Card.Text>
                                    </div>
                                    <Row className="m-1 mt-5 d-flex justify-content-around">
                                      <Button className="col-6" variant="outline-info" onClick={() => handleUpdateMovie(item._id, item)} >Update</Button>
                                      <Button className="col-6" variant="outline-danger" onClick={() => handleDeleteMovie(item._id)}>Delete</Button>
                                    </Row>

                                    </div>
                                </Card.Body>
                            </Card>
                            </Col>
                        )
                    })
                    setMovies(moviesItems)
                } else {
                    const moviesItems = data.movies.map(item => {
                        return (
                            <Col className="d-flex justify-content-center my-3 col-12 col-md-6 col-lg-4" key={item._id}>
                            <Card style={{width:'300px', minWidth:'300px' }}>
                                <Card.Body>
                                    <div className="d-flex flex-column justify-content-between">
                                    <div>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{item.director}</Card.Subtitle>
                                        <div className="d-flex ">
                                        <Card.Subtitle className="text-secondary p-0 mx-1 my-0">{item.year}</Card.Subtitle>
                                        <Card.Subtitle className="text-secondary p-0 mx-1 my-0">|</Card.Subtitle>
                                        <Card.Subtitle className="d-flex text-secondary p-0 mx-1 my-0">{item.genre}</Card.Subtitle>
                                        </div>
                                        <Card.Text className="m-1">{item.description}</Card.Text>
                                        <Row className="m-1 mt-5 d-flex justify-content-around">
                                            <Button className="col" variant="outline-success" onClick={() => handleViewMovie(item._id)}>View</Button>
                                        </Row>
                                    </div>
                                    </div>
                                </Card.Body>
                            </Card>
                            </Col>
                        )
                    })
                    setMovies(moviesItems)
                }
            }
        })
    }

    const handleViewMovie = (id) => {
        fetch(`${url}/movies/getMovie/${id}`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`,
                "Content-Type": "application/json",
            },
         })
        .then(res => res.json())
        .then(data => {
             if (data.error) {
                swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error getting movie',
                });
                navigate('/movies')
            } else {
                setGetMovie(data)
            }
        })
    }

    const handleCreateMovie = () => {
         fetch(`${url}/movies/addMovie`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: newMovieTitle,
                director: newMovieDirector,
                year: newMovieYear,
                description: newMovieDesc,
                genre: newMovieGenre
            })
         })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error adding movie',
                });
            } else {
                swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Workout created successfully!',
                });
            }
            setIsChanged(true);
            setShowModal(false);
            setNewMovieTitle('')
            setNewMovieDirector('')
            setNewMovieYear(0)
            setNewMovieDesc('')
            setNewMovieGenre('')
        })
         .catch(error => {
            swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Something went wrong. Please try again later.',
                });
        })
    }

    const handleUpdateMovie = (id, movie) => {
        setSelectedId(id);
        setNewMovieTitle(movie.title)
        setNewMovieDirector(movie.director)
        setNewMovieYear(movie.year)
        setNewMovieDesc(movie.description)
        setNewMovieGenre(movie.genre)
        setShowUpdateModal(true);
    }

    const handleSaveUpdateMovie = () => {
          fetch(`${url}/movies/updateMovie/${selectedId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: newMovieTitle,
               director: newMovieDirector,
               year: newMovieYear,
               description: newMovieDesc,
               genre: newMovieGenre
            })
         })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error updating movie',
                });
            } else {
                swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Movie updated successfully!',
                });
            }
            setIsChanged(true);
            setShowUpdateModal(false);
            setSelectedId('');
            setNewMovieTitle('')
            setNewMovieDirector('')
            setNewMovieYear(0)
            setNewMovieDesc('')
            setNewMovieGenre('')

        })
         .catch(error => {
            swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Something went wrong. Please try again later.',
                });
        })
    }

    const handleDeleteMovie = (id) => {
         fetch(`${url}/movies/deleteMovie/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`,
                "Content-Type": "application/json",
            },
         })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error deleting workout',
                });
            } else {
                swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Workout deleted!',
                });
            }
            setIsChanged(true)
        })
         .catch(error => {
            swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Something went wrong. Please try again later.',
                });
        })
    }

    const handleUpdateComment = (id) => {
        setSelectedId(id);
        setShowCommentModal(true);
    }

    const handleSaveComment = () => {
         fetch(`${url}/movies/addComment/${selectedId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`,
                "Content-Type": "application/json",
            },
            body: {
                comment: movieComment
            }
         })
        .then(res => res.json())
        .then(data => {
             if (data.error || !data) {
                swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error adding movie comment',
                });
                setIsChanged(true)
            }
        })
        .catch(error => {
            swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Something went wrong. Please try again later.',
                });
        })
    }

    useEffect(() => {
        console.log(user.id)
        if (user.id === null) {
            // navigate('/login')
        } else {
            fetchMovies();
        }
    },[user])

    useEffect(() => {
        if(user.id !== null) {
            fetchMovies();
            setIsChanged(false)
        }
    }, [isChanged])

    return (
        <>
        {user.id === null ? (
             <p className="text-center mt-3">
             You've been logged out. Go to <Link to="/login">login</Link>.
            </p>
        ) : (
            <>

        <Container className="p-5">
            {getMovie.title === undefined ? (null) : (
            <div className="mb-4">
            <Card style={{overflow:'auto'}}>
                <Card.Body className="d-flex justify-content-center">
                <Row style={{width:'100%'}}>
                    <Card style={{width:'50%', minWidth:'200px', marginRight:'2px'}} className="col">
                        <Card.Body>
                            <Card.Title>{getMovie.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{getMovie.director}</Card.Subtitle>
                            <div className="d-flex ">
                            <Card.Subtitle className="text-secondary p-0 mx-1 my-0">{getMovie.year}</Card.Subtitle>
                            <Card.Subtitle className="text-secondary p-0 mx-1 my-0">|</Card.Subtitle>
                            <Card.Subtitle className="d-flex text-secondary p-0 mx-1 my-0">{getMovie.genre}</Card.Subtitle>
                            </div>
                            <Card.Text className="m-1">{getMovie.description}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card style={{width:'50%', minWidth:'200px', overflow:'auto' }} className="col">
                        <ListGroup as="ol">
                            { (!getMovie.comments) ? (
                                <h5 className="text-center justify-content-center">NO COMMENTS</h5>
                            ) : (
                                getMovie.comments.map(user => {
                                    return (
                                        <ListGroup.Item
                                        key={user._id}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{user.userId}</div>
                                {user.comment}
                                </div>
                                </ListGroup.Item>
                                )
                            })
                            )
                            }
                        </ListGroup>
                        <Button className="col" style={{maxHeight:'40px'}} variant="outline-success" onClick={() => handleUpdateComment(getMovie._id)}>Add Comment</Button>
                    </Card>
                </Row>
                </Card.Body>
            </Card>
            </div>
            )}

            <h2 className="fw-bold">MOVIE LIST</h2>
            {user.isAdmin === true ? (
                <div className="d-flex" style={{justifyContent:'start', alignItems:'center'}}>
                    <Button className="btn text-white mx-1" variant="danger" onClick={() => setShowModal(true)}>Add Movie</Button>
                </div>
            ):(
                null
            )}
            <hr/>
            <Row className="justify-content-center">
                {movies}
            </Row>
        </Container>

        <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                type="text"
                                value={movieComment}
                                onChange={(e) => setMovieComment(e.target.value)}
                                maxLength={200}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveComment}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMovieTitle}
                                onChange={(e) => setNewMovieTitle(e.target.value)}
                                maxLength={80}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMovieDirector}
                                onChange={(e) => setNewMovieDirector(e.target.value)}
                                maxLength={80}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                value={newMovieYear}
                                onChange={(e) => setNewMovieYear(e.target.value)}
                                maxLength={4}
                                min={1400}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMovieGenre}
                                onChange={(e) => setNewMovieGenre(e.target.value)}
                                maxLength={80}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                type="text"
                                value={newMovieDesc}
                                onChange={(e) => setNewMovieDesc(e.target.value)}
                                maxLength={200}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveUpdateMovie}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                          <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMovieTitle}
                                onChange={(e) => setNewMovieTitle(e.target.value)}
                                maxLength={80}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMovieDirector}
                                onChange={(e) => setNewMovieDirector(e.target.value)}
                                maxLength={80}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                value={newMovieYear}
                                onChange={(e) => setNewMovieYear(e.target.value)}
                                maxLength={4}
                                min={1400}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMovieGenre}
                                onChange={(e) => setNewMovieGenre(e.target.value)}
                                maxLength={80}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                type="text"
                                value={newMovieDesc}
                                onChange={(e) => setNewMovieDesc(e.target.value)}
                                maxLength={200}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleCreateMovie}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
            </>
        )}
        </>
    )
}

export default MoviesPage;
