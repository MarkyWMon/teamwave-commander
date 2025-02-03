import TemplateEditor from "@/components/email-templates/TemplateEditor";

const EmailTemplates = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Email Template Editor</h1>
      <TemplateEditor />
    </div>
  );
};

export default EmailTemplates;