import React, { useState } from 'react';
import { Sparkles, Code2, X, RotateCcw } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'adventure',
    label: '⚔️ Adventure Quest',
    fn: (hero, monster, item) => `# 🏰 ${hero}'s Adventure
class ${monster}Error(Exception):
    pass

${hero.toLowerCase()}_has_${item.toLowerCase()} = True

try:
    print(f"⚔️ {hero} enters the dungeon...")
    if not ${hero.toLowerCase()}_has_${item.toLowerCase()}:
        raise ${monster}Error("Missing ${item}!")
    treasure = dungeon.unlock_chest(key="${item}")
    loot = treasure.collect_gold()

except ${monster}Error as e:
    print(f"🚨 {monster} Error: {e}")
    print(f"💡 {hero} needs a {item} first!")

else:
    print(f"✅ Victory! {hero} collected {loot} gold coins!")

finally:
    hero.sheathe_sword()
    dungeon.seal_entrance()
    print(f"🔒 {hero} exits dungeon safely")`
  },
  {
    id: 'school',
    label: '📚 School Exam',
    fn: (student, subject, score) => `# 📚 ${student}'s ${subject} Exam
class LowScoreError(Exception):
    pass

PASS_MARK = 35

try:
    print(f"📝 {student} submits {subject} paper...")
    score = ${isNaN(parseInt(score)) ? '0' : parseInt(score)}
    if not isinstance(score, (int, float)):
        raise TypeError("Score must be a number!")
    if score < PASS_MARK:
        raise LowScoreError(f"Score {score} below pass mark!")
    grade = "A" if score >= 90 else "B" if score >= 70 else "C"

except TypeError as e:
    print(f"❌ Invalid score format: {e}")

except LowScoreError as e:
    print(f"📉 {student} failed: {e}")
    print("💡 Tip: Attempt practice questions daily!")

else:
    print(f"🎉 {student} passed with Grade: {grade}!")

finally:
    exam_hall.mark_attendance("${student}")
    print(f"📋 Attendance recorded for {student}")`
  },
  {
    id: 'recipe',
    label: '🍕 Cooking Recipe',
    fn: (chef, dish, ingredient) => `# 🍕 Chef ${chef}'s ${dish} Recipe
class MissingIngredientError(Exception):
    pass

pantry = {"flour": 500, "eggs": 6, "${ingredient.toLowerCase()}": 0}

try:
    print(f"👨‍🍳 Chef {chef} starts cooking {dish}...")
    amount_needed = 200  # grams
    if pantry.get("${ingredient.toLowerCase()}", 0) < amount_needed:
        raise MissingIngredientError(
            f"Not enough ${ingredient}! Have {pantry.get('${ingredient.toLowerCase()}',0)}g"
        )
    dish_ready = kitchen.bake(dish, time=30)

except MissingIngredientError as e:
    print(f"🚨 Recipe halted: {e}")
    print(f"💡 Substitute: use dried ${ingredient.toLowerCase()} instead")

else:
    print(f"✅ {dish} is perfect! Ready to serve!")

finally:
    kitchen.turn_off_oven()
    chef.wash_hands()
    print(f"🧹 Kitchen cleaned by Chef {chef}")`
  },
];

export function CustomStoryModal({ isOpen, onClose }) {
  const [step,      setStep]      = useState(0);
  const [template,  setTemplate]  = useState(TEMPLATES[0]);
  const [fields,    setFields]    = useState(['', '', '']);
  const [generated, setGenerated] = useState('');

  if (!isOpen) return null;

  const fieldLabels = [
    ['Hero Name', 'Monster Name', 'Magic Item'],
    ['Student Name', 'Subject', 'Exam Score'],
    ['Chef Name', 'Dish Name', 'Missing Ingredient'],
  ][TEMPLATES.indexOf(template)] || ['Field 1', 'Field 2', 'Field 3'];

  const generate = () => {
    const [f0, f1, f2] = fields.map(f => f || 'Hero');
    const code = template.fn(f0 || 'Hero', f1 || 'Dragon', f2 || 'Sword');
    setGenerated(code);
    setStep(1);
  };

  const reset = () => { setStep(0); setFields(['', '', '']); setGenerated(''); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={18} />
            <h3>🎭 Custom Story Generator</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {step === 0 && (
          <div className="modal-step1">
            <p className="modal-subtitle">Choose a theme, fill in characters, and generate a <strong>real Python exception script!</strong></p>

            {/* Template picker */}
            <div className="modal-template-grid">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  className={`modal-tmpl-btn ${template.id === t.id ? 'tmpl-active' : ''}`}
                  onClick={() => setTemplate(t)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="modal-fields">
              {fieldLabels.map((label, i) => (
                <label key={i} className="modal-field-label">
                  {label}
                  <input
                    type="text"
                    placeholder={`Enter ${label}…`}
                    value={fields[i]}
                    onChange={e => {
                      const next = [...fields];
                      next[i] = e.target.value;
                      setFields(next);
                    }}
                    className="modal-field-input"
                  />
                </label>
              ))}
            </div>

            <button className="modal-generate-btn" onClick={generate}>
              <Code2 size={15} /> Generate Python Exception Code!
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="modal-step2">
            <div className="modal-result-header">
              <span>✅ Your Custom Python Code:</span>
              <button className="modal-reset-link" onClick={reset}>
                <RotateCcw size={13} /> Make Another
              </button>
            </div>
            <pre className="modal-code-output">{generated}</pre>
            <p className="modal-result-note">
              💡 This code uses <strong>try, except, else, finally</strong> — copy it into your Python IDE and run it!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
