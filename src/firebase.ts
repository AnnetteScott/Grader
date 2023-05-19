import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { Auth, Unsubscribe, User } from 'firebase/auth';
import { getFirestore, onSnapshot, doc, setDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

class Firebase {
	static instance: Firebase;
	private firebaseConfig = {
		apiKey: "AIzaSyBg2RJIEZNlj1N5EJzTKd8emeku_w-VOhM",
		authDomain: "grader-dccee.firebaseapp.com",
		projectId: "grader-dccee",
		storageBucket: "grader-dccee.appspot.com",
		messagingSenderId: "127382055466",
		appId: "1:127382055466:web:fc8c843837f85a992a7153"
	};
	app: FirebaseApp;
	auth: Auth;
	authUnsubscribe: Unsubscribe;
	fireStoreUnsubscribe: Unsubscribe;
	db: Firestore; // Firestore database
	user = ref(null) as Ref<User | null>; //User
	dataBase = reactive({}); // User data

	fireStorePath = '';

	constructor () {
		// Initialize Firebase.
		this.app = initializeApp(this.firebaseConfig);

		// Initialize Firestore.
		this.db = getFirestore(this.app)

		this.fireStoreUnsubscribe = {} as Unsubscribe;

		// Initialize Firebase Authentication and get a reference to the service.
		this.auth = getAuth(this.app);
		this.authUnsubscribe = onAuthStateChanged(this.auth, (user) => {
			this.auth = getAuth(this.app);
			this.user.value = user;
			
			if(this.user.value){
				this.fireStorePath = `${this.user.value.uid}/DashBooks`

				try {
					this.fireStoreUnsubscribe();
				} catch (error) {
					//console.warn(error)
				}

				this.fireStoreUnsubscribe = onSnapshot(doc(this.db, this.fireStorePath), async (doc) => {
					Object.assign(this.dataBase, doc.data())
					if(Object.keys(this.dataBase).length === 0){
						const newItem = {};
						await this.updateDataBase(newItem)
					}
					console.log(this.dataBase)
				});
			}else{
				try {
					this.fireStoreUnsubscribe();
					Object.assign(this.dataBase, {})
				} catch (error) {
					//console.warn(error)
				}
			}
		});
		
	}

	/**
	 * Get a reference to the singleton instance of the Firebase class.
	 */
	static getInstance (): Firebase {
		if (!Firebase.instance) {
			Firebase.instance = new Firebase();
		}
		return Firebase.instance;
	}

	async updateDataBase(dataBase = this.dataBase, bypass = false){
		if(this.user === null || !bypass){
			return;
		}
		await setDoc(doc(this.db, this.fireStorePath), {
			...dataBase
		})
	}
}

export default Firebase.getInstance();
