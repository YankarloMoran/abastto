export default function NotificationsLoading() {
    return (
        <div className="flex-1 p-6 md:p-10 xl:p-14 max-w-[800px] w-full mx-auto animate-pulse">
            <div className="space-y-2 mb-8">
                <div className="h-8 w-64 bg-slate-200 dark:bg-white/10 rounded-xl" />
                <div className="h-4 w-48 bg-slate-100 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 sm:p-6">
                            <div className="w-11 h-11 bg-slate-100 dark:bg-white/5 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-40 bg-slate-200 dark:bg-white/10 rounded" />
                                    <div className="h-5 w-16 bg-slate-100 dark:bg-white/5 rounded-full" />
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
