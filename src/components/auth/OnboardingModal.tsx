import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import {
  Compass,
  GraduationCap,
  Clock,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  User,
  Calendar,
  Building,
  MapPin,
  BookOpen,
  Users,
  CheckCircle2,
  FileText,
  Sparkles,
  Search,
  SkipForward
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { UserProfile } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: Partial<UserProfile>) => void;
  initialName?: string;
  initialEmail?: string;
}

const POPULAR_DEPARTMENTS = [
  'Department of AI and Data Science Engineering',
  'Department of Computer Science and Engineering (CSE)',
  'Department of Artificial Intelligence and Machine Learning (AIML)',
  'Department of Information Science and Engineering (ISE)',
  'Department of Electronics and Communication Engineering (ECE)',
  'Department of Electrical and Electronics Engineering (EEE)',
  'Department of Mechanical Engineering',
  'Department of Civil Engineering',
  'Department of Biotechnology Engineering',
  'Department of Aerospace Engineering',
  'Department of Cyber Security and Forensics',
  'Department of Data Science and Analytics',
  'Department of Robotics and Automation',
  'Department of Computer Applications (MCA / BCA)',
  'Department of Business Administration (MBA / BBA)',
  'Department of Mathematics and Computing',
  'Department of Humanities and Social Sciences',
];

