
const express = require('express');

const mysql=require("mysql2");
const app = express()
app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/js", express.static(__dirname + "/js"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.urlencoded({extended:false}))

let conexion=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mendozaweb_bd",
});



app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.get('/usuarios', function(req, res){
    //res.render("usuarios");
    let consulta = "SELECT * FROM usuario";
    conexion.query(consulta, function(error, resultados){
        if (error) {
            console.error(error);
            res.status(500).send("Error al consultar la base de datos");
        } else {
            res.render("usuarios", { usuarios: resultados });
        }
    });
});


app.post('/validar', function(req, res){
    const datos=req.body;
    console.log(datos);
    let nombres=datos.nombres;
    let celular=datos.celular;
    let correo=datos.correo;
    let mensaje=datos.mensaje;

    let registrar= "INSERT INTO informacion (nombres, celular, correo, mensaje) VALUES ('"+nombres+"','"+celular+"','"+correo+"','"+mensaje+"')"
    conexion.query(registrar, function(error){
        if (error) {
            throw error;
        }else{
            //console.log("Datos almacenados correctamente");
            res.send(`
                <script>
                    alert("Datos enviados correctamente");
                    window.location.href="/";
                </script>
                `);
        }
    });
});

// Definir las rutas ANTES de app.listen
app.post("/registrar", function(req, res) {
    const {dni, nombres, correo, celular} = req.body;
    const sql = `
        INSERT INTO usuario (dni, nombres, correo, celular) 
        VALUES (?, ?, ?, ?)
    `;
    
    conexion.query(
        sql,
        [dni, nombres, correo, celular],
        function(error){
            if (error) {
                console.error(error);
                return res.status(500).send("Error al registrar");
            }
            res.redirect("/usuarios");
        }
    );
});

// Iniciar el servidor al final
app.listen(3000, () => {
    console.log("Servidor creado en localhost");
});