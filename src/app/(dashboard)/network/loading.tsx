export default function NetworkLoading() {
    return (
        <div className="flex-1 p-6 md:p-10 xl:p-14 max-w-[1400px] w-full mx-auto space-y-8 animate-pulse">
            <div className="space-y-3">
                <div className="h-9 w-64 bg-slate-200 dark:bg-white/10 rounded-xl" />
                <div className="h-5 w-96 bg-slate-100 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="flex gap-3">
                <div className="h-11 flex-1 bg-slate-100 dark:bg-white/5 rounded-xl" />
                <div className="h-11 w-32 bg-slate-100 dark:bg-white/5 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-36 bg-slate-200 dark:bg-white/10 rounded" />
                                <div className="h-3 w-24 bg-slate-100 dark:bg-white/5 rounded" />
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="h-3 w-full bg-slate-50 dark:bg-white/[0.02] rounded" />
                            <div className="h-3 w-2/3 bg-slate-50 dark:bg-white/[0.02] rounded" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-6 w-20 bg-slate-100 dark:bg-white/5 rounded-full" />
                            <div className="h-6 w-16 bg-slate-100 dark:bg-white/5 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