const AVATAR_PRESETS = ['👨‍💻', '👩‍💻', '🎓', '🤖', '⚡', '🚀', '🧠', '🔬'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialName = 'Abhiram',
  initialEmail = 'student@gmail.com',
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Personal Identity & Photo
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('👨‍💻');
  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState('2005-04-16');
  const [studentId, setStudentId] = useState('AI26-BTECH-303');

  // Step 2: Institution & Campus
  const [university, setUniversity] = useState('School of Engineering and Technology');
  const [campus, setCampus] = useState('Central Campus / Arch Block');

  // Step 3: Department (Searchable Autocomplete) & Degree
  const [department, setDepartment] = useState('Department of AI and Data Science Engineering');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [course, setCourse] = useState('B.Tech Artificial Intelligence');
  const [semester, setSemester] = useState('Year 2 — Semester III');

  // Step 4: Classroom & Practical Lab Batch
  const [roomNo, setRoomNo] = useState('Room No: 303, 3F- Arch Block');
  const [batch, setBatch] = useState<'B1' | 'B2'>('B1');
  const [classTeacher, setClassTeacher] = useState('Prof. Swati Raj (Co: Dr. Ambily Balaram)');

  // Step 5: Academic Criteria & Study Target
  const [criterion, setCriterion] = useState(75);
  const [dailyGoal, setDailyGoal] = useState(2.0);

  // Step 6: Timetable Setup
  const [timetableChoice, setTimetableChoice] = useState<'template' | 'upload' | 'skip'>('template');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Filter department suggestions based on input
  const filteredDepartments = POPULAR_DEPARTMENTS.filter((d) =>
    d.toLowerCase().includes(department.toLowerCase())
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File too large', 'Please choose an image under 5MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
          setSelectedEmoji('');
          showToast('Photo Uploaded', 'Profile image attached successfully.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTimetableFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setTimetableChoice('upload');
      showToast('Timetable File Attached', `Ready to parse: ${file.name}`, 'info');
    }
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      showToast('Missing field', 'Please enter your full name.', 'warning');
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const finishOnboarding = () => {
    const finalData: Partial<UserProfile> = {
      name: name.trim(),
      dob,
      studentId: studentId.trim(),
      avatarUrl: avatarUrl || selectedEmoji,
      university: university.trim(),
      campus: campus.trim(),
      department: department.trim(),
      course: course.trim(),
      semester: semester.trim(),
      roomNo: roomNo.trim(),
      batch,
      classTeacher: classTeacher.trim(),
      criterion,
      dailyGoal,
      onboardingCompleted: true,
      hasTimetableConfigured: timetableChoice !== 'skip',
    };

    onComplete(finalData);
    showToast(
      'Profile Configured',
      timetableChoice === 'skip'
        ? 'Welcome to STELLAR! You can upload your timetable anytime from the Timetable page.'
        : 'Welcome to STELLAR! Your schedule and student operating system are active.',
      'success'
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} maxWidth="540px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Step Progress Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              STEP {step} OF {totalSteps}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {step === 1 && 'Personal Identity & Photo'}
              {step === 2 && 'Institution & Campus'}
              {step === 3 && 'Department & Program'}
              {step === 4 && 'Classroom & Lab Batch'}
              {step === 5 && 'Attendance & Study Target'}
              {step === 6 && 'Timetable Setup'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', height: '4px' }}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '100%',
                  borderRadius: '2px',
                  backgroundColor: s <= step ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                  transition: 'background-color 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* ===================== STEP 1: IDENTITY, PHOTO & DOB ===================== */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Let's set up your Student Profile 👋
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Upload a photo or choose an avatar, and verify your personal details.
              </p>
            </div>

            {/* Profile Picture Upload & Emoji Selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-default)' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '2px solid var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{selectedEmoji}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    border: '2px solid var(--surface-secondary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Upload photo"
                >
                  <Camera size={12} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Choose an Avatar or Upload Photo
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {AVATAR_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setAvatarUrl('');
                      }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selectedEmoji === emoji && !avatarUrl ? 'var(--accent-subtle)' : 'var(--surface-elevated)',
                        border: `1px solid ${selectedEmoji === emoji && !avatarUrl ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abhiram"
                  style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
                <User size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Date of Birth & Student Roll No Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Date of Birth (DOB) *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ width: '100%', padding: '9px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Admission No / USN / Roll No
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. AI26-BTECH-303"
                  style={{ width: '100%', padding: '9px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 2: INSTITUTION & CAMPUS ===================== */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Where are you studying? 🏛️
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Your institutional affiliation configures your academic hub.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                University / College Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. School of Engineering and Technology"
                  style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
                <Building size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Campus / Location / Block
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder="e.g. Central Campus / Arch Block"
                  style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
                <MapPin size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 3: SEARCHABLE DEPARTMENT & DEGREE ===================== */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Department &amp; Degree Program 📚
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Start typing to search department options or enter your custom department.
              </p>
            </div>

            {/* Department with Searchable Autocomplete */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Department (Type to see suggestions) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setShowDeptDropdown(true);
                  }}
                  onFocus={() => setShowDeptDropdown(true)}
                  placeholder="e.g. Type 'AI', 'Computer', 'Data'..."
                  style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
                <Search size={14} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--text-muted)' }} />
              </div>

              {/* Autocomplete Dropdown */}
              {showDeptDropdown && filteredDepartments.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    marginTop: '4px',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  {filteredDepartments.map((dept) => (
                    <div
                      key={dept}
                      onClick={() => {
                        setDepartment(dept);
                        setShowDeptDropdown(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Degree & Semester */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Degree / Major *
                </label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech AI"
                  style={{ width: '100%', padding: '9px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Academic Term / Semester *
                </label>
                <input
                  type="text"
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. Year 2 — Semester III"
                  style={{ width: '100%', padding: '9px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 4: CLASSROOM & LAB BATCH ===================== */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Classroom &amp; Practical Lab Batch 🧪
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Specify your classroom venue and assigned practical batch.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Classroom Venue / Room Number
              </label>
              <input
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                placeholder="e.g. Room No: 303, 3F- Arch Block"
                style={{ width: '100%', padding: '9px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
              />
            </div>

            {/* Practical Batch Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Assigned Practical Lab Batch *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBatch('B1')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: batch === 'B1' ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                    border: `1.5px solid ${batch === 'B1' ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    color: batch === 'B1' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: batch === 'B1' ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: batch === 'B1' ? 'var(--accent-primary)' : 'inherit' }}>
                    Batch 1 (B1)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    DS Lab on Mon • DBMS Lab on Tue
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBatch('B2')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: batch === 'B2' ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                    border: `1.5px solid ${batch === 'B2' ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    color: batch === 'B2' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: batch === 'B2' ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: batch === 'B2' ? 'var(--accent-primary)' : 'inherit' }}>
                    Batch 2 (B2)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    DBMS Lab on Mon • XR Lab on Tue
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Class Teacher / Faculty Mentor
              </label>
              <input
                type="text"
                value={classTeacher}
                onChange={(e) => setClassTeacher(e.target.value)}
                placeholder="e.g. Prof. Swati Raj"
                style={{ width: '100%', padding: '9px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {/* ===================== STEP 5: ATTENDANCE & STUDY TARGET ===================== */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Attendance &amp; Study Routine 🎯
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Configure attendance thresholds and daily focus goals.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Mandatory Attendance Criterion
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {criterion}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="90"
                step="5"
                value={criterion}
                onChange={(e) => setCriterion(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                <span>60% (Flexible)</span>
                <span>75% (Standard)</span>
                <span>85% (Strict)</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Target Daily Self-Study Hours
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>
                  {dailyGoal} hrs / day
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-success)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                <span>1.0 hr</span>
                <span>2.0 hrs (Balanced)</span>
                <span>5.0 hrs (Intense)</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 6: TIMETABLE SETUP (OR SKIP) ===================== */}
        {step === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Class Timetable Setup 📅
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Choose how you want to configure your weekly schedule.
              </p>
            </div>

            {/* Option 1: AI Template */}
            <div
              onClick={() => setTimetableChoice('template')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: timetableChoice === 'template' ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                border: `1.5px solid ${timetableChoice === 'template' ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Sparkles size={18} style={{ color: 'var(--accent-primary)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Load AI &amp; Data Science Sem III Template (Recommended)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Pre-configures all periods (09:00 - 16:00), faculty, and lab venues from your official timetable.
                </div>
              </div>
            </div>

            {/* Option 2: Upload Timetable PDF/Image */}
            <div
              onClick={() => setTimetableChoice('upload')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: timetableChoice === 'upload' ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                border: `1.5px solid ${timetableChoice === 'upload' ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Upload size={18} style={{ color: 'var(--color-info)', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Upload Timetable PDF / Image Now
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Select a PDF or photo of your class schedule to parse.'}
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleTimetableFileUpload}
                  style={{ marginTop: '8px', fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Option 3: Skip for Now */}
            <div
              onClick={() => setTimetableChoice('skip')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: timetableChoice === 'skip' ? 'rgba(234, 179, 8, 0.08)' : 'var(--surface-primary)',
                border: `1.5px solid ${timetableChoice === 'skip' ? 'var(--color-warning)' : 'var(--border-default)'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <SkipForward size={18} style={{ color: 'var(--color-warning)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Skip for Now — I'll upload it later
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Don't have your timetable right now? No problem! All other personal details will be saved, and you can upload anytime from the Timetable page.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-default)' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step === 6 && (
              <button
                type="button"
                onClick={() => {
                  setTimetableChoice('skip');
                  finishOnboarding();
                }}
                className="btn btn-outline"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                Skip Timetable
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn btn-accent-solid"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 18px' }}
            >
              <span>{step === totalSteps ? 'Complete Onboarding' : 'Next Step'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
