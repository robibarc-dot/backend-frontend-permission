"use client";

import { useParams } from "next/navigation";
import QuestionFormPage from "../../components/QuestionFormPage";

export default function EditQuestionPage() {
    const { id } = useParams();

    return <QuestionFormPage mode="edit" questionId={id} />;
}
