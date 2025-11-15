import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { Center, Box, Button, ButtonText, Text, VStack, HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import dayjs from "dayjs";

/**
Expected AsyncStorage keys / formats (adjust if needed):
- waterEntries: [{ date: "2025-11-15", amount: 250 }, ...]  // amount in ml
- moodEntries:  [{ date: "2025-11-15", mood: "happy"|"neutral"|"sad" }, ...]
*/

const MOOD_SCORE = { sad: 1, neutral: 2, happy: 3 };

function formatNumber(n) {
    return Number.isFinite(n) ? Math.round(n) : 0;
}

// Build small sparkline SVG from an array of numbers
function buildSparklineSVG(values = [], width = 300, height = 40, stroke = "#3b82f6") {
    if (!values.length) {
        return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    }
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const step = width / Math.max(1, values.length - 1);
    const points = values
        .map((v, i) => {
            const x = i * step;
            const y = height - ((v - min) / range) * height;
            return `${x},${y}`;
        })
        .join(" ");
    // small filled area under line
    const lastX = (values.length - 1) * step;
    const path = `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${path}</svg>`;
}

// compute Pearson correlation r between two arrays (equal length)
function pearsonCorrelation(x, y) {
    if (!x.length || x.length !== y.length) return null;
    const n = x.length;
    const mean = arr => arr.reduce((s, v) => s + v, 0) / n;
    const mx = mean(x), my = mean(y);
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
        const a = x[i] - mx;
        const b = y[i] - my;
        num += a * b;
        dx += a * a;
        dy += b * b;
    }
    const denom = Math.sqrt(dx * dy);
    if (denom === 0) return 0;
    return num / denom;
}

