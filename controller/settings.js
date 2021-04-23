class Settings {
  static DEFAULT_DATA_FOLDER = "./user_data/";
  static DATA_FOLDER = Settings.DEFAULT_DATA_FOLDER;

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

    $("#dataFolderPicker").on("click", function (event) {
      IPCRenderer.send("onClickDataFolderPicker");
      event.preventDefault();
    });

    IPCRenderer.on("onClickDataFolderPickerReply", function (event, result) {
      if(result && result.length > 0 && result[0].trim().length > 0) {
        Settings.DATA_FOLDER = result[0];
      } else {
        Settings.DATA_FOLDER = Settings.DEFAULT_DATA_FOLDER;
      }
      console.log(`Set data folder to: ${Settings.DATA_FOLDER}`);
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
