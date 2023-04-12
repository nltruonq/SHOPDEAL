import styles from "./Admin.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

import { Col, Container, Row, Navbar, Nav } from "react-bootstrap";
import AdminComponent from "../../components/Admin/Admin";
import Report from "../../components/Report/Report";
import Statistical from "../../components/Statistical/Statistical";

const cx = classNames.bind(styles);

function Admin() {
    const [nav, setNav] = useState("admin");
    const navigate = useNavigate();
    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem("admin_nghiendeal")) || null;
        const checkAdmin = async () => {
            const querySnapshot = await getDocs(collection(db, "admin"));
            querySnapshot.forEach((doc) => {
                const adminDB = doc.data();
                if (admin.username === adminDB.username && admin.password === adminDB.password) {
                } else {
                    navigate("/admin/login");
                }
            });
        };
        if (admin) {
            checkAdmin();
        } else {
            navigate("/admin/login");
        }
    }, []);
    const handleNav = (text) => {
        setNav(text);
    };

    const handleLogout = () => {
        localStorage.removeItem("shop_nghiendeal");
        navigate("/admin/login");
    };
    return (
        <>
            <Navbar className={cx("nav-bar")} expand="lg">
                <Navbar.Brand style={{ color: "#fff" }} href="#">
                    ADMIN
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className={cx("collapse")} id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => handleNav("admin")} className={cx("nav-link")}>
                            Xem Shop
                        </Nav.Link>
                        <Nav.Link onClick={() => handleNav("report")} className={cx("nav-link")}>
                            Xem khiếu nại
                        </Nav.Link>
                        <Nav.Link onClick={() => handleNav("statistical")} className={cx("nav-link")}>
                            Thống kê
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout} className={cx("nav-link")}>
                            Đăng xuất
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {nav === "admin" ? (
                <AdminComponent />
            ) : nav === "report" ? (
                <Report />
            ) : nav === "statistical" ? (
                <Statistical />
            ) : (
                ""
            )}
        </>
    );
}

export default Admin;
