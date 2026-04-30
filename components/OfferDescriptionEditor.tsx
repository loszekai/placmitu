"use client";

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    Link,
    Heading,
    BlockQuote,
    Alignment,
    Table,
    TableToolbar,
    HorizontalLine,
    Indent,
    IndentBlock
} from 'ckeditor5';
import translations from 'ckeditor5/translations/pl.js';

import 'ckeditor5/ckeditor5.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OfferDescriptionEditor({ value, onChange }: Props) {
  return (
    <div className="ckeditor-wrapper prose max-w-none w-full">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: 'GPL',
          plugins: [
            Essentials, Paragraph, Heading,
            Bold, Italic, Underline, Strikethrough,
            List, Link, BlockQuote, Alignment,
            Table, TableToolbar, HorizontalLine,
            Indent, IndentBlock
          ],
          toolbar: {
            items: [
              'undo', 'redo', '|',
              'heading', '|',
              'bold', 'italic', 'underline', 'strikethrough', '|',
              'alignment', '|',
              'bulletedList', 'numberedList', 'outdent', 'indent', '|',
              'link', 'blockQuote', 'insertTable', 'horizontalLine'
            ],
            shouldNotGroupWhenFull: true
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          },
          language: 'pl',
          translations: [translations]
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 150px;
        }
        .ck.ck-editor__main > .ck-editor__editable {
          border-bottom-left-radius: var(--radius, 0.5rem) !important;
          border-bottom-right-radius: var(--radius, 0.5rem) !important;
          border-color: #e2e8f0 !important;
        }
        .ck.ck-toolbar {
          border-top-left-radius: var(--radius, 0.5rem) !important;
          border-top-right-radius: var(--radius, 0.5rem) !important;
          border-color: #e2e8f0 !important;
          background: #f8fafc !important;
        }
        .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 1px #4f46e5 !important;
        }
      `}</style>
    </div>
  );
}
