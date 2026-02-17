import { useContext, useEffect } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
    const {
        user,
        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginLoading,
    } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            <Form onSubmit={loginUser}>
                <Row
                    className="justify-content-center align-items-center"
                    style={{ minHeight: "80vh" }}
                >
                    <Col xs={12} md={6} lg={4}>
                        <Stack gap={3} className="p-4 shadow-sm rounded bg-white">
                            <h2 className="text-center">Login</h2>

                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={loginInfo.email}
                                onChange={(e) =>
                                    updateLoginInfo({
                                        ...loginInfo,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={loginInfo.password}
                                onChange={(e) =>
                                    updateLoginInfo({
                                        ...loginInfo,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <Button variant="primary" type="submit" disabled={isLoginLoading}>
                                {isLoginLoading ? "Logging in..." : "Login"}
                            </Button>

                            {loginError && (
                                <Alert variant="danger">
                                    <p className="mb-0">{loginError}</p>
                                </Alert>
                            )}

                            <div className="text-center">
                                <span>
                                    Don&apos;t have an account?{" "}
                                    <Link to="/register">Register</Link>
                                </span>
                            </div>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Login;