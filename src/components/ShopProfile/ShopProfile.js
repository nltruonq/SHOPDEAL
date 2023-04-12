import styles from "./ShopProfile.module.scss";
import classNames from "classnames/bind";

import { Col, Container, Row } from "react-bootstrap";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { setDoc, doc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { FaUser } from "react-icons/fa";
import { auth, db, storage } from "../../firebase/config";
import { useRef, useEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";

const cx = classNames.bind(styles);

const schema = yup.object({
    email: yup.string().required("Vui lòng nhập trường này").max(60).email(),
    phone: yup.string().required("Vui lòng nhập trường này").max(12).min(6),
    name: yup.string().required("Vui lòng nhập trường này").max(60).min(5),
    fb: yup.string().required("Vui lòng nhập trường này").max(300).min(10),
});

function ShopProfile() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const [shop, setShop] = useState(null);
    const [user, setUser] = useState(null);
    const [img, setImg] = useState(null);

    const imgRef = useRef();

    const onSubmit = async (profile) => {
        const imageRef = ref(storage, `images/${auth.currentUser.uid}/valid`);
        await uploadBytes(imageRef, img).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
                await setDoc(doc(db, "shops", auth.currentUser.uid), {
                    id: auth.currentUser.uid,
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    fb: profile.fb,
                    img: url,
                    isValid: 0, //0 chưa xác nhận, -1 không hợp lệ, 1 hợp lệ
                });
            });
        });
        toast.success("Cập nhật thành công!");
        getShop();
    };

    const getShop = async () => {
        const ref = doc(db, "shops", auth.currentUser.uid);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setShop(data);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getShop();
            }
        });
    }, []);

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className={cx("title")}>Tài khoản người bán</h1>
                </Col>
                <Col xs={12}>
                    <div className={cx("wrapper")}>
                        <div className={cx("heading")}>
                            <FaUser size={20} />
                            Thông tin cá nhân
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className={cx("body")}>
                            <Row className="ps-3">
                                <Col className="mt-4 mb-4" xs={3}></Col>
                                <Col
                                    className="mt-4 mb-4"
                                    style={{ color: "#E4604A", fontWeight: 700, fontSize: 24 }}
                                    xs={9}
                                >
                                    {shop?.isValid === 0
                                        ? "Đang chờ xác nhận"
                                        : shop?.isValid === 1
                                        ? "Tài khoản đã được xác nhận"
                                        : shop?.isValid === -1
                                        ? "Tài khoản không được xác nhận"
                                        : "Điền thông tin Shop"}
                                </Col>
                                {shop?.isValid !== 0 && shop?.isValid !== -1 && shop?.isValid !== 1 ? (
                                    <>
                                        <Col className="mb-4" xs={3}>
                                            Tên
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                {...register("name")}
                                                className={cx("input")}
                                                placeholder="Nhập Tên"
                                            ></input>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.name?.message}
                                            </div>
                                        </Col>
                                        <Col className="mb-4" xs={3}>
                                            Email
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                {...register("email")}
                                                className={cx("input")}
                                                placeholder="Nhập Email"
                                            ></input>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.email?.message}
                                            </div>
                                        </Col>
                                        <Col className="mb-4" xs={3}>
                                            Số điện thoại (có zalo)
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                {...register("phone")}
                                                className={cx("input")}
                                                type={"number"}
                                                placeholder="Nhập Số điện thoại"
                                            ></input>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.phone?.message}
                                            </div>
                                        </Col>
                                        <Col className="mb-4" xs={3}>
                                            Link facebook
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                {...register("fb")}
                                                className={cx("input")}
                                                placeholder="Nhập Link facebook"
                                            ></input>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.fb?.message}
                                            </div>
                                        </Col>
                                        <Col className={cx("img-fb") + " mb-4"} xs={3}>
                                            Hình ảnh facebook
                                            <img src="https://vcdn1-giaitri.vnecdn.net/2019/03/24/e21bea9d06fdf3ddca0585e680a70fb9-1553439867.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=j48om2Tq01_KDA_AZ4SI0Q" />
                                            <span style={{ fontSize: 14 }}>Ảnh mẫu</span>
                                        </Col>
                                        <Col className="mb-4 d-flex flex-column" xs={9}>
                                            <input
                                                {...register("img")}
                                                type={"file"}
                                                accept="image/*"
                                                className={cx("input")}
                                                onChange={(e) => {
                                                    const [file] = e.target.files;
                                                    if (file) {
                                                        imgRef.current.src = URL.createObjectURL(file);
                                                        setImg(file);
                                                    }
                                                }}
                                            ></input>
                                            <img className={cx("img-preview")} ref={imgRef} src="" />
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.img?.message}
                                            </div>
                                        </Col>
                                        <Col className="mb-4" xs={3}></Col>
                                        <Col className="mb-4" xs={9}>
                                            <button type="submit" className={cx("btn-save")}>
                                                Lưu
                                            </button>
                                        </Col>
                                    </>
                                ) : (
                                    <>
                                        <Col className="mb-4" xs={3}>
                                            Tên
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                className={cx("input", "bg-input")}
                                                value={shop?.name}
                                                readOnly
                                            ></input>
                                        </Col>
                                        <Col className="mb-4" xs={3}>
                                            Email
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                className={cx("input", "bg-input")}
                                                value={shop?.email}
                                                readOnly
                                            ></input>
                                        </Col>
                                        <Col className="mb-4" xs={3}>
                                            Số điện thoại (có zalo)
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                className={cx("input", "bg-input")}
                                                value={shop?.phone}
                                                readOnly
                                            ></input>
                                        </Col>
                                        <Col className="mb-4" xs={3}>
                                            Link facebook
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <input
                                                className={cx("input", "bg-input", 'link-fb')}
                                                value={shop?.fb}
                                                readOnly
                                            ></input>
                                        </Col>
                                        <Col className={cx("img-fb") + " mb-4"} xs={3}>
                                            Hình ảnh facebook
                                            <img src="https://vcdn1-giaitri.vnecdn.net/2019/03/24/e21bea9d06fdf3ddca0585e680a70fb9-1553439867.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=j48om2Tq01_KDA_AZ4SI0Q" />
                                            <span style={{ fontSize: 14 }}>Ảnh mẫu</span>
                                        </Col>
                                        <Col className="mb-4" xs={9}>
                                            <img className={cx("img-preview")} src={shop?.img} />
                                        </Col>
                                        <Col className="mb-4" xs={3}></Col>
                                        <Col className="mb-4" xs={9}>
                                            {/* <button type="submit" className={cx("btn-save")}>
                                                Lưu
                                            </button> */}
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ShopProfile;
