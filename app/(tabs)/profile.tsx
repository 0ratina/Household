import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { doc, getDoc, setDoc, query, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../src/firebase";

export interface Profile {
    id: number;
    HouseholdID: number;
    Name: string;
    isOwner: boolean;
    AvatarID: string;
    AccountId: number;
    isRequest: boolean;
}

type Account = {
    AccountId: number;
    HouseholdID: number;
    isOwner?: boolean;
    isRequest?: boolean;
    AvatarID?: string;
};

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

async function getAccount(uid: string) {
    const ref = doc(db, `accounts/${uid}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Kunde inte hitta konto.");
    return snap.data() as Account;
}

async function getProfile(houseId: number, accountId: number) {
    const ref = doc(db, `households/${houseId}/profiles/${accountId}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Profile) : null;
}

async function saveProfile(profile: Profile) {
    const { HouseholdID, AccountId } = profile;
    const ref = doc(db, `households/${HouseholdID}/profiles/${AccountId}`);
    await setDoc(
        ref,
        {
            ...profile,
        },
        { merge: true }
    );
}

async function getUsedAvatars(householdId: number) {
    const qRef = collection(db, `households/${householdId}/profiles`);
    const snap = await getDocs(query(qRef));
    const usedAvatars = new Set<string>();
    snap.forEach((d) => {
        const a = (d.data()?.AvatarID as string) || "";
        if (a) usedAvatars.add(a);
    });
    return usedAvatars;
}

export default function ProfileScreen() {
    const uid = auth.currentUser?.uid ?? null;

    const {
        data: account,
        isLoading: accountLoading,
        error: accountError,
    } = useQuery({
        queryKey: ["account", uid],
        enabled: !!uid,
        queryFn: () => getAccount(uid!),
    });

    const {
        data: existingProfile,
        isLoading: profileLoading,
    } = useQuery({
        queryKey: ["profile", account?.HouseholdID, account?.AccountId],
        enabled: !!account?.HouseholdID && !!account?.AccountId,
        queryFn: () => getProfile(account!.HouseholdID, account!.AccountId),
    });

    const { data: usedAvatars } = useQuery({
        queryKey: ["used-avatars", account?.HouseholdID],
        enabled: !!account?.HouseholdID,
        queryFn: () => getUsedAvatars(account!.HouseholdID),
    });

    const [username, setUsername] = useState("");
    const [avatarId, setAvatarId] = useState<AvatarEmoji>("🦊");

    useEffect(() => {
        if (existingProfile?.Name) setUsername(existingProfile.Name);
        if (existingProfile?.AvatarID && AVATARS.includes(existingProfile.AvatarID as AvatarEmoji)) {
            setAvatarId(existingProfile.AvatarID as AvatarEmoji);
        } else if (account?.AvatarID && AVATARS.includes(account.AvatarID as AvatarEmoji)) {
            setAvatarId(account.AvatarID as AvatarEmoji);
        }
    }, [existingProfile, account]);

    const profileColor = useMemo(() => AVATAR_COLORS[avatarId], [avatarId]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (name: string) => {
            if (!account?.HouseholdID || !account?.AccountId) {
                throw new Error("Saknar HouseholdID eller AccountId.");
            }
            const profile: Profile = {
                id: account.AccountId,
                HouseholdID: account.HouseholdID,
                Name: name.trim(),
                isOwner: existingProfile?.isOwner ?? account.isOwner ?? false,
                AvatarID: avatarId,
                AccountId: account.AccountId,
                isRequest: existingProfile?.isRequest ?? account.isRequest ?? false,
            };
            await saveProfile(profile);
        },
        onSuccess: () => router.push("/createhousehold"),
        onError: (err: any) => {
            console.error(err);
            alert(err?.message ?? "Kunde inte spara profilen");
        },
    });

    const onSave = async () => {
        if (!username.trim()) return alert("Ange ett användarnamn!");
        if (!account?.HouseholdID || !account?.AccountId) return;

        const used = await getUsedAvatars(account.HouseholdID);
        const allowed =
            !used.has(avatarId) || avatarId === existingProfile?.AvatarID;
        if (!allowed) {
            alert("Den här avataren är redan vald av någon i hushållet.");
            return;
        }
        mutate(username);
    };

    const onClose = () => router.back();

    const formDisabled = isPending || profileLoading;

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.avatarWrap}
                        onPress={() => { }}
                        disabled={formDisabled}
                    >
                        <View style={[styles.avatarCircle, { borderColor: profileColor }]}>
                            <Text style={{ fontSize: 56 }}>{avatarId}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.grid}>
                        {AVATARS.map((a) => {
                            const selected = a === avatarId;
                            const takenByOther =
                                usedAvatars?.has(a) && a !== (existingProfile?.AvatarID as AvatarEmoji);

                            return (
                                <TouchableOpacity
                                    key={a}
                                    style={[
                                        styles.gridItem,
                                        { borderColor: selected ? AVATAR_COLORS[a] : "rgba(0,0,0,0.08)" },
                                        selected && { borderWidth: 2, transform: [{ scale: 1.02 }] },
                                        takenByOther && { opacity: 0.35 },
                                    ]}
                                    activeOpacity={takenByOther ? 1 : 0.9}
                                    onPress={() => !takenByOther && setAvatarId(a)}
                                    disabled={formDisabled || !!takenByOther}
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
                        placeholder="Användarnamn"
                        placeholderTextColor="#7A7A7A"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!formDisabled}
                    />
                    {profileLoading && <Text style={{ color: "#666", marginTop: 6 }}>Laddar profil…</Text>}
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.bottomButton}>
                <TouchableOpacity
                    style={[styles.pillButton]}
                    activeOpacity={0.85}
                    onPress={onSave}
                    disabled={isPending}
                >
                    <Text style={styles.pillButtonText}>
                        {isPending ? "Sparar..." : "Spara"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function Centered({ children }: { children: React.ReactNode }) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
            {children}
        </View>
    );
}

const BG = "#EFEFEF";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG },
    container: { flex: 1, backgroundColor: BG },
    header: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(0,0,0,0.06)",
    },
    headerTitle: { fontSize: 22, fontWeight: "600", letterSpacing: 0.3 },
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
    actionLabel: { fontSize: 16, fontWeight: "600" },
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

    pillButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: "600",
    },
});