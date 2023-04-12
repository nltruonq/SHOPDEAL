import Header from "../../components/Header/Header";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer/>
            <ScrollToTop/>
        </>
    );
}

export default DefaultLayout;
