# Class 11-12 UI Implementation Guide

**Date**: 2026-09-03  
**Component**: NewExam.tsx  
**Status**: Ready for frontend implementation  
**Priority**: HIGH (Blocks assessment from working)

---

## 🎯 WHAT NEEDS TO BE FIXED

### Issue 1: Question Counter Shows 7/79 Instead of 7/78
**Location**: NewExam.tsx line ~213  
**Problem**: Shows 79 instead of 78  
**Root Cause**: Hard-coded or incorrect total calculation  

### Issue 2: Scale Questions (Q7, Q41-42, etc.) Have No Input
**Location**: NewExam.tsx line ~679-688  
**Problem**: Scale question shows but NO SLIDER appears to answer it  
**Status**: Code EXISTS but not being triggered for "scale" type  

### Issue 3: Multiple Choice with Selection Limits Not Enforced
**Location**: NewExam.tsx ~714-733  
**Problem**: No max selection validation for Q63, Q68, Q71, Q74  

---

## 🔧 FIX 1: Correct Question Counter (78, not 79)

### Location
**File**: `app/NewExam.tsx`  
**Line**: ~213 and ~453 (stats panel)

### Current Code
```tsx
const total = flat.length;  // Should be 78, showing 79
```

### Fix
The counter should automatically be correct since `flat` is calculated from the actual data. Check:

1. Are we loading all 78 questions from `questions.json`?
2. Is there an off-by-one error in the counter display?

**Check with**:
```tsx
console.log("Total questions:", flat.length);  // Should log 78
```

**Then verify in UI**:
- Currently shows: `7 / 79`
- Should show: `7 / 78`

---

## 🎛️ FIX 2: Add Scale Question Support (1-10 Slider)

### Current Code (Working for "likert5")
**Location**: `app/NewExam.tsx` lines 679-688

```tsx
if (q.type === "likert5") {
  const v = value === "" ? 0 : parseInt(value, 10);
  return (
    <div>
      <div style={S.sliderTop}>
        <span style={S.sliderEnd}>1 · Not like me</span>
        <span style={S.sliderVal}>{v ? v : "—"}</span>
        <span style={S.sliderEnd}>Exactly like me · 10</span>
      </div>
      <input type="range" min={1} max={10} step={1} value={v || 1} onChange={(e) => onChange(e.target.value)} style={S.slider} className="og-range" />
      <div style={S.sliderTicks}>{Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
    </div>
  );
}
```

### CHANGE TO (Support Both "likert5" AND "scale")
```tsx
if (q.type === "likert5" || q.type === "scale") {
  const v = value === "" ? 0 : parseInt(value, 10);
  
  // Use custom labels if provided (for "scale" type), fallback to defaults
  const minLabel = (q as any).scaleLabel_min || "Not like me";
  const maxLabel = (q as any).scaleLabel_max || "Exactly like me";
  
  return (
    <div>
      <div style={S.sliderTop}>
        <span style={S.sliderEnd}>1 · {minLabel}</span>
        <span style={S.sliderVal}>{v ? v : "—"}</span>
        <span style={S.sliderEnd}>{maxLabel} · 10</span>
      </div>
      <input 
        type="range" 
        min={1} 
        max={10} 
        step={1} 
        value={v || 1} 
        onChange={(e) => onChange(e.target.value)} 
        style={S.slider} 
        className="og-range" 
      />
      <div style={S.sliderTicks}>
        {Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}</span>)}
      </div>
    </div>
  );
}
```

### Questions This Fixes
- Q7: Independence (1-10)
- Q41-42: Confidence & self-awareness
- Q48-49: Financial security & meaningful work
- Q52: Hands-on learning preference
- Q60: Creative originality
- Q66-67: Academic confidence & stream satisfaction
- Q69-70: Openness to change & career clarity
- Q73: Flexibility
- Q76: Post-Class-12 confidence

**Total: 13 scale questions** ✅

---

