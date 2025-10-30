import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    doc,
    getDoc,
    writeBatch,
    query,
    collection,
    getDocs,
    collectionGroup,
    where,
} from "firebase/firestore";
import { db, auth } from "../../../src/firebase";

export interface Profile {
    id: string;
    HouseholdID: string;
    Name: string;
    isOwner: boolean;
    AvatarID: string;
    AccountId: string;
    isRequest: boolean;
}

export interface GlobalProfile {
    Name: string;
    DefaultAvatarID?: string;
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
    const qRef = collectionGroup(db, "profiles");
    const qy = query(qRef, where("AccountId", "==", accountId));
    const snap = await getDocs(qy);
    return snap.docs.map((d) => d.data() as Profile);
}

async function getProfile(houseId: string, accountId: string) {
    const ref = doc(db, `households/${houseId}/profiles/${accountId}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Profile) : null;
}

async function getUsedAvatars(householdId: string) {
    const qRef = collection(db, `households/${householdId}/profiles`);
    const snap = await getDocs(query(qRef));
    const usedAvatars = new Set<string>();
    snap.forEach((d) => {
        const a = (d.data()?.AvatarID as string) || "";
        if (a) usedAvatars.add(a);
    });
    return usedAvatars;
}

async function saveProfileChanges(opts: {
    uid: string;
    newName: string;
    selectedHouseholdId: string | null;
    newAvatar?: AvatarEmoji;
}) {
    const { uid, newName, selectedHouseholdId, newAvatar } = opts;
    const batch = writeBatch(db);

    const globalRef = doc(db, "profiles", uid);
    batch.set(
        globalRef,
        { Name: newName.trim() },
        { merge: true }
    );

    if (selectedHouseholdId) {
        const memberRef = doc(db, `households/${selectedHouseholdId}/profiles/${uid}`);
        batch.set(
            memberRef,
            {
                AccountId: uid,
                HouseholdID: selectedHouseholdId,
                ...(newAvatar ? { AvatarID: newAvatar } : {}),
            },
            { merge: true }
        );
    }

    await batch.commit();
}

export default function ProfileScreen() {
    const uid = auth.currentUser?.uid ?? null;

    const { data: myProfiles = [] } = useQuery({
        queryKey: ["profiles-by-account", uid],
        enabled: !!uid,
        queryFn: () => getProfilesForAccount(uid!),
    });

    const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedHouseholdId && myProfiles.length > 0) {
            setSelectedHouseholdId(myProfiles[0].HouseholdID);
        }
    }, [myProfiles, selectedHouseholdId]);

    useEffect(() => {
        setHasTouchedAvatar(false);
    }, [selectedHouseholdId]);

    const { data: existingProfile } = useQuery({
        queryKey: ["profile", selectedHouseholdId, uid],
        enabled: !!uid && !!selectedHouseholdId,
        queryFn: () => getProfile(selectedHouseholdId!, uid!),
    });

    const { data: usedAvatars } = useQuery({
        queryKey: ["used-avatars", selectedHouseholdId],
        enabled: !!selectedHouseholdId,
        queryFn: () => getUsedAvatars(selectedHouseholdId!),
    });

    const [username, setUsername] = useState("");
    const [avatarId, setAvatarId] = useState<AvatarEmoji>("🦊");
    const [hasTouchedAvatar, setHasTouchedAvatar] = useState(false);



    useEffect(() => {
        const name =
            existingProfile?.Name ??
            "";
        setUsername(name);

        if (!hasTouchedAvatar) {
            if (
                existingProfile?.AvatarID &&
                AVATARS.includes(existingProfile.AvatarID as AvatarEmoji)
            ) {
                setAvatarId(existingProfile.AvatarID as AvatarEmoji);
            }
        }
    }, [existingProfile, hasTouchedAvatar]);

    const profileColor = useMemo(() => AVATAR_COLORS[avatarId], [avatarId]);

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ name, avatar }: { name: string; avatar: AvatarEmoji }) => {
            if (!uid) throw new Error("Ingen användare inloggad.");

            if (selectedHouseholdId) {
                const used = await getUsedAvatars(selectedHouseholdId);
                const allowed = !used.has(avatar) || avatar === existingProfile?.AvatarID;
                if (!allowed) {
                    throw new Error("Den här avataren är redan vald av någon i hushållet.");
                }
            }

            await saveProfileChanges({
                uid,
                newName: name,
                selectedHouseholdId,
                newAvatar: selectedHouseholdId ? avatar : undefined,
            });
        },
        onSuccess: () => router.back(),
        onError: (err: any) => {
            console.error(err);
            alert(err?.message ?? "Kunde inte uppdatera profilen");
        },
    });



    const onSave = () => {
        if (!username.trim()) return alert("Ange ett användarnamn!");

        const prevName = existingProfile?.Name ?? "";
        const prevAvatar = existingProfile?.AvatarID as AvatarEmoji | undefined;

        const nameChanged = username.trim() !== prevName.trim();
        const avatarChanged = !!selectedHouseholdId && avatarId !== prevAvatar;

        if (!nameChanged && !avatarChanged) {
            alert("Inga ändringar att spara.");
            return;
        }

        mutate({ name: username, avatar: avatarId });
    };

    const nameDisabled = isPending || !uid;
    const avatarDisabled = isPending || !selectedHouseholdId;

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {myProfiles.length > 1 && (
                        <View style={[styles.inputCard, { paddingVertical: 10 }]}>
                            <Text style={{ fontWeight: "600", marginBottom: 8 }}>Välj hushåll</Text>
                            <View style={styles.householdRow}>
                                {myProfiles.map((p) => {
                                    const active = p.HouseholdID === selectedHouseholdId;
                                    return (
                                        <TouchableOpacity
                                            key={p.HouseholdID}
                                            onPress={() => setSelectedHouseholdId(p.HouseholdID)}
                                            style={[
                                                styles.householdPill,
                                                active && { backgroundColor: "#111" },
                                            ]}
                                        >
                                            <Text style={{ color: active ? "#fff" : "#111", fontWeight: "600" }}>
                                                {p.HouseholdID}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {!selectedHouseholdId && (
                        <Text style={{ color: "#555", marginBottom: 12, textAlign: "center" }}>
                            Inget hushåll valt – Du kan ändra <Text style={{ fontWeight: "700" }}>namn</Text> nu.
                            Din Avatar kan ändras när du valt ett hushåll.
                        </Text>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.avatarWrap}
                    >
                        <View style={[styles.avatarCircle, { borderColor: profileColor, opacity: avatarDisabled ? 0.4 : 1 }]}>
                            <Text style={{ fontSize: 56 }}>{avatarId}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.grid}>
                        {AVATARS.map((a) => {
                            const selected = a === avatarId;
                            const takenByOther =
                                !!selectedHouseholdId &&
                                !!(usedAvatars?.has(a) && a !== (existingProfile?.AvatarID as AvatarEmoji));

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
                                        setHasTouchedAvatar(true);
                                        setAvatarId(a);
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>{a}</Text>
                                    {takenByOther && (
                                        <Text style={{ fontSize: 10, marginTop: 2, color: "#666" }}>
                                            upptagen
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TextInput
                        style={styles.inputCard}
                        placeholder="Användarnamn"
                        placeholderTextColor="#7A7A7A"
                        value={username}
                        onChangeText={setUsername}
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
                    disabled={isPending || !uid}
                >
                    <Text style={styles.pillButtonText}>
                        {isPending ? "Sparar..." : "Spara"}
                    </Text>
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