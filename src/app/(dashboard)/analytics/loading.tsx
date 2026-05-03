export default function AnalyticsLoading() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8 min-h-screen animate-pulse">
            <div className="h-4 w-48 bg-slate-100 dark:bg-white/5 rounded" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
                <div className="space-y-3">
                    <div className="h-9 w-80 bg-slate-200 dark:bg-white/10 rounded-xl" />
                    <div className="h-5 w-[500px] max-w-full bg-slate-100 dark:bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-56 bg-purple-100 dark:bg-purple-900/20 rounded-xl" />
            </div>

            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-2xl mb-6" />
                <div className="h-7 w-56 bg-slate-200 dark:bg-white/10 rounded-lg mb-3" />
                <div className="h-5 w-80 bg-slate-100 dark:bg-white/5 rounded-lg" />
            </div>
        </div>
    )
}
