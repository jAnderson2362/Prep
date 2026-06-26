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
            className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#0048FF]/50 px-5 py-4 shadow-sm lg:px-8 xl:px-[8%]"
            // ${isScroll ? "bg-white/50 backdrop-blur-lg shadow-sm" : ""}`}
        >
            {/* Logo */}
            <Link to="/" className="font-bold text-lg w-28">
                LOGO
            </Link>

            {/* Nav */}
            <ul className="hidden md:flex items-center gap-8 rounded-full px-12 py-3">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/">Features</Link></li>
                <li><Link to="/">Community</Link></li>
                <li><Link to="/">Pricing</Link></li>
                <li><Link to="/">Contact</Link></li>
            </ul>

            {/* Mobile button */}
            <button
                className="md:hidden"
                onClick={() => setMenuOpen(true)}
            >
                ☰
            </button>

            {/* Mobile Nav */}
            <div
                className={`fixed top-0 right-0 h-screen w-64 bg-white transition-transform duration-300 md:hidden
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