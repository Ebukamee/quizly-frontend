export default function Spinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-black dark:border-zinc-700 dark:border-t-white" />
    </div>
  );
}
