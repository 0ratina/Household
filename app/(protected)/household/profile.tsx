import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../../../src/firebase";

export interface Profile {
    id: string;
    HouseholdID: string;
    Name: string;
    isOwner: boolean;
    AvatarID: string;
    AccountId: string;
}

const AVATARS = ["🦊", "🐷", "🐸", "🐥", "🐙", "🐬", "🦉", "🦄"] as const;
type AvatarEmoji = (typeof AVATARS)[number];

const AVATAR_COLORS: Record<AvatarEmoji, string> = {
    "🦊": "#FF7A45",
    "🐷": "#FF92B0",
    "🐸": "#4CAF50",
    "🐥": "#FFC107",
    "🐙": "#d3331eff",
    "🐬": "#03A9F4",
    "🦉": "#795548",
    "🦄": "#E91E63",
};

async function getProfilesForAccount(accountId: string) {
    const qy = query(collection(db, "profiles"), where("AccountId", "==", accountId));
    const snap = await getDocs(qy);
    return snap.docs.map(
        (d) => ({ id: d.id, ...(d.data() as Omit<Profile, "id">) }) as Profile
    );
}

async function getUsedAvatars(householdId: string) {
    const qy = query(collection(db, "profiles"), where("HouseholdID", "==", householdId));
    const snap = await getDocs(qy);
    const used = new Set<string>();
    snap.forEach((d) => {
        const a = (d.data()?.AvatarID as string) || "";
        if (a) used.add(a);
    });
    return used;
}

async function saveProfileChanges(profileDocId: string, name: string, avatar: AvatarEmoji) {
    const ref = doc(db, "profiles", profileDocId);
    await setDoc(
        ref,
        {
            Name: name.trim(),
            AvatarID: avatar,
        },
        { merge: true }
    );
}

