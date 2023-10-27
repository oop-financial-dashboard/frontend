<template>
  <div class="reset_password p-3">
    <!-- Form -->
    <form class="shadow-lg p-3 py-5">
      <h4 class="pb-2">Change Password</h4>
      <p class="grey_text">Enter your passwords below</p>

      <!-- Old password input -->
      <div class="form-outline mb-4">
        <label class="form-label grey_text" for="formExample1"
          >Current Password</label
        >
        <div class="d-flex">
          <input
            type="password"
            id="formExample1"
            class="form-control"
            v-model="currentPassword"
            placeholder="Password"
          />
          <span
            class="material-symbols-outlined"
            for="formExample1"
            id="eye"
            @click="ShowHide('formExample1', 'eye')"
            >visibility</span
          >
        </div>
        <div v-if="currentPasswordError" class="text-danger">
          {{ currentPasswordError }}
        </div>
      </div>

      <!-- New password input -->
      <div class="form-outline mb-4">
        <label class="form-label grey_text" for="formExample2"
          >New Password</label
        >
        <div class="d-flex">
          <input
            type="password"
            id="formExample2"
            class="form-control"
            v-model="newPassword"
            placeholder="Password"
          />
          <span
            class="material-symbols-outlined"
            for="formExample2"
            id="eye1"
            @click="ShowHide('formExample2', 'eye1')"
            >visibility</span
          >
        </div>
        <div v-if="newPasswordError" class="text-danger">
          {{ newPasswordError }}
        </div>
      </div>

      <!-- Confirm Password input -->
      <div class="form-outline mb-4">
        <label class="form-label grey_text" for="formExample3"
          >Confirm New Password</label
        >
        <div class="d-flex">
          <input
            type="password"
            id="formExample3"
            class="form-control"
            v-model="confirmPassword"
            placeholder="Password"
          />
          <span
            class="material-symbols-outlined"
            for="formExample3"
            id="eye2"
            @click="ShowHide('formExample3', 'eye2')"
            >visibility</span
          >
        </div>
        <div v-if="confirmPasswordError" class="text-danger">
          {{ confirmPasswordError }}
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="button"
        class="reset_btn my-4 p-2"
        @click="ChangePassword()"
      >
        Reset Password
      </button>
      <!-- <div id="incorrect_text"></div> -->
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";

