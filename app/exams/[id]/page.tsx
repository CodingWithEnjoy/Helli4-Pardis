import ExamPageClient from "./ExamPageClient";
import React from "react";

export default async function ExamPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params before using
  const { id } = await params;

  return <ExamPageClient examId={id} />;
}
