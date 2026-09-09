import { useMemo } from "react";
import { wineDataSet } from "./files/wineDataSet";
import styles from "./App.module.scss";

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = (values) => { const sorted = [...values].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; };
const mode = (values) => { const counts = new Map(); values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1)); return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]; };
const format = (value) => value.toFixed(3);

function App() {
    const groups = useMemo(() => {
        const grouped = wineDataSet.reduce((result, item) => { const key = item.Alcohol; result[key] = result[key] || []; result[key].push(item); return result; }, {});
        return Object.entries(grouped).map(([alcohol, records]) => { const flavanoids = records.map((item) => Number(item.Flavanoids)); const gamma = records.map((item) => (Number(item.Ash) * Number(item.Hue)) / Number(item.Magnesium)); return { alcohol, sampleSize: records.length, flavanoids: [mean(flavanoids), median(flavanoids), mode(flavanoids)], gamma: [mean(gamma), median(gamma), mode(gamma)] }; });
    }, []);
    const renderTable = (title, description, key) => <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>Dataset measure</p><h2>{title}</h2></div><span className={styles.badge}>{groups.length} classes</span></div><p className={styles.description}>{description}</p><div className={styles.tableWrap}><table><thead><tr><th>Measure</th>{groups.map((group) => <th key={group.alcohol}>Class {group.alcohol}<small>{group.sampleSize} records</small></th>)}</tr></thead><tbody>{["Mean", "Median", "Mode"].map((measure, index) => <tr key={measure}><th scope="row">{measure}</th>{groups.map((group) => <td key={group.alcohol}>{format(group[key][index])}</td>)}</tr>)}</tbody></table></div></section>;
    return <main className={styles.container}><header className={styles.header}><div><p className={styles.kicker}>STATISTICS PLAYGROUND</p><h1>Wine dataset insights</h1><p className={styles.lead}>Compare descriptive statistics across alcohol classes using a transparent array-of-objects workflow.</p></div><div className={styles.summary}><strong>{wineDataSet.length}</strong><span>records analysed</span></div></header><div className={styles.grid}>{renderTable("Flavanoids", "Average, middle, and most frequent flavanoid value for each alcohol class.", "flavanoids")}{renderTable("Gamma", "Gamma is derived from Ash × Hue ÷ Magnesium for every record.", "gamma")}</div><footer className={styles.footer}>Built by <a href="https://www.ashishranjan.net/" target="_blank" rel="noreferrer">Ashish Ranjan</a> · <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">View source</a></footer></main>;
}

export default App;
