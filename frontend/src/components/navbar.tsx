import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
    // const [isScroll, setIsScroll] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         setIsScroll(window.scrollY > 50);
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    return (
        <nav
            className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#81a3f8] px-5 py-4 shadow-sm lg:px-8 xl:px-[8%]"
            // ${isScroll ? "bg-white/50 backdrop-blur-lg shadow-sm" : ""}`}
        >
            {/* Logo placeholder*/}
            <Link to="/" className="font-bold text-lg w-28">
                PREP
            </Link>

            {/* Nav */}
            <ul className="hidden md:flex items-center gap-8 rounded-full px-12 py-3">
                <li>
                    <Link
                        to="/"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/about"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        About
                    </Link>
                </li>
                <li>
                    <Link
                        to="/products"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        Products
                    </Link>
                </li>
                <li>
                    <Link
                        to="/"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        Features
                    </Link>
                </li>
                <li>
                    <Link
                        to="/"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        Community
                    </Link>
                </li>
                <li>
                    <Link
                        to="/"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        Pricing
                    </Link>
                </li>
                <li>
                    <Link
                        to="/"
                        activeOptions={{ exact: true }}
                        activeProps={{
                            className: "border-b-2 border-blue-600 text-blue-600",
                        }}
                        inactiveProps={{
                            className: "hover:text-blue-600",
                        }}
                    >
                        Contact
                    </Link>
                </li>
            </ul>

            <div className="flex items-center gap-4 min-w-[220px] justify-end">
                <Link
                    to="/"
                    className="text-sm bg-white text-black hover:text-blue border border-zinc-700 px-3 py-1.5 rounded"
                >
                    Sign in
                </Link>
                <Link
                    to="/"
                    className="text-sm bg-black text-white hover:text-blue border border-zinc-700 px-3 py-1.5 rounded"
                >
                    Register
                </Link>
            </div>

            {/* Mobile borgir button */}
            <button
                className="md:hidden"
                onClick={() => setMenuOpen(true)}
            >
                ☰
            </button>

            {/* Mobile Nav */}
            <div
                className={`fixed top-0 right-0 h-screen w-64 bg-[#1cb1ecff] transition-transform duration-300 md:hidden
                ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                <div className="flex flex-col gap-6 mt-20 px-6">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Features</Link>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Community</Link>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Pricing</Link>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Contact</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;