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
        <label class="form-label grey_text" for="form2Example2">Password</label>

        <!-- Forget Password -->
        <label
          class="pwd grey_text"
          data-bs-toggle="modal"
          data-bs-target="#forgetpasswordModal"
          ><u>Forgot Password?</u></label
        >

        <div class="d-flex">
          <input
            type="password"
            id="form2Example2"
            class="form-control"
            v-model="pwd"
            placeholder="Enter Password"
          />
          <span
            class="material-symbols-outlined visible-icon"
            @click="ShowHide()"
            >{{ visible }}</span
          >
        </div>
        <p v-if="invalidPwdInput" class="text-danger">
          {{ invalidPwdMessage }}
        </p>
      </div>

      <!-- Submit button -->
      <button type="button" class="login_btn my-4 p-2" @click="getUserType()">
        Log in
      </button>
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
            <h3 style="text-align: center">Change Password</h3>
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
                        @click="sendEmail()"
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
  </div>
</template>

<script>
// import axios from 'axios'
// import { server } from '@/utils/helper'
export default {
  data() {
    return {
      staff: "admin",
      email: "",
      pwd: "",
      visible: "visibility",
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
