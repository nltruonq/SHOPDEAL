import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";

import { ToastContainer } from "react-toastify";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        const Layout = route.layout === false ? false : DefaultLayout;
                        if (Layout)
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        else return <Route key={index} path={route.path} element={<Page />} />;
                    })}

                    {/* <Route path={'/admin'} element={<Admin/>}/>
                    <Route path={'/admin/login'} element={<Login/>}/> */}
                </Routes>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                />
            </div>
        </Router>
    );
}

export default App;
