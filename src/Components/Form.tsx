import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Sun, Moon, Download, Upload, Clipboard } from "lucide-react";

const Alert: React.FC<{ variant?: string; className?: string; children: React.ReactNode }> = ({
  variant,
  className,
  children,
}) => {
  return <div className={`alert alert-${variant} ${className}`}>{children}</div>;
};

const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span className="alert-description">{children}</span>;
};

interface FormOption {
  value: string;
  label: string;
}

interface FormValidation {
  pattern?: string;
  message?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

interface FormField {
  id: string;
  type: "text" | "number" | "email" | "select" | "textarea" | "radio";
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: FormOption[];
  validation?: FormValidation;
}

interface FormSchema {
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
}

const Form: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (!jsonInput.trim()) {
        setFormSchema(null);
        setJsonError(null);
        return;
      }
      const parsed = JSON.parse(jsonInput) as FormSchema;
      if (!parsed.formTitle || !Array.isArray(parsed.fields)) {
        throw new Error('Invalid schema format. Must include "formTitle" and "fields" array.');
      }
      setFormSchema(parsed);
      setJsonError(null);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
      setFormSchema(null);
    }
  }, [jsonInput]);

  const handleInputChange = (id: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const validateField = (id: string, value: string): void => {
    const field = formSchema?.fields.find((f) => f.id === id);
    if (!field) return;

    let error = "";
    if (field.required && !value) {
      error = "This field is required";
    } else if (field.validation) {
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        error = field.validation.message || "Invalid format";
      }
      if (field.validation.minLength && value.length < field.validation.minLength) {
        error = `Minimum length is ${field.validation.minLength}`;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        error = `Maximum length is ${field.validation.maxLength}`;
      }
    }
    setFormErrors((prev) => ({
      ...prev,
      [id]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};
    formSchema?.fields.forEach((field) => {
      const value = formData[field.id] || "";
      validateField(field.id, value);
      if (field.required && !value) {
        newErrors[field.id] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted successfully!");
      setIsSubmitted(true);
    } else {
      setFormErrors(newErrors);
    }

    setIsSubmitting(false);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setJsonInput(reader.result as string);
      }
    };
    reader.readAsText(file);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  const handleCopyJson = () => {
        navigator.clipboard.writeText(jsonInput).then(() => {
          alert("JSON copied to clipboard!");
        }).catch((err) => {
          console.error("Failed to copy JSON:", err);
        });
      };
  return (
    
    <div className={`min-h-screen p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
  <div className="container mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">📁FORM GENERATOR</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isDarkMode ? <Sun /> : <Moon />}
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">JSON Schema Editor</h2>
        <textarea
          className="w-full h-96 font-mono p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black" // Apply text color conditionally here
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`{
            "title": "Contact Form",
            "fields": [
              {
                "type": "text",
                "label": "Name",
                "name": "name",
                "required": true
              }
            ]
          }`}
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleDownload}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Download /> Download JSON
          </button>
          <label
            htmlFor="upload"
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
          >
            <Upload /> Upload JSON
            <input
              id="upload"
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
          <button
                onClick={handleCopyJson}
                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
              >
                <Clipboard /> Copy Form JSON
              </button>
            
            {jsonError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{jsonError}</AlertDescription>
              </Alert>
            )}
        </div>
        {jsonError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{jsonError}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {formSchema ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">{formSchema.formTitle}</h2>
            {formSchema.formDescription && (
              <p className="text-gray-600 dark:text-gray-300 mb-6">{formSchema.formDescription}</p>
            )}

            {formSchema.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-black dark:text-white">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black" // Apply text color conditionally here
                    required={field.required}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "radio" ? (
                  <div className="space-y-1">
                    {field.options?.map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`${field.id}-${option.value}`}
                          name={field.id}
                          value={option.value}
                          checked={formData[field.id] === option.value}
                          onChange={() => handleInputChange(field.id, option.value)}
                          required={field.required}
                        />
                        <label htmlFor={`${field.id}-${option.value}`} className="text-white">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black" // Apply text color conditionally here
                    required={field.required}
                  />
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black" // Apply text color conditionally here
                    required={field.required}
                  />
                )}
                {formErrors[field.id] && (
                  <p className="text-red-500 text-sm">{formErrors[field.id]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="p-2 bg-blue-500 text-black rounded hover:bg-blue-600 flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {isSubmitted && (
              <Alert variant="success" className="mt-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Form submitted successfully!</AlertDescription>
              </Alert>
            )}
          </form>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Provide a valid JSON schema to render the form.</p>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default Form;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// import React, { useState, useEffect } from "react";
// import { AlertCircle, CheckCircle2, Sun, Moon, Download, Upload, Clipboard } from "lucide-react";

// const Alert: React.FC<{ variant?: string; className?: string; children: React.ReactNode }> = ({
//   variant,
//   className,
//   children,
// }) => {
//   return <div className={`alert alert-${variant} ${className}`}>{children}</div>;
// };

// const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return <span className="alert-description">{children}</span>;
// };

// interface FormOption {
//   value: string;
//   label: string;
// }

// interface FormValidation {
//   pattern?: string;
//   message?: string;
//   min?: number;
//   max?: number;
//   minLength?: number;
//   maxLength?: number;
// }

// interface FormField {
//   id: string;
//   type: "text" | "number" | "email" | "select" | "textarea" | "radio";
//   label: string;
//   required?: boolean;
//   placeholder?: string;
//   options?: FormOption[];
//   validation?: FormValidation;
// }

// interface FormSchema {
//   formTitle: string;
//   formDescription?: string;
//   fields: FormField[];
// }

// const Form: React.FC = () => {
//   const [jsonInput, setJsonInput] = useState<string>("");
//   const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
//   const [jsonError, setJsonError] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Record<string, string>>({});
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

//   useEffect(() => {
//     try {
//       if (!jsonInput.trim()) {
//         setFormSchema(null);
//         setJsonError(null);
//         return;
//       }
//       const parsed = JSON.parse(jsonInput) as FormSchema;
//       if (!parsed.formTitle || !Array.isArray(parsed.fields)) {
//         throw new Error('Invalid schema format. Must include "formTitle" and "fields" array.');
//       }
//       setFormSchema(parsed);
//       setJsonError(null);
//     } catch (error) {
//       setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
//       setFormSchema(null);
//     }
//   }, [jsonInput]);

//   const handleInputChange = (id: string, value: string): void => {
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     validateField(id, value);
//   };

//   const validateField = (id: string, value: string): void => {
//     const field = formSchema?.fields.find((f) => f.id === id);
//     if (!field) return;

//     let error = "";
//     if (field.required && !value) {
//       error = "This field is required";
//     } else if (field.validation) {
//       if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
//         error = field.validation.message || "Invalid format";
//       }
//       if (field.validation.minLength && value.length < field.validation.minLength) {
//         error = `Minimum length is ${field.validation.minLength}`;
//       }
//       if (field.validation.maxLength && value.length > field.validation.maxLength) {
//         error = `Maximum length is ${field.validation.maxLength}`;
//       }
//     }
//     setFormErrors((prev) => ({
//       ...prev,
//       [id]: error,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const newErrors: Record<string, string> = {};
//     formSchema?.fields.forEach((field) => {
//       const value = formData[field.id] || "";
//       validateField(field.id, value);
//       if (field.required && !value) {
//         newErrors[field.id] = "This field is required";
//       }
//     });

//     if (Object.keys(newErrors).length === 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Form submitted successfully!");
//       setIsSubmitted(true);
//     } else {
//       setFormErrors(newErrors);
//     }

//     setIsSubmitting(false);
//   };

//   const handleDownload = () => {
//     const blob = new Blob([jsonInput], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "form-schema.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.result) {
//         setJsonInput(reader.result as string);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode((prev) => !prev);
//   };

//   const handleCopyJson = () => {
//     navigator.clipboard.writeText(jsonInput).then(() => {
//       alert("JSON copied to clipboard!");
//     }).catch((err) => {
//       console.error("Failed to copy JSON:", err);
//     });
//   };

//   return (
//     <div className={`min-h-screen p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">📁FORM GENERATOR</h1>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             {isDarkMode ? <Sun /> : <Moon />}
//           </button>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
//             <h2 className="text-lg font-semibold mb-4">JSON Schema Editor</h2>
//             <textarea
//               className="w-full h-96 font-mono p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
//               value={jsonInput}
//               onChange={(e) => setJsonInput(e.target.value)}
//               placeholder={`{
//                 "title": "Contact Form",
//                 "fields": [
//                   {
//                     "type": "text",
//                     "label": "Name",
//                     "name": "name",
//                     "required": true
//                   }
//                 ]
//               }`}
//             />
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={handleDownload}
//                 className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
//               >
//                 <Download /> Download JSON
//               </button>
//               <label
//                 htmlFor="upload"
//                 className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
//               >
//                 <Upload /> Upload JSON
//                 <input
//                   id="upload"
//                   type="file"
//                   accept="application/json"
//                   className="hidden"
//                   onChange={handleUpload}
//                 />
//               </label>
//               <button
//                 onClick={handleCopyJson}
//                 className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
//               >
//                 <Clipboard /> Copy Form JSON
//               </button>
//             </div>
//             {jsonError && (
//               <Alert variant="destructive" className="mt-4">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{jsonError}</AlertDescription>
//               </Alert>
//             )}
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
//             {formSchema ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <h2 className="text-lg font-semibold mb-2">{formSchema.formTitle}</h2>
//                 {formSchema.formDescription && (
//                   <p className="text-gray-600 dark:text-gray-300 mb-6">{formSchema.formDescription}</p>
//                 )}

//                 {formSchema.fields.map((field) => (
//                   <div key={field.id} className="space-y-2">
//                     <label className="block text-sm font-medium text-black dark:text-white">
//                       {field.label}
//                       {field.required && <span className="text-red-500">*</span>}
//                     </label>
//                     {field.type === "select" ? (
//                       <select
//                         id={field.id}
//                         value={formData[field.id] || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       >
//                         {field.options?.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === "textarea" ? (
//                       <textarea
//                         id={field.id}
//                         value={formData[field.id] || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder={field.placeholder}
//                       />
//                     ) : (
//                       <input
//                         type={field.type}
//                         id={field.id}
//                         value={formData[field.id] || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder={field.placeholder}
//                       />
//                     )}
//                     {formErrors[field.id] && (
//                       <p className="text-red-500 text-xs">{formErrors[field.id]}</p>
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex justify-end gap-4">
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
//                       isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {isSubmitting ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//                 {isSubmitted && (
//                   <Alert variant="success" className="mt-4">
//                     <CheckCircle2 className="h-4 w-4" />
//                     <AlertDescription>Form submitted successfully!</AlertDescription>
//                   </Alert>
//                 )}
//               </form>
//             ) : (
//               <div className="text-center text-gray-500">Please enter a valid JSON schema to preview the form.</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Form;


// import React, { useState, useEffect } from "react";
// import { AlertCircle, CheckCircle2, Sun, Moon, Download, Upload, Clipboard } from "lucide-react";

// const Alert: React.FC<{ variant?: string; className?: string; children: React.ReactNode }> = ({
//   variant,
//   className,
//   children,
// }) => {
//   return <div className={`alert alert-${variant} ${className}`}>{children}</div>;
// };

// const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return <span className="alert-description">{children}</span>;
// };

// interface FormOption {
//   value: string;
//   label: string;
// }

// interface FormValidation {
//   pattern?: string;
//   message?: string;
//   min?: number;
//   max?: number;
//   minLength?: number;
//   maxLength?: number;
// }

// interface FormField {
//   id: string;
//   type: "text" | "number" | "email" | "select" | "textarea" | "radio";
//   label: string;
//   required?: boolean;
//   placeholder?: string;
//   options?: FormOption[];
//   validation?: FormValidation;
// }

// interface FormSchema {
//   formTitle: string;
//   formDescription?: string;
//   fields: FormField[];
// }

// const Form: React.FC = () => {
//   const [jsonInput, setJsonInput] = useState<string>("");
//   const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
//   const [jsonError, setJsonError] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Record<string, string>>({});
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

//   useEffect(() => {
//     try {
//       if (!jsonInput.trim()) {
//         setFormSchema(null);
//         setJsonError(null);
//         return;
//       }
//       const parsed = JSON.parse(jsonInput) as FormSchema;
//       if (!parsed.formTitle || !Array.isArray(parsed.fields)) {
//         throw new Error('Invalid schema format. Must include "formTitle" and "fields" array.');
//       }
//       setFormSchema(parsed);
//       setJsonError(null);
//     } catch (error) {
//       setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
//       setFormSchema(null);
//     }
//   }, [jsonInput]);

//   const handleInputChange = (id: string, value: string): void => {
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     validateField(id, value);
//   };

//   const validateField = (id: string, value: string): void => {
//     const field = formSchema?.fields.find((f) => f.id === id);
//     if (!field) return;

//     let error = "";
//     if (field.required && !value) {
//       error = "This field is required";
//     } else if (field.validation) {
//       if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
//         error = field.validation.message || "Invalid format";
//       }
//       if (field.validation.minLength && value.length < field.validation.minLength) {
//         error = `Minimum length is ${field.validation.minLength}`;
//       }
//       if (field.validation.maxLength && value.length > field.validation.maxLength) {
//         error = `Maximum length is ${field.validation.maxLength}`;
//       }
//     }
//     setFormErrors((prev) => ({
//       ...prev,
//       [id]: error,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const newErrors: Record<string, string> = {};
//     formSchema?.fields.forEach((field) => {
//       const value = formData[field.id] || "";
//       validateField(field.id, value);
//       if (field.required && !value) {
//         newErrors[field.id] = "This field is required";
//       }
//     });

//     if (Object.keys(newErrors).length === 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Form submitted successfully!");
//       setIsSubmitted(true);
//     } else {
//       setFormErrors(newErrors);
//     }

//     setIsSubmitting(false);
//   };

//   const handleDownload = () => {
//     const blob = new Blob([jsonInput], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "form-schema.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.result) {
//         setJsonInput(reader.result as string);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode((prev) => !prev);
//   };

//   const handleCopyJson = () => {
//     navigator.clipboard.writeText(jsonInput).then(() => {
//       alert("JSON copied to clipboard!");
//     }).catch((err) => {
//       console.error("Failed to copy JSON:", err);
//     });
//   };

//   return (
//     <div className={`min-h-screen p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">📁FORM GENERATOR</h1>
//           <button
//             onClick={toggleDarkMode}
//             className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             {isDarkMode ? <Sun /> : <Moon />}
//           </button>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
//             <h2 className="text-lg font-semibold mb-4">JSON Schema Editor</h2>
//             <textarea
//               className="w-full h-96 font-mono p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
//               value={jsonInput}
//               onChange={(e) => setJsonInput(e.target.value)}
//               placeholder={`{
//                 "title": "Contact Form",
//                 "fields": [
//                   {
//                     "type": "text",
//                     "label": "Name",
//                     "name": "name",
//                     "required": true
//                   }
//                 ]
//               }`}
//             />
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={handleDownload}
//                 className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
//               >
//                 <Download /> Download JSON
//               </button>
//               <label
//                 htmlFor="upload"
//                 className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 cursor-pointer"
//               >
//                 <Upload /> Upload JSON
//                 <input
//                   id="upload"
//                   type="file"
//                   accept="application/json"
//                   className="hidden"
//                   onChange={handleUpload}
//                 />
//               </label>
//               <button
//                 onClick={handleCopyJson}
//                 className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
//               >
//                 <Clipboard /> Copy Form JSON
//               </button>
//             </div>
//             {jsonError && (
//               <Alert variant="destructive" className="mt-4">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{jsonError}</AlertDescription>
//               </Alert>
//             )}
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
//             {formSchema ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <h2 className="text-lg font-semibold mb-2">{formSchema.formTitle}</h2>
//                 {formSchema.formDescription && (
//                   <p className="text-gray-600 dark:text-gray-300 mb-6">{formSchema.formDescription}</p>
//                 )}

//                 {formSchema.fields.map((field) => (
//                   <div key={field.id} className="space-y-2">
//                     <label className="block text-sm font-medium text-black dark:text-white">
//                       {field.label}
//                       {field.required && <span className="text-red-500">*</span>}
//                     </label>
//                     {field.type === "select" ? (
//                       <select
//                         id={field.id}
//                         value={formData[field.id] || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       >
//                         {field.options?.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                     ) : field.type === "textarea" ? (
//                       <textarea
//                         id={field.id}
//                         value={formData[field.id] || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder={field.placeholder}
//                       />
//                     ) : (
//                       <input
//                         id={field.id}
//                         type={field.type}
//                         value={formData[field.id] || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder={field.placeholder}
//                       />
//                     )}
//                     {formErrors[field.id] && (
//                       <p className="text-red-500 text-xs">{formErrors[field.id]}</p>
//                     )}
//                   </div>
//                 ))}
//                 <div className="flex gap-4">
//                   <button
//                     type="submit"
//                     className={`w-full p-2 rounded ${isSubmitting ? "bg-gray-400" : "bg-blue-500"}`}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Submitting..." : "Submit Form"}
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="text-gray-600 dark:text-gray-300">Please enter a valid JSON schema above.</div>
//             )}
//             {isSubmitted && (
//               <Alert variant="success" className="mt-4">
//                 <CheckCircle2 className="h-4 w-4" />
//                 <AlertDescription>Form submitted successfully!</AlertDescription>
//               </Alert>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Form;
