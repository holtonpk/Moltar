"use client";
import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  useRef,
} from "react";

// import nookies from "nookies";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  signInWithPopup,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
  deleteUser,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import {
  getDownloadURL,
  ref,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";

import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {db, auth, app} from "@/config/firebase";
import {PlansType} from "@/types/index";
import emailjs from "@emailjs/browser";
interface DeleteAccountResponse {
  success?: string;
  error?: string;
}

interface AuthContextType {
  currentUser: UserData | undefined;
  signIn: (email: string, password: string) => Promise<any>;
  createAccount: (
    email: string,
    name: {first: string; last: string},
    password: string
  ) => Promise<{success: boolean; user?: FirebaseUser; error?: string}>;
  logInWithGoogle: () => Promise<any>;
  logOut: () => Promise<void>;
  changeUserPassword: (currentPassword: string, newPassword: string) => any;
  changeUserEmail: (currentPassword: string, newEmail: string) => any;
  changeUserDisplayName: (newName: string) => any;
  resetPassword: () => any;
  uploadProfilePicture: (file: File) => any;
  changeProfilePicture: (url: string) => any;
  DeleteAccount: () => Promise<DeleteAccountResponse>;
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;
  newUser: boolean;
  setNewUser: (value: boolean) => void;
  unSubscribedUserId: string | null;
  showEmailVerificationModal: boolean;
  setShowEmailVerificationModal: (value: boolean) => void;
  email: string;
  VerifyEmail: (code: string, uId: string) => any;
  sendVerificationEmail: (to_name: string, to_email: string) => any;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const emailRef = React.createRef();

export function useAuth() {
  return useContext(AuthContext);
}

export interface UserData extends FirebaseUser {
  firstName: string;
  lastName: string;
  photoURL: string;
  stripeId: string;
  userPlan: PlansType | undefined;
  welcome_intro: boolean;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<UserData | undefined>(
    undefined
  );

  const [unSubscribedUserId, setUnSubscribedUserId] = useState<string | null>(
    null
  );

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [newUser, setNewUser] = React.useState(true);
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(true);
  const [email, setEmail] = useState("");

  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);

  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("unSubscribedUserId"))
        setUnSubscribedUserId(
          localStorage.getItem("unSubscribedUserId") as string
        );
      else {
        const uId = Math.random().toString(36).substring(2, 14);
        localStorage.setItem("unSubscribedUserId", uId);
        setUnSubscribedUserId(uId);
      }
    }
  }, [rerender, currentUser]);

  // convert unSubscribedUserId to a user

  // const router = useRouter();

  const defaultProfilePictures: string[] = [
    "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/profile%20picture%2F1%20(1).png?alt=media&token=103606ce-edfe-4693-a259-b73c527b0a11",
    "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/profile%20picture%2F2.png?alt=media&token=8787d9db-f898-4738-9abb-a3e356e23e74",
    "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/profile%20picture%2F3%20(1).png?alt=media&token=84c7e20e-b2da-43ee-9d33-95234516ac45",
  ];

  // Function to pick a random image URL from the array
  function getRandomImageUrl(): string {
    const randomIndex = Math.floor(
      Math.random() * defaultProfilePictures.length
    );
    return defaultProfilePictures[randomIndex] as string;
  }

  async function createAccount(
    email: string,
    name: {first: string; last: string},
    password: string
  ): Promise<{success: boolean; user?: FirebaseUser; error?: string}> {
    try {
      const account = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserStorage(account?.user.uid, name, email);
      return {success: true, user: account.user};
    } catch (error: any) {
      return {error: error.code, success: false};
    }
  }

  function signIn(email: string, password: string) {
    const login = signInWithEmailAndPassword(auth, email, password)
      .then((value: any) => {
        return {success: value};
      })
      .catch((error: any) => {
        return {error: error.code};
      });
    return login;
  }

  async function logOut() {
    try {
      await signOut(auth);
      setCurrentUser(undefined);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async function logInWithGoogle(): Promise<{success?: any; error?: any}> {
    try {
      const result = await signInWithPopup(
        auth,
        new GoogleAuthProvider().setCustomParameters({prompt: "select_account"})
      );
      if (result.user) {
        createUserStorage(
          result.user.uid,
          {
            first: result.user?.displayName?.split(" ")[0] || "",
            last: result.user?.displayName?.split(" ")[1] || "",
          },
          result.user.email || "",
          result.user.photoURL || undefined
        );
        return {success: result};
      } else {
        return {error: result};
      }
    } catch (error: any) {
      return {error};
    }
  }

  const DeleteAccount = async (): Promise<DeleteAccountResponse> => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await deleteDoc(userRef);
        await deleteUser(auth.currentUser as FirebaseUser);
        return {success: "Account deleted successfully."};
      } catch (error) {
        return {success: "failed to delete account"};
      }
    } else {
      return {success: "failed to delete account"};
    }
  };

  const createUserStorage = async (
    uid: string,
    name: {first: string; last: string},
    email: string,
    photoUrl?: string
  ) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName: name.first,
        lastName: name.last,
        email: email,
        photoURL: photoUrl || (getRandomImageUrl() as string),
        uid: uid,
        welcome_intro: false,
      });
    }

    if (!auth.currentUser?.displayName) {
      await updateProfile(auth.currentUser as FirebaseUser, {
        displayName: `${name.first} ${name.last}`,
      });
    }

    //  merge the data of the unsubscribed user to the new user
    if (unSubscribedUserId) {
      copyDocuments(uid);
      // localStorage.removeItem("unSubscribedUserId");
      // setUnSubscribedUserId(null);
    }
    // if (!user.photoURL) {
    //   const profileUrl = getRandomImageUrl() as string;
    //   updateProfile(user, {
    //     photoURL: profileUrl,
    //   });
    // }
  };

  const copyDocuments = async (newUserId: string) => {
    if (!unSubscribedUserId) return;

    try {
      const unSubscribedUserRef = doc(db, "users", unSubscribedUserId);
      const unSubscribedUserSnap = await getDoc(unSubscribedUserRef);
    } catch (error) {}

    try {
      const unSubscribedUserUploadsRef = collection(
        db,
        `users/${unSubscribedUserId}/uploads`
      );
      const unSubscribedUserUploadsSnap = await getDocs(
        unSubscribedUserUploadsRef
      );

      for (const docSnap of unSubscribedUserUploadsSnap.docs) {
        if (docSnap.exists()) {
          const newDocRef = doc(db, `users/${newUserId}/uploads`, docSnap.id);
          await setDoc(newDocRef, docSnap.data());
        }
      }
    } catch (error) {}

    try {
      const unSubscribedUserProjectsRef = collection(
        db,
        `users/${unSubscribedUserId}/projects`
      );
      const unSubscribedUserProjectsSnap = await getDocs(
        unSubscribedUserProjectsRef
      );

      for (const docSnap of unSubscribedUserProjectsSnap.docs) {
        if (docSnap.exists()) {
          const newDocRef = doc(db, `users/${newUserId}/projects`, docSnap.id);
          await setDoc(newDocRef, docSnap.data());
        }
      }
    } catch (error) {}

    try {
      const unSubscribedUserRef = doc(db, "users", unSubscribedUserId);
      await deleteDoc(unSubscribedUserRef);
    } catch (error) {
      return {error: "Failed to delete account"};
    }
  };

  const uploadProfilePicture = async (file: any) => {
    if (!currentUser) return;
    const storage = getStorage();
    const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
    // Create a upload task
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: "image/jpeg", // Manually set the MIME type
    });

    // Create a promise to handle the upload task
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // You may want to use these to provide feedback to the user
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed", error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  };

  const changeProfilePicture = async (url: string) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      photoURL: url,
    });
    // updateProfile(firebaseUser, {
    //   photoURL: url,
    // });
  };

  async function changeUserPassword(
    currentPassword: string,
    newPassword: string
  ) {
    if (!auth.currentUser || !auth.currentUser.email) {
      return {error: "No user is currently signed in"};
    }

    // Create a credential
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    // Re-authenticate the user.
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      return {error: "Current password is incorrect"};
    }

    // Update the user's password.
    try {
      await updatePassword(auth.currentUser, newPassword);
      return {success: "Password updated successfully"};
    } catch (error) {
      return {error: "Error updating password: " + error};
    }
  }

  function resetPassword() {
    if (!currentUser || !currentUser.email)
      return {error: "No user is signed in"};
    const reset = sendPasswordResetEmail(auth, currentUser.email)
      .then((result) => {
        return "success";
      })
      .catch((error) => {
        console.log("error(((((", error);
        return error.code;
      });

    return reset;
  }

  async function changeUserDisplayName(newDisplayName: string) {
    if (!auth.currentUser || !currentUser)
      return {error: "No user is signed in"};
    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        firstName: newDisplayName.split(" ")[0],
        lastName: newDisplayName.split(" ")[1],
      });
      return {success: "Display name updated successfully"};
    } catch (error) {
      return {error: error};
    }
  }

  async function changeUserEmail(newEmail: string, currentPassword: string) {
    if (!currentUser) return {error: "No user is signed in"};
    // Re-authenticate the user

    const credential = EmailAuthProvider.credential(
      currentUser.email as string,
      currentPassword
    );

    try {
      try {
        if (!auth.currentUser) return {error: "No user is currently signed in"};
        await reauthenticateWithCredential(auth.currentUser, credential);
      } catch (error) {
        console.log("error", error);
        return {error: "Current password is incorrect"};
      }

      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      // Change the email
      return {success: "Email updated successfully"};
    } catch (error) {
      return {error: error};
    }
  }

  // const [verifyCode, setVerifyCode] = useState<string>(
  //   Math.floor(100000 + Math.random() * 900000).toString()
  // );

  const verifyCode = useRef<string>(
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  async function sendVerificationEmail(to_name: string, to_email: string) {
    await emailjs.send(
      "service_st6kbsq",
      "template_xpxefvp",
      {
        to_name,
        code: verifyCode.current,
        to_email,
      },
      "v0cr80z06j9YsBn-N"
    );
  }

  async function VerifyEmail(code: string, uId: string) {
    // if (code !== verifyCode.current) {
    //   return "error";
    // }

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uId,
        }),
      });
      const data = await response.json();

      if (data.success) {
        await CreateCurrentUser();
        return "success";
      } else {
        return "error";
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      return "error";
    }
  }

  async function resendVerificationEmail() {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    // setVerifyCode(newCode);
    verifyCode.current = newCode;
    await emailjs.send(
      "service_st6kbsq",
      "template_xpxefvp",
      {
        to_name: auth.currentUser?.displayName,
        code: newCode,
        to_email: auth.currentUser?.email,
      },
      "v0cr80z06j9YsBn-N"
    );
  }

  async function CreateCurrentUser() {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    await auth.currentUser?.getIdToken(true);
    const decodedToken = await auth.currentUser?.getIdTokenResult();
    console.log("decodedToken", decodedToken?.claims?.stripeRole);

    setCurrentUser({
      ...user,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      photoURL: userData?.photoURL,
      stripeId: userData?.stripeId,
      userPlan: Plans[1],
      // userPlan: Plans[decodedToken?.claims?.stripeRole],
      welcome_intro: userData?.welcome_intro,
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("email ver ====", user?.emailVerified);
      if (user?.uid) {
        const token = await user.getIdToken();
        // nookies.set(undefined, "token", token, { path: "/" });
      }
      if (user) {
        if (user.emailVerified !== false) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          await auth.currentUser?.getIdToken(true);
          const decodedToken = await auth.currentUser?.getIdTokenResult();
          console.log("decodedToken", decodedToken?.claims?.stripeRole);

          setCurrentUser({
            ...user,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            photoURL: userData?.photoURL,
            stripeId: userData?.stripeId,
            userPlan: Plans[1],
            // userPlan: Plans[decodedToken?.claims?.stripeRole],
            welcome_intro: userData?.welcome_intro,
          });
        }
      } else {
        setRerender(true);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signIn,
    createAccount,
    logInWithGoogle,
    logOut,
    changeUserDisplayName,
    changeUserEmail,
    changeUserPassword,
    resetPassword,
    uploadProfilePicture,
    changeProfilePicture,
    DeleteAccount,
    showLoginModal,
    setShowLoginModal,
    newUser,
    setNewUser,
    unSubscribedUserId,
    showEmailVerificationModal,
    setShowEmailVerificationModal,
    email,
    VerifyEmail,
    sendVerificationEmail,
    resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export type PlansConfig = {
  [firebaseRole: number]: PlansType;
};

export const Plans: PlansConfig = {
  0: {
    tier: 0,
    COLLECTION_LIMIT: {
      totalCredits: 0,
      access: false,
    },
    PRODUCT_TRACK_LIMIT: {
      totalCredits: 0,
      access: false,
    },
    DAILY_PRODUCT_SEARCH_LIMIT: {
      totalCredits: 0,
      access: false,
    },
  },
  1: {
    tier: 1,
    COLLECTION_LIMIT: {
      totalCredits: 5,
      access: true,
    },
    PRODUCT_TRACK_LIMIT: {
      totalCredits: 5,
      access: true,
    },
    DAILY_PRODUCT_SEARCH_LIMIT: {
      totalCredits: 3,
      access: true,
    },
  },
  2: {
    tier: 2,
    COLLECTION_LIMIT: {
      totalCredits: 20,
      access: true,
      unlimited: true,
    },
    PRODUCT_TRACK_LIMIT: {
      totalCredits: 20,
      access: true,
      unlimited: true,
    },
    DAILY_PRODUCT_SEARCH_LIMIT: {
      totalCredits: 10000,
      access: true,
      unlimited: true,
    },
  },
};