export default {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      visible: "visibility",
      msg: "",
      currentPasswordError: null, // Error message for current password
      newPasswordError: null,     // Error message for new password
      confirmPasswordError: null, // Error message for confirm password
    };
  },
  methods: {
    ShowHide(id, visible) {
      var x = document.getElementById(id);
      var y = document.getElementById(visible);
      if (y.innerHTML == "visibility_off") {
        y.innerHTML = "visibility";
        x.type = "password";
      } else {
        y.innerHTML = "visibility_off";
        x.type = "text";
      }
    },
    ChangePassword() {
      const token = sessionStorage.getItem("token");

      this.currentPasswordError = null;
      this.newPasswordError = null;
      this.confirmPasswordError = null;

      const currentpasswordValid = this.currentpwValid(this.currentPassword);
      const newpasswordValid = this.newpwValid(this.newPassword);

      if (this.newPassword === this.currentPassword) {
      this.newPasswordError = "Current password cannot be the same as the new password.";
      return;
      } 
      const confirmpasswordValid = this.confirmpwValid(this.confirmPassword);

      const matchpasswordValid = this.validateConfirmPassword(this.newPassword,this.confirmPassword);
      console.log(currentpasswordValid, newpasswordValid, confirmpasswordValid, matchpasswordValid)

      if (!currentpasswordValid || !newpasswordValid || !confirmpasswordValid || !matchpasswordValid) {
        return; // Do not proceed with registration if there are errors
      }

      console.log("helllo over here")

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const toSend = {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmationPassword: this.confirmPassword,
        };
        console.log(toSend);

        axios
          .patch(`users/change-password`, toSend, config)
          .then((response) => {
            console.log(response.data);
            if (response.status === 200) {
              this.show(
                "notification",
                "Password changed successfully",
                "",
                "success"
              );
            this.$router.push("/");
            }
          })
          .catch((error) => {
            if (error.response.status === 403) {
              // Handle the 403 Forbidden status here
              this.currentPasswordError = "Incorrect current password.";
            } else {
              // Handle other error cases
              this.show(
                "notification",
                "Error",
                "Oh no, something went wrong! Please try again later.",
                "error"
              );
            }
          });
      } catch (e) {
        this.show(
          "notification",
          "Error",
          "Oh no, something went wrong! Please try again later.",
          "error"
        );
      }

      console.log("here");

      /*
            // if (this.newpwd != this.pwdconfirm) {
            //     document.getElementById('incorrect_text').innerHTML =
            //         'New password did not match. Please try again.';
            // } else {
                // document.getElementById('incorrect_text').innerHTML = '';
                axios
                    .post(`users/change-password`, {
                        currentPassword: this.currentPassword,
                        newPassword: this.newPassword,
                        confirmationPassword: this.confirmationPassword,
                    })

                    .then((response) => {
                        console.log(response.data);
                        // sessionStorage.setItem('user_email', this.email);
                        // sessionStorage.setItem('msg', response.data.message);
                        // this.$router.push('/settings');
                    })
                    .catch((e) => {
                        console.log(e.response.data.message);
                        // this.msg = e.response.data.message;
                        // if (Array.isArray(this.msg)) {
                        //     this.errors = '';
                        //     for (var i = 0; i < this.msg.length; i++) {
                        //         this.errors += this.msg[i] + '\n';
                        //     }
                        //     document.getElementById(
                        //         'incorrect_text',
                        //     ).innerHTML = this.errors;
                        // } else {
                        //     document.getElementById(
                        //         'incorrect_text',
                        //     ).innerHTML = this.msg;
                        // }
                    });
            // }
            */
    },
    currentpwValid(pw) {
      if (pw.length < 8 || pw.length > 25) {
        this.currentPasswordError = "Password must be between 8 and 25 characters.";
        return false;
      }

      if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
        this.currentPasswordError =
          "Password must contain both uppercase and lowercase letters.";
        return false;
      }

      if (!/\d/.test(pw)) {
        this.currentPasswordError = "Password must include at least 1 numeral.";
        return false;
      }

      if (!/[!@#$%^&*]/.test(pw)) {
        this.currentPasswordError = "Password must include at least 1 symbol.";
        return false;
      }

      // Password is valid
      this.currentPasswordError = null;
      return true;
    },

    newpwValid(pw) {
      if (pw.length < 8 || pw.length > 25) {
        this.newPasswordError = "Password must be between 8 and 25 characters.";
        return false;
      }

      if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
        this.newPasswordError =
          "Password must contain both uppercase and lowercase letters.";
        return false;
      }

      if (!/\d/.test(pw)) {
        this.newPasswordError = "Password must include at least 1 numeral.";
        return false;
      }

      if (!/[!@#$%^&*]/.test(pw)) {
        this.newPasswordError = "Password must include at least 1 symbol.";
        return false;
      }

      // Password is valid
      this.newPasswordError = null;
      return true;
    },

    confirmpwValid(pw) {
      if (pw.length < 8 || pw.length > 25) {
        this.confirmPasswordError = "Password must be between 8 and 25 characters.";
        return false;
      }

      if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
        this.confirmPasswordError =
          "Password must contain both uppercase and lowercase letters.";
        return false;
      }

      if (!/\d/.test(pw)) {
        this.confirmPasswordError = "Password must include at least 1 numeral.";
        return false;
      }

      if (!/[!@#$%^&*]/.test(pw)) {
        this.confirmPasswordError = "Password must include at least 1 symbol.";
        return false;
      }

      // Password is valid
      this.confirmPasswordError = null;
      return true;
    },

    validateConfirmPassword(newPassword, confirmPassword) {
      if (newPassword !== confirmPassword) {
        this.confirmPasswordError = "Passwords do not match.";
        return false;
      }
      return true; // Passwords match
    },

    show(group, title = "", text, type = "") {
      notify({
        group,
        title,
        type,
        text,
      });
    },
  },
};
</script>

<style scoped>
.reset_password {
  width: 100%;
  height: 100vh;
}

p {
  font-size: 14px;
}

form {
  width: 30%;
  background-color: var(--lighter-grey-alt);
  padding: 40px;
  border-radius: 5px;
  text-align: center;
  margin: auto;
  margin-top: 10%;
}

.form-outline {
  text-align: left;
}

.reset_btn {
  width: 100%;
  background-color: #7399c6;
  color: white;
  border-radius: 5px;
}

.pwd {
  font-size: 12px;
  float: right;
}

.material-symbols-outlined {
  margin-left: -45px;
  padding: 8px;
}

#incorrect_text {
  color: red;
}

.grey_text {
  color: var(--light-grey);
}

input::placeholder {
  color: var(--light-grey);
}
</style>
