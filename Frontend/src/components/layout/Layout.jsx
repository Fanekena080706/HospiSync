import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children }) {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="page-content">
                    <div className="page-content-inner">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;