import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

const PlainTextQuillEditor = ({ onChange }) => {
  const handleRemarkChange = (content) => {
    // Convert HTML content to plain text
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const plainText = doc.body.textContent || "";
    onChange(plainText);
  };

  return (
    <ReactQuill
      onChange={handleRemarkChange}
      theme="snow"
      placeholder="Add a remark..."
      modules={{
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          [{ 'align': [] }],
          ['clean']
        ],
      }}
    />
  );
};

export default PlainTextQuillEditor;
