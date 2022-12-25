const db = require("./firebase.js");
var cookieSession = require("cookie-session");
const { FieldValue } = require("firebase-admin/firestore");
var admin = require("firebase-admin");

class FirebaseData {
  static setData(collection, data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      // change this to env
      let ref = db.collection(collection);
      ref.add({
        apiKey: data.apiKey,
        name: data.name,
        email: data.email,
        phone: data.phone,
        reqCountCurrent: data.reqCountCurrent,
        reqCountMax: data.reqCountMax,
        statusCode: data.statusCode,
        _id: data._id,
        date: data.date,
        subStartDate: data.subStartDate,
        subEndDate: data.subEndDate,
        dateTimeRange: data.dateTimeRange,
        slotSize: data.slotSize,
      });
    } else {
      throw new Error("API Key does not match our records!");
    }
  }

  // get Appointment

  static async getAppointment(id, guestID, wait, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      return { status: false, message: "API Key not found!" };
    }
    let docID = snapshot.docs[0].id;
    let user = db.collection("users").doc(docID);

    if (id && !guestID && !wait) {
      // get by appointment id
      let appointment = await user
        .collection("appointments")
        .where("_id", "=", id)
        .get();

      const docData = appointment.docs[0].data();
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });

      return docData;
    } else if (!id && guestID && !wait) {
      // get by guest id
      let appointment = await user
        .collection("appointments")
        .where("guestID", "=", guestID)
        .get();

      const docData = new Array();

      appointment.forEach((doc) => {
        docData.push(doc.data());
        user.update({
          reqCountCurrent: FieldValue.increment(1),
        });
      });

      return docData;
    } else if (wait && guestID && !id) {
      console.log("Waiting for guest");
      // get upcoming appointments
      const d = new Date();
      let time = d.getTime() / 1000;

      let appointment = await user
        .collection("appointments")
        .where("guestID", "=", guestID)
        .where("time", ">=", d)
        .get();
      const docData = new Array();

      appointment.forEach((doc) => {
        docData.push(doc.data());
        user.update({
          reqCountCurrent: FieldValue.increment(1),
        });
      });

      return docData;
    } else if (!id && !guestID && !wait) {
      // get all
      let appointment = await user.collection("appointments").get();

      const docData = new Array();

      appointment.forEach((doc) => {
        docData.push(doc.data());
        user.update({
          reqCountCurrent: FieldValue.increment(1),
        });
      });

      return docData;
    }
  }

  // get guest
  static async getGuest(email, guestID, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      return { status: false, message: "API Key not found!" };
    }
    let docID = snapshot.docs[0].id;
    let user = db.collection("users").doc(docID);

    if (guestID) {
      // get by guest id
      let guest = await user
        .collection("guests")
        .where("guestID", "=", guestID)
        .get();

      const docData = new Array();

      guest.forEach((doc) => {
        docData.push(doc.data());
        user.update({
          reqCountCurrent: FieldValue.increment(1),
        });
      });

      return docData;
    } else if (email) {
      // get by guest id
      let guest = await user
        .collection("guests")
        .where("email", "=", email)
        .get();

      const docData = new Array();

      guest.forEach((doc) => {
        docData.push(doc.data());
        user.update({
          reqCountCurrent: FieldValue.increment(1),
        });
      });

      return docData;
    } else {
      // get by guest id
      let guests = await user.collection("guests").get();

      const docData = new Array();

      guests.forEach((doc) => {
        docData.push(doc.data());
      });

      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });

      return docData;
    }
  }

  // get guest
  static async getUpcoming(location, time, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      return { status: false, message: "API Key not found!" };
    }
    let docID = snapshot.docs[0].id;
    let user = db.collection("users").doc(docID);

    if (location) {
      // get by guest id
      let d = new Date(1970, 0, 0);
      d.setSeconds(time);

      let d1 = new Date(1970, 0, 0);
      d1.setSeconds(parseInt(time) + 1800);
      console.log(admin.firestore.Timestamp.fromDate(d));
      console.log(admin.firestore.Timestamp.fromDate(d1));
      if (time) {
        let appointments = await user
          .collection("appointments")
          .where("location", "==", location)
          .where("time", "==", admin.firestore.Timestamp.fromDate(d))
          .get();

        if (!appointments.empty) {
          const docData = new Array();

          appointments.forEach((doc) => {
            docData.push(doc.data());
          });
          user.update({
            reqCountCurrent: FieldValue.increment(1),
          });

          return docData;
        } else {
          return { status: true, message: "No match found!" };
        }
      } else {
        let appointments = await user
          .collection("appointments")
          .where("location", "==", location)
          .where("time", ">=", d)
          .get();

        if (!appointments.empty) {
          const docData = new Array();

          appointments.forEach((doc) => {
            docData.push(doc.data());
          });
          user.update({
            reqCountCurrent: FieldValue.increment(1),
          });

          return docData;
        } else {
          return { status: true, message: "No match found!" };
        }
      }
    } else {
      return { status: false, message: "No location was passed!" };
    }
  }

  // create appointment
  static async createAppointment(data, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();

    if (snapshot.empty) {
      throw new Error("API Key not found!");
    }
    let docID = snapshot.docs[0].id;

    let appointments = db
      .collection("users")
      .doc(docID)
      .collection("appointments");
    let guests = db.collection("users").doc(docID).collection("guests");
    let user = db.collection("users").doc(docID);
    let userData = await (await user.get()).data();

    if (userData.reqCountCurrent >= userData.reqCountMax) {
      return { status: false, message: "Maximum number of requests exceeded!" };
    }

    let check = await guests.where("_id", "=", data.guestID).get();

    if (check.empty) {
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: false, message: "Guest not found!" };
    } else {
      appointments.add({
        guestID: data.guestID,
        location: data.location,
        _id: data._id,
        date: data.date,
        checkedIn: data.checkedIn,
        amount: data.amount,
        payed: data.payed,
        time: data.time,
      });
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return {
        status: true,
        guestID: data.guestID,
        location: data.location,
        _id: data._id,
        date: data.date,
        checkedIn: data.checkedIn,
        amount: data.amount,
        payed: data.payed,
        time: data.time,
      };
    }
  }

  // create guest
  static async createGuest(data, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();

    if (snapshot.empty) {
      throw new Error("API Key not found!");
    }
    let docID = snapshot.docs[0].id;

    let guests = db.collection("users").doc(docID).collection("guests");
    let user = db.collection("users").doc(docID);

    let userData = await (await user.get()).data();

    if (userData.reqCountCurrent >= userData.reqCountMax) {
      return { status: false, message: "Maximum number of requests exceeded!" };
    }

    let check = await guests.where("email", "=", data.email).get();

    if (!check.empty) {
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: false, message: "Email already registered!" };
    } else {
      // add data
      guests.add({
        name: data.name,
        email: data.email,
        phone: data.phone,
        _id: data._id,
        date: data.date,
      });

      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });

      return {
        status: true,
        name: data.name,
        email: data.email,
        phone: data.phone,
        _id: data._id,
        date: data.date,
      };
    }
  }

  // create user
  static async createUser(data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let ref = db.collection("users");
      const snapshot = await ref.where("email", "==", data.email).get();

      if (snapshot.empty) {
        FirebaseData.setData(
          "users",
          data,
          "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
        );
        return true;
      } else {
        return true;
      }
    } else {
      throw new Error("You are not Authorised to create a new user!");
    }
  }

  // delete appointment
  static async deleteApp(id, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      throw new Error("API Key not found!");
    }

    let docID = snapshot.docs[0].id;

    let appointments = db
      .collection("users")
      .doc(docID)
      .collection("appointments");

    var app = await appointments.where("_id", "=", id).get();
    let ap = app.docs[0].id;
    if (app.empty) {
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: false, message: "Appointment not found!" };
    } else {
      const res = appointments.doc(ap).delete();
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: true, message: "Appointment deleted successfully" };
    }
  }

  // delete guest
  static async deleteGuest(id, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      return { status: false, message: "API Key not found!" };
    }

    let docID = snapshot.docs[0].id;

    let guest = db.collection("users").doc(docID).collection("guests");
    let ap = db.collection("users").doc(docID).collection("appointments");

    var app = await guest.where("_id", "=", id).get();
    let apID = app.docs[0].id;
    let user = db.collection("users").doc(docID);

    if (app.empty) {
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: false, message: "Guest not found!" };
    } else {
      guest.doc(apID).delete();
      const res = ap.where("guestID", "=", id);

      res.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });

      return { status: true, message: "Guest deleted successfully" };
    }
  }

  // update appointment
  static async updateAppointment(id, data, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      return { status: false, message: "API Key not found!" };
    }

    let docID = snapshot.docs[0].id;
    let user = db.collection("users").doc(docID);

    let appointment = await user
      .collection("appointments")
      .where("_id", "=", id)
      .get();

    if (appointment.empty) {
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: false, message: "Appointment not found!" };
    } else {
      const docRef = user
        .collection("appointments")
        .doc(appointment.docs[0].id);

      const res = await docRef.update({
        amount: data.amount,
        checkedIn: data.checkedIn,
        time: data.time,
        guestID: data.guestID,
        location: data.location,
        payed: data.payed,
      });

      let sendData = (await docRef.get()).data();

      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });

      return sendData;
    }
  }

  // update guest
  static async updateGuest(id, data, key) {
    let ref = db.collection("users");
    const snapshot = await ref.where("apiKey", "==", key).get();
    if (snapshot.empty) {
      return { status: false, message: "API Key not found!" };
    }

    let docID = snapshot.docs[0].id;
    let user = db.collection("users").doc(docID);

    let guest = await user.collection("guests").where("_id", "=", id).get();

    if (guest.empty) {
      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });
      return { status: false, message: "Guest not found!" };
    } else {
      const docRef = user.collection("guests").doc(guest.docs[0].id);

      const res = await docRef.update({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      let sendData = (await docRef.get()).data();

      user.update({
        reqCountCurrent: FieldValue.increment(1),
      });

      return sendData;
    }
  }

  // update user
  static async updateUser(id, data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let ref = db.collection("users");
      const snapshot = await ref.where("_id", "==", id).get();
      if (snapshot.empty) {
        return false;
      }

      let docID = snapshot.docs[0].id;
      let user = db.collection("users").doc(docID);

      if (data.name) {
        user.update({
          name: data.name,
        });
      }

      if (data.phone) {
        user.update({
          phone: data.phone,
        });
      }
      if (data.slotSize) {
        user.update({
          slotSize: data.slotSize,
        });
      }
      if (data.dateTimeRange.lenght != 0) {
        user.update({
          dateTimeRange: data.dateTimeRange,
        });
      }

      return false;
    } else {
      return false;
    }
  }
}

module.exports = FirebaseData;
