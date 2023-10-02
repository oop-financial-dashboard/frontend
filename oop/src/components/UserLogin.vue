<template>
    <div class="login">
        <form>
            <div class="logo">
                <img src="../assets/GSLogo.png" alt="Vue" class="app_logo">
            </div>
            <!-- <p class="pb-1">Goldman Sachs</p> -->
            <h3>Welcome Back</h3>
            <p>Enter your email and password below</p>
            <!-- Email input -->
            <div class="form-outline mb-4">
                <label class="form-label" for="form2Example1">Email</label>
                <input type="email" id="form2Example1" class="form-control" v-model="email"/>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <label class="form-label" for="form2Example2">Password</label>
                <label class="pwd" @click="ForgetPassword">Forget Password ?</label>
                <div class="d-flex">
                    <input type="password" id="form2Example2" class="form-control" v-model="pwd"/>
                    <span class="material-symbols-outlined" @click="ShowHide()">{{visible}}</span>
                </div>
            </div>

            <!-- Submit button -->
            <button type="button" class="login_btn my-4 p-2" @click="getUserType()">Log in</button>
        </form>
    </div>
</template>

<script>
// import axios from 'axios'
// import { server } from '@/utils/helper'
export default {
    data () {
        return {
            staff: 'admin',
            email: '',
            pwd: '',
            visible: 'visibility'
        }
    },
    methods: {
        getUserType() {
            localStorage.setItem("usertype", this.staff)
            // sessionStorage.setItem("staff_id", staff.staff_id)
            this.$router.push('/consumption')
        },
        ForgetPassword() {
            this.$router.push('/forget_password')
        },
        ShowHide() {
            var x = document.getElementById("form2Example2")
            if (this.visible == 'visibility_off') {
                this.visible = 'visibility'
                x.type = 'password'
            } else {
                this.visible = 'visibility_off'
                x.type = 'text'
            }
        }
    }
}
</script>

<style scoped>
.login {
    width: 100%;
    height: 100vh;
    /* background: var(--primary); */
    /* background-color: #7399C6; */
    background-color: rgba(115, 153, 198, 0.5)
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
.login_btn {
    width: 100%;
    background-color: #7399C6;
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
</style>