import { redirect } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Book() {
  redirect(SITE.treatwell);
}
