Vue.createApp ({

    data() {
        return {
            tasks: [],
            task: "",

            length: 20,
            picked: ["alpha", "capitalAlpha", "Numbers", "Symbols"],

            code: "AddingCode",
            codeLength: 7, 

            fullData: [],
            accounts: [],

            isShow: true,
            isHide: false,

            getId: '',
            id: '',
            pageName: "",
            userName: "",
            password: "",
            link: "",
            info: "",
            note: "",
            editCode: "",
        };
    },

    created() {
        try
        {
            this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];   
            this.fullData = JSON.parse(localStorage.getItem("fullData")) || [];
            this.flagAccount();
        }
        catch (e){
            console.log(e);
        };
    },

    watch: {
        loading(){},
    },

    computed: {
        loading(){
            this.accounts = this.fullData.filter((data)=>{
                return this.code == data.code;
            });
        },
    },

    methods: {
        addTask() {
            if (this.task != "")
            {
                this.tasks.push ({
                    id: Date.now(),
                    name: this.task,
                });
                localStorage.setItem("tasks", JSON.stringify(this.tasks));
                this.task = "";
            }
        },

        removeTask(task) {
            let newTasks = this.tasks.filter(function (item){
                return task.id !== item.id;
            });
            this.tasks = newTasks;
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },

        fixTask(index) {
            if (this.task != "") 
            {
                this.tasks[index]['name'] = this.task;
                this.task = "";
                localStorage.setItem("tasks", JSON.stringify(this.tasks));
            }
        },

        clearInput(){
            this.task = "";
        },

        generatePassword()
        {

            const alpha = "abcdefghijklmnopqrstuvwxyz";
            const capitalAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            const symbols = "!@#$%^&*_-+=";

            const defaultLength = 20;

            let password = "";
            
            try {
                var characters ="";

                if (this.picked.includes("Symbols"))
                {
                    characters += symbols;
                }    
                if (this.picked.includes("Numbers"))
                {
                        characters += numbers;
                }
                if (this.picked.includes("alpha"))
                {
                        characters += alpha;
                }
                if (this.picked.includes("capitalAlpha"))
                {
                        characters += capitalAlpha;
                }

                var length = this.length;

                if (length != "")
                {
                    length = Math.floor(length);
                    if (length <= 47 && length > 0)
                    {
                        for (let i = 0; i < length; i++)
                        {
                            password += characters.charAt
                            (
                                Math.floor( Math.random() * characters.length )
                            );
                        }
                    }
                    else 
                    {
                        for (let i = 0; i < defaultLength; i++)
                        {
                            password += characters.charAt
                            (
                                Math.floor( Math.random() * characters.length )
                            );
                        }
                    }
                }
                else 
                {
                    for (let i = 0; i < defaultLength; i++)
                    {
                            password += characters.charAt
                            (
                                Math.floor( Math.random() * characters.length )
                            );
                    }
                }
            }
            catch (error)
            {
                console.log(error);
            }

            return this.task = password;
        },

        isClean(){
            localStorage.setItem("fullData", []);
        },

        getData(){

            const options = {
                method: 'GET',
                // url: 'https://apichallengermydragon.000webhostapp.com/api/account',
                url: 'http://localhost:8000/api/account',
            }

            try {
                axios.request(options).then((response) =>
                {
                    this.fullData = response.data;
                    localStorage.setItem("fullData", JSON.stringify(this.fullData));
                    console.log(response.data);
                })
    
            }
            catch(err){
                console.log(err);
            }

        },

        addData(){
            const options = {
                method: 'POST',
                // url: 'https://apichallengermydragon.000webhostapp.com/api/account',
                url: 'http://localhost:8000/api/account/',

                data: {
                    'account_page' : "this.pageName",
                    'account_name' : "this.userName",
                    'account_password' : "this.password",
                    'account_link' : "http://www.nettruyenme.com/",
                    'account_info' : "Hegemony No. 1. Unstoppable. The road does not return. No explanation",
                    'account_note' : "Big Waves",
                    'code': this.code,  
                }
            }
            try {
                axios.request(options).then((response) =>
                {
                    this.getData();
                    console.log(response);
                })
            }
            catch(err){
                console.log(err);
            }

            this.isShow = false;
            this.isHide = true;
        },

        editData(){
            const options = {
                method: 'PUT',
                // url: 'https://apichallengermydragon.000webhostapp.com/api/account',
                url: 'http://localhost:8000/api/account/'+this.id,

                data: {
                    'account_page' : this.pageName,
                    'account_name' : this.userName,
                    'account_password' : this.password,
                    'account_link' : this.link,
                    'account_info' : this.info,
                    'account_note' : this.note,
                    'code': this.editCode,
                }
            }
            try {
                axios.request(options).then(() =>
                {
                    this.getData();
                })
    
            }
            catch(err){
                console.log(err);
            }

            this.isShow = false;
            this.isHide = true;
        },

        isRedirect(link){
            window.open(link);
        },

        flagAccount(){
            if(this.code.length >= this.codeLength)
                return true;    
            return false;
        },

        isTakes(){
            this.getData();
        },

        copy(getText){
            // navigator clipboard api needs a secure context (https)
            if (navigator.clipboard && window.isSecureContext) {
                // navigator clipboard api method'
                return navigator.clipboard.writeText(getText);
            } 
            else 
            {
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
                    document.execCommand('copy') ? res() : rej();
                    textArea.remove();
                });
            }        

        },

        openModal($account){
            this.isHide = false;
            this.isShow = true;

            this.getId = $account.id;
            this.id = this.getId;
            this.pageName = $account.account_page;
            this.userName = $account.account_name;
            this.password = $account.account_password;
            this.link = $account.account_link;
            this.info = $account.account_info;
            this.note = $account.account_note;
            this.editCode = $account.code;

            this.getId = '';
        },

        showModal(){
            this.isHide = false;
            this.isShow = true;

            this.pageName = "pageName",
            this.userName = "userName",
            this.password = "password",
            this.link = "http://www.nettruyenme.com/",
            this.info = "Hegemony No. 1. Unstoppable. The road does not return. No explanation",
            this.note = "Big Waves",
            this.editCode = "AddingCode"

        },

        closeModal(){
            this.isHide = true;
            this.isShow = false;
        }
    },
    
}).mount("#app");

