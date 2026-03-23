import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import { AVATAR_COLORS, type AvatarEmoji } from "../../(protected)/household/profile";
import { db } from "../../../src/firebase";
import { useActiveHousehold } from "../../../src/service/activeHousehold";

interface CompletedTask {
  name: string;
  taskId: string;
  userId: string;
  householdId: string;
  value: number;
  doneAt?: Date;
}

interface Profile {
  id: string;
  HouseHoldID: string[];
  Name: string;
  isOwner: boolean;
  AvatarID: string;
  AccountId: string;
}

interface PieSegment {
  profileId: string;
  value: number;
  color: string;
  avatar?: string;
}

interface TaskPieData {
  taskId: string;
  taskName: string;
  segments: PieSegment[];
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `
    M ${cx} ${cy}
    L ${start.x} ${start.y}
    A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    Z
  `;
}

function getMidAngle(startAngle: number, endAngle: number) {
  return (startAngle + endAngle) / 2;
}

function PieChart({
  segments,
  size,
  showAvatars = false,
}: {
  segments: PieSegment[];
  size: number;
  showAvatars?: boolean;
}) {
  const validSegments = segments.filter((s) => Number(s.value || 0) > 0);
  const total = validSegments.reduce((sum, s) => sum + Number(s.value || 0), 0);
  const radius = size / 2;
  const center = size / 2;

  if (total <= 0) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#F3F3F3",
        }}
      />
    );
  }

  if (validSegments.length === 1) {
    const onlySegment = validSegments[0];

    return (
      <Svg width={size} height={size}>
        <G>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill={onlySegment.color}
          />
          {showAvatars && onlySegment.avatar ? (
            <SvgText
              x={center}
              y={center}
              fontSize={24}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {onlySegment.avatar}
            </SvgText>
          ) : null}
        </G>
      </Svg>
    );
  }

  let currentAngle = 0;

  return (
    <Svg width={size} height={size}>
      <G>
        {validSegments.map((segment, index) => {
          const numericValue = Number(segment.value || 0);
          const sweepAngle = (numericValue / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sweepAngle;
          currentAngle += sweepAngle;

          const path = createSlicePath(center, center, radius, startAngle, endAngle);

          const midAngle = getMidAngle(startAngle, endAngle);
          const labelRadius = radius * 0.6;
          const labelPoint = polarToCartesian(center, center, labelRadius, midAngle);

          return (
            <G key={`${segment.profileId}-${index}`}>
              <Path d={path} fill={segment.color} />
              {showAvatars && segment.avatar ? (
                <SvgText
                  x={labelPoint.x}
                  y={labelPoint.y}
                  fontSize={24}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.avatar}
                </SvgText>
              ) : null}
            </G>
          );
        })}
      </G>
    </Svg>
  );
}

