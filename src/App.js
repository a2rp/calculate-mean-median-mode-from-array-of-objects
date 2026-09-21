import { createElement, useEffect, useMemo, useState } from "react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiCode, FiCoffee, FiGlobe, FiLifeBuoy, FiMail, FiMenu, FiX } from "react-icons/fi";
import { SiPatreon } from "react-icons/si";
import { wineDataSet } from "./files/wineDataSet";
import styles from "./App.module.scss";

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const mode = (values) => {
    const counts = new Map();
    values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
};
const format = (value) => value.toFixed(3);

const footerLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FiGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FaGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: FiCode },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FaLinkedinIn },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FaFacebookF },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FaYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FiLifeBuoy },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FiCoffee },
    { label: "Patreon", href: "https://www.patreon.com/a2rp", icon: SiPatreon },
];

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTopButton, setShowTopButton] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTopButton(window.scrollY > 360);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const groups = useMemo(() => {
        const grouped = wineDataSet.reduce((result, item) => {
            const key = item.Alcohol;
            result[key] = result[key] || [];
            result[key].push(item);
            return result;
        }, {});

        return Object.entries(grouped).map(([alcohol, records]) => {
            const flavanoids = records.map((item) => Number(item.Flavanoids));
            const gamma = records.map((item) => (Number(item.Ash) * Number(item.Hue)) / Number(item.Magnesium));
            return {
                alcohol,
                sampleSize: records.length,
                flavanoids: [mean(flavanoids), median(flavanoids), mode(flavanoids)],
                gamma: [mean(gamma), median(gamma), mode(gamma)],
            };
        });
    }, []);

    const renderTable = (title, description, key) => (
        <section className={styles.panel}>
            <div className={styles.panelHeading}>
                <div>
                    <p className={styles.eyebrow}>Dataset measure</p>
                    <h2>{title}</h2>
                </div>
                <span className={styles.badge}>{groups.length} classes</span>
            </div>
            <p className={styles.description}>{description}</p>
            <div className={styles.tableWrap}>
                <table>
                    <thead>
                        <tr>
                            <th>Measure</th>
                            {groups.map((group) => (
                                <th key={group.alcohol}>
                                    Class {group.alcohol}
                                    <small>{group.sampleSize} records</small>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {["Mean", "Median", "Mode"].map((measure, index) => (
                            <tr key={measure}>
                                <th scope="row">{measure}</th>
                                {groups.map((group) => (
                                    <td key={group.alcohol}>{format(group[key][index])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    return (
        <div className={styles.appShell}>
            <header className={styles.siteHeader}>
                <div className={styles.headerBar}>
                    <a className={styles.brand} href="#statistics" aria-label="Wine dataset statistics home">
                        <img className={styles.brandLogo} src={`${process.env.PUBLIC_URL}/logo.png`} alt="Wine dataset statistics logo" />
                        <span>Wine Dataset Statistics</span>
                    </a>
                    <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
                        <a href="#statistics" onClick={() => setMenuOpen(false)}>Statistics</a>
                        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
                    </nav>
                    <button
                        className={styles.menuButton}
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                    </button>
                </div>
            </header>

            <main className={styles.container} id="statistics">
                <header className={styles.header}>
                    <div>
                        <p className={styles.kicker}>STATISTICS PLAYGROUND</p>
                        <h1>Wine dataset insights</h1>
                        <p className={styles.lead}>Compare descriptive statistics across alcohol classes using a transparent array-of-objects workflow.</p>
                    </div>
                    <div className={styles.summary}>
                        <strong>{wineDataSet.length}</strong>
                        <span>records analysed</span>
                    </div>
                </header>
                <div className={styles.grid}>
                    {renderTable("Flavanoids", "Average, middle, and most frequent flavanoid value for each alcohol class.", "flavanoids")}
                    {renderTable("Gamma", "Gamma is derived from Ash x Hue / Magnesium for every record.", "gamma")}
                </div>
                <section className={styles.about} id="about">
                    <p className={styles.eyebrow}>About this project</p>
                    <p>Explore a compact statistical summary of the wine dataset, grouped by alcohol class for quick comparison.</p>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerBar}>
                    <p className={styles.copy}>
                        Copyright &copy; {new Date().getFullYear()} {" "}
                        <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a>
                    </p>
                    <nav className={styles.footerLinks} aria-label="Footer links">
                        {footerLinks.map(({ label, href, icon }) => {
                            const iconElement = createElement(icon, { "aria-hidden": true });
                            const external = !href.startsWith("mailto:");
                            return (
                                <a key={label} href={href} aria-label={label} title={label} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                                    {iconElement}
                                </a>
                            );
                        })}
                    </nav>
                </div>
            </footer>

            {showTopButton && (
                <button className={styles.toTop} type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top" title="Go to top">
                    ↑
                </button>
            )}
        </div>
    );
}

export default App;
