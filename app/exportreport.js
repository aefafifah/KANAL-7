import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { Center, Box, Button, ButtonText, Text, VStack, HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import dayjs from "dayjs";

// ===== Tambahan Props dengan Default =====
export default function ExportReport({
    title = "Hydration Report",
    primaryColor = "#3b82f6",
    accentColor = "#06b6d4",
}) {
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

    // =========================
    // Semua fungsi tetap sama
    // =========================

    const MOOD_SCORE = { sad: 1, neutral: 2, happy: 3 };

    function formatNumber(n) {
        return Number.isFinite(n) ? Math.round(n) : 0;
    }

    // buildSparklineSVG: kembalikan string SVG, bukan JSX
    function buildSparklineSVG(values = [], width = 300, height = 40, stroke = "#3b82f6") {
        if (!values || values.length === 0) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`;
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

        return `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
                <polyline points="${points}" fill="none" stroke="${stroke}"
                    stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        `;
    }

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

    const aggregateWaterByDay = entries => {
        const map = {};
        entries.forEach(e => {
            if (!e || !e.date) return;
            const d = dayjs(e.date).format("YYYY-MM-DD");
            map[d] = (map[d] || 0) + Number(e.amount || 0);
        });
        return map;
    };

    const mapMoodByDay = entries => {
        const map = {};
        entries.forEach(e => {
            if (!e || !e.date) return;
            const d = dayjs(e.date).format("YYYY-MM-DD");
            map[d] = e.mood;
        });
        return map;
    };

    const buildReportForMonth = (monthOffset = 0) => {
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

        const corr = validPairsX.length > 1 ? pearsonCorrelation(validPairsX, validPairsY) : null;

        return {
            targetMonthLabel: monthStart.format("MMMM YYYY"),
            days,
            dailyWater,
            dailyMoodScore,
            total,
            avg,
            correlation: corr,
            daysFilled: dailyWater.filter(v => v > 0).length,
        };
    };

    const buildSixMonthTrend = () => {
        const trend = [];
        for (let i = -5; i <= 0; i++) {
            const r = buildReportForMonth(i);
            trend.push({ month: r.targetMonthLabel, total: r.total, avg: r.avg });
        }
        return trend;
    };

    const generateHTML = (report) => {
        const sparkWater = buildSparklineSVG(report.dailyWater, 500, 60, primaryColor);
        const moodValues = report.dailyMoodScore.map(v => v == null ? 0 : v);
        const sparkMood = buildSparklineSVG(moodValues, 500, 60, "#f97316");

        const sixTrend = buildSixMonthTrend();

        // pastikan .map menghasilkan string, bukan JSX
        const trendMonths = sixTrend.map(t => `<td style="padding:6px;text-align:center">${t.month}</td>`).join("");
        const trendTotals = sixTrend.map(t => `<td style="padding:6px;text-align:center">${formatNumber(t.total)} ml</td>`).join("");
        const trendAvgs = sixTrend.map(t => `<td style="padding:6px;text-align:center">${formatNumber(t.avg)} ml/day</td>`).join("");

        const corrText = report.correlation == null ? "Not enough data" : report.correlation.toFixed(2);

        return `
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8"/>
            <title>Hydration & Mood Report - ${report.targetMonthLabel}</title>
            <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#1f2937; padding:20px; }
            .card { background:#fff; border-radius:12px; padding:16px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom:12px; }
            table { width:100%; border-collapse:collapse; margin-top:8px; }
            th, td { border-bottom:1px solid #eee; padding:8px; font-size:12px; }
            .small { font-size:12px; color:#6b7280; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Hydration & Mood Report</h1>
                <div><strong>Total intake</strong><div>${formatNumber(report.total)} ml</div></div>
                <div class="small">Days with logged intake: ${report.daysFilled} / ${report.days.length}</div>
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

            <div class="small" style="margin-top:18px; color:#6b7280">Generated on ${dayjs().format("DD MMM YYYY HH:mm")}</div>
        </body>
        </html>
        `;
    };

    const exportPDF = async () => {
        try {
            setLoading(true);
            const report = buildReportForMonth(0);
            const html = generateHTML(report);
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);
        } catch (err) {
            Alert.alert("Error", "Gagal membuat laporan: " + String(err));
        }
        setLoading(false);
    };

    // ============================
    // UI tetap 100% sama
    // ============================

    return (
        <Center flex={1} bg="$coolGray100">
            <Box w="100%" maxWidth={780} px="$4" py="$6">

                <Box
                    bg={{
                        linearGradient: {
                            colors: [primaryColor, accentColor],
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
                        {title}
                    </Text>
                    <Text mt="$2" fontSize="$md" color="black" opacity={0.85}>
                        Analyze your water intake & mood relationship
                    </Text>
                </Box>

                {/* Card */}
                <Box bg="$white" rounded="$2xl" p="$6" shadow="$3">
                    <VStack space="lg">

                        <Text fontSize="$xl" fontWeight="bold">
                            Monthly Summary
                        </Text>

                        <Button
                            size="lg"
                            bg="$blue600"
                            rounded="$xl"
                            onPress={exportPDF}
                            isDisabled={loading}
                            shadow="$4"
                        >
                            <ButtonText color="white">
                                {loading ? "Generating PDF..." : "Export Monthly PDF"}
                            </ButtonText>
                        </Button>

                    </VStack>
                </Box>
            </Box>
        </Center>
    );
}
