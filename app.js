Vue.createApp({
  data() {
    return {
      tasks: [],
      task: "",

      action: "", // Flag To Action Task

      // Restore Task After Delete
      deleteTasks: [],
      diary: [],

      //  Restore Task After Fix
      fixTasks: [],

      length: 20,
      picked: ["alpha", "capitalAlpha", "Numbers", "Symbols"],

      check: "",

      // Setting Pagination
      limit: 7,
      dataDisplay: [],
      dataPage: [],
      currentPage: 1,
      totalPages: 0,
      pageActive: 1,

      pickColor: "Default",
      colorOptions: [
        "Default",
        "Aquamarine",
        "Gray",
        "Green",
        "RedPink",
        "Silver", //Color Simple
        "Gradient-SunSet",
        "Gradient-Ocean",
        "Gradient-Dawn",
        "Gradient-Sun",
        "Gradient-Grass", //Color Gradient
      ],
    };
  },

  created() {
    this.index();
  },

  watch: {},

  computed: {},

  mounted() {
    this.focusInput();
  },

  methods: {
    index() {
      this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      this.diary = JSON.parse(localStorage.getItem("diary")) || [];
      this.pickColor =
        JSON.parse(localStorage.getItem("backgroundColor")) || "Default";
      this.chooseColorBackGround(this.pickColor);

      if (this.tasks.length > 0) {
        this.paginationData(this.tasks);
        this.displayPaginationPage(this.currentPage);
      } else {
        this.dataDisplay = this.tasks;
      }
      try {
        this.pickColor = JSON.parse(localStorage.getItem("backgroundColor"));
        if (this.pickColor) {
          this.chooseColorBackGround(this.pickColor);
        }
      } catch (Ex) {
        console.log("Error Background Color: " + Ex);
      }
    },

    addTask() {
      let currentDateTime = new Date();

      if (this.task != "") {
        this.tasks.push({
          id: this.randomId(),
          name: this.task,
          created: currentDateTime,
          updated: currentDateTime,
        });
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        this.task = "";
      }
      this.index();
    },

    removeTask(task) {
      this.action = "Delete Task";
      this.deleteTasks.push(task);
      var flagCheck = 0;
      this.diary.forEach((element) => {
        if (element.id == task.id) {
          flagCheck++;
        }
      });
      if (flagCheck == 0) {
        this.diary.push(task);
        localStorage.setItem("diary", JSON.stringify(this.diary));
      }

      let newTasks = this.tasks.filter(function (item) {
        return task.id !== item.id;
      });
      this.tasks = newTasks;
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      this.index();
    },

    restoreTask() {
      if (this.action == "Delete Task") {
        if (this.deleteTasks.length > 0) {
          this.tasks.push(this.deleteTasks[this.deleteTasks.length - 1]);
          var tempt = [];
          for (var i = 0; i < this.deleteTasks.length - 1; i++) {
            tempt.push(this.deleteTasks[i]);
          }
          this.deleteTasks = tempt;

          localStorage.setItem("tasks", JSON.stringify(this.tasks));
          this.index();
        }
      }
      if (this.action == "Fix Task") {
        if (this.fixTasks.length > 0) {
          var tasks = this.tasks;
          var fixTasks = this.fixTasks;
          // Find index id in array task
          tasks.forEach((item, index) => {
            if (item.id == this.fixTasks[this.fixTasks.length - 1].id) {
              this.tasks[index] = this.fixTasks[this.fixTasks.length - 1];
            }
          });
          var temptFixTasks = [];
          for (var i = 0; i < this.fixTasks.length - 1; i++) {
            temptFixTasks.push(this.fixTasks[i]);
          }
          fixTasks = temptFixTasks;
          this.tasks = tasks;
          this.fixTasks = fixTasks;
          localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
        this.index();
      }
    },

    fixTask(index) {
      let currentDateTime = new Date();
      this.action = "Fix Task";
      if (this.task != "") {
        let fixTask = {
          id: this.tasks[index]["id"],
          name: this.tasks[index]["name"],
          created: this.tasks[index]["created"],
          updated: currentDateTime,
        };
        this.fixTasks.push(fixTask);
        this.tasks[index]["name"] = this.task;
        this.task = "";
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
      }
      this.index();
    },

    clearInput() {
      this.task = "";
    },

    generatePassword() {
      const alpha = "abcdefghijklmnopqrstuvwxyz";
      const capitalAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      const symbols = "!@#$%^&*_-+=";

      const defaultLength = 20;

      let password = "";

      try {
        var characters = "";

        if (this.picked.includes("Symbols")) {
          characters += symbols;
        }
        if (this.picked.includes("Numbers")) {
          characters += numbers;
        }
        if (this.picked.includes("alpha")) {
          characters += alpha;
        }
        if (this.picked.includes("capitalAlpha")) {
          characters += capitalAlpha;
        }

        var length = this.length;

        if (length != "") {
          length = Math.floor(length);
          if (length <= 47 && length > 0) {
            for (let i = 0; i < length; i++) {
              password += characters.charAt(
                Math.floor(Math.random() * characters.length)
              );
            }
          } else {
            for (let i = 0; i < defaultLength; i++) {
              password += characters.charAt(
                Math.floor(Math.random() * characters.length)
              );
            }
            this.length = "20";
          }
        } else {
          for (let i = 0; i < defaultLength; i++) {
            password += characters.charAt(
              Math.floor(Math.random() * characters.length)
            );
          }
        }
      } catch (error) {
        console.log(error);
      }

      this.copy(password);
      return (this.task = password);
    },

    copy(getText) {
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(getText);
      } else {
        // text area method
        let textArea = document.createElement("textArea");
        textArea.value = getText;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand("copy") ? res() : rej();
          textArea.remove();
        });
      }
    },

    paginationData(dataPage) {
      try {
        this.dataPage = dataPage;
        this.totalPages = Math.round(this.dataPage.length / this.limit);
        if (
          Math.round(this.dataPage.length / this.limit) <
          this.dataPage.length / this.limit
        ) {
          this.totalPages++;
        }
      } catch (error) {
        console.log(error);
      }
    },

    displayPaginationPage(numberPage) {
      try {
        if (numberPage > this.totalPages) {
          numberPage = 1;
        }
        this.currentPage = numberPage;
        this.pageActive = numberPage;
        var numberRowPage = Number(this.limit); //Because input text
        var totalRecords = this.dataPage.length;
        var start = (numberPage - 1) * numberRowPage;
        var end = start + numberRowPage;
        this.dataDisplay = [];
        if (end < totalRecords) {
          while (start < end) {
            this.dataDisplay.push(this.dataPage[start]);
            start++;
          }
        } else {
          while (start < totalRecords) {
            this.dataDisplay.push(this.dataPage[start]);
            start++;
          }
        }

        //If page no records
        if (this.dataDisplay.length < 1) {
          this.currentPage = this.currentPage - 1;
          this.displayPaginationPage(this.currentPage);
        }
      } catch (Ex) {
        console.log("Error: " + Ex);
      }
    },

    firstPage() {
      this.displayPaginationPage(1);
    },

    lastPage() {
      this.displayPaginationPage(this.totalPages);
    },

    chooseColorBackGround(pickColor) {
      var background = document.getElementById("html");
      background.style.height = "100%";
      if (pickColor == "Default") {
        background.style.backgroundColor = "#fcdad5";
        background.style.backgroundImage = "none";
      }
      if (pickColor == "Aquamarine") {
        background.style.backgroundColor = "aquamarine";
        background.style.backgroundImage = "none";
      }
      if (pickColor == "Gray") {
        background.style.backgroundColor = "rgb(160,160,160)";
        background.style.backgroundImage = "none";
      }
      if (pickColor == "Green") {
        background.style.backgroundColor = "rgb(153,255,153)";
        background.style.backgroundImage = "none";
      }
      if (pickColor == "RedPink") {
        background.style.backgroundColor = "rgb(255,204,153)";
      }
      if (pickColor == "Silver") {
        background.style.backgroundColor = "rgb(224,224,224)";
        background.style.backgroundImage = "none";
      }
      // Gradient Color
      if (pickColor == "Gradient-SunSet") {
        background.style.backgroundImage = "linear-gradient(#F9AD6A, #43978D)";
      }
      if (pickColor == "Gradient-Ocean") {
        background.style.backgroundImage =
          "linear-gradient(to top, #264D59, #43978D)";
      }
      if (pickColor == "Gradient-Dawn") {
        background.style.backgroundImage = "linear-gradient(#43978D, #F9E07F)";
      }
      if (pickColor == "Gradient-Sun") {
        background.style.backgroundImage =
          "linear-gradient(to top,#F9E07F, #F9AD6A)";
      }
      if (pickColor == "Gradient-Grass") {
        background.style.backgroundImage = "linear-gradient(#F9E2AE, #A7D676)";
      }
      localStorage.setItem("backgroundColor", JSON.stringify(pickColor));
    },

    switchArr() {
      if (this.deleteTasks.length > 0) {
        this.paginationData(this.deleteTasks);
        this.displayPaginationPage(1);
      } else {
        this.dataDisplay = [];
      }
      var tempt = this.tasks;
      this.tasks = this.deleteTasks;
      this.deleteTasks = tempt;
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    randomId() {
      var characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=";

      var id = Date.now();

      for (var i = 0; i < 7; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    },

    focusInput() {
      this.$refs.task.focus();
    },

    sendMessageWebhook() {
      let currentDateTime = new Date();

      const url =
        "https://discord.com/api/webhooks/1085023952113516636/ekHpJBGvW2bdysVy6LknGwsQ7XEYJzhZTOFVt5aJPsMNCcwodm2P_CUbBYGlnQSDPQWb";

      let tasks = JSON.stringify(this.tasks);
      let diary = JSON.stringify(this.diary);

      const message = {
        username: "Dragon Bot",
        content: "Boss! Time:" + currentDateTime,
        embeds: [
          {
            title: "Task",
            description: tasks,
            color: 15684489,
          },
          {
            title: "Diary",
            description: diary,
            color: 14177041,
          },
        ],
      };

      axios
        .post(url, message)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
}).mount("#app");

