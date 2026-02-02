import { getEntryForDate } from "@/lib/entries";
import { parseDateParam, getTodayDateString } from "@/lib/date-utils";
import { redirect } from "next/navigation";
import { JournalEditor } from "@/components/journal-editor";

type Props = { params: Promise<{ date: string }> };

export default async function JournalDatePage({ params }: Props) {
  const { date: dateParam } = await params;
  const date = parseDateParam(dateParam) ?? getTodayDateString();
  if (date !== dateParam) redirect(`/journal/${date}`);

  const entry = await getEntryForDate(date);
  if (!entry) redirect("/login");

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <JournalEditor key={date} initialContent={entry.content_json} selectedDate={date} />
      </div>
    </main>
  );
}
