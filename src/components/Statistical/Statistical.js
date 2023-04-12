import styles from "./Statistical.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col, Table } from "react-bootstrap";
import { AiOutlineTable } from "react-icons/ai";
import { useEffect, useState } from "react";

import { db } from "../../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const cx = classNames.bind(styles);

function Statistical() {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    const getUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setUsers(data);
    };

    const getOrders = async () => {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const data = [];
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            data.push({ ...order, date: new Date(order.timestamp * 1000) });
        });
        setOrders(data);
    };

    useEffect(() => {
        getUsers();
        getOrders();
    }, []);
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className={cx("title")}>THỐNG KÊ</h1>
                </Col>
                <Col xs={12}>
                    <div className={cx("wrapper")}>
                        <div className={cx("heading")}>
                            <AiOutlineTable size={20} />
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Số lượng người dùng</th>
                                    <th>Số lượt mua trong ngày</th>
                                    <th>Số lượt mua trong tháng</th>
                                    <th>Tổng số lượt mua</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{users.length}</td>
                                    <td>{orders.filter(order => order.date.getDate() === new Date(Date.now()).getDate()).length}</td>
                                    <td>{orders.filter(order => order.date.getMonth() === new Date(Date.now()).getMonth()).length}</td>
                                    <td>{orders.length}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Statistical;
