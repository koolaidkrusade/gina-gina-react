import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref as databaseRef, set, get } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

import imageCompression from 'browser-image-compression';
import uuid from 'react-uuid';



// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyD6HrD6znU220A1uED9tNSMysU0x7g4jus',
	authDomain: 'gina-gina.firebaseapp.com',
	databaseURL: 'https://gina-gina-default-rtdb.firebaseio.com',
	projectId: 'gina-gina',
	storageBucket: 'gina-gina.appspot.com',
	messagingSenderId: '940139974013',
	appId: '1:940139974013:web:a04cc66b9803fe7181d014',
	measurementId: 'G-7XP8V32R9H'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

const emailSuffix = '@ginagina.com';

export function signup(userName, password) {
	return createUserWithEmailAndPassword(auth, userName+emailSuffix, password);
}

export function login(userName, password) {
	return signInWithEmailAndPassword(auth, userName+emailSuffix, password);
}

export function logout() {
	return signOut(auth);
}

// Custom Hook
export function useAuth() {
	const [ currentUser, setCurrentUser ] = useState();

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
		return unsub;
	}, [])

	return currentUser;
}

export function writeCurrentCue(cue) {
	set(databaseRef(database, 'public/currentCue'), cue);
}

export function writeUserData(uid, userName, photoURL) {
	set(databaseRef(database, 'users/' + uid), {
		userName: userName,
		role: 'audience',
		profilePicture: photoURL
	});
}

export function createEmptyPostData(postName, emptyReactionData) {
	set(databaseRef(database, 'public/posts/' + postName), {
		reactions: emptyReactionData
	});
}

export function writeUserReactions(postName, userUID, updateReaction, currentReaction) {
	set(databaseRef(database, 'users/' + userUID + '/reactions/' + postName), updateReaction);
	if(currentReaction !== null) {
		const currentReactionRef = databaseRef(database, 'public/posts/' + postName + '/reactions/' + currentReaction);
		get(currentReactionRef).then((snapshot) => {
			if(snapshot.exists()) set(currentReactionRef, Math.max(snapshot.val()-1, 0));
		});
		if(updateReaction !== 'none') {
			const updateReactionRef = databaseRef(database, 'public/posts/' + postName + '/reactions/' + updateReaction);
			get(updateReactionRef).then((snapshot) => {
				if(snapshot.exists()) set(updateReactionRef, Math.max(snapshot.val()+1, 0));
			});
		}
	}
}

export function resetAllPostData() {
	set(databaseRef(database, 'public/posts/'), {} );
}

export function writeComment(postName, userUID, comment) {
	set(databaseRef(database, 'public/posts/' + postName + '/comments/' + Date.now()), {
		userUID: userUID,
		comment: comment
	});
}

// Storage
export async function upload(file, setPhotoURL, setIsLoading, setIsUploading) {
	
	console.log('originalFile instanceof Blob', file instanceof Blob); // true
	console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

	setIsLoading(true);
	setIsUploading(true);

	const options = {
		maxSizeMB: 0.2,
		maxWidthOrHeight: 200,
		useWebWorker: true
	}
	try {
		const compressedFile = await imageCompression(file, options);
		console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
		console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
		
		const fileRef = storageRef(storage, uuid() + '.png');
		// const snapshot = await uploadBytes(fileRef, compressedFile);
		await uploadBytes(fileRef, compressedFile);
		const photoURL = await getDownloadURL(fileRef);
		setPhotoURL(photoURL);
		const timer = setTimeout(() => {
			setIsUploading(false);
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	} catch (error) {
		console.log(error);
		setIsUploading(false);
		setIsLoading(false);
	}
}