## ☑️ FIX 3: Handle Multiple Choice With Selection Limits

### Questions Affected
- **Q63**: Select ALL (no limit)
- **Q64-65**: Select ONE (max 1)
- **Q68**: Select TWO (max 2)
- **Q71**: Select THREE (max 3)
- **Q74**: Select TWO (max 2)

### Current Code (Radio - Single Select)
**Location**: `app/NewExam.tsx` lines 712-733

```tsx
// This handles single-select only
const isYesNo = q.type === "yesno";
const opts = isYesNo ? ["Yes", "No"] : (q.options ?? []);
return (
  <div style={S.optList}>
    {opts.map((o, i) => {
      const val = isYesNo ? o : String(i);
      const sel = value === val;
      // ... renders radio buttons
    })}
  </div>
);
```

### CHANGE TO: Support Multiple Type With Limits

Add this BEFORE the "Radio rows" section (before line 712):

```tsx
// Handle "multiple" type with selection limits
if (q.type === "multiple" || q.type === "multiple_with_grouping") {
  const opts = q.options ?? [];
  
  // Selection limits per question
  const limits: Record<string, number> = {
    "Q63": Infinity,  // All
    "Q64": 1,
    "Q65": 1,
    "Q68": 2,
    "Q71": 3,
    "Q74": 2,
  };
  
  const maxSelections = limits[q.id] ?? 1;
  const currentSelections = value ? JSON.parse(value) : [];
  const canSelect = currentSelections.length < maxSelections;
  
  return (
    <div style={S.optList}>
      {opts.map((o, i) => {
        const isSelected = currentSelections.includes(String(i));
        const label = o?.replace(/^\d+\)\s*/, "") ?? "";
        
        return (
          <button
            key={i}
            className="og-opt"
            style={{
              ...S.optRow,
              ...(isSelected ? S.optRowOn : {}),
              opacity: !isSelected && !canSelect ? 0.5 : 1,
              pointerEvents: !isSelected && !canSelect ? "none" : "auto",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (isSelected) {
                // Remove selection
                const newSelections = currentSelections.filter((x: string) => x !== String(i));
                onChange(JSON.stringify(newSelections));
              } else if (canSelect) {
                // Add selection
                const newSelections = [...currentSelections, String(i)];
                onChange(JSON.stringify(newSelections));
              } else {
                // Show feedback that limit reached
                alert(`Maximum ${maxSelections} selection${maxSelections > 1 ? "s" : ""} allowed`);
              }
            }}
          >
            <Checkbox on={isSelected} />
            <span style={{ ...S.optLabel, ...(isSelected ? S.optLabelOn : {}) }}>
              {label}
              {maxSelections !== Infinity && currentSelections.length >= maxSelections && !isSelected && (
                <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
                  (max {maxSelections})
                </span>
              )}
            </span>
          </button>
        );
      })}
      {maxSelections !== Infinity && (
        <div style={{ padding: "8px 16px", fontSize: 12, color: "#666" }}>
          {currentSelections.length} of {maxSelections} selected
        </div>
      )}
    </div>
  );
}
```

### Add Checkbox Component
Add this function after the `Radio` component (line ~738):

```tsx
/** Checkbox control for multiple-select questions */
function Checkbox({ on }: { on: boolean }) {
  return (
    <span 
      className={`og-checkbox${on ? " on" : ""}`} 
      style={{
        width: 18,
        height: 18,
        border: `2px solid ${on ? "#2563eb" : "#e6e9f0"}`,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: on ? "#2563eb" : "white",
        transition: "all 0.2s",
      }}
    >
      {on && (
        <span style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>✓</span>
      )}
    </span>
  );
}
```

---

## 🔄 FIX 4: Update Answer Storage for Multiple Selections

### Current Code
```tsx
const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
```

### What Changes
- Single select: Stores string → `"0"` or `"1"`
- Multiple select: Stores JSON array → `"[0,2,4]"`

