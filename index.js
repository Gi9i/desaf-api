require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// models
const User = require("./models/User");

// Config JSON response
app.use(express.json());

// Open Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a API!" });
});

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo a nossa Api"})
})



// Register User
app.post('/auth/register', async (req, res) => {
    const { nome, email, senha, confirmSenha, telefones } = req.body;

    if (!nome) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' });
    }

    if (!email) {
        return res.status(422).json({ msg: 'O Email é obrigatório!' });
    }

    if (!senha) {
        return res.status(422).json({ msg: 'O Senha é obrigatório!' });
    }

    if (senha !== confirmSenha) {
        return res.status(422).json({ msg: 'As senhas não conferem!' });
    }

    const usuarioExiste = await User.findOne({ email });

    if (usuarioExiste) {
        return res.status(422).json({ msg: 'E-mail já existente' });
    }

    try {
        const saltRounds = 12;
        const cripitarSenha = await bcrypt.hash(senha, saltRounds);

        // Criar usuário
        const user = new User({
            nome,
            email,
            senha: cripitarSenha,
            telefones: [{ numero: telefones.numero, ddd: telefones.ddd }]
        });

        // Salvar usuário no banco de dados
        await user.save();

        // acessar os dados
        const secret = process.env.SECRET;
        const token = jwt.sign({
            id: user._id,
            data_criacao: formatarDataEHora(user.createdAt),
            data_atualizacao: formatarDataEHora(user.updatedAt),
            ultimo_login: formatarDataEHora(user.ultimo_login),
        }, secret, { expiresIn: '30m' });
        

        res.status(201).json({
            msg: 'Usuário criado com sucesso!',
            id: user._id,
            data_criacao: formatarDataEHora(user.createdAt),
            data_atualizacao: formatarDataEHora(user.updatedAt),
            ultimo_login: formatarDataEHora(user.ultimo_login),
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ops, houve um erro no servidor. Tente novamente.' });
    }
});



//login

app.post("/auth/login", async(req, res) => {

    const {email,senha} = req.body

    if(!email){
        return res.status(422).json({msg: 'O Email é obrigatório!'})
    }


    if(!senha){
        return res.status(422).json({msg: 'O Senha é obrigatório!'})
    }

    // checkar se meu usuario existe

    const usuario = await User.findOne({email:email})

    if(!usuario){
        return res.status(401).json({msg: 'Usuário e/ou senha inválidos'})
    }

// Atualiza o campo de último login
    usuario.ultimo_login = new Date();
    await usuario.save();


    // checkar se meu usuario existe

    const checarSenha = await bcrypt.compare(senha, usuario.senha)

    if(!checarSenha){
        return res.status(401).json({msg: 'Usuário e/ou senha inválidos'})
    }

    try {
        const secret = process.env.SECRET
   

        const token = jwt.sign({
            id: usuario._id,
            data_criacao: formatarDataEHora(usuario.createdAt),
            data_atualizacao: formatarDataEHora(usuario.updatedAt),
            ultimo_login: formatarDataEHora(usuario.ultimo_login),

        },
        secret, { expiresIn: '30m' }
        );

        res.status(200).json({
            msg: 'Autenticação realizada com sucesso',
            id: usuario._id,
            data_criacao: formatarDataEHora(usuario.createdAt),
            data_atualizacao: formatarDataEHora(usuario.updatedAt),
            ultimo_login: formatarDataEHora(usuario.ultimo_login),
            token,
        });



    } catch (err) {
        console.log(err)
        res.status(500).json({msg:'Ops houve um erro no servidor, tentar novamente'})
    }

})





// Credenciais de acesso
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.bxk3jvf.mongodb.net/authjwt?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
        console.log('Conectou ao banco!');
    })
    .catch((err) => console.error(err));








    // Função para formatar uma data para "dd/mm/yyyy HH:mm:ss"
const formatarDataEHora = (data) => {
    try {
        if (!data) {
            throw new Error('Data inválida');
        }

        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        return data.toLocaleDateString('pt-BR', options);
    } catch (error) {
        console.error('Erro ao formatar data e hora:', error.message);
        return null;
    }
};
