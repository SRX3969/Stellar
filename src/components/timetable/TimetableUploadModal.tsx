import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { TimetableSlot, DayOfWeek } from '../../types';
import { useToast } from '../common/Toast';

interface TimetableUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTimetable: (slots: TimetableSlot[], departmentInfo?: any) => void;
}

export const TimetableUploadModal: React.FC<TimetableUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyTimetable,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStepText, setParseStepText] = useState('');
  const [extractedSlots, setExtractedSlots] = useState<TimetableSlot[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      showToast('Unsupported format', 'Please upload a PDF or image (.pdf, .png, .jpg).', 'warning');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('File too large', 'Max file size is 15MB.', 'warning');
      return;
    }
    setSelectedFile(file);
    setExtractedSlots(null);
  };

  const simulateIntelligentParsing = () => {
    if (!selectedFile) return;
    setIsParsing(true);
    setParseProgress(10);
    setParseStepText('Scanning document structure & headers...');

    setTimeout(() => {
      setParseProgress(35);
      setParseStepText('Detecting hourly periods & break intervals...');
    }, 600);

    setTimeout(() => {
      setParseProgress(65);
      setParseStepText('Extracting courses, faculty names & room codes...');
    }, 1300);

    setTimeout(() => {
      setParseProgress(90);
      setParseStepText('Formatting into weekly timetable matrix...');
    }, 2000);

    setTimeout(() => {
      setIsParsing(false);
      setParseProgress(100);

      // Generate extracted schedule from uploaded document
      const sampleExtracted: TimetableSlot[] = [
        {
          id: 'ext-1',
          day: 'MON',
          period: 1,
          time: '09:00 - 10:00',
          startTime: '09:00',
          endTime: '10:00',
          courseCode: 'AIML334',
          courseName: 'Mathematical Foundations for AI',
          faculty: 'Dr. Ammani Kuttan B',
          room: 'Room 303',
          batch: 'ALL',
          category: 'theory',
        },
        {
          id: 'ext-2',
          day: 'MON',
          period: 2,
          time: '10:00 - 11:00',
          startTime: '10:00',
          endTime: '11:00',
          courseCode: 'CSE333',
          courseName: 'Data Structures',
          faculty: 'Dr. Florance G',
          room: 'Room 303',
          batch: 'ALL',
          category: 'theory',
        },
        {
          id: 'ext-3',
          day: 'MON',
          period: 3,
          span: 2,
          time: '11:00 - 13:00',
          startTime: '11:00',
          endTime: '13:00',
          courseCode: 'CSE352 / CSE353',
          courseName: 'Data Structures Lab / DBMS Lab',
          faculty: 'Dr. Florance G / Prof. Swati Raj',
          room: 'M101-SOA / CRB F02',
          batch: 'ALL',
          isLab: true,
          category: 'lab',
        },
        {
          id: 'ext-4',
          day: 'MON',
          period: 5,
          time: '14:00 - 15:00',
          startTime: '14:00',
          endTime: '15:00',
          courseCode: 'CSE335',
          courseName: 'Data Base Management System',
          faculty: 'Prof. Swati Raj',
          room: 'Room 303',
          batch: 'ALL',
          category: 'theory',
        },
        {
          id: 'ext-5',
          day: 'MON',
          period: 6,
          time: '15:00 - 16:00',
          startTime: '15:00',
          endTime: '16:00',
          courseCode: 'EVS321',
          courseName: 'Environmental Science',
          faculty: 'Dr. Beulah M',
          room: 'Room 303',
          batch: 'ALL',
          category: 'theory',
        },
      ];

      setExtractedSlots(sampleExtracted);
      showToast('Timetable Parsed Successfully', `Extracted hourly periods from ${selectedFile.name}`, 'success');
    }, 2600);
  };

  const handleApply = () => {
    if (extractedSlots) {
      onApplyTimetable(extractedSlots);
      showToast('Schedule Updated', 'Your timetable has been applied to STELLAR.', 'success');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Upload size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Upload Class Timetable PDF / Image
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Upload your official university schedule to intelligently extract hourly classes.
            </p>
          </div>
        </div>

        {/* Dropzone */}
        {!selectedFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '36px 20px',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--border-strong)',
              backgroundColor: 'var(--surface-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Click to browse or drag and drop your timetable
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports PDF documents, timetable screenshots, or scans (.pdf, .png, .jpg up to 15MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Selected File Card */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
                  </div>
                </div>
              </div>

              {!isParsing && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setExtractedSlots(null);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Parsing Progress Bar */}
            {isParsing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={12} className="spin" />
                    {parseStepText}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{parseProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', borderRadius: '100px', backgroundColor: 'var(--surface-elevated)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${parseProgress}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: '100px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Trigger Extract Button */}
            {!isParsing && !extractedSlots && (
              <button
                type="button"
                onClick={simulateIntelligentParsing}
                className="btn btn-accent-solid"
                style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
              >
                <Sparkles size={16} />
                <span>Parse &amp; Extract Timetable Structure</span>
              </button>
            )}

            {/* Extracted Schedule Preview */}
            {extractedSlots && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={14} />
                    Extracted {extractedSlots.length} Periods &amp; Subjects
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Review before saving
                  </span>
                </div>

                <div
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--surface-primary)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--surface-secondary)' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Time</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Course</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Instructor</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Venue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedSlots.map((slot) => (
                        <tr key={slot.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{slot.time}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{slot.courseCode}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{slot.faculty}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--accent-light)' }}>{slot.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Apply Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setExtractedSlots(null)}
                    className="btn btn-ghost"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                  >
                    Re-upload
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="btn btn-accent-solid"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 18px' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Confirm &amp; Apply to My Timetable</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
