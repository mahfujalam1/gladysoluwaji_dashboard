import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

export const joditConfig = {
  readonly: false,
  height: "500px",
  buttons:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  buttonsMD:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  buttonsSM:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  buttonsXS:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  placeholder: "",
};

const CustomJoditEditor = ({ initialContent, onChange }) => {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={initialContent}
      config={joditConfig}
      onBlur={newContent => onChange(newContent)}
      onChange={() => {}} // onChange is required by jodit-react, but we use onBlur for updates
    />
  );
};

export default CustomJoditEditor;