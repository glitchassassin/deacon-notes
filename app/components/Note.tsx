interface NoteField {
  type: string;
  directive: string;
  title: string;
  key: string;
  options?: Array<{ name: string; value: string }>;
  description?: string;
  expressions?: {
    hide?: string;
  };
}

interface NoteDefinition {
  definitionName: string;
  title: string;
  plural: string;
  fields: NoteField[];
}

interface NoteProps {
  data: Record<string, any>;
  fullDefinition: NoteDefinition;
  created: string;
  author: {
    name: string;
  };
}

// New components for each field type
const TextAreaField = ({
  field,
  value,
}: {
  field: NoteField;
  value: string;
}) => (
  <div key={field.key} className="mb-4">
    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
      {field.title}
    </label>
    <div className="mt-1">{value}</div>
  </div>
);

const SelectField = ({ field, value }: { field: NoteField; value: string }) => (
  <div key={field.key} className="mb-4">
    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
      {field.title}
    </label>
    {field.description && (
      <p className="mt-1 text-sm text-gray-500">{field.description}</p>
    )}
    <div className="mt-1">
      {field.options?.find((opt) => opt.value === value)?.name || value}
    </div>
  </div>
);

const DateField = ({ field, value }: { field: NoteField; value: string }) => (
  <div key={field.key} className="mb-4">
    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
      {field.title}
    </label>
    <div className="mt-1">{new Date(value).toLocaleDateString()}</div>
  </div>
);

const DefaultField = ({
  field,
  value,
}: {
  field: NoteField;
  value: string;
}) => (
  <div key={field.key} className="mb-4">
    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
      {field.title}
    </label>
    <div className="mt-1">{value}</div>
  </div>
);

function Note({ data, fullDefinition, created, author }: NoteProps) {
  const renderField = (field: NoteField) => {
    const value = data[field.key];

    switch (field.directive) {
      case "textarea":
        return <TextAreaField field={field} value={value} />;
      case "select":
      case "button-select":
        return <SelectField field={field} value={value} />;
      case "date-select":
        return <DateField field={field} value={value} />;
      default:
        return <DefaultField field={field} value={value} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs hover:shadow-md transition-shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{fullDefinition.title}</h2>
        <div className="text-sm text-gray-500">
          By {author.name} on {new Date(created).toLocaleDateString()}
        </div>
      </div>

      {/* Special handling for note type with HTML body */}
      {fullDefinition.definitionName === "note" && data.body && (
        <div dangerouslySetInnerHTML={{ __html: data.body }} />
      )}

      {/* Render all other fields based on definition */}
      {fullDefinition.fields.map((field) => renderField(field))}
    </div>
  );
}

export default Note;