export default function ExportReport() {
    const [loading, setLoading] = useState(false);
    const [waterEntries, setWaterEntries] = useState([]);
    const [moodEntries, setMoodEntries] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const we = await AsyncStorage.getItem("waterEntries");
                const me = await AsyncStorage.getItem("moodEntries");
                setWaterEntries(we ? JSON.parse(we) : []);
                setMoodEntries(me ? JSON.parse(me) : []);
            } catch (err) {
                console.warn("Load entries error", err);
            }
        })();
    }, []);

    // Helper: aggregate per day map { date: amount }
    const aggregateWaterByDay = (entries) => {
        const map = {};
        entries.forEach(e => {
            if (!e || !e.date) return;
            const d = dayjs(e.date).format("YYYY-MM-DD");
            map[d] = (map[d] || 0) + Number(e.amount || 0);
        });
        return map;
    };

    // Helper: mood map { date: mood }
    const mapMoodByDay = (entries) => {
        const map = {};
        entries.forEach(e => {
            if (!e || !e.date) return;
            const d = dayjs(e.date).format("YYYY-MM-DD");
            map[d] = e.mood;
        });
        return map;
    };

    // Build report data for a specific month/year (default: current month)
    const buildReportForMonth = (monthOffset = 0) => {
        // monthOffset 0 => current month, -1 prev month, etc.
        const target = dayjs().add(monthOffset, "month");
        const monthStart = target.startOf("month");
        const monthEnd = target.endOf("month");
        const days = [];
        for (let d = monthStart; d.isBefore(monthEnd) || d.isSame(monthEnd, "day"); d = d.add(1, "day")) {
            days.push(d.format("YYYY-MM-DD"));
        }

        const waterByDay = aggregateWaterByDay(waterEntries);
        const moodByDay = mapMoodByDay(moodEntries);

        const dailyWater = days.map(date => waterByDay[date] || 0);
        const dailyMoodScore = days.map(date => {
            const m = moodByDay[date];
            return m ? (MOOD_SCORE[m] || null) : null;
        });

        const validPairsX = [];
        const validPairsY = [];
        for (let i = 0; i < days.length; i++) {
            if (dailyMoodScore[i] != null) {
                validPairsX.push(dailyWater[i]);
                validPairsY.push(dailyMoodScore[i]);
            }
        }

        const total = dailyWater.reduce((s, v) => s + v, 0);
        const avg = dailyWater.length ? total / dailyWater.length : 0;
        const daysFilled = dailyWater.filter(v => v > 0).length;

        const corr = validPairsX.length > 1 ? pearsonCorrelation(validPairsX, validPairsY) : null;

        return {
            targetMonthLabel: monthStart.format("MMMM YYYY"),
            days,
            dailyWater,
            dailyMoodScore,
            total,
            avg,
            daysFilled,
            correlation: corr,
        };
    };

    // Build 6-month trend (last 6 months including current)
    const buildSixMonthTrend = () => {
        const trend = [];
        for (let i = -5; i <= 0; i++) {
            const r = buildReportForMonth(i);
            trend.push({ month: r.targetMonthLabel, total: r.total, avg: r.avg });
        }
        return trend;
    };

    const generateHTML = (report) => {
        // small sparkline svg for water and mood (convert numbers)
        const sparkWater = buildSparklineSVG(report.dailyWater, 500, 60, "#3b82f6");
        const moodValues = report.dailyMoodScore.map(v => v == null ? 0 : v);
        const sparkMood = buildSparklineSVG(moodValues, 500, 60, "#f97316");

        const sixTrend = buildSixMonthTrend();
        const trendMonths = sixTrend.map(t => `<td style="padding:6px;text-align:center">${t.month}</td>`).join("");
        const trendTotals = sixTrend.map(t => `<td style="padding:6px;text-align:center">${formatNumber(t.total)} ml</td>`).join("");
        const trendAvgs = sixTrend.map(t => `<td style="padding:6px;text-align:center">${formatNumber(t.avg)} ml/day</td>`).join("");

        const corrText = report.correlation == null ? "Not enough data" : report.correlation.toFixed(2);

        // build html
        return `
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>Hydration & Mood Report - ${report.targetMonthLabel}</title>
        <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#1f2937; padding:20px; }
        .header { text-align:center; margin-bottom:16px; }
        .card { background:#fff; border-radius:12px; padding:16px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom:12px; }
        .row { display:flex; gap:12px; align-items:center; }
        .col { flex:1 }
        table { width:100%; border-collapse:collapse; margin-top:8px; }
        th, td { border-bottom:1px solid #eee; padding:8px; font-size:12px; }
        .small { font-size:12px; color:#6b7280; }
        </style>
    </head>
    <body>
        <div class="header">
        <h1>Hydration & Mood Report</h1>
            <div class="col">
            <strong>Total intake</strong>
            <div>${formatNumber(report.total)} ml</div>
            <div class="small">Days with logged intake: ${report.daysFilled} / ${report.days.length}</div>
            </div>
            <div class="col">
            <strong>Average per day</strong>
            <div>${formatNumber(report.avg)} ml/day</div>
            <div class="small">Based on ${report.days.length} days</div>
            </div>
            <div class="col">
            <strong>Water ↔ Mood correlation</strong>
            <div>${corrText}</div>
            <div class="small">Pearson r (1 to -1)</div>
            </div>
        </div>
        </div>

        <div class="card">
        <h2>Daily Trend</h2>
        <div>${sparkWater}</div>
        <div style="margin-top:8px" class="small">Water intake (ml) per day</div>

        <div style="margin-top:12px">${sparkMood}</div>
        <div style="margin-top:8px" class="small">Mood score per day (1 sad → 3 happy)</div>
        </div>

        <div class="card">
        <h2>6-Month Trend</h2>
        <table>
            <tr><th>Month</th>${trendMonths}</tr>
            <tr><th>Total</th>${trendTotals}</tr>
            <tr><th>Average</th>${trendAvgs}</tr>
        </table>
        </div>

        <div class="small" style="margin-top:18px; color:#6b7280">
        Generated on ${dayjs().format("DD MMM YYYY HH:mm")}
        </div>
    </body>
    </html>
    `;
    };

    const exportPDF = async () => {
        try {
            setLoading(true);
            // build report for current month
            const report = buildReportForMonth(0);
            const html = generateHTML(report);

            // create PDF
            const { uri } = await Print.printToFileAsync({ html });
            if (Platform.OS === "ios") {
                await Sharing.shareAsync(uri); // uses share sheet
            } else {
                await Sharing.shareAsync(uri);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Gagal membuat laporan: " + String(err));
            setLoading(false);
        }
    };

    return (
        <Center flex={1} bg="$coolGray100">
            <Box w="100%" maxWidth={780} px="$4" py="$6">

                {/* Gradient Header */}
                <Box
                    bg={{
                        linearGradient: {
                            colors: ["#3b82f6", "#06b6d4"],
                            start: [0, 0],
                            end: [1, 1],
                        },
                    }}
                    rounded="$2xl"
                    p="$6"
                    mb="$5"
                    shadow="$5"
                >
                    <Text fontSize="$3xl" fontWeight="bold" color="black">
                        Hydration Report
                    </Text>
                    <Text mt="$2" fontSize="$md" color="black" opacity={0.85}>
                        Analyze your water intake & mood relationship
                    </Text>
                </Box>

                {/* Main Card */}
                <Box
                    bg="$white"
                    rounded="$2xl"
                    p="$6"
                    shadow="$3"
                    borderWidth={1}
                    borderColor="$coolGray200"
                >
                    <VStack space="lg">

                        <Text fontSize="$xl" fontWeight="bold">
                            Monthly Summary
                        </Text>

                        <Text fontSize="$sm" color="$coolGray600">
                            Export a detailed PDF report containing water intake, mood score,
                            and 6-month comparison.
                        </Text>

                        {/* Stats */}
                        <Box
                            bg="$coolGray100"
                            rounded="$lg"
                            p="$4"
                            borderWidth={1}
                            borderColor="$coolGray200"
                        >
                            <HStack justifyContent="space-between">

                                {/* Total */}
                                <VStack>
                                    <Text fontSize="$2xl" fontWeight="bold" color="#3b82f6">
                                        {formatNumber(buildReportForMonth(0).total)} ml
                                    </Text>
                                    <Text fontSize="$xs" color="$coolGray600">
                                        Total Intake
                                    </Text>
                                </VStack>

                                {/* Average */}
                                <VStack>
                                    <Text fontSize="$2xl" fontWeight="bold" color="#0ea5e9">
                                        {formatNumber(buildReportForMonth(0).avg)} ml
                                    </Text>
                                    <Text fontSize="$xs" color="$coolGray600">
                                        Daily Avg
                                    </Text>
                                </VStack>

                                {/* Correlation */}
                                <VStack>
                                    <Text fontSize="$2xl" fontWeight="bold" color="#f97316">
                                        {buildReportForMonth(0).correlation
                                            ? buildReportForMonth(0).correlation.toFixed(2)
                                            : "-"}
                                    </Text>
                                    <Text fontSize="$xs" color="$coolGray600">
                                        Mood Corr.
                                    </Text>
                                </VStack>

                            </HStack>
                        </Box>

                        {/* Export Button */}
                        <Button
                            size="lg"
                            bg="$blue600"
                            rounded="$xl"
                            onPress={exportPDF}
                            isDisabled={loading}
                            shadow="$4"
                        >
                            <ButtonText fontSize="$md" fontWeight="bold" color="white">
                                {loading ? "Generating PDF..." : "Export Monthly PDF"}
                            </ButtonText>
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </Center>
    );
}