export default function StatisticsScreen() {
  const { data: activeHouseholdId } = useActiveHousehold();

  const [periodIndex, setPeriodIndex] = useState(0);
  const periods = ["Idag", "Förra veckan", "Förra månaden"];

  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !activeHouseholdId) {
          setCompletedTasks([]);
          setProfiles([]);
          return;
        }

        const profilesQ = query(
          collection(db, "profiles"),
          where("HouseHoldID", "array-contains", activeHouseholdId)
        );

        const profilesSnap = await getDocs(profilesQ);

        const householdProfiles: Profile[] = profilesSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Profile, "id">),
        }));

        setProfiles(householdProfiles);

        const profileMap = new Map(
          householdProfiles.map((profile) => [profile.id, profile])
        );

        const tasksQ = query(
          collection(db, "tasks"),
          where("HouseHoldID", "==", activeHouseholdId)
        );

        const tasksSnap = await getDocs(tasksQ);
        const statsData: CompletedTask[] = [];

        tasksSnap.docs.forEach((taskDoc) => {
          const taskData = taskDoc.data();
          const completions = taskData.completions || [];

          completions.forEach((completion: any) => {
            if (profileMap.has(completion.profileId)) {
              statsData.push({
                name: taskData.title ?? "Okänd uppgift",
                taskId: taskDoc.id,
                userId: completion.profileId,
                householdId: taskData.HouseHoldID ?? activeHouseholdId,
                value: Number(taskData.value ?? 0),
                doneAt: completion.timestamp?.toDate?.(),
              });
            }
          });
        });

        setCompletedTasks(statsData);
      } catch (e) {
        console.error("Fel vid hämtning av statistik:", e);
        setCompletedTasks([]);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [activeHouseholdId]);

  const changePeriod = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setPeriodIndex((prev) => (prev > 0 ? prev - 1 : periods.length - 1));
    } else {
      setPeriodIndex((prev) => (prev < periods.length - 1 ? prev + 1 : 0));
    }
  };

  function filterTasksByPeriod(tasks: CompletedTask[], index: number) {
    const now = new Date();

    if (index === 0) {
      return tasks.filter(
        (t) =>
          t.doneAt &&
          t.doneAt.getDate() === now.getDate() &&
          t.doneAt.getMonth() === now.getMonth() &&
          t.doneAt.getFullYear() === now.getFullYear()
      );
    }

    if (index === 1) {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const firstDayOfLastWeek = new Date(firstDayOfWeek);
      firstDayOfLastWeek.setDate(firstDayOfWeek.getDate() - 7);
      firstDayOfLastWeek.setHours(0, 0, 0, 0);

      const lastDayOfLastWeek = new Date(firstDayOfWeek);
      lastDayOfLastWeek.setDate(firstDayOfWeek.getDate() - 1);
      lastDayOfLastWeek.setHours(23, 59, 59, 999);

      return tasks.filter(
        (t) =>
          t.doneAt &&
          t.doneAt >= firstDayOfLastWeek &&
          t.doneAt <= lastDayOfLastWeek
      );
    }

    if (index === 2) {
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
        0,
        0,
        0,
        0
      );

      const lastDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      );

      return tasks.filter(
        (t) =>
          t.doneAt &&
          t.doneAt >= firstDayOfLastMonth &&
          t.doneAt <= lastDayOfLastMonth
      );
    }

    return tasks;
  }

  const filteredTasks = useMemo(
    () => filterTasksByPeriod(completedTasks, periodIndex),
    [completedTasks, periodIndex]
  );

  const hasStatsInPeriod = filteredTasks.length > 0;
  const hasPositiveStatsInPeriod = filteredTasks.some(
    (task) => Number(task.value ?? 0) > 0
  );

  const totalPieSegments: PieSegment[] = useMemo(() => {
    if (!hasPositiveStatsInPeriod) return [];

    const grouped = new Map<string, PieSegment>();

    filteredTasks.forEach((task) => {
      const profile = profiles.find((p) => p.id === task.userId);
      if (!profile) return;

      const taskValue = Number(task.value ?? 0);
      if (taskValue <= 0) return;

      const avatar = (profile.AvatarID || "🦊") as AvatarEmoji;
      const color = AVATAR_COLORS[avatar] ?? "#F09550";

      const existing = grouped.get(task.userId);

      if (existing) {
        existing.value += taskValue;
      } else {
        grouped.set(task.userId, {
          profileId: task.userId,
          value: taskValue,
          color,
          avatar,
        });
      }
    });

    return Array.from(grouped.values());
  }, [filteredTasks, profiles, hasPositiveStatsInPeriod]);

  const taskPieData: TaskPieData[] = useMemo(() => {
    if (!hasPositiveStatsInPeriod) return [];

    const groupedTasks = new Map<string, TaskPieData>();

    filteredTasks.forEach((task) => {
      const profile = profiles.find((p) => p.id === task.userId);
      if (!profile) return;

      const taskValue = Number(task.value ?? 0);
      if (taskValue <= 0) return;

      const avatar = (profile.AvatarID || "🦊") as AvatarEmoji;
      const color = AVATAR_COLORS[avatar] ?? "#F09550";

      const existingTask = groupedTasks.get(task.taskId);

      if (!existingTask) {
        groupedTasks.set(task.taskId, {
          taskId: task.taskId,
          taskName: task.name,
          segments: [
            {
              profileId: task.userId,
              value: taskValue,
              color,
            },
          ],
        });
        return;
      }

      const existingSegment = existingTask.segments.find(
        (s) => s.profileId === task.userId
      );

      if (existingSegment) {
        existingSegment.value += taskValue;
      } else {
        existingTask.segments.push({
          profileId: task.userId,
          value: taskValue,
          color,
        });
      }
    });

    return Array.from(groupedTasks.values()).filter(
      (task) => task.segments.length > 0
    );
  }, [filteredTasks, profiles, hasPositiveStatsInPeriod]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hushållet</Text>

      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => changePeriod("prev")}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.periodText}>{periods[periodIndex]}</Text>

        <TouchableOpacity onPress={() => changePeriod("next")}>
          <Ionicons name="chevron-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {hasPositiveStatsInPeriod ? (
        <>
          <PieChart segments={totalPieSegments} size={220} showAvatars />
          <Text style={styles.totalLabel}>Totalt</Text>
        </>
      ) : (
        <>
          <View style={styles.bigCircleFallback}>
            <Text style={styles.bigFallbackText}>0</Text>
          </View>
          <Text style={styles.totalLabel}>Totalt</Text>
        </>
      )}

      {!hasStatsInPeriod && !loading && (
        <Text style={styles.noStatsText}>Ingen statistik ännu 😅</Text>
      )}

      {hasPositiveStatsInPeriod && (
        <View style={styles.tasksGrid}>
          {taskPieData.map((task) => (
            <View key={task.taskId} style={styles.taskItem}>
              <PieChart segments={task.segments} size={104} />
              <Text style={styles.taskLabel} numberOfLines={2}>
                {task.taskName}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const BG = "#F3F3F3";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: BG,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    marginBottom: 20,
  },
  periodText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    minWidth: 110,
    textAlign: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginTop: 8,
    marginBottom: 28,
  },
  noStatsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 20,
  },
  tasksGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  taskItem: {
    width: 110,
    alignItems: "center",
  },
  taskLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
  },
  bigCircleFallback: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  bigFallbackText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#333",
  },
});