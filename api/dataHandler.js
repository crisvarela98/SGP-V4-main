const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

exports.saveData = (req, res) => {
    const { type, data } = req.body;
    const filePath = path.join(DATA_DIR, `${type}.json`);
    
    fs.readFile(filePath, (err, fileData) => {
        let entries = fileData && !err ? JSON.parse(fileData) : [];
        entries.push(data);
        
        fs.writeFile(filePath, JSON.stringify(entries, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al guardar los datos');
            }
            res.json({ message: `${type} guardado/a con éxito` });
        });
    });
};

exports.loadData = (req, res) => {
    const { type } = req.params;
    const filePath = path.join(DATA_DIR, `${type}.json`);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: `No se encontraron ${type}` });
            }
            console.error(err);
            return res.status(500).send('Error al cargar los datos');
        }
        res.json(JSON.parse(data));
    });
};