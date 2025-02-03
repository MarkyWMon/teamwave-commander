import { Routes, Route } from "react-router-dom";
import TemplateEditor from "@/components/email-templates/TemplateEditor";
import TemplatesList from "@/components/email-templates/TemplatesList";

const EmailTemplates = () => {
  return (
    <Routes>
      <Route index element={<TemplatesList />} />
      <Route path="new" element={<TemplateEditor />} />
      <Route path=":id/edit" element={<TemplateEditor />} />
    </Routes>
  );
};

export default EmailTemplates;