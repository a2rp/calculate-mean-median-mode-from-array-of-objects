import rawWineData from "./wine.data?raw";

// The official UCI file stores the cultivar class first, followed by 13 features.
const columns = [
    "Class",
    "Alcohol",
    "Malic Acid",
    "Ash",
    "Alcalinity of ash",
    "Magnesium",
    "Total phenols",
    "Flavanoids",
    "Nonflavanoid phenols",
    "Proanthocyanins",
    "Color intensity",
    "Hue",
    "OD280/OD315 of diluted wines",
    "Proline",
];

export const wineDataSet = rawWineData
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, rowIndex) => {
        const values = line.split(",").map(Number);
        if (values.length !== columns.length || values.some((value) => !Number.isFinite(value))) {
            throw new Error(`Invalid UCI Wine dataset row at line ${rowIndex + 1}.`);
        }
        return Object.fromEntries(columns.map((column, columnIndex) => [column, values[columnIndex]]));
    });
