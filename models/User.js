const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    ultimo_Login: Date,
    telefones: [{
        numero: String,
        ddd: String,
    }]
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

const User = mongoose.model('User', userSchema);

module.exports = User;