export default function ProfileScreen() {
    const uid = auth.currentUser?.uid ?? null;
    const queryClient = useQueryClient();

    const { data: myProfiles = [] } = useQuery({
        queryKey: ["profiles-by-account", uid],
        enabled: !!uid,
        queryFn: () => getProfilesForAccount(uid!),
    });

    const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);

    useEffect(() => {
        if (myProfiles.length === 0) {
            setSelectedHouseholdId(null);
            return;
        }
        if (!selectedHouseholdId) {
            setSelectedHouseholdId(myProfiles[0].HouseholdID);
            return;
        }
        const stillExists = myProfiles.some(p => p.HouseholdID === selectedHouseholdId);
        if (!stillExists) setSelectedHouseholdId(myProfiles[0].HouseholdID);
    }, [myProfiles, selectedHouseholdId]);

    const selectedProfile = useMemo(
        () => myProfiles.find(p => p.HouseholdID === selectedHouseholdId) ?? null,
        [myProfiles, selectedHouseholdId]
    );

    const { data: usedAvatars } = useQuery({
        queryKey: ["used-avatars", selectedHouseholdId],
        enabled: !!selectedHouseholdId,
        queryFn: () => getUsedAvatars(selectedHouseholdId!),
    });

    const [hasTouchedAvatar, setHasTouchedAvatar] = useState(false);
    useEffect(() => setHasTouchedAvatar(false), [selectedHouseholdId]);

    const [nickname, setNickname] = useState("");
    const [avatarId, setAvatarId] = useState<AvatarEmoji>("🦊");

    useEffect(() => {
        setNickname(selectedProfile?.Name ?? "");
        if (!hasTouchedAvatar) {
            const a = selectedProfile?.AvatarID;
            if (a && AVATARS.includes(a as AvatarEmoji)) setAvatarId(a as AvatarEmoji);
        }
    }, [selectedProfile, hasTouchedAvatar]);

    const profileColor = useMemo(() => AVATAR_COLORS[avatarId], [avatarId]);

    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            profileId,
            householdId,
            name,
            avatar,
            prevAvatar,
        }: {
            profileId: string;
            householdId: string | null;
            name: string;
            avatar: AvatarEmoji;
            prevAvatar?: AvatarEmoji;
        }) => {
            if (!uid) throw new Error("Ingen användare inloggad.");
            if (!profileId) throw new Error("Kunde inte hitta din profil för valt hushåll.");

            if (householdId) {
                const used = await getUsedAvatars(householdId);
                const allowed = !used.has(avatar) || avatar === prevAvatar;
                if (!allowed) throw new Error("Den här avataren är redan vald av någon i hushållet.");
            }

            await saveProfileChanges(profileId, name, avatar);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["profiles-by-account", uid],
            });
            router.back();
        },
        onError: (err: any) => {
            console.error(err);
            alert(err?.message ?? "Kunde inte uppdatera profilen");
        },
    });

    const onSave = () => {
        if (!uid) {
            alert("Inte inloggad.");
            return;
        }
        if (!selectedProfile) {
            alert("Kunde inte hitta din profil för valt hushåll. Öppna hushållet och försök igen.");
            return;
        }
        if (!nickname.trim()) return alert("Ange ett namn!");

        const prevName = selectedProfile.Name ?? "";
        const prevAvatar = selectedProfile.AvatarID as AvatarEmoji | undefined;

        const nameChanged = nickname.trim() !== prevName.trim();
        const avatarChanged = avatarId !== prevAvatar;

        if (!nameChanged && !avatarChanged) {
            alert("Inga ändringar att spara.");
            return;
        }

        mutate({
            profileId: selectedProfile.id,
            householdId: selectedHouseholdId,
            name: nickname,
            avatar: avatarId,
            prevAvatar,
        });
    };

    const nameDisabled = isPending || !uid || !selectedProfile;
    const avatarDisabled = isPending || !uid || !selectedProfile;

    if (uid && myProfiles.length === 0) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center", padding: 24 }]}>
                <Text style={{ fontSize: 16, color: "#333", textAlign: "center", marginBottom: 12 }}>
                    Du har ingen profil ännu. Gå till ett hushåll och skapa/gå med för att kunna ändra avatar och namn.
                </Text>
                <TouchableOpacity
                    onPress={() => router.push("/(protected)/joinHousehold")}
                    style={[styles.pillButton, { paddingHorizontal: 20 }]}
                >
                    <Text style={styles.pillButtonText}>Gå till hushåll</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <TouchableOpacity activeOpacity={0.8} style={styles.avatarWrap}>
                        <View style={[styles.avatarCircle, { borderColor: profileColor, opacity: avatarDisabled ? 0.4 : 1 }]}>
                            <Text style={{ fontSize: 56 }}>{avatarId}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.grid}>
                        {AVATARS.map((a) => {
                            const selected = a === avatarId;
                            const takenByOther =
                                !!selectedHouseholdId &&
                                !!(usedAvatars?.has(a) && a !== (selectedProfile?.AvatarID as AvatarEmoji));

                            return (
                                <TouchableOpacity
                                    key={a}
                                    style={[
                                        styles.gridItem,
                                        { borderColor: selected ? AVATAR_COLORS[a] : "rgba(0,0,0,0.08)" },
                                        selected && { borderWidth: 2, transform: [{ scale: 1.02 }] },
                                        (avatarDisabled || takenByOther) && { opacity: 0.35 },
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setAvatarId(a);
                                        setHasTouchedAvatar(true);
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>{a}</Text>
                                    {takenByOther && (
                                        <Text style={{ fontSize: 10, marginTop: 2, color: "#666" }}>upptagen</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TextInput
                        style={styles.inputCard}
                        placeholder="Smeknamn"
                        placeholderTextColor="#7A7A7A"
                        value={nickname}
                        onChangeText={setNickname}
                        autoCapitalize="none"
                        editable={!nameDisabled}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.bottomButton}>
                <TouchableOpacity
                    style={[styles.pillButton]}
                    activeOpacity={0.85}
                    onPress={onSave}
                    disabled={isPending || !uid || !selectedProfile}
                >
                    <Text style={styles.pillButtonText}>{isPending ? "Sparar..." : "Spara"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const BG = "#EFEFEF";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 },
    avatarWrap: { alignItems: "center", marginBottom: 16 },
    avatarCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
        marginBottom: 18,
    },
    gridItem: {
        width: 56,
        height: 56,
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    inputCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    bottomButton: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    pillButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 40,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    pillButtonText: { color: "#111", fontSize: 16, fontWeight: "600" },
    householdRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    householdPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#f0f0f0",
    },
});