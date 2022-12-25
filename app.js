const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const FirebaseData = require("./firebase/setData");
const User = require("./Models/user");
const { generateApiKey } = require("generate-api-key");
const db = require("./firebase/firebase");

require("./firebase/firebase_service");

// ********************************* middleware *********************************
const csrfMiddleware = csrf({ cookie: true });

const app = express();

app.set("view engine", "ejs");
app.use("/static", express.static("public"));

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(csrfMiddleware);

// ********************************* routes *********************************

// app.all("/login", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

// app.all("/signup", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

// ********************************* sessions *********************************

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});
// ********************************* session end *********************************

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/test2", (req, res) => {
  res.sendFile(__dirname + "/views/test2.html");
});

// ********************************* date select *********************************
app.get("/date_select", (req, res) => {
  if (req.query.apiKey) {
    res.render("date_select", {
      type: req.query.type ? req.query.type : 1,
      btnc: req.query.type == 0 && req.query.btnc ? req.query.btnc : "E0E0E0",
      color:
        req.query.type == 0 && req.query.color ? req.query.color : "646464",
      apiKey: req.query.apiKey,
      br: req.query.br ? req.query.br : 10,
      testVersions: req.query.testVersions == 1 ? 1 : 0,
    });
  } else {
    res.status(404).send("API Key Not Found");
  }
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/pricing", (req, res) => {
  res.sendFile(__dirname + "/views/pricing.html");
});

app.get("/blog", (req, res) => {
  res.sendFile(__dirname + "/views/blog.html");
});

app.get("/blog-single", (req, res) => {
  res.sendFile(__dirname + "/views/blog-single.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/views/contact.html");
});

// app.get("/user", (req, res) => {
//   res.sendFile(__dirname + "/views/user_account.html");
// });

app.get("/user", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);

      try {
        let ref = db.collection("users");
        const snapshot = await ref.where("email", "==", userData.email).get();

        if (snapshot.empty) {
          const user = new User({
            _id: userData.uid,
            name: " ",
            email: userData.email,
            phone: " ",
            apiKey: generateApiKey({
              method: "string",
              length: 30,
              pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            }),
          });
          console.log("User:", user);
          FirebaseData.createUser(
            user,
            "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
          ).then(
            function (value) {
              console.log(req.session.csrf);
              res.render("user_account", {
                user: user,
                csrf: req.session.csrf,
              });
            },
            function (error) {
              res.status(404).send("ERROR: " + error.message);
            }
          );
        } else {
          const user = snapshot.docs[0].data();
          // console.log(user);
          res.render("user_account", { user: user });
        }
      } catch (e) {
        console.log(e);
      }
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

// ********************************* register / login / logout *********************************
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.render("login");
});

// ********************************* create user *********************************

module.exports = app;
