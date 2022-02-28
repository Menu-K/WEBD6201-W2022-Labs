class User
    {
        // TODO: missing Getters and Setters

        // constructor
        constructor(firstName = "", lastName = "", emailAddress = "", password = "")
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.UserName = firstName.toLowerCase() + lastName.toLowerCase();
            this.EmailAddress = emailAddress;
            this.Password = password;
        }

        // overriden methods
        toString()
        {
            return `Name : ${this.FirstName}${this.LastName}\nEmail Address : ${this.EmailAddress}`;
        }

        // utility methods
        toJSON()
        {
            return {
                "FirstName": this.FirstName,
                "LastName": this.LastName,
                "EmailAddress": this.EmailAddress,
                "Password": this.Password,
            }
        }

        fromJSON(data)
        {
            this.FirstName = data.firstName;
            this.LastName = data.lastName;
            this.EmailAddress = data.EmailAddress;
            this.UserName = data.UserName;
            this.Password = data.Password;
        }

        serialize()
        {
            if(this.FirstName !== "" && this.LastName !== "" && this.EmailAddress !== "" && this.Password !== "")
            {
                return `${this.FirstName},${this.LastName},${this.EmailAddress},${this.Password}`;
            }
            console.error("One or more properties of the User Object are missing or invalid");
            return null;
        }
    
        deserialize(data) // assume that data is in a comma-separated format (string array of properties)
        {
            let propertyArray = data.split(",");
            this.FirstName = propertyArray[0];
            this.LastName = propertyArray[1];
            this.UserName = propertyArray[2];
            this.EmailAddress = propertyArray[3];
            this.Password = propertyArray[4];
        }
    }


// IIFE -- Immediately Invoked Function Express
// AKA anonymous self-executing function

