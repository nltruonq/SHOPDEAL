import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";

import { collection, query, where, getDocs } from "firebase/firestore";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useEffect, useState } from "react";
import axios from "axios";
import ItemProduct from "../../components/ItemProduct/ItemProduct";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/config";

const cx = classNames.bind(styles);

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 10,
        slidesToSlide: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 992 },
        items: 9,
        slidesToSlide: 4,
    },
    tablet: {
        breakpoint: { max: 992, min: 768 },
        items: 6,
        slidesToSlide: 3,
    },
    mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 4,
        slidesToSlide: 2,
    },
};

const categories = [
    {
        title: "Tất cả",
        category: "tatca",
    },
    {
        title: "#Deal0Đ",
        category: "0d",
    },
    {
        title: "Thời Trang Nữ",
        category: "thoitrangnu",
    },
    {
        title: "Thời Trang Nam",
        category: "thoitrangnam",
    },
    {
        title: "Sắc Đẹp",
        category: "sacdep",
    },
    {
        title: "Thời trang trẻ em & trẻ sơ sinh",
        category: "thoitrangtreem",
    },
    {
        title: "Nhà cửa & Đời sống",
        category: "nhacuavadoisong",
    },
    {
        title: "Sức Khỏe",
        category: "suckhoe",
    },
    {
        title: "Thực phẩm & Đồ uống",
        category: "thucphamvadouong",
    },
    {
        title: "Phụ Kiện Thời Trang",
        category: "phukienthoitrang",
    },
    {
        title: "Túi Ví Nữ",
        category: "tuivinu",
    },
    {
        title: "Túi Ví Nam",
        category: "tuivinam",
    },
    {
        title: "Thiết Bị Âm Thanh",
        category: "thietbiamthanh",
    },
    {
        title: "Mẹ & Bé",
        category: "mevabe",
    },
    {
        title: "Điện Thoại & Phụ Kiện",
        category: "dienthoaivaphukien",
    },
    {
        title: "Giày Dép Nữ",
        category: "giaydepnu",
    },
    {
        title: "Giày Dép Nam",
        category: "giaydepnam",
    },
    {
        title: "Máy tính & Laptop",
        category: "maytinhvalaptop",
    },
    {
        title: "Thiết Bị Điện Gia Dụng",
        category: "thietbidiengiadung",
    },
    {
        title: "Đồng Hồ",
        category: "dongho",
    },
    {
        title: "Thể Thao & Dã Ngoại",
        category: "thethaovadangoai",
    },
    {
        title: "Sở thích & Sưu tầm",
        category: "sothichvasuutam",
    },
    {
        title: "Văn Phòng Phẩm",
        category: "vanphongpham",
    },
];

function Home() {
    const [deals, setDeals] = useState([]);
    const [active, setActive] = useState(0);

    const [category, setCategory] = useState("tatca");

    const handleActive = (i) => {
        setActive(i);
        setCategory(categories[i].category);
    };

    useEffect(() => {
        const getDeals = async () => {
            let q;
            if(category === 'tatca') {
                q = query(collection(db, "deals"));
            } else {
                q = query(collection(db, "deals"), where('category', '==', category));
            }
            const querySnapshot = await getDocs(q);
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            setDeals(data);
        };
        getDeals();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDeals();
            }
        });
    }, [category]);
    return (
        <Container style={{ marginTop: 10 }}>
            <Row>
                <Col className={cx("heading")} xs={12}>
                    <h2 className={cx("title")}>DEAL BÁN CHẠY</h2>
                    <hr className={cx("tour")} role={"tournament6"}></hr>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Carousel responsive={responsive} infinite={true}>
                        {categories.map((e, i) => {
                            return (
                                <div key={i} onClick={() => handleActive(i)} className={cx("item")}>
                                    <span className={cx("text", { active: i === active })}>{e.title}</span>
                                </div>
                            );
                        })}
                    </Carousel>
                </Col>
            </Row>
            <Row style={{ marginTop: 40 }}>
                {deals.map((e, i) => {
                    return (
                        <Col key={i} lg={3} md={4} sm={6} xs={6}>
                            <Link to={`/product/${e.id}`}>
                                <ItemProduct data={e} />
                            </Link>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
}

export default Home;
