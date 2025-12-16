import { getAuth } from "firebase/auth";
import { collection, getDoc, getDocs, query, where, doc} from "firebase/firestore";
import { db } from "../firebase";

const auth = getAuth();

export async function getMyProfile() {
  const uid = auth.currentUser?.uid
  if (!uid) return null

  const ref = doc(db,"profiles", uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    name: data?.Name,
    avatarId: data?.AvatarID,
    isOwner: data?.isOwner,
  };
}