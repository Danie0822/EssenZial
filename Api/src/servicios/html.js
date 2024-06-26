// archivo: correoHTML.js

function generarCorreoHTML({ codigoRecuperacion }) {
    return `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Essenzial - Recuperación de Contraseña</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
        }

        .header {
            background: #0056b3;
            padding: 20px;
            text-align: center;
            color: #fff;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }

        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
        }

        .content {
            padding: 30px 20px;
            text-align: center;
        }

        .content p {
            font-size: 18px;
            line-height: 1.6;
            margin: 10px 0;
            color: #555;
        }

        .code {
            font-size: 28px;
            font-weight: 700;
            margin: 30px 0;
            color: #0056b3;
            background: #f9f9f9;
            padding: 15px 20px;
            border-radius: 8px;
            display: inline-block;
            letter-spacing: 2px;
        }

        .footer {
            background: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #888;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            border-top: 1px solid #e0e0e0;
        }

        .footer p {
            margin: 0;
        }

        @media screen and (max-width: 600px) {

            .content,
            .header,
            .footer {
                padding: 10px;
            }

            .code {
                font-size: 22px;
                padding: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Essenzial - Recuperación de Contraseña</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Has solicitado recuperar tu contraseña. Utiliza el siguiente código para restablecerla:</p>
            <div class="code">${codigoRecuperacion}</div>
            <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EssenZial. Todos los derechos reservados.</p>
        </div>
    </div>
</body>

</html>`;
}

module.exports = generarCorreoHTML;
