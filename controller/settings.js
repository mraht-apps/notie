class Settings {
  static registerEvents() {
    $("#btnSavePassword").on("click", function (event) {
      Eventhandler.onClickBtnSavePassword(event);
    });

    $("#btnSetPassword").on("click", function (event) {
      Eventhandler.onClickBtnSetPassword(event);
    });

    $("#btnReadPassword").on("click", function (event) {
      Eventhandler.onClickBtnReadPassword(event);
    });
  }
}

class Eventhandler {
  static onClickBtnSavePassword(event) {
    const password = $("#password").val();
    CryptoJS.PASSWORD = password;
    console.log("User set password to " + CryptoJS.PASSWORD + "\n");

    CryptoJS.IV = CryptoJS.generateIV();
    console.log("User set iv to " + CryptoJS.IV + "\n");
  }

  static onClickBtnSetPassword(event) {
    const password = $("#password").val();
    CryptoJS.PASSWORD = password;
    console.log("User set password to " + CryptoJS.PASSWORD + "\n");
  }

  static onClickBtnReadPassword(event) {
    console.log("User set password to " + CryptoJS.PASSWORD + "\n");
    console.log("User set iv to " + CryptoJS.IV + "\n");
  }
}

module.exports = Settings;