**No code change needed** - the existing `set()` function handles both:
```tsx
// Single select response
setAnswers({ ...answers, "Q7": "5" })  // Scale value

// Multiple select response
setAnswers({ ...answers, "Q71": JSON.stringify([0, 2, 3]) })  // Selected indices
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Test Current Scale Support
- [ ] Load assessment
- [ ] Navigate to Q7 (scale question)
- [ ] Verify slider appears (check if type is "likert5" vs "scale")
- [ ] Test dragging slider
- [ ] Test typing in value
- [ ] Verify value persists

### Phase 2: Add "scale" Type Support
- [ ] Open `app/NewExam.tsx`
- [ ] Find line ~679 (likert5 handler)
- [ ] Change condition to: `if (q.type === "likert5" || q.type === "scale")`
- [ ] Add label extraction: `scaleLabel_min` and `scaleLabel_max`
- [ ] Test all 13 scale questions

### Phase 3: Add Multiple-Select Support
- [ ] Add multiple/multiple_with_grouping handler before line 712
- [ ] Add selection limit logic
- [ ] Add Checkbox component
- [ ] Test Q63 (select all)
- [ ] Test Q64-Q65 (select one)
- [ ] Test Q68 (select two)
- [ ] Test Q71 (select three)
- [ ] Test Q74 (select two)

### Phase 4: Fix Question Counter
- [ ] Verify total = 78
- [ ] Check display shows "X / 78" not "X / 79"
- [ ] Test counter increments correctly

### Phase 5: Validation & Testing
- [ ] All 78 questions load
- [ ] All input types work (choice, scale, multiple)
- [ ] Answers save/persist
- [ ] Selection limits enforced
- [ ] Progress tracking accurate
- [ ] Mobile responsive

---

## 🧪 TESTING STEPS

### Test Q7 (Scale Question)
1. Load assessment
2. Navigate to Q7
3. Should see: "On a scale of 1-10, how comfortable are you..."
4. Should see: Slider with 1-10 ticks
5. Should see: Labels "Not comfortable at all" and "Very comfortable"
6. Drag slider, verify value updates
7. Click Next, navigate back
8. Verify value persists

### Test Q71 (Multiple with Limit)
1. Navigate to Q71
2. Question: "Which areas are you currently considering? Select up to THREE"
3. Should see: Checkboxes (not radio buttons)
4. Click 3 options - should all be selectable
5. Try clicking 4th option - should be disabled/show alert
6. Uncheck one - 4th becomes selectable again
7. Verify display shows "X of 3 selected"

### Test Q63 (Select All)
1. Navigate to Q63
2. Should see: "Select all that apply"
3. All options should be independently selectable
4. No limit enforced
5. Can select all options

---

## 📊 Data Format Reference

### Scale Response
```json
{
  "Q7": "5",      // String: "1" to "10"
  "Q41": "8",
  "Q48": "2"
}
```

### Multiple Response
```json
{
  "Q71": "[0, 3, 5]",  // JSON string of selected indices
  "Q74": "[1, 2]"
}
```

---

## 🚀 DEPLOYMENT ORDER

1. ✅ **Data ready** on main (78 questions in questions.json)
2. ⏳ **Fix #1**: Update question counter (Easy, 1 line)
3. ⏳ **Fix #2**: Add "scale" type support (Easy, 1 line change)
4. ⏳ **Fix #3**: Add multiple-select with limits (Medium, ~50 lines)
5. ⏳ **Fix #4**: Test all functionality (Hard, comprehensive)

---

## 📞 QUESTIONS?

- **Scale questions don't appear?** Check that question type is "scale" (not "likert5")
- **Multiple select not working?** Verify question type is "multiple" or "multiple_with_grouping"
- **Selection limits not enforced?** Check the limits object has the question ID

---

**Created**: 2026-09-03  
**Status**: Ready for frontend implementation  
**Estimated effort**: 4-6 hours development + 2 hours testing
