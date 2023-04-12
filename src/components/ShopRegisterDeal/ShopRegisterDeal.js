import styles from "./ShopRegisterDeal.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col } from "react-bootstrap";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { setDoc, doc, collection, query, where, getDocs, getDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BsPencilSquare } from "react-icons/bs";
import { useRef, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import InformationDeal from "../../pages/InformationDeal/InformationDeal";

const cx = classNames.bind(styles);

const schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên cho sản phẩm").min(4),
    link: yup.string().required("Vui lòng nhập link sản phẩm").min(4),
});

function ShopRegisterDeal() {
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
    const [img, setImg] = useState(null);
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState({});
    const imgRef = useRef();
    const selectRef = useRef();

    const onSubmit = async (data) => {
        if (!img) {
            toast.error("Vui lòng chọn ảnh cho sản phẩm!");
            return;
        }
        if (!data.bank && !data.momo) {
            toast.error("Vui lòng chọn ít nhất 1 phương thức hoàn tiền!");
            return;
        }
        if (!data.location) {
            toast.error("Vui lòng chọn khu vực của shop!");
            return;
        }
        if (!data.price || !data.refund) {
            toast.error("Vui lòng nhập đầy đủ giá sản phẩm!");
            return;
        }
        if (!data.slot) {
            toast.error("Vui lòng nhập số lượng!");
            return;
        }
        if (parseInt(data.price) < 50000 && data.bank) {
            toast.error("Thanh toán ngân hàng khi số tiền hoàn lại > 50000");
            return;
        }
        if (parseInt(data.price) < parseInt(data.refund)) {
            toast.error("Số tiền hoàn lại không được quá 100%");
            return;
        }
        const imageRef = ref(storage, `images/${auth.currentUser.uid}/${data.name}`);
        const id = new Date().getTime().toString();
        await uploadBytes(imageRef, img).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
                await setDoc(doc(db, "deals", id), {
                    shop: auth.currentUser.uid,
                    id: id,
                    name: data.name,
                    link: data.link,
                    img: url,
                    momo: data.momo,
                    bank: data.bank,
                    freeship: data.freeship,
                    location: data.location,
                    price: data.price,
                    refund: data.refund,
                    slot: data.slot,
                    note: data.note,
                    bought: 0,
                    category: selectRef.current.value,
                    isValid: 0, //0 chưa xác nhận, -1 không hợp lệ, 1 hợp lệ
                });
            });
        });
        toast.success("Đăng ký deal thành công!");
        const infoData = {
            id: id,
            momo: data.momo,
            bank: data.bank,
            freeshipextra: data.freeship,
            location: data.location,
            price: data.price,
            refund: data.refund,
            slot: data.slot,
            note: data.note,
            category: selectRef.current.value,
        };
        setInfo(infoData);
        setSuccess(true);
        reset();
        imgRef.current.src = "";
    };

    const getShop = async () => {
        const ref = doc(db, "shops", auth.currentUser.uid);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setShop(data);
        }
    };

    const handleCancel = () => {
        reset();
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getShop();
            }
        });
    }, []);
    return (
        <>
            {!success && (
                <Container>
                    <Row>
                        <Col xs={12}>
                            <h1 className={cx("title")}>Đăng ký Deal</h1>
                        </Col>
                        <Col xs={12}>
                            {shop?.isValid !== 1 ? (
                                "Vui lòng cập nhật thông tin shop và chờ xác nhận!"
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className={cx("wrapper")}>
                                    <div className={cx("heading")}>
                                        <BsPencilSquare size={20} />
                                        Nhập thông tin deal
                                    </div>
                                    <Row className="ps-2">
                                        {/* hinh sp */}
                                        <Col className="pt-3 pb-3 b-r b-b" style={{ height: "340px" }} xs={3}>
                                            Hình sản phẩm
                                        </Col>
                                        <Col
                                            xs={9}
                                            style={{ height: "340px" }}
                                            className="d-flex flex-column pb-3 pt-3 b-b"
                                        >
                                            <img className={cx("img-product")} ref={imgRef} src="" />
                                            <input
                                                type={"file"}
                                                accept="image/*"
                                                {...register("img")}
                                                onChange={(e) => {
                                                    const [file] = e.target.files;
                                                    if (file) {
                                                        imgRef.current.src = URL.createObjectURL(file);
                                                        setImg(file);
                                                    }
                                                }}
                                            ></input>
                                        </Col>

                                        {/* Ten sp */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Tên sản phẩm
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <input
                                                {...register("name")}
                                                className={cx("input")}
                                                placeholder="Nhập tên sản phẩm"
                                            />
                                            <div className={cx("note")}>* Tên sản phẩm không có chữ deal</div>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.name?.message}
                                            </div>
                                        </Col>

                                        {/* link sp */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Link sản phẩm
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <input
                                                {...register("link")}
                                                className={cx("input")}
                                                placeholder="Nhập link sản phẩm"
                                            />
                                            <div className={cx("note")}>
                                                * Ví dụ: https://shopee.vn/ao-ni-nam-da-ca-dep.31123123
                                            </div>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.link?.message}
                                            </div>
                                        </Col>

                                        {/* danh muc sp */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Danh mục sản phẩm
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <select ref={selectRef}>
                                                <option value={"0d"}>#Deal0Đ</option>
                                                <option value={"thoitrangnu"}>Thời trang nữ</option>
                                                <option value={"thoitrangnam"}>Thời trang nam</option>
                                                <option value={"sacdep"}>Sắc đẹp</option>
                                                <option value={"thoitrangtreem"}>Thời trang trẻ em</option>
                                                <option value={"nhacuavadoisong"}>Nhà cửa & đời sống</option>
                                                <option value={"suckhoe"}>Sức khỏe</option>
                                                <option value={"thucphamvadouong"}>Thực phẩm và đồ uống</option>
                                                <option value={"phukienthoitrang"}>Phụ kiện thời trang</option>
                                                <option value={"tuivinu"}>Túi ví nữ</option>
                                                <option value={"tuivinam"}>Túi ví nam</option>
                                                <option value={"thietbiamthanh"}>Thiết bị âm thanh</option>
                                                <option value={"mevabe"}>Mẹ & bé</option>
                                                <option value={"dienthoaivaphukien"}>Điện thoại & phụ kiện</option>
                                                <option value={"giaydepnu"}>Giày dép nữ</option>
                                                <option value={"giaydepnam"}>Giày dép nam</option>
                                                <option value={"maytinhvalaptop"}>Máy tính & laptop</option>
                                                <option value={"thietbidiengiadung"}>Thiết bị điện gia dụng</option>
                                                <option value={"dongho"}>Đồng hồ</option>
                                                <option value={"thethaovadangoai"}>Thể thao & dã ngoại</option>
                                                <option value={"sothichvasuutam"}>Sở thích & sưu tầm</option>
                                                <option value={"vanphongpham"}>Văn phòng phẩm</option>
                                            </select>
                                        </Col>

                                        {/* so luong slot */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Số lượng slot
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <input
                                                {...register("slot")}
                                                className={cx("input")}
                                                type="number"
                                                placeholder="Nhập số lượng"
                                            />
                                            <div className={cx("note")}>* Số lượng review cần có</div>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.slot?.message}
                                            </div>
                                        </Col>

                                        {/* gia ban tren san */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Giá bán trên sàn
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <input
                                                {...register("price")}
                                                className={cx("input")}
                                                type="number"
                                                placeholder="Nhập giá bán"
                                            />
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.price?.message}
                                            </div>
                                        </Col>

                                        {/* so tien hoan lai */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Số tiền hoàn lại
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <input
                                                {...register("refund")}
                                                type="number"
                                                className={cx("input")}
                                                placeholder="Nhập số tiền hoàn lại"
                                            />
                                            <div className={cx("note")}>* Số tiền hoàn lại sau khi review</div>
                                            <div className="mt-[6px]  px-[1rem] text-red-500">
                                                {errors?.refund?.message}
                                            </div>
                                        </Col>

                                        {/* freeship extra */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Freeship Extra
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <input
                                                {...register("freeship")}
                                                className={cx("input-checkbox")}
                                                type="checkbox"
                                            />
                                        </Col>

                                        {/* cach hoan tien */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Cách hoàn tiền
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <div className={cx("wrapper-checkbox")}>
                                                <input
                                                    {...register("bank")}
                                                    className={cx("input-checkbox")}
                                                    type="checkbox"
                                                />
                                                <label>Qua Ngân hàng</label>
                                            </div>
                                            <div className={cx("wrapper-checkbox")}>
                                                <input
                                                    {...register("momo")}
                                                    className={cx("input-checkbox")}
                                                    type="checkbox"
                                                />
                                                <label>Qua MoMo</label>
                                            </div>
                                            {/* <div className={cx("wrapper-checkbox")}>
                                        <input className={cx("input-checkbox")} type="checkbox" />
                                        <label>Qua ShopeePay</label>
                                    </div>
                                    <div className={cx("wrapper-checkbox")}>
                                        <input className={cx("input-checkbox")} type="checkbox" />
                                        <label>Qua Zalo</label>
                                    </div> */}
                                        </Col>

                                        {/* Khu vuc cua shop */}
                                        <Col xs={3} className="pb-3 pt-3 b-r b-b">
                                            Khu vực của shop
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3 b-b">
                                            <div className={cx("wrapper-checkbox")}>
                                                <input
                                                    {...register("location")}
                                                    value="hcm"
                                                    type="radio"
                                                    name="location"
                                                />
                                                <label>Hồ Chí Minh</label>
                                            </div>
                                            <div className={cx("wrapper-checkbox")}>
                                                <input
                                                    {...register("location")}
                                                    value="hn"
                                                    type="radio"
                                                    name="location"
                                                />
                                                <label>Hà Nội</label>
                                            </div>
                                            <div className={cx("wrapper-checkbox")}>
                                                <input
                                                    {...register("location")}
                                                    value="other"
                                                    type="radio"
                                                    name="location"
                                                />
                                                <label>Khu vực khác</label>
                                            </div>
                                        </Col>

                                        {/* ghi chu */}
                                        <Col xs={3} className="pb-3 b-r pt-3">
                                            Ghi chú
                                        </Col>
                                        <Col xs={9} className="pb-3 pt-3">
                                            <textarea
                                                {...register("note")}
                                                className={cx("textarea")}
                                                placeholder="tối đa 400 kí tự"
                                            />
                                        </Col>

                                        {/* button */}
                                        <Col xs={3} className="pb-3 pt-3 b-r"></Col>
                                        <Col xs={9} className="pb-3 pt-3 ">
                                            <div className="d-flex gap-5">
                                                <button type="submit" className={cx("btn-save")}>
                                                    Lưu
                                                </button>
                                                <button onClick={handleCancel} className={cx("btn-cancel")}>
                                                    Hủy
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            )}
                        </Col>
                    </Row>
                </Container>
            )}
            {success && <InformationDeal info={info} />}
        </>
    );
}

export default ShopRegisterDeal;
