window.$ = window.jQuery = require("jquery");
const IPCRenderer = require("electron").ipcRenderer;

const General = require("../utils/general.js");
const Settings = require("../controller/settings.js");
const File = require("../utils/file.js");

class Renderer {
  static init() {
    Renderer.registerEvents();

    let settings = IPCRenderer.sendSync("getSettings");
    Settings.CACHE = settings.CACHE;
    Settings.DATA = settings.DATA;

    if (Settings.CACHE.REMEMBER_DB) {
      $("#rememberDatabase").prop("checked", true);
    }
    if (Settings.CACHE.REMEMBER_PW) {
      $("#rememberPassword").prop("checked", true);
    }

    if (Settings.DATA.PASSWORD) {
      $("#password").val(Settings.DATA.PASSWORD);
    }

    if (Settings.DATA.DATABASE && Settings.DATA.DATABASE.length > 0) {
      $("#openDatabase").trigger("click");
    } else {
      $("#createDatabase").trigger("click");
    }
  }

  static registerEvents() {
    $("#createDatabase").on("click", (event) => Eventhandler.onClickCreateDatabase(event));
    $("#openDatabase").on("click", (event) => Eventhandler.onClickOpenDatabase(event));
    $("#database").on("change", (event) => Eventhandler.onChangeDatabase(event));
    $("#btnDatabasePicker").on("click", (event) => Eventhandler.onClickBtnDatabasePicker(event));
    $("#password").on("keyup", (event) => Eventhandler.onKeyupPassword(event));
    $("#btnPasswordVisibility").on("click", (event) => Eventhandler.onClickBtnPasswordVisibility(event));
    $("#btnExit").on("click", (event) => Eventhandler.onClickBtnExit(event));
    $("#btnLogin").on("click", (event) => Eventhandler.onClickBtnLogin(event));
  }
}

class Eventhandler {
  // OPT Move source code to a single method
  static onClickCreateDatabase(event) {
    $("#createDatabase").addClass("active");
    $("#openDatabase").removeClass("active");

    $(".firstLabel").text("Database folder:");
    $("#btnDatabasePicker").attr("title", "Choose a database folder");

    $("#database").attr("title", "Choose a database folder");
    $("#database").val(Settings.CACHE.DEFAULT_FOLDER);
    $("#database").trigger("change");

    if ($("#database").val() == "" || $("#database").hasClass("error")) {
      General.focus($("#database"));
    } else {
      General.focus($("#password"));
    }
  }

  static onClickOpenDatabase(event) {
    $("#openDatabase").addClass("active");
    $("#createDatabase").removeClass("active");

    $(".firstLabel").text("Database file:");
    $("#btnDatabasePicker").attr("title", "Choose a database file");

    $("#database").attr("title", "Choose a database file");
    $("#database").val(Settings.CACHE.DEFAULT_FILE);
    $("#database").trigger("change");

    if ($("#database").val() == "" || $("#database").hasClass("error")) {
      General.focus($("#database"));
    } else {
      General.focus($("#password"));
    }
  }

  static onChangeDatabase(event) {
    let database = $(event.target);
    if (File.exists(database.val())) {
      database.removeClass("error");
    } else if (!database.hasClass("error")) {
      database.addClass("error");
    }
  }

  static onClickBtnDatabasePicker(event) {
    let result = null;
    if ($("#openDatabase").hasClass("active")) {
      result = IPCRenderer.sendSync("databaseFilePicker");
    } else {
      result = IPCRenderer.sendSync("databaseFolderPicker");
    }
    if (!result || result.length == 0 || result[0].trim().length == 0) return;
    $("#database").val(result[0]);
    $("#database").trigger("change");
    General.focus($("#password"));
  }

  static onKeyupPassword(event) {
    if ($("#password").hasClass("error") && Settings.isSuitablePassword($("#password").val())) {
      $("#password").removeClass("error");
    }
  }

  static onClickBtnPasswordVisibility(event) {
    let passwordInput = $("#password");
    let passwordImg = $("#imgHideShowPassword");
    if (passwordInput.attr("type") == "password") {
      passwordInput.attr("type", "text");
      passwordImg.attr("src", "../res/img/hide.svg");
    } else {
      passwordInput.attr("type", "password");
      passwordImg.attr("src", "../res/img/show.svg");
    }
    General.focus(passwordInput);
  }

  static onClickBtnExit() {
    IPCRenderer.send("exit", false);
  }

  static onClickBtnLogin() {
    let database = $("#database").val();
    let password = $("#password").val();

    if ($("#openDatabase").hasClass("active") && !File.exists(database)) {
      $("#database").addClass("error");
      General.focus($("#database"));
      return;
    } else if (!File.exists(database)) {
      $("#database").addClass("error");
      General.focus($("#database"));
      return;
    }

    if (password.length < 8) {
      $("#password").addClass("error");
      General.focus($("#password"));
      return;
    }

    IPCRenderer.send("openDatabase", {
      REMEMBER_DB: $("#rememberDatabase").is(":checked"),
      DATABASE: $("#database").val(),
      REMEMBER_PW: $("#rememberPassword").is(":checked"),
      PASSWORD: $("#password").val(),
    });
  }
}

Renderer.init();
