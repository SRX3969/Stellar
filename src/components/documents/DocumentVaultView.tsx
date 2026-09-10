import React, { useState } from 'react';
import {
  Files,
  Folder,
  UploadCloud,
  FileText,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  Layers,
  MessageSquare,
  Eye,
  X
} from 'lucide-react';
import { DOCUMENTS } from '../../data/mockData';
import { DocumentItem } from '../../types';
import { Modal } from '../common/Modal';
import { NavRoute } from '../shell/Sidebar';

interface DocumentVaultViewProps {
  onNavigate: (route: NavRoute) => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({ onNavigate }) => {
  const [activeFolder, setActiveFolder] = useState<'academic' | 'career' | 'personal'>('academic');
  const [docList, setDocList] = useState<DocumentItem[]>(DOCUMENTS);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'ready'>('idle');

  const filteredDocs = docList.filter((d) => d.folder === activeFolder);

  const handleSimulateDrop = (e: React.DragEvent) => {
    e.preventDefault();
    triggerUploadFlow('CS301_CIA_Mock_Question_Paper_2025.pdf', 'PDF', '1.8 MB');
  };

  const triggerUploadFlow = (name: string, fileType: 'PDF' | 'DOCX' | 'PPT' | 'IMG', size: string) => {
    setIsUploading(true);
    setUploadStatus('uploading');

    setTimeout(() => {
      setUploadStatus('processing');
      setTimeout(() => {
        setUploadStatus('ready');
        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          name,
          folder: activeFolder,
          category: 'DBMS',
          fileType,
          size,
          updatedAt: 'Just now',
          status: 'ready',
        };
        setDocList((prev) => [newDoc, ...prev]);

        setTimeout(() => {
          setIsUploading(false);
          setUploadStatus('idle');
        }, 1500);
      }, 1000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Academic Knowledge Base</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>Vector-Indexed for AI Tutor</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Document Vault
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Secure repository for lecture slides, syllabus documents, lab manuals, and career artifacts.
        </p>
      </div>

      {/* Drag and Drop Uploader (Section 34) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleSimulateDrop}
        onClick={() => triggerUploadFlow('Operating_Systems_MidTerm_Prep.pdf', 'PDF', '3.1 MB')}
        style={{
          padding: '28px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px dashed var(--border-strong)',
          backgroundColor: 'var(--surface-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          textAlign: 'center',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      >
        <UploadCloud size={28} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
        {isUploading ? (
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {uploadStatus === 'uploading' && 'Uploading document... (74%)'}
              {uploadStatus === 'processing' && 'Processing & generating syllabus embeddings...'}
              {uploadStatus === 'ready' && '✓ Document Ready & Indexed into AI Tutor!'}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Please wait while STELLAR organizes references
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Drop files here or click to upload
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Supported: PDF, PPTX, DOCX, Images • Automatically linked with relevant subjects
            </p>
          </div>
        )}
      </div>

      {/* Folder Tabs (Academic, Career, Personal) */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
        {(['academic', 'career', 'personal'] as const).map((folder) => {
          const isSelected = activeFolder === folder;
          const count = docList.filter((d) => d.folder === folder).length;

          return (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 400,
                backgroundColor: isSelected ? 'var(--surface-elevated)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--border-strong)' : 'transparent',
                textTransform: 'capitalize',
              }}
            >
              <Folder size={15} style={{ color: isSelected ? 'var(--accent-primary)' : 'inherit' }} />
              <span>{folder}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Document Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="card-base"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {doc.fileType}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.size}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <FileText size={18} style={{ color: 'var(--text-secondary)', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.4 }}>
                  {doc.name}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', paddingLeft: '28px' }}>
                {doc.category} • Updated {doc.updatedAt}
              </div>
            </div>

            {/* Document Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                marginTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => setPreviewDoc(doc)}
                style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Eye size={13} /> Preview
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => onNavigate('ai')}
                  title="Ask AI Tutor"
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent-light)',
                    border: '1px solid var(--accent-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={11} /> Ask AI
                </button>

                <button
                  onClick={() => onNavigate('study')}
                  title="Generate Flashcards"
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Layers size={11} /> Cards
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.name}
          subtitle={`${previewDoc.category} • ${previewDoc.size} • Uploaded ${previewDoc.updatedAt}`}
          maxWidth="680px"
        >
          <div style={{ padding: '20px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>Document Index Summary:</strong>
              <p style={{ marginTop: '8px' }}>
                This file contains institutional syllabus requirements, exam questions, and core formulas indexed by STELLAR's retrieval pipeline. It is available to the AI Tutor for contextual Q&amp;A and automated flashcard generation.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
            <button
              onClick={() => {
                setPreviewDoc(null);
                onNavigate('ai');
              }}
              className="btn btn-accent-solid"
            >
              Ask AI about this Document
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
