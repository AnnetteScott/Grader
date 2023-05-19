import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { Auth, Unsubscribe, User } from 'firebase/auth';
import { getFirestore, onSnapshot, doc, setDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import router from '@/router'
import { UserData } from './types';

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
	fireStoreUnsubscribe: Unsubscribe | undefined;
	db: Firestore; // Firestore database
	user = ref(null) as Ref<User | null>; //User
    dataBase = reactive({}) as UserData; // User data

    fireStorePath = '';

	constructor () {
		// Initialize Firebase.
		this.app = initializeApp(this.firebaseConfig);

        // Initialize Firestore.
		this.db = getFirestore(this.app)

		// Initialize Firebase Authentication and get a reference to the service.
		this.auth = getAuth(this.app);
		this.authUnsubscribe = onAuthStateChanged(this.auth, (user) => {
			this.user.value = user;
            
            if(this.user.value){
                this.fireStorePath = `${this.user.value.uid}/Grader`

                this.fireStoreUnsubscribe?.();

                this.fireStoreUnsubscribe = onSnapshot(doc(this.db, this.fireStorePath), async (doc) => {
                    Object.assign(this.dataBase, doc.data())
                    console.log(doc.data())
                    if(doc.data() == undefined || Object.keys(this.dataBase).length == 0){
                        await this.updateDataBase(new UserData())
                    }
                    console.log(this.dataBase)
                });
            }else{
                this.fireStoreUnsubscribe?.();
                Object.assign(this.dataBase, {})
                router.push({name: 'Login'});
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
        if(this.user === null || bypass){
            return;
        }

        dataBase.semesters.forEach((semester) => {
            semester.courses.forEach((courses) => {
                courses.assessments.sort((a, b) => a.dueDate > b.dueDate ? 1 : -1)
            })
        })

        await setDoc(doc(this.db, this.fireStorePath), {
            ...dataBase
        });
    }
}

export default Firebase.getInstance();
