import styles from "./User.module.scss";
import classNames from "classnames/bind";

import { Col, Container, Row } from "react-bootstrap";

import { useEffect, useState } from "react";

import { getDoc, doc, setDoc, addDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/config";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import ItemProduct from "../../components/ItemProduct/ItemProduct";

import { AiOutlineStar, AiFillBell } from "react-icons/ai";
import { GiShoppingBag } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 8,
        slidesToSlide: 4,
    },
    desktop: {
        breakpoint: { max: 3000, min: 992 },
        items: 6,
        slidesToSlide: 3,
    },
    tablet: {
        breakpoint: { max: 992, min: 768 },
        items: 4,
        slidesToSlide: 2,
    },
    mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 3,
        slidesToSlide: 2,
    },
};

const statusDeal = [
    {
        title: "Tất cả",
        status: 9,
    },
    {
        title: "Đợi mua hàng",
        status: 1,
    },
    {
        title: "Đợi review",
        status: 2,
    },
    {
        title: "Đợi người bán duyệt",
        status: 3,
    },
    {
        title: "Hình ảnh bị từ chối",
        status: -1,
    },
    {
        title: "Đã hoàn tiền",
        status: 4,
    },
    {
        title: "Bị khóa",
        status: -1,
    },
    {
        title: "Hết hạn mua",
        status: "",
    },
];

function User() {
    const [active, setActive] = useState(0);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const handleActive = (i) => {
        setActive(i);
    };

    const getOrder = async () => {
        const q = query(collection(db, "orders"), where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setOrders(data);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getOrder();
            } else {
                navigate("/login");
            }
        });
    }, []);

    return (
        <div className={cx("wrapper")}>
            <Container>
                <Row>
                    {user && (
                        <Col lg={3}>
                            <div className={cx("side-bar")}>
                                <div className={cx("profile-top")}>
                                    <div className={cx("img")}>
                                        <img src={user?.photoURL} alt="" />
                                    </div>
                                    <div className={cx("detail")}>
                                        <span>{user?.displayName}</span>
                                    </div>
                                </div>
                                <div className={cx("faq-tab")}>
                                    <Link to="/deal-da-tham-gia">
                                        <li className={cx("item")}>
                                            <GiShoppingBag size={20} />
                                            <span>Deal Đã Tham Gia</span>
                                        </li>
                                    </Link>
                                    <Link to="/">
                                        <li className={cx("item")}>
                                            <AiOutlineStar size={20} />
                                            <span>Deal Bán Chạy</span>
                                        </li>
                                    </Link>
                                    <Link to="/thong-bao">
                                        <li className={cx("item")}>
                                            <AiFillBell size={20} />
                                            <span>Thông Báo</span>
                                        </li>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    )}
                    <Col lg={9}>
                        <div className={cx("main")}>
                            <div className={cx("title")}>
                                <h2>{path === "/deal-da-tham-gia" ? "DEAL ĐÃ THAM GIA" : "THÔNG BÁO"}</h2>
                                <hr className={cx("tour")} role={"tournament6"}></hr>
                            </div>
                            {path === "/thong-bao" ? (
                                <span className={cx("no-data")}>Không có dữ liệu</span>
                            ) : (
                                <div className={cx("deal")}>
                                    <Carousel responsive={responsive} infinite={true}>
                                        {statusDeal.map((e, i) => {
                                            return (
                                                <div key={i} onClick={() => handleActive(i)} className={cx("item")}>
                                                    <span className={cx("text", { active: i === active })}>
                                                        {e.title}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </Carousel>
                                    <Row>
                                        {orders.map((e, i) => {
                                            return (
                                                statusDeal[active].status === 9 || e.status === statusDeal[active].status ? (
                                                    <Col key={i} lg={3} md={4} sm={6} xs={6}>
                                                        <Link to={`/product/${e.id}`}>
                                                            <ItemProduct data={e} />
                                                        </Link>
                                                    </Col>
                                                ) : ''
                                            );
                                        })}
                                    </Row>
                                    <span className={cx("no-data")}>Không có dữ liệu</span>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default User;
