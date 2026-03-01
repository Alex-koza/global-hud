"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useEffect, useState } from 'react';

export function MiniChart() {
    const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => ({ value: 50 + Math.random() * 50 })));

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1), { value: 50 + Math.random() * 50 }];
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-24 w-full mt-4 border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-2 rounded">
            <div className="text-[10px] text-[#00f0ff]/70 mb-1">REAL-TIME TELEMETRY</div>
            <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <YAxis domain={[0, 100]} hide />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#00f0ff"
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
