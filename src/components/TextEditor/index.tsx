import React from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill/lib";
// 
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'code'],
    ['clean'],
  ],
};
const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'code',
  ];

const TextEditor = ({ value, onChange, placeholder }: any) => {
    return (
      <>
      <ReactQuill
        theme="snow"
        value={value || ''}
        modules={modules}
        formats={formats}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
    );
};

export default TextEditor;