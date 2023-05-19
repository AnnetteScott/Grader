<script lang="ts">
import { defineComponent } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth"
import Firebase from '@/firebase'

export default defineComponent({
	name: 'LoginUser',
	data() {
		return {
			email: '',
			password: '',
			showPassword: false,
            authUnsubscribe: {} as Unsubscribe
		};
	},
    mounted(){
        this.authUnsubscribe = onAuthStateChanged(Firebase.auth, (user) => {
            if(user){
                if(this.$route.query.redirect){
                    this.$router.push(this.$route.query.redirect as string);
                }else{
                    this.$router.push({name: 'DashBoard'});
                }
            }
		});
    },
	methods: {
		login() {
			signInWithEmailAndPassword(Firebase.auth, this.email, this.password)
			.then(() => {
			})
			.catch((error) => {
				const errorCode = error.code;
				console.warn(errorCode)
			});
		}
	}
})

</script>

<template>
	<main>
		<div class="inner">
			<form @submit.prevent="login()">
				<fieldset>
					<h2>Login</h2>
					<label for="email">
						Email
						<input id="email" type="email" v-model="email" required autocomplete="on">
					</label>
					<label for="password">
						Password
						<div>
							<input id="password" name="password" :type="showPassword ? 'text' : 'password'" v-model="password" required autocomplete="on">
							<button class="icon_button" @click.prevent="(showPassword = !showPassword)">
								<div class="material-symbols-rounded" :title="showPassword ? 'Hide password' : 'Show password'">
									{{ showPassword ? 'visibility_off' : 'visibility' }}
								</div>
							</button>
						</div>
					</label>
					<button type="submit">Login</button>
				</fieldset>
				<fieldset style="align-items: center;gap: 0.5rem;">
					<RouterLink :to="{name: 'Register', query: { redirect: $route.query.redirect }}">Create account</RouterLink>
					<RouterLink to="/register">Forgot password?</RouterLink>
				</fieldset>
			</form>
		</div>
	</main>
</template>

<style scoped>
main > .inner {
	display: flex;
	flex-flow: column wrap;
	gap: 2rem;
	margin: auto;
}
form {
	display: flex;
	flex-flow: column wrap;
	gap: 2rem;
	margin: auto;
}
fieldset {
	display: flex;
	flex-flow: column wrap;
	gap: 1rem;
	padding: 1.1rem 1.5rem 1.5rem;
	background-color: white;
	border: unset;
	border-radius: 30px;
	box-shadow:
		0px -4px 2px 0 #0006 inset,
		0 3px 10px 0 #0006;
}
fieldset h2 {
	color: #881247;
	line-height: 1em;
}
label {
	display: flex;
	flex-flow: column wrap;
}
label > div {
	display: flex;
	flex-flow: row nowrap;
	gap: 1ch;
}
</style>
