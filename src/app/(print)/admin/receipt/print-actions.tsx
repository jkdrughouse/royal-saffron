"use client";
import { useEffect } from "react";

export default function PrintActions() {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="no-print"
            style={{ display: "flex", gap: 10 }}
        >
            <button
                className="btn btn-back"
                onClick={() => window.history.back()}
            >
                ← Back
            </button>
            <button
                className="btn btn-print"
                onClick={() => window.print()}
            >
                🖨 Print Receipt
            </button>
        </div>
    );
}
