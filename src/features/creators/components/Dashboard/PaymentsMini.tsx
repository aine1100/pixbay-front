"use client";

import React from "react";

export function PaymentsMini() {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Payments</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <p className="text-[14px] font-semibold text-slate-400">
                    Start your first project to get income
                </p>
            </div>
        </div>
    );
}
