import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-[#F0F3FE] px-5 py-12 text-slate-700 lg:px-8 xl:px-[8%]">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">
            Product
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-slate-950">
                Features
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-950">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-950">
                Subjects
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">
            Resources
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-slate-950">
                Study Guides
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-950">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-950">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/about" className="hover:text-slate-950">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-950">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">
            Legal
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-slate-950">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-slate-950">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">
            Social
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-950"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-sm text-slate-500">
        © {new Date().getFullYear()} Prep. All rights reserved.
      </div>
    </footer >
  );
};

export default Footer;