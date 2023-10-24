<template>
  <div class="reset_password p-3">
    <!-- Form -->
    <form class="shadow-lg p-3 py-5">
      <h4 class="pb-2">Change Password</h4>
      <p class="grey_text">Enter your passwords below</p>

      <!-- Old password input -->
      <div class="form-outline mb-4">
        <label class="form-label grey_text" for="formExample1"
          >Old Password</label
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
      </div>

      <!-- Submit button -->
      <button
        type="button"
        class="reset_btn my-4 p-2"
        @click="ChangePassword()"
      >
        Reset Password
      </button>
      <div id="incorrect_text"></div>
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
    isPasswordValid() {
      if (this.regPassword.length < 8 || this.regPassword.length > 25) {
        this.passwordError = "Password must be between 8 and 25 characters.";
        return false;
      }

      if (!/[A-Z]/.test(this.regPassword) || !/[a-z]/.test(this.regPassword)) {
        this.passwordError =
          "Password must contain both uppercase and lowercase letters.";
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
