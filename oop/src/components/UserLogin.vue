<template>
  <div class="login">
    <form>
      <div class="logo">
        <img src="../assets/GSLogo.png" alt="Vue" class="app_logo" />
      </div>

      <h3>Welcome Back</h3>
      <p class="grey_text">Enter your email and password below</p>
      <!-- Email input -->
      <div class="form-outline mb-4">
        <label class="form-label grey_text" for="form2Example1">Email</label>
        <input
          type="email"
          id="form2Example1"
          class="form-control"
          v-model="email"
          placeholder="Enter Email Address"
        />
        <p v-if="invalidEmailInput" class="text-danger">
          {{ invalidEmailMessage }}
        </p>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">

        <div class="row d-flex">
          <label class="form-label grey_text col" for="form2Example2">Password</label>

          <!-- Forget Password -->
          <label
            class="pwd grey_text col d-flex justify-content-lg-end justify-content-md-start"
            data-bs-toggle="modal"
            data-bs-target="#forgetpasswordModal"
            ><u>Forget Password?</u></label
          >
        </div>
        

        <div class="d-flex">
          <input
            type="password"
            id="form2Example2"
            class="form-control"
            v-model="pwd"
            placeholder="Enter Password"
          />
          <span class="material-symbols-outlined" @click="ShowHide()">{{
            visible
          }}</span>
        </div>
        <p v-if="invalidPwdInput" class="text-danger">
          {{ invalidPwdMessage }}
        </p>
      </div>

      <!-- Submit button -->
      <button type="button" class="login_btn my-4 p-2" @click="getUserType()">
        Log in
      </button>
      <p
        class="grey_text"
        data-bs-toggle="modal"
        data-bs-target="#registerModal"
      >
        Don't have an account? 
        <!-- <u>Register</u> -->
        <a href="#registerModal" class="pe-auto">Register</a>
      </p>
    </form>

    <!-- modal for forget pw -->
    <div
      class="modal fade"
      id="forgetpasswordModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 style="text-align: center">Forget Password</h3>
            <button
              type="btn"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-hidden="true"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <div class="panel panel-default">
                <div class="panel-body">
                  <p>
                    If you have forgotten your password you can reset it here.
                  </p>
                  <div class="panel-body">
                    <fieldset>
                      <div class="form-group row">
                        <label for="forgetPw" class="col-sm-2 col-form-label"
                          >Email</label
                        >
                        <div class="col-sm-10">
                          <input
                            type="email"
                            class="form-control"
                            id="forgetPw"
                            placeholder="Enter Email Address"
                            v-model="email"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        class="send_btn my-4 p-2"
                        @click="ForgetPassword()"
                        id="close"
                      >
                        Send Password
                      </button>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for registration -->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 style="text-align: center">Register</h3>
            <button
              type="btn"
              class="btn-close"
              id="btnclose"
              data-bs-dismiss="modal"
              aria-hidden="true"
              aria-label="Close"
              @click="closeModal()"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <div class="panel panel-default">
                <div class="panel-body">
                  <div class="panel-body">
                    <fieldset class="container">
                      <div class="form-group">
                        <div class="row mb-4">
                          <label for="reg" class="col-sm-3 col-form-label"
                            >First Name:</label
                          >
                          <div class="col-sm-9">
                            <input
                              type="text"
                              class="form-control"
                              id="reg"
                              v-model="firstName"
                              placeholder="Enter First Name"
                            />
                          </div>
                        </div>
                        
                        <div class="row mb-4">
                          <label for="reg" class="col-sm-3 col-form-label"
                            >Last Name:</label
                          >
                          <div class="col-sm-9">
                            <input
                              type="text"
                              class="form-control"
                              id="reg"
                              v-model="lastName"
                              placeholder="Enter Last Name"
                            />
                          </div>
                        </div>

                        <div class="row mb-4">
                          <label for="reg" class="col-sm-3 col-form-label"
                            >Email:</label
                          >
                          <div class="col-sm-9">
                            <input
                              type="email"
                              class="form-control"
                              id="regEmail"
                              v-model="regEmail"
                              placeholder="Enter Email Address"
                            />
                            <div v-if="emailError" class="text-danger">{{ emailError }}</div>
                          </div>
                        </div>
                        

                        <div class="row mb-4">
                          <label for="regPassword" class="col-sm-3 col-form-label">Password:</label>
                          <div class="col-sm-9">
                            <div class="d-flex">
                              <input
                                type="password"
                                class="form-control"
                                id="regPassword"
                                v-model="regPassword"
                                placeholder="Enter Password"
                              /><span class="material-symbols-outlined" @click="ShowHide2()">{{
                                visible
                              }}</span>

                            </div>
                            
                            <div v-if="passwordError" class="text-danger">{{ passwordError }}</div>
                            
                          </div>
                          
                        </div>
                        

                        <button
                          type="button"
                          class="send_btn my-4 p-2"
                          @click="validateEmail(); Register()"
                          id="closeReg"
                        >
                          Register
                        </button>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import $ from 'jquery';
