import React, { useState, useEffect } from 'react';
import { useTests } from '../context/TestContext';
import { Save, X } from 'lucide-react';

const defaultForm = {
  name: '',
  date: new Date().toISOString().slice(0, 10),
  marks: '',
  maxMarks: '100',
  gateScore: '',
  rank: '',
  remarks: '',
};

const AddTest = () => {
  const { addTest, updateTest, editingTest, setEditingTest, setActiveSection } = useTests();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editingTest) {
      setForm({
        name: editingTest.name || '',
        date: editingTest.date || '',
        marks: String(editingTest.marks ?? ''),
        maxMarks: String(editingTest.maxMarks ?? '100'),
        gateScore: editingTest.gateScore || '',
        rank: editingTest.rank || '',
        remarks: editingTest.remarks || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTest]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Test name is required.';
    if (!form.date) errs.date = 'Date is required.';
    const marks = parseFloat(form.marks);
    const maxMarks = parseFloat(form.maxMarks);
    if (form.marks === '' || isNaN(marks)) errs.marks = 'Marks obtained is required.';
    else if (marks < 0) errs.marks = 'Marks cannot be negative.';
    if (form.maxMarks === '' || isNaN(maxMarks) || maxMarks <= 0) errs.maxMarks = 'Maximum marks must be a positive number.';
    if (!isNaN(marks) && !isNaN(maxMarks) && marks > maxMarks) errs.marks = `Marks cannot exceed maximum marks (${maxMarks}).`;
    if (form.gateScore && isNaN(parseFloat(form.gateScore))) errs.gateScore = 'Enter a valid GATE score.';
    if (form.rank && isNaN(parseInt(form.rank))) errs.rank = 'Enter a valid rank.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      name: form.name.trim(),
      date: form.date,
      marks: parseFloat(form.marks),
      maxMarks: parseFloat(form.maxMarks),
      gateScore: form.gateScore ? parseFloat(form.gateScore) : '',
      rank: form.rank ? parseInt(form.rank) : '',
      remarks: form.remarks.trim(),
    };

    if (editingTest) {
      updateTest(editingTest.id, payload);
      setEditingTest(null);
    } else {
      addTest(payload);
    }

    setForm(defaultForm);
    setErrors({});
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditingTest(null);
    setForm(defaultForm);
    setErrors({});
    setActiveSection('history');
  };

  const pct = form.marks && form.maxMarks && !isNaN(parseFloat(form.marks)) && !isNaN(parseFloat(form.maxMarks))
    ? ((parseFloat(form.marks) / parseFloat(form.maxMarks)) * 100).toFixed(1)
    : null;

  return (
    <div className="add-test">
      <div className="page-header">
        <h1>{editingTest ? 'Edit Mock Test' : 'Add Mock Test'}</h1>
        <p className="page-subtitle">
          {editingTest ? 'Update the details of this mock test.' : 'Record your latest mock test performance.'}
        </p>
      </div>

      {saved && (
        <div className="alert alert--success">
          ✓ Mock test saved successfully! Keep up the great work.
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className={`form-group form-group--full ${errors.name ? 'form-group--error' : ''}`}>
              <label>Mock Test Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., GATE Mock 01, ACE Test 02, Made Easy Mock 03"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className={`form-group ${errors.date ? 'form-group--error' : ''}`}>
              <label>Test Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className={`form-group ${errors.marks ? 'form-group--error' : ''}`}>
              <label>Marks Obtained *</label>
              <input
                type="number"
                name="marks"
                value={form.marks}
                onChange={handleChange}
                placeholder="e.g., 72.5"
                step="0.5"
              />
              {errors.marks && <span className="form-error">{errors.marks}</span>}
            </div>

            <div className={`form-group ${errors.maxMarks ? 'form-group--error' : ''}`}>
              <label>Maximum Marks *</label>
              <input
                type="number"
                name="maxMarks"
                value={form.maxMarks}
                onChange={handleChange}
                placeholder="100"
                step="0.5"
              />
              {errors.maxMarks && <span className="form-error">{errors.maxMarks}</span>}
            </div>

            {pct !== null && (
              <div className="form-group form-group--full">
                <div className="pct-preview">
                  <span className="pct-preview__label">Calculated Percentage:</span>
                  <span className={`pct-preview__value ${parseFloat(pct) >= 60 ? 'good' : parseFloat(pct) >= 40 ? 'avg' : 'low'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            )}

            <div className={`form-group ${errors.gateScore ? 'form-group--error' : ''}`}>
              <label>GATE Score <span className="optional">(optional)</span></label>
              <input
                type="number"
                name="gateScore"
                value={form.gateScore}
                onChange={handleChange}
                placeholder="e.g., 650"
                step="0.1"
              />
              {errors.gateScore && <span className="form-error">{errors.gateScore}</span>}
            </div>

            <div className={`form-group ${errors.rank ? 'form-group--error' : ''}`}>
              <label>Rank <span className="optional">(optional)</span></label>
              <input
                type="number"
                name="rank"
                value={form.rank}
                onChange={handleChange}
                placeholder="e.g., 1250"
              />
              {errors.rank && <span className="form-error">{errors.rank}</span>}
            </div>

            <div className="form-group form-group--full">
              <label>Remarks <span className="optional">(optional)</span></label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="e.g., Struggled with Operating Systems, good in DS/Algo"
                rows={3}
              />
            </div>
          </div>

          <div className="form-actions">
            {editingTest && (
              <button type="button" className="btn btn--ghost" onClick={handleCancel}>
                <X size={16} /> Cancel
              </button>
            )}
            <button type="submit" className="btn btn--primary">
              <Save size={16} />
              {editingTest ? 'Update Test' : 'Save Mock Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTest;
