var admin = require("firebase-admin");
require("dotenv").config();

var serviceAccount = require("./../serviceAction.json");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "appointmentapi-7f945",
    private_key_id: "bdedafb0468a6e7abaf416c0573fdeae9a57e6fe",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCIw8+qKNGtB5G8\nfKoDrsgZolhg5OU9f7xrvDaGhBgldjSwfJwhpYt+bzWfSu3YsXqLWku4JeuDOVrS\nyW2FVrUtpYCgXC6PZ1Z+pFLKdvWn2pZj2cv5aaUDCVrsVsNlEEYC2rD8ogfO0kK2\ndi2y+yqgerHSKfxl++nzueVwIJn3K6gMPUE7Ge0g+2g3SXClthU6W2WZc28MTy+O\nr/lQ8u1ELgaOopwXH6Dgjp0vOXrBe/xsSYeymKbS74r0AWQNVbyi4NPZXRJeOKPA\ngy+UCnlwYvAfSa36Rma06TcX1+8e/o0u2iHdTLbwAUI5oS/IN5zZH9E/STncsaIN\n2QIns3P/AgMBAAECggEAGNUQ8jD6LUQoEoTCK+wC2iCvklxNQVbdo+QnNFJsvfSS\nCY9+m99ejiTsJBGrUQKcoQvSnsuH0SpLUuWO9LxzJigcTEGglJorStBUVf22ifU3\nBEdJ8W3cr8n1j98LGGEVjTQfGafj6gokYdPgZVSUf1H30pScBvpwFrhkr/DDc+zd\n3kBbJqUz7NpNrGOLYM4z76Dl+nOl6N7d/Ubymyo2JthRrfV7VrcDnGboReBbCJ+4\nWolss3N83/9flsh0mqHa7ynyIIwSK8wcziVu2bhxM0pjFzALrzXXzWUMWAFUrSu9\nvdjNtLPJYXSWtI0XoR0YPFN2n5zymnqS7W6FiHZjWQKBgQC+9ALXIVbPeftOpv6N\npflwTdn3qrDH32rk43KB2ganqs9Wtl3K7KkjjSjBLG/7JCcWx2XdJYKWHZCEybqJ\nbZAsL2OLwH0HzdM+lfomNXuOWCpo1L096AXiUjZXM6zLQU4nEJlwcnh0rMVoV+5z\nxnopbr4UmcDFw09f+NDR2sxPdwKBgQC3WlWZT98tvkXpHzD6jHn9fOLk4lKlW2il\nUt/trclLe1kwjdxiUvRWKYg+uDJuvNfs8UGcT9VKtY85Jhdoi/2uSjqjJHo5UNQM\nNoYh4XYwtRLs6J28xa9SetcQ4Ftb1VU0fA+3Zd7UuK08DjbHyrFij7mWoW7kC9kX\nC1Sa/HnxuQKBgQCj2OifA8JjYL2cbXo6vNHd5U9ETjhGKJSmNevJM/VF5TDnrK+q\nMYuoL7Vqm+CyVAEecJYdPdRhTpj098uRpGtzHm6COfaOvbOnHjV4l6efKlOpg/Gl\nrvNtkTGDfZmlBjIzHvEqJW7qXl08/UZkHUgxSQ7cylk42C/Bn9Q+XUm2XQKBgHB+\nIwCSKZq2H8x8z58ZKwtkYQ0O8qfzYkv0geEge90sy7bngqxsuu5WQvpAJukcQdpk\n1t1hebqBlGL6xOfm4/jYIAvSKI8b0U3A8iC9ZLdTkU37FjQokX2oUmVPUZ4RUFqI\nN1hNTx7yQ48SJXgFGzoedj49w3x07HegAwOoHeU5AoGADOqv9vcLUhLwPWLiyAns\nTwcYJLKr4ydM5NvivvDZoyMPYbclrEkS3wh2hLgBLbnpYvMs7svIqw3rJzIqEOzy\njEphDU/pn9Tmyg6wLCsRj3YnYq6xnCKSfU2Z90I84tH0WtaN5kK0H0wp/wubjBWH\nBqYEttTIbdUn0xa1w1SnVJg=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-r9i7r@appointmentapi-7f945.iam.gserviceaccount.com",
    client_id: "111204007359243064713",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r9i7r%40appointmentapi-7f945.iam.gserviceaccount.com",
  }),
  databaseURL: "https://server-auth-41acc.firebaseio.com",
});

module.exports = admin;
