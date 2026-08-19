/* =========================================================
   codeEditor.js
   Drag-and-Drop code builder for the interactive coding step.
   ========================================================= */

const codeEditorModule = (function () {

  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  /* ---------------------------------------------------------
     SIMULATED EXECUTION
     Validates if the user has dropped the items into the 
     correct sequence as defined by step.dropSlots
     --------------------------------------------------------- */
  function simulateRun(filledSlots, expectedSlots) {
    if (filledSlots.length !== expectedSlots.length) {
      return { success: false, output: "Error: missing blocks." };
    }
    
    for (let i = 0; i < filledSlots.length; i++) {
      if (filledSlots[i] !== expectedSlots[i]) {
        return { success: false, output: "Error: syntax error or unexpected sequence." };
      }
    }

    return { success: true, output: "Execution Successful" };
  }

  /* ---------------------------------------------------------
     PUBLIC: render
     --------------------------------------------------------- */
  function render(mountEl, step, notifyInteraction) {
    const wrapper = el("div", "code-editor-wrapper drag-drop-mode");

    /* ---------- Title bar ---------- */
    const titlebar = el("div", "code-editor-titlebar");
    titlebar.appendChild(el("span", "titlebar-dot red"));
    titlebar.appendChild(el("span", "titlebar-dot yellow"));
    titlebar.appendChild(el("span", "titlebar-dot green"));
    titlebar.appendChild(el("span", "titlebar-filename", step.filename || "main.py"));
    wrapper.appendChild(titlebar);

    /* ---------- Drag and Drop Area ---------- */
    const dndArea = el("div", "dnd-area");
    
    // Bank of draggable chips
    const bank = el("div", "dnd-bank");
    const blocks = step.draggableBlocks || [];
    
    // Array to track the current state of slots
    const currentSlots = new Array((step.dropSlots || []).length).fill(null);

    let draggedItem = null;

    function handleDragStart(e) {
      draggedItem = this;
      setTimeout(() => this.classList.add("dragging"), 0);
    }

    function handleDragEnd(e) {
      setTimeout(() => this.classList.remove("dragging"), 0);
      draggedItem = null;
    }
    
    blocks.forEach((text, i) => {
      const chip = el("div", "draggable-chip", text);
      chip.draggable = true;
      chip.dataset.value = text;
      chip.dataset.source = "bank";
      chip.addEventListener("dragstart", handleDragStart);
      chip.addEventListener("dragend", handleDragEnd);
      bank.appendChild(chip);
    });
    
    // The drop slots area
    const codeArea = el("div", "dnd-code-area");
    (step.dropSlots || []).forEach((expectedText, i) => {
      const slotWrap = el("div", "drop-slot-wrapper");
      
      // Indent logic for python - if it's the 5th element in a for loop it's indented.
      // We can just add indentation to the 5th item manually for this specific case.
      if (i === 4) {
         slotWrap.style.marginLeft = "40px";
         
         // Start a new line visually for indentation
         slotWrap.style.width = "100%";
      }

      const slot = el("div", "drop-slot");
      slot.dataset.index = i;
      
      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        slot.classList.add("drag-over");
      });
      
      slot.addEventListener("dragleave", () => {
        slot.classList.remove("drag-over");
      });
      
      slot.addEventListener("drop", function(e) {
        e.preventDefault();
        this.classList.remove("drag-over");
        
        if (draggedItem) {
          // If the slot already has a chip, send it back to bank
          if (this.firstChild) {
            const existingChip = this.firstChild;
            existingChip.dataset.source = "bank";
            bank.appendChild(existingChip);
            currentSlots[this.dataset.index] = null;
          }
          
          // Remove from previous slot if it came from one
          if (draggedItem.dataset.source === "slot") {
             const prevIndex = draggedItem.dataset.slotIndex;
             if (prevIndex !== undefined) {
               currentSlots[prevIndex] = null;
             }
          }
          
          draggedItem.dataset.source = "slot";
          draggedItem.dataset.slotIndex = this.dataset.index;
          this.appendChild(draggedItem);
          this.classList.add("filled");
          
          currentSlots[this.dataset.index] = draggedItem.dataset.value;
        }
      });
      
      slotWrap.appendChild(slot);
      codeArea.appendChild(slotWrap);
    });
    
    // Allow dragging back to the bank
    bank.addEventListener("dragover", (e) => e.preventDefault());
    bank.addEventListener("drop", function(e) {
       e.preventDefault();
       if (draggedItem && draggedItem.dataset.source === "slot") {
          const prevIndex = draggedItem.dataset.slotIndex;
          if (prevIndex !== undefined) {
            currentSlots[prevIndex] = null;
          }
          draggedItem.dataset.source = "bank";
          delete draggedItem.dataset.slotIndex;
          this.appendChild(draggedItem);
          
          // update slot styling
          document.querySelectorAll('.drop-slot').forEach(s => {
             if (!s.firstChild) s.classList.remove("filled");
          });
       }
    });

    dndArea.appendChild(bank);
    dndArea.appendChild(codeArea);
    wrapper.appendChild(dndArea);

    /* ---------- Actions row (Run button) ---------- */
    const actionsRow = el("div", "editor-actions");
    const hint = el("span", "editor-hint", step.hint ? "💡 " + step.hint : "");
    const runBtn = el("button", "run-btn", "▶ Run Code");
    runBtn.type = "button";

    actionsRow.appendChild(hint);
    actionsRow.appendChild(runBtn);
    wrapper.appendChild(actionsRow);

    /* ---------- Output console ---------- */
    const output = el("div", "code-output empty");
    wrapper.appendChild(output);

    /* ---------- Run button behavior ---------- */
    runBtn.addEventListener("click", () => {
      // Validate
      const isComplete = !currentSlots.includes(null);
      if (!isComplete) {
         output.classList.remove("empty", "success");
         output.classList.add("error");
         output.textContent = "Error: Fill all slots before running.";
         lessonEngine.markStepIncomplete(step.id);
         notifyInteraction();
         return;
      }

      const result = simulateRun(currentSlots, step.dropSlots);

      output.classList.remove("empty", "success", "error");

      if (result.success) {
        output.classList.add("success");
        let outText = step.successMessage;
        if (step.validation && step.validation.expectedOutput) {
            // Unescape newline characters
            outText = "Output:\n" + step.validation.expectedOutput.replace(/\\n/g, '\n') + "\n\n" + step.successMessage;
        }
        output.textContent = outText;
        lessonEngine.markStepComplete(step.id);
      } else {
        output.classList.add("error");
        output.textContent = result.output + "\n\n" + step.errorMessage;
        lessonEngine.markStepIncomplete(step.id);
      }

      notifyInteraction();
    });

    mountEl.appendChild(wrapper);
  }

  return {
    render
  };

})();