"use strict";
(function()
{
    /**
     * This function uses AJAX open a connection to the url and returns data to the callback function
     *
     * @param {string} method
     * @param {string} url
     * @param {Function} callback
     */
    function AjaxRequest(method, url, callback)
    {
        // step 1 - create a new XHR object
        let XHR = new XMLHttpRequest();

        // step 2 - create an event
        XHR.addEventListener("readystatechange", ()=>
        {
            if(XHR.readyState === 4 && XHR.status === 200)
            {
               callback(XHR.responseText);
            }
        });

        // step 3 - open a request
        XHR.open(method, url);

        // step 4 - send the request
        XHR.send();
    }

    /**
     * This function loads the Navbar from the header file and injects into the page
     *
     */
    function LoadHeader()
    {
        $.get("./Views/components/header.html", function(html_data)
        {
            $("header").html(html_data);

            document.title = router.ActiveLink.substring(0, 1).toUpperCase() +
                router.ActiveLink.substring(1);

            $(`li>a:contains(${document.title})`).addClass("active");
            CheckLogin();
        });
        
    }

    /**
     *
     *
     * @returns {void}
     */
    function LoadContent()
    {
        let page_name = router.ActiveLink; //alias
        let callback = ActiveLinkCallBack();
        $.get(`./Views/content/${page_name}.html`, function(html_data)
        {
            $("main").html(html_data);

            callback();
        });
    }

    function LoadFooter()
    {
        $.get("./Views/components/footer.html", function(html_data)
        {
            $("footer").html(html_data);
        });
    }

    function DisplayHome()
    {
        console.log("Home Page");

        

        $("#AboutUsButton").on("click", () => 
        {
            location.href = "/about";
        });

        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);

        $("body").append(`
        <article class="container">
            <p id="ArticleParagraph" class="mt-3">This is the Article Paragraph</p>
            </article>`);
    }

    function DisplayAboutPage()
    {
        console.log("About Us Page");
    }

    function DisplayProjectsPage()
    {
        console.log("Our Projects Page");
    }

    function DisplayServicesPage()
    {
        console.log("Our Services Page");
    }

    /**
     * Adds a Contact Object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName, contactNumber, emailAddress)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();

            localStorage.setItem(key, contact.serialize());
        }
    }

    /**
     * This method validates an input text field in the form and displays
     * an error in the message area
     *
     * @param {string} input_field_ID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(input_field_ID, regular_expression, error_message)
    {
        let errorMessage = $("#errorMessage").hide();
        
        $("#" + input_field_ID).on("blur", function()
        {
            let inputFieldText = $(this).val();

            if(!regular_expression.test(inputFieldText))
            {
                $(this).trigger("focus").trigger("select"); 
                errorMessage.addClass("alert alert-danger").text(error_message).show(); 
            }
            else
            {
                errorMessage.removeAttr("class").hide();
            }
        });
    }

    function ContactFormValidation()
    {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]{1,})+([\s,-]([A-Z][a-z]{1,}))*$/,"Please enter a valid Full Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}$/, "Please enter a valid Contact Number.");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }

    function DisplayContactPage()
    {
        console.log("Contact Us Page");

        ContactFormValidation();
        
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function()
        {
            if(subscribeCheckbox.checked)
            { 
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }

    function DisplayContactListPage()
    {
        console.log("Contact-List Page");

        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList");

            let data = ""; // data container -> add deserialized data from the localStorage

            let keys = Object.keys(localStorage); // returns a string array of keys

            let index = 1; // counts how many keys

            // for every key in the keys array (collection), loop
            for (const key of keys) 
            {
                let contactData = localStorage.getItem(key); // get localStorage data value related to the key

                let contact = new core.Contact(); // create a new empty contact object
                contact.deserialize(contactData);

                // inject a repeatable row into the contactList
                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>
                `;

                index++;
            }

            contactList.innerHTML = data;

            $("#addButton").on("click",() =>
            {
                location.href = "/edit#add";
            });

            $("button.delete").on("click", function()
            {
                if(confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val());
                }

                // refresh after deleting
                location.href = "/contact-list";
            });

            $("button.edit").on("click", function()
            {
                location.href = "/edit#" + $(this).val();
            });
        }
    }


    function DisplayEditPage()
    {
        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);

        switch(page)
        {
            case "add":
                {
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
                
                    $("#editButton").on("click", (event)=>
                    {
                        event.preventDefault();
                        // Add Contact
                        AddContact(fullName.value, contactNumber.value, emailAddress.value);
                        // refresh the contact-list page
                        location.href = "/contact-list";
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "/contact-list";
                    });
                }
                break;
            default:
                {
                    // get the contact  info from localStorage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));

                    // display the contact info in the edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    // when editButton is pressed - update the contact
                    $("#editButton").on("click", (event)=>
                    {
                        event.preventDefault();

                        // get any changes from the form
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();

                        // replace the item in localStorage
                        localStorage.setItem(page, contact.serialize());

                        // return to the contact-list
                        location.href = "/contact-list";
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "/contact-list";
                    });
                }
                break;
        }
    }


    function DisplayLoginPage()
    {
        console.log("Login Page");
        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function()
        {
            let success = false;

            // create an empty user object
            let newUser = new core.User();

            // use jQuery shortcut to lod the users.json file
            $.get("./Data/users.json", function(data)
            {
                // for every user in the users.json file, loop
                for (const user of data.users) 
                {
                    // check if the username and password entered matches the user data
                    if(username.value == user.Username && password.value == user.Password)
                    {
                        console.log("conditional passed!");
                        // get the user data from the file and assign it to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                 // if username and password matches..success! -> perform the login sequence
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize());

                    // hide any error message
                    errorMessage.removeAttr("class").hide();

                    // redirect the user to the secure area of the site - contact-list.html
                    location.href = "/contact-list";
                }
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    errorMessage.addClass("alert alert-danger").text("Error: Invalid Login Credentials").show();
                }
            });
        });

        $("#cancelButton").on("click", function()
        {
            // clear the login form
            //document.forms[0].reset();

            // return to the home page
            location.href = "/home";
        });
    }

    function CheckLogin()
    {
        // if user is logged in, then...
        if(sessionStorage.getItem("user"))
        {       
            // swap out the login link for logout
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            );

            $("#logout").on("click", function()
            {
                // perform logout
                sessionStorage.clear();
                
                // redirect back to login page
                location.href = "/login";
            })
                //  insert username between the Contact Us link and the Login/Logout link
                let userName = sessionStorage.getItem("user").split(',')[3];
                let contactListNavbar = $("a:contains('Contact Us')").parent();
                let user = sessionStorage.getItem("user").split(',');
                console.log(user);
                contactListNavbar.after(`<li class="nav-item"><a class="nav-link disabled">${userName}</a></li>`);
        }
    }

    function RegisterField(input_field_ID, regular_expression, error_message)
    {
        let errorMessage = $("#errorMessage").hide();
        
        $("#" + input_field_ID).on("blur", function()
        {
            let inputFieldText = $(this).val();

            if(!regular_expression.test(inputFieldText))
            {
                $(this).trigger("focus").trigger("select"); 
                errorMessage.addClass("alert alert-danger").text(error_message).show(); 
            }
            else
            {
                errorMessage.removeAttr("class").hide();
            }
        });
    }

        
        /**
         * Takes both passwords that user inputted and validates/compares them if both are the same
         *
         * @param {string} password
         * @param {string} validPassword
         * @param {boolean} isValid
         */
        function ValidPassword(password, validPassword)
        {
            let isValid = true;
            let password1 = password.split("");
            let password2 = validPassword.split("");

            if(password1.length == password2.length)
            {
                for(i = 0; i < password2.length; i++)
                {
                    if(password1[i] != password2[i])
                    {
                        console.log("Error. Passwords do not match");
                        isValid = false;
                    }
                }
            }
            else
            {
                isValid = false;
            }
    
            if(isValid == false)
            {
                return isValid;
            }
            else
            {
                return isValid;
            }
        }

    function RegisterFormValidation()
    {
        RegisterField("firstName", /^([A-Z][a-z]{1,})$/,"Error. First Name must be at least 2 characters long.");
        RegisterField("lastName", /^([A-Z][a-z]{1,})$/,"Error. Last Name must be at least 2 characters long.");
        RegisterField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Error. Please enter a valid Email Address.");

        // Taken and thanks to the user at StackOverflow [https://stackoverflow.com/questions/10868308/regular-expression-a-za-z0-9]
        RegisterField("password", /^([a-zA-Z0-9._-]{6,})$/, "Error. Password must be 6 characters long.");
        RegisterField("confirmPassword", /^([a-zA-Z0-9._-]{6,})$/, "Error. Password must be 6 characters long.");

        if(document.getElementById("errorMessage"))
        {
            document.getElementById("errorMessage").id = "errorMessage";
        }
    }

    function DisplayRegisterPage()
    {
        console.log("Register Page");
        $("#contentArea").prepend(`<div id="ErrorMessage">ERROR MESSAGE</div>`);
        $("#ErrorMessage").hide();
        let errorMessage = $("#ErrorMessage");
        emailAddress.text = "Email";
        password.text = "Password";
        RegisterFormValidation(); 
        
        // Registration Page Validation
        $('#submitButton').on("click", function(event)
        {
            EventTarget.preventDefault();
            if(firstName.value != null)
            {
                if(lastName.value != null)
                {
                    if(emailAddress.value != null)
                    {
                        if(password.value != null)
                        {
                            if(ValidPassword(password.value, validPassword.value) == false)
                            {
                                errorMessage.show().addClass("alert alert-danger").text("Error. Passwords do not match");
                                $("#password").trigger("focus");
                                $("#password").trigger("select");
                            }
                            else
                            {
                                let newUser = new User(firstName.value, lastName.value, emailAddress.value, password.value);
                                console.log(newUser.toString() + "\nCreated!");
                                FirstName.value = "";
                                lastName.value = "";
                                emailAddress.value = "";
                                password.value = "";
                                confirmPassword.value = "";
                            }
                        }
                        else
                        {
                            errorMessage.show().addClass("alert alert-danger").text("Error. Password field cannot be empty.");
                            $("#password").trigger("focus");
                            $("#password").trigger("select");    
                        } 
                    }
                    else
                    {
                        errorMessage.show().addClass("alert alert-danger").text("Error. Email Address field cannot be empty.");
                        $("#password").trigger("focus");
                        $("#password").trigger("select");    
                    }
                }
                else
                {
                    errorMessage.show().addClass("alert alert-danger").text("Error. Last Name field cannot be empty.");
                    $("#password").trigger("focus");
                    $("#password").trigger("select");   
                }
            }
                errorMessage.show().addClass("alert alert-danger").text("Error. First Name field cannot be empty.");
                $("#password").trigger("focus");
                $("#password").trigger("select");  
            
        });
    }

    function Display404()
    {

    }

    /**
     * This function returns the appropriate callback function relative to the activeLink
     *
     * @returns {function}
     */
    function ActiveLinkCallBack()
    {
        switch (router.ActiveLink) 
        {
          case "home": return DisplayHome;
          case "about": return DisplayAboutPage;
          case "projects": return DisplayProjectsPage;
          case "services": return DisplayServicesPage;
          case "contact-list": return DisplayContactListPage;
          case "contact": return DisplayContactPage;
          case "edit": return DisplayEditPage;
          case "login": return DisplayLoginPage;
          case "register": return DisplayRegisterPage;
          case "404": return Display404;
          default:
              console.error("ERROR: callback does not exist: " + router.ActiveLink);
              break;
        }
    }

    // named function
    function Start()
    {
        console.log("App Started!!");

        LoadHeader()

        LoadContent();

        LoadFooter();
    }
    
    window.addEventListener("load", Start);
})();