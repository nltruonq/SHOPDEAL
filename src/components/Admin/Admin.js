import styles from "./Admin.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col, Table } from "react-bootstrap";
import { AiOutlineTable } from "react-icons/ai";

import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const cx = classNames.bind(styles);

function Admin() {
    const [shops, setShops] = useState([]);

    const getShops = async () => {
        //get deals
        const qDeals = query(collection(db, "deals"));
        const querySnapshotDeals = await getDocs(qDeals);
        let deals = [];
        querySnapshotDeals.forEach((doc) => {
            deals.push(doc.data());
        });

        const q = query(collection(db, "shops"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            const dealsOfShop = deals.filter((deal) => deal.shop === doc.data()?.id);
            data.push({
                shop: doc.data(),
                dealsOfShop,
            });
        });
        setShops(data);
    };

    const handleValid = (shop) => {
        updateDoc(doc(db, "shops", shop.id), {
            isValid: 1,
        });
        getShops();
    };

    const handleNotValid = (shop) => {
        updateDoc(doc(db, "shops", shop.id), {
            isValid: -1,
        });
        getShops();
    };

    const handleReValid = (shop) => {
        updateDoc(doc(db, "shops", shop.id), {
            isValid: 1,
        });
        getShops();
    };

    useEffect(() => {
        getShops();
    }, []);

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className={cx("title")}>SHOP</h1>
                </Col>
                <Col xs={12}>
                    <div className={cx("wrapper")}>
                        <div className={cx("heading")}>
                            <AiOutlineTable size={20} />
                            Số lượng Shop: {shops.length}
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ và tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Link facebook</th>
                                    <th>Tình trạng</th>
                                    <th>Số Deal</th>
                                    <th>Hình ảnh</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {shops?.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td colSpan={1} className={cx("id_shop")}>{e?.shop?.id}</td>
                                            <td>{e?.shop?.name}</td>
                                            <td>{e?.shop?.email}</td>
                                            <td>{e?.shop?.phone}</td>
                                            <td>
                                                <a href={e?.shop?.fb} target="_blank">
                                                    {e?.shop?.fb}
                                                </a>
                                            </td>
                                            <td>
                                                {e?.shop?.isValid === 1
                                                    ? "Đã xác nhận"
                                                    : e?.shop?.isValid === 0
                                                    ? "Chưa xác nhận"
                                                    : e?.shop?.isValid === -1
                                                    ? "Từ chối"
                                                    : ""}
                                            </td>
                                            <td>{e?.dealsOfShop.length}</td>
                                            <td>
                                                <img className={cx("shop-img")} src={e?.shop?.img} />
                                            </td>
                                            <td>
                                                <div className={cx("wrapper-btn")}>
                                                    {e?.shop?.isValid === 0 && (
                                                        <button
                                                            onClick={() => handleValid(e)}
                                                            className={cx("action-btn", "green")}
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    )}
                                                    {e?.shop?.isValid === 0 && (
                                                        <button
                                                            onClick={() => handleNotValid(e)}
                                                            className={cx("action-btn", "red")}
                                                        >
                                                            Từ chối
                                                        </button>
                                                    )}
                                                    {e?.shop?.isValid === -1 && (
                                                        <button
                                                            onClick={() => handleReValid(e)}
                                                            className={cx("action-btn", "yellow")}
                                                        >
                                                            Xác nhận lại
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Admin;
