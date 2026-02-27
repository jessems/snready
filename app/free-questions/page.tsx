import { redirect } from "next/navigation";

// Redirect old /free-questions URL to practice-questions
export default function FreeQuestionsRedirect() {
  redirect("/practice-questions");
}
