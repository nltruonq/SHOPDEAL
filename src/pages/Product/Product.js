import styles from "./Product.module.scss";
import classNames from "classnames/bind";

import { Col, Container, Row } from "react-bootstrap";

import { useEffect, useState, useRef } from "react";

import { getDoc, doc, setDoc, addDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../firebase/config";

import { AiOutlineStar, AiFillBell, AiFillMail } from "react-icons/ai";
import { GiShoppingBag } from "react-icons/gi";
import { Link, useNavigate, useParams } from "react-router-dom";

import Popup from "../../components/Popup/Popup";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

function Product() {
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [user, setUser] = useState(null);
    const [img, setImg] = useState(null);
    const [imgReview, setImgReview] = useState(null);
    const [product, setProduct] = useState(null);
    const [docid, setDocid] = useState(null);
    const [order, setOrder] = useState(null);
    const [methodRefund, setMethodRefund] = useState("");
    const [bank, setBank] = useState("");
    const [bankOwner, setBankOwner] = useState("");
    const [bankNumber, setBankNumber] = useState("");
    const [momoNumber, setMomoNumber] = useState("");
    const [clickReport, setClickReport] = useState(false);
    const [textReport, setTextReport] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const updateImgRef = useRef();
    const reviewImgRef = useRef();

    const handleRegister = async () => {
        if (!user) {
            navigate("/login");
        }
        await addDoc(collection(db, "orders"), {
            id: id,
            uid: auth.currentUser.uid,
            status: 1,
            img: product.img,
            imgUpdate: "",
            imgReview: "",
            name: product.name,
            username: auth.currentUser.displayName,
            shop: product.shop,
            price: product.price,
            refund: product.refund,
            timestamp: Math.floor(Date.now() / 1000),
        });
        await getProduct();
        await updateDoc(doc(db, "deals", product.id), {
            bought: parseInt(product.bought) + 1,
        });
        setOpen(true);
    };

    const getOrder = async () => {
        const q = query(collection(db, "orders"), where("uid", "==", auth.currentUser.uid), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        let data;
        let docId;
        querySnapshot.forEach((doc) => {
            data = doc.data();
            docId = doc.id;
        });
        setDocid(docId);
        setOrder(data);
    };

    const getProduct = async () => {
        const ref = doc(db, "deals", id);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setProduct(data);
        }
    };

    const handleUpdate = async () => {
        if (!img) {
            toast.error("Vui lòng chọn ảnh!");
            return;
        }

        // setOpenError(true);

        const imageRef = ref(storage, `images/orders/${auth.currentUser.uid}/update/${id}`);
        await uploadBytes(imageRef, img).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(doc(db, "orders", docid), {
                    imgUpdate: url,
                    status: 2,
                });
            });
        });
        getOrder();
        toast.success("Cập nhật thành công!");
    };

    const handleReview = async () => {
        if (!imgReview) {
            toast.error("Vui lòng chọn ảnh!");
            return;
        }
        if (!methodRefund) {
            toast.error("Vui lòng chọn phương thức hoàn tiền!");
            return;
        }
        if (methodRefund === "bank" && (bank === "" || bankNumber === "" || bankOwner === "")) {
            toast.error("Vui lòng nhập đầy đủ thông tin ngân hàng!");
            return;
        }
        if (methodRefund === "momo" && momoNumber === "") {
            toast.error("Vui lòng nhập đầy đủ thông tin momo!");
            return;
        }

        const imageRef = ref(storage, `images/orders/${auth.currentUser.uid}/review/${id}`);
        await uploadBytes(imageRef, imgReview).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(doc(db, "orders", docid), {
                    imgReview: url,
                    status: 3,
                    methodRefund,
                    momoNumber,
                    bank,
                    bankNumber,
                    bankOwner,
                });
            });
        });
        getOrder();
        toast.success("Cập nhật thành công!");
    };

    const handleClickReport = () => {
        setClickReport(!clickReport);
    };

    const handleSendReport = async () => {
        if(textReport === '') {
            toast.error("Vui lòng không bỏ trống nội dung!");
            return;
        }
        const idReport = new Date().getTime().toString();
        await addDoc(collection(db, "reports"), {
            id: idReport,
            pid: id,
            uid: auth.currentUser.uid,
            text: textReport,
            img: product.img,
            name: product.name,
            username: auth.currentUser.displayName,
            shop: product.shop,
        });
        toast.success("Gửi thành công!");
        setTextReport("");
        setClickReport(false);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getOrder();
            }
        });
        getProduct();
    }, []);

    return (
        <>
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
                            <Col lg={9} md={12} sm={12}>
                                <Row>
                                    <Col lg={6}>
                                        <div className={cx("product-img")}>
                                            <img src={product?.img} alt="" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className={cx("heading")}>
                                            <div className={cx("title")}>{product?.name}</div>
                                            <div className={cx("description")}>
                                                <div className={cx("price")}>
                                                    <span style={{ color: "#007BFF" }}>Giá bán: {product?.price}đ</span>{" "}
                                                    -{" "}
                                                    <span style={{ color: "#FF0000" }}>
                                                        Hoàn tiền: {product?.refund}đ
                                                    </span>
                                                </div>
                                                <div className={cx("note")}>
                                                    Mua sản phẩm trên Shopee, đánh giá và nhận hoàn tiền từ người bán.
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx("process")}>
                                            <div className={cx("title")}>📢 Các bước mua Deal</div>

                                            {/* buoc 1 */}
                                            <div className={cx("step")}>
                                                <div className={cx("bar")}>
                                                    <div
                                                        className={cx("circle", {
                                                            "circle-disable":
                                                                order?.status !== undefined ||
                                                                parseInt(product?.bought) === parseInt(product?.slot),
                                                        })}
                                                    ></div>
                                                    <div
                                                        className={cx("line", {
                                                            "circle-disable":
                                                                order?.status !== undefined ||
                                                                parseInt(product?.bought) === parseInt(product?.slot),
                                                        })}
                                                    ></div>
                                                </div>
                                                <div className={cx("info")}>
                                                    <div
                                                        className={cx("status-text", {
                                                            "status-text-disable":
                                                                order?.status !== undefined ||
                                                                parseInt(product?.bought) === parseInt(product?.slot),
                                                        })}
                                                    >
                                                        B1. Đăng ký mua Deal
                                                    </div>
                                                    <button
                                                        onClick={handleRegister}
                                                        className={cx("btn", {
                                                            "btn-disable":
                                                                order?.status !== undefined ||
                                                                parseInt(product?.bought) === parseInt(product?.slot),
                                                        })}
                                                    >
                                                        Đăng ký
                                                    </button>
                                                    <div className={cx("error")}></div>
                                                </div>
                                            </div>

                                            {/* buoc 2 */}
                                            <div className={cx("step")}>
                                                <div className={cx("bar")}>
                                                    <div
                                                        className={cx("circle", {
                                                            "circle-disable": order?.status !== 1,
                                                        })}
                                                    ></div>
                                                    <div
                                                        className={cx("line", {
                                                            "circle-disable": order?.status !== 1,
                                                        })}
                                                    ></div>
                                                </div>
                                                <div className={cx("info")}>
                                                    <div
                                                        className={cx("status-text", {
                                                            "status-text-disable": order?.status !== 1,
                                                        })}
                                                    >
                                                        B2. Cập nhật ảnh đơn hàng
                                                    </div>
                                                    {order?.status > 0 && (
                                                        <>
                                                            <img
                                                                className={cx("update-img")}
                                                                ref={updateImgRef}
                                                                src={order?.imgUpdate}
                                                                alt=""
                                                            />
                                                            <input
                                                                type="file"
                                                                onChange={(e) => {
                                                                    const [file] = e.target.files;
                                                                    if (file) {
                                                                        updateImgRef.current.src =
                                                                            URL.createObjectURL(file);
                                                                        setImg(file);
                                                                    }
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={handleUpdate}
                                                        className={cx("btn", { "btn-disable": !order?.status })}
                                                    >
                                                        {order?.status === 1
                                                            ? "Cập nhật ảnh đơn hàng"
                                                            : "Gửi lại ảnh đơn hàng"}
                                                    </button>
                                                    <div className={cx("error")}></div>
                                                </div>
                                            </div>

                                            {/* buoc 3 */}
                                            <div className={cx("step")}>
                                                <div className={cx("bar")}>
                                                    <div
                                                        className={cx("circle", {
                                                            "circle-disable": order?.status !== 2,
                                                        })}
                                                    ></div>
                                                    <div
                                                        className={cx("line", {
                                                            "circle-disable": order?.status !== 2,
                                                        })}
                                                    ></div>
                                                </div>
                                                <div className={cx("info")}>
                                                    <div
                                                        className={cx("status-text", {
                                                            "status-text-disable": order?.status !== 2,
                                                        })}
                                                    >
                                                        B3. Cập nhật ảnh đánh giá sản phẩm
                                                    </div>
                                                    {order?.status > 1 && (
                                                        <>
                                                            <img
                                                                className={cx("update-img")}
                                                                ref={reviewImgRef}
                                                                src={order?.imgReview}
                                                            />
                                                            <input
                                                                type="file"
                                                                onChange={(e) => {
                                                                    const [file] = e.target.files;
                                                                    if (file) {
                                                                        reviewImgRef.current.src =
                                                                            URL.createObjectURL(file);
                                                                        setImgReview(file);
                                                                    }
                                                                }}
                                                            />
                                                            <div className={cx("refund")}>
                                                                <div className={cx("title-rf")}>
                                                                    Chọn cách hoàn lại tiền
                                                                </div>
                                                                <select
                                                                    style={{ outline: "none", padding: 4 }}
                                                                    value={methodRefund}
                                                                    onChange={(e) => setMethodRefund(e.target.value)}
                                                                >
                                                                    <option></option>
                                                                    {product?.bank && (
                                                                        <option value="bank">Ngân hàng</option>
                                                                    )}
                                                                    {product?.momo && (
                                                                        <option value="momo">Momo</option>
                                                                    )}
                                                                </select>
                                                                {methodRefund === "bank" && (
                                                                    <div className={cx("input-bank")}>
                                                                        <input
                                                                            value={bankOwner}
                                                                            onChange={(e) =>
                                                                                setBankOwner(e.target.value)
                                                                            }
                                                                            placeholder="Tên chủ tài khoản"
                                                                        />
                                                                        <input
                                                                            value={bank}
                                                                            onChange={(e) => setBank(e.target.value)}
                                                                            placeholder="Tên ngân hàng"
                                                                        />
                                                                        <input
                                                                            value={bankNumber}
                                                                            onChange={(e) =>
                                                                                setBankNumber(e.target.value)
                                                                            }
                                                                            placeholder="Số tài khoản"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {methodRefund === "momo" && (
                                                                    <div className={cx("input-momo")}>
                                                                        <input
                                                                            value={momoNumber}
                                                                            onChange={(e) =>
                                                                                setMomoNumber(e.target.value)
                                                                            }
                                                                            placeholder="SĐT chuyển tiền Momo"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={handleReview}
                                                        className={cx("btn", {
                                                            "btn-disable": !order?.status || order?.status === 1,
                                                        })}
                                                    >
                                                        {order?.status === 2 ? "Cập nhật ảnh đánh giá SP" : "Cập nhật"}
                                                    </button>
                                                    <div className={cx("error")}></div>
                                                </div>
                                            </div>

                                            {/* buoc 4 */}
                                            <div className={cx("step")}>
                                                <div className={cx("bar")}>
                                                    <div
                                                        className={cx("circle", {
                                                            "circle-disable": order?.status !== 3,
                                                        })}
                                                    ></div>
                                                    <div
                                                        className={cx("line", {
                                                            "circle-disable": order?.status !== 3,
                                                        })}
                                                    ></div>
                                                </div>
                                                <div className={cx("info")}>
                                                    <div
                                                        className={cx("status-text", {
                                                            "status-text-disable": order?.status !== 3,
                                                        })}
                                                    >
                                                        B4. Chờ duyệt ảnh và hoàn tiền
                                                    </div>
                                                    <button
                                                        className={cx("btn", { "btn-disable": order?.status !== 3 })}
                                                    >
                                                        Chờ hoàn tiền
                                                    </button>
                                                    <div className={cx("error")}></div>
                                                </div>
                                            </div>
                                        </div>
                                        {order?.status >= 2 && (
                                            <div className={cx("report")}>
                                                <div onClick={handleClickReport} className={cx("heading")}>
                                                    <AiFillMail size={20} /> Gửi khiếu nại
                                                </div>
                                                {clickReport && (
                                                    <div className={cx("body")}>
                                                        <textarea
                                                            value={textReport}
                                                            onChange={(e) => setTextReport(e.target.value)}
                                                            className={cx("textarea")}
                                                        />
                                                        <button onClick={handleSendReport}>GỬI</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </div>
            {open && (
                <Popup
                    setOpen={setOpen}
                    href={`https://t.ecomobi.com/?token=GIBhYFkCyyhjURziEQgWY&url=${encodeURIComponent(product.link)}`}
                    title="Đăng ký lượt mua thành công!"
                    content="Tiếp theo bạn có 30phút để mua hàng và gửi hình ảnh đơn hàng lên hệ thống"
                    note="Quá thời hạn này lượt mua của bạn sẽ bị hủy và không được hoàn tiền"
                    contentBtn="Tôi đã hiểu và tiếp tục mua deal"
                />
            )}
            {openError && (
                <Popup
                    setOpen={setOpenError}
                    content="Bạn có chắc cung cấp đúng hình ảnh và thông tin?"
                    note="Nếu hình ảnh đơn hàng không đúng bạn sẽ bị khóa lượt mua Deal"
                    contentBtn="Đồng ý"
                    error
                />
            )}
        </>
    );
}

export default Product;