// import { server } from '@/utils/helper'
export default {
  data() {
    return {
      staff: "admin",
      email: "",
      pwd: "",
      visible: "visibility",
      firstName: "",
      lastName: "",
      msg: "",
      regEmail: "",
      regPassword: "",
      passwordError: null,
      emailError: null,
      invalidEmailInput: false,
      invalidPwdInput: false,
      invalidEmailMessage: "",
      invalidPwdMessage: "",
      invalidMessages: ["This blank cannot be empty", "Invalid email entered"],
    };
  },
  methods: {
    getUserType() {
        this.invalidEmailInput = false; // Reset validation flags
        this.invalidPwdInput = false;

        // if email is blank:
        if (this.email == "") {
          this.invalidEmailInput = true;
          this.invalidEmailMessage = this.invalidMessages[0];
        } else if (this.email && !this.email.includes("@")) {
          console.log("hi");
          this.invalidEmailInput = true;
          this.invalidEmailMessage = this.invalidMessages[1];
        }
        if (this.pwd == "") {
          this.invalidPwdInput = true;
          this.invalidPwdMessage = this.invalidMessages[0];
        } else if (
          this.invalidEmailInput == false &&
          this.invalidPwdInput == false
        ) {
          localStorage.setItem("usertype", this.staff);
          // sessionStorage.setItem("staff_id", staff.staff_id)
          this.$router.push("/home");
        }
      },
    show(group, title="", text, type = "") {
      notify({
        group,
        title,
        type,
        text
      });
    },
    getUserType() {
      localStorage.setItem("usertype", this.staff);
      // sessionStorage.setItem("staff_id", staff.staff_id)
      this.$router.push("/home");
    },
    ForgetPassword() {
      this.$router.push("/forget_password");
    },
    ShowHide() {
      var x = document.getElementById("form2Example2");
      if (this.visible == "visibility_off") {
        this.visible = "visibility";
        x.type = "password";
      } else {
        this.visible = "visibility_off";
        x.type = "text";
      }
    },
    ShowHide2() {
      var x = document.getElementById("regPassword");
      if (this.visible == "visibility_off") {
        this.visible = "visibility";
        x.type = "password";
      } else {
        this.visible = "visibility_off";
        x.type = "text";
      }
    },
    Register() {
      // Reset error messages at the beginning
      this.emailError = null;
      this.passwordError = null;

      // Validate both email and password
      const emailValid = this.validateEmail();
      const passwordValid = this.isPasswordValid();

      // Check if there are any validation errors
      if (!emailValid || !passwordValid) {
        return; // Do not proceed with registration if there are errors
      }

      axios
        .post(`/auth/register`, {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.regEmail,
          password: this.regPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            this.show(
              "notification",
              "Success",
              "Successful registration! Please check your inbox.",
              "success"
            );
            this.closeModal();
          }
        })
        .catch((error)=>{
          console.log(error)
           this.show(
              "notification",
              "Error",
              "Oh no, something went wrong! Please try again later.",
              "error"
            );
            this.closeModal();
        });

        // After successful registration or error handling, reset the passwordError
      this.passwordError = null;
    },
    isPasswordValid() {
      if (this.regPassword.length < 8 || this.regPassword.length > 25) {
        this.passwordError = "Password must be between 8 and 25 characters.";
        return false;
      }

      if (!/[A-Z]/.test(this.regPassword) || !/[a-z]/.test(this.regPassword)) {
        this.passwordError = "Password must contain both uppercase and lowercase letters.";
        return false;
      }

      if (!/\d/.test(this.regPassword)) {
        this.passwordError = "Password must include at least 1 numeral.";
        return false;
      }

      if (!/[!@#$%^&*]/.test(this.regPassword)) {
        this.passwordError = "Password must include at least 1 symbol.";
        return false;
      }

      // Password is valid
      this.passwordError = null;
      return true;
    },
    validateEmail() {
      if (!this.regEmail) {
        this.emailError = "Email is required.";
        return false;
      } else {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(this.regEmail) || !this.regEmail.includes("@")) {
          this.emailError = "Please enter a valid email address.";
        } else {
          this.emailError = null;
        }
      }

      // Email is valid
      return this.emailError === null;
    },
    closeModal(){
      $('#btnclose').trigger('click');
      this.firstName = "";
      this.lastName = "";
      this.regEmail = "";
      this.regPassword = "";
      this.passwordError = null;
      this.emailError = null;
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/client-centric-banking.jpg");
  background-size: cover;
  /* background: var(--primary); */
  /* background-color: #7399C6; */
  /* background-color: rgba(115, 153, 198, 0.5) */
}

.logo {
  margin-bottom: 1rem;
}
.app_logo {
  width: 80px;
}
p {
  font-size: 14px;
}
form {
  width: 25%;
  background-color: var(--lighter-grey-alt);
  padding: 40px;
  border-radius: 5px;
  text-align: center;
  margin: 10% auto;
}
.form-outline {
  text-align: left;
}
.login_btn,
.send_btn {
  width: 100%;
  background-color: #7399c6;
  color: white;
  border-radius: 5px;
}
.pwd {
  font-size: 12px;
  float: right;
  cursor: pointer;
}
.material-symbols-outlined {
  margin-left: -45px;
  padding: 8px;
}

.grey_text {
  color: var(--light-grey);
}

.modal {
  top: 25%;
}
.visible-icon {
  cursor: pointer;
}
</style>
