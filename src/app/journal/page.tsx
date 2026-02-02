import { getTodayDateString } from "@/lib/date-utils";
import { redirect } from "next/navigation";

export default function JournalIndexPage() {
  redirect(`/journal/${getTodayDateString()}`);
}
