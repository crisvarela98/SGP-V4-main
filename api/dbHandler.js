const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// URI de conexión a MongoDB
const uri = "mongodb+srv://crisvarela98:8RhsLRfAy0UHpMlW@adminsgppanel.fwdca.mongodb.net/adminSGPpanel";

// Función para subir la base de datos
exports.uploadDatabase = async (req, res) => {
    try {
        await mongoose.connect(uri);
        console.log('Conectado a MongoDB Atlas');

        const schema = new mongoose.Schema({}, { strict: false }); // Esquema flexible

        // Leer y subir datos a la colección 'pedidos'
        const pedidosData = JSON.parse(fs.readFileSync('data/pedidos.json', 'utf-8'));
        const Pedidos = mongoose.model('pedidos', schema, 'pedidos');
        await Pedidos.insertMany(pedidosData);

        // Leer y subir datos a la colección 'notas'
        const notasData = JSON.parse(fs.readFileSync('data/notas.json', 'utf-8'));
        const Notas = mongoose.model('notas', schema, 'notas');
        await Notas.insertMany(notasData);

        res.json({ message: 'Base de datos subida exitosamente' });
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        res.status(500).json({ message: 'Error al subir la base de datos' });
    } finally {
        mongoose.connection.close();
    }
};

// Función para descargar la base de datos
exports.downloadDatabase = async (req, res) => {
    try {
        await mongoose.connect(uri);
        console.log('Conectado a MongoDB Atlas');

        const Pedidos = mongoose.model('pedidos', new mongoose.Schema({}, { strict: false }), 'pedidos');
        const pedidosData = await Pedidos.find().lean();
        fs.writeFileSync('data/pedidos.json', JSON.stringify(pedidosData, null, 2));

        const Notas = mongoose.model('notas', new mongoose.Schema({}, { strict: false }), 'notas');
        const notasData = await Notas.find().lean();
        fs.writeFileSync('data/notas.json', JSON.stringify(notasData, null, 2));

        res.json({ message: 'Base de datos descargada exitosamente' });
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        res.status(500).json({ message: 'Error al descargar la base de datos' });
    } finally {
        mongoose.connection.close();
    }
};
