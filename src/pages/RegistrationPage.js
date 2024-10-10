import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Card } from "react-bootstrap";
import swal from "sweetalert2";
import UserContext from "../context/UserContext";

const RegistrationPage = () => {

    const { user } = useContext(UserContext)
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isActive, setIsActive ] = useState(false);
    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();

        const url = process.env.REACT_APP_API_BASE_URL;

        fetch(`${url}/users/register`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
		.then(res => res.json())
		.then(data => {
			if (typeof data.access !== 'undefined') {

                localStorage.setItem('token', data.access);
                navigate('/login')

			} else if (data.message === "Email already exists") {
                swal.fire({
                    title: "Email already exists",
                    icon: "info",
                    text: "Try logging in"
                }).then(() => {
                    navigate('/login');
                })
            } else {
				swal.fire({
					title: "Registration successful",
					icon: "success",
					text: "Go ahead and login."
				});
                navigate('/login')
			}
		})
		.catch(error => {
			swal.fire({
				title: "Registration Failed",
				icon: "error",
				text: "Something went wrong. Please try again later."
			});
		});
    }

    useEffect(() => {
        if (user.id !== null) {
            navigate('/movies')
        }
    })


    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return (
        <>
           <Container className="flex">
                <Row className="justify-content-center">
                    <Card className="m-5 p-0 shadow" style={{width:'400px'}}>
                        <div className="rounded-top" style={{height:'30px', backgroundColor: '#7a2e2e'}}></div>
                        <Form onSubmit={register} className="p-5">
                            <h2 className="fw-bold">Register</h2>
                            <hr />
                            <Form.Group className="my-2">
                                <Form.Label className="fw-bold">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="email"
	        	                    value={email}
            				        onChange={(e) => setEmail(e.target.value)}
	        	                    required
                                />
                            </Form.Group>
                            <Form.Group className="my-2">
                                <Form.Label className="fw-bold">Password</Form.Label>
                                <Form.Control
                                    type="password"
	        	                    placeholder="password"
	        	                    value={password}
            				        onChange={(e) => setPassword(e.target.value)}
	        	                    required
                                />
                            </Form.Group>

                             { isActive ?
	        	                <Button type="submit" id="submitBtn" className="text-white mt-3 w-100" style={{backgroundColor: '#7a2e2e', border:'1px solid #7a2e2e'}}>
	        	                    Login
	        	                </Button>
	        	                 :
	        	                <Button variant="secondary" type="submit" id="submitBtn" disabled className="mt-3 w-100">
	        	                    Submit
	        	                </Button>
	        	            }
					            <p className="text-center mt-3">
                    	            or click <Link to="/login">here</Link> to login.
                	            </p>
                        </Form>
                    </Card>
                </Row>
            </Container>
        </>
    )
}

export default RegistrationPage;
