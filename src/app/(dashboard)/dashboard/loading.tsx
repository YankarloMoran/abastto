export default function DashboardLoading() {
    return (
        <div className="flex-1 p-6 md:p-10 xl:p-14 max-w-[1600px] w-full mx-auto space-y-10 animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-2">
                <div className="space-y-3">
                    <div className="h-9 w-64 bg-slate-200 dark:bg-white/10 rounded-xl" />
                    <div className="h-5 w-96 bg-slate-100 dark:bg-white/5 rounded-lg" />
                </div>
                <div className="h-11 w-44 bg-blue-100 dark:bg-blue-900/20 rounded-xl" />
            </div>

            {/* Metrics skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-white/5">
                        <div className="flex justify-between items-start mb-5">
                            <div className="h-3 w-24 bg-slate-100 dark:bg-white/5 rounded" />
                            <div className="h-11 w-11 bg-slate-100 dark:bg-white/5 rounded-xl" />
                        </div>
                        <div className="h-8 w-32 bg-slate-200 dark:bg-white/10 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Main grid skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="px-7 py-5 bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                        <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded-lg" />
                        <div className="h-9 w-20 bg-slate-100 dark:bg-white/5 rounded-xl" />
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="px-7 py-4 flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-slate-100 dark:bg-white/5 rounded" />
                                    <div className="h-3 w-24 bg-slate-50 dark:bg-white/[0.02] rounded" />
                                </div>
                                <div className="h-4 w-20 bg-slate-100 dark:bg-white/5 rounded" />
                                <div className="h-6 w-20 bg-slate-100 dark:bg-white/5 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
                        <div className="h-3 w-32 bg-slate-100 dark:bg-white/5 rounded mb-4" />
                        <div className="h-[160px] bg-slate-50 dark:bg-white/[0.02] rounded-xl" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
                        <div className="h-3 w-40 bg-slate-100 dark:bg-white/5 rounded mb-4" />
                        <div className="h-[120px] bg-slate-50 dark:bg-white/[0.02] rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
