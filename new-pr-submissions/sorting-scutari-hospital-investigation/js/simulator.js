/**
 * The Sorting Investigation - Screen 5: Multi-Algorithm Simulator & Comparison Lab
 * ==============================================================================
 * Bubble, Insertion, Merge and a clearly labelled simplified Timsort teaching
 * model. Step generators are generic: they work for any numeric array and mode.
 * The comparison lab consumes the honest metric definitions returned by the
 * local benchmark API; offline mode does not invent numbers.
 */

const SimulatorModule = (function () {
  const initialData = [58, 24, 91, 12, 45];
  const DATASET_LABELS = {
    random: "random-like",
    sorted: "already sorted",
    reversed: "reversed",
    nearly_sorted: "nearly sorted",
    duplicates: "duplicates",
  };
  const DATASET_EXPLANATIONS = {
    random: "mixed order, with no obvious shortcut",
    sorted: "lowest to highest already, so little work remains",
    reversed: "highest to lowest, with many pairs starting in the wrong order",
    nearly_sorted: "almost ordered, with only a few neighbouring pairs swapped",
    duplicates: "only seven different values repeated many times",
  };
  const INPUT_DATASET_LABELS = {
    ward_sample: "ward sample",
    ...DATASET_LABELS,
  };
  const SIM_INPUT_SIZE = 5;
  const MAX_SIM_INPUT = 40;
  const BENCHMARK_TIMEOUT_MS = 12000;

  let currentAlgo = "bubble";
  let currentMode = "ascending";
  let steps = [];
  let currentStepIdx = 0;
  let isPlaying = false;
  let playbackTimer = null;
  let speedDelay = 900;
  let benchmarkRequestId = 0;
  let activeDataset = "random";
  let inputDatasetType = "ward_sample";
  let currentInputData = [...initialData];
  // A short understanding check replaces the old Watch/Guided mode system.
  // Reaching the final frame alone never earns a simulator milestone.
  let checkAnsweredCorrectly = false;
  let screenCompletedForRun = false;
  // Presentation order is chosen once per run; the semantic values stay fixed.
  let checkOptionOrder = [];
  let checkOptionAlgo = null;
  let benchmarkStatus = {
    state: "idle",
    title: "No benchmark yet",
    detail: "Select a data pattern to run a benchmark.",
  };

  function inOrder(a, b) {
    return currentMode === "descending" ? a >= b : a <= b;
  }

  function oppositeOrder(a, b) {
    return currentMode === "descending" ? a < b : a > b;
  }

  // Local, deterministic inputs for the step simulator. These mirror the
  // backend dataset patterns so animation and measured lab results can be
  // discussed using the same language without sharing source code.
  function createInputDataset(type) {
    const size = SIM_INPUT_SIZE;
    if (type === "sorted") {
      return Array.from({ length: size }, (_, i) => 10 + i * 2);
    }
    if (type === "reversed") {
      return Array.from({ length: size }, (_, i) => 10 + (size - i - 1) * 2);
    }
    if (type === "nearly_sorted") {
      const values = Array.from({ length: size }, (_, i) => 10 + i * 2);
      if (values.length > 2) {
        [values[1], values[2]] = [values[2], values[1]];
      }
      return values;
    }
    if (type === "duplicates") {
      const baseValues = [12, 25, 38];
      return Array.from({ length: size }, (_, i) => baseValues[i % baseValues.length]);
    }
    if (type === "random") {
      return Array.from({ length: size }, (_, i) => ((i * 37 + 19) % (size * 3)) + 5);
    }
    return [...initialData];
  }

  function normaliseInput(values) {
    if (!Array.isArray(values) || values.length > MAX_SIM_INPUT) return null;
    const normalised = values.map((value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : null;
    });
    return normalised.includes(null) ? null : normalised;
  }

  // Every teaching surface keeps each value's original ward identity and
  // arrival number. Stable algorithms must preserve these identities when
  // values compare equal.
  function makeRecords(data) {
    return data.map((value, index) => ({
      value,
      label: index < 26 ? `Ward ${String.fromCharCode(65 + index)}` : `Ward ${index + 1}`,
      arrival: index + 1,
    }));
  }

  function formatRecord(record) {
    return record
      ? `${record.label} (${record.value}, arrival #${record.arrival})`
      : "—";
  }

  function formatSplitRange(splitRange) {
    if (!splitRange) return "";
    return `Split ${splitRange.left + 1}–${splitRange.right}: left ${splitRange.left + 1}–${splitRange.mid}, right ${splitRange.mid + 1}–${splitRange.right}`;
  }

  // One consistent teaching vocabulary for every algorithm. The fields are
  // derived from the frame so the visual, commentary and detail panel agree.
  function describeIndex(step, index) {
    const record = (step.recordIdentities || [])[index];
    if (record) return formatRecord(record);
    return `position ${index + 1} (${step.array[index]})`;
  }

  function teachingFor(step, previousStep) {
    const n = step.array.length;
    const phase = step.phase || "Running";
    const comparing = step.comparing || [];
    const active = step.activeIndices || [];
    const sortedCount = (step.sortedIndices || []).length;
    const options = step.checkpointOptions || {};

    let examined = "No element is being examined at this step.";
    if (comparing.length) {
      examined = comparing.map((index) => describeIndex(step, index)).join(" versus ");
    } else if (step.heldKey) {
      examined = `Held key: ${formatRecord(step.heldKey)}`;
    } else if (step.mergeRange) {
      examined = `Merge segment ${step.mergeRange.left + 1}–${step.mergeRange.right}`;
    } else if (step.splitRange) {
      examined = formatSplitRange(step.splitRange);
    } else if ((step.runStack || []).length) {
      examined = `Run stack: ${step.runStack.map((run) => `${run.start + 1}–${run.end}`).join(", ")}`;
    } else if (active.length) {
      examined = active.slice(0, 6).map((index) => describeIndex(step, index)).join(", ");
    }

    let condition = "A logical operation is ready to be checked.";
    let outcome = phase;
    let completion =
      "Completion condition: every position is in final order and the algorithm reaches its finished frame.";

    if (currentAlgo === "bubble") {
      completion = "Completion condition: a full pass needs no swaps, or the final pass finishes.";
      if (phase === "Initial State") {
        condition = "Can adjacent neighbours be swapped until no pair is out of order?";
        outcome = "Not started — compare the first neighbouring pair.";
      } else if (phase === "No swaps needed") {
        condition = "Did this full pass contain any swap?";
        outcome = "False — no swap was needed, so all remaining values are ordered.";
      } else if (phase.includes("swap")) {
        condition = "Were the two neighbours out of the requested order?";
        outcome = "True — the pair was swapped.";
      } else {
        condition = `Is the left neighbour already before the right neighbour in ${currentMode} order?`;
        outcome = comparing.length === 2 && oppositeOrder(step.array[comparing[0]], step.array[comparing[1]])
          ? "False — the pair is out of order, so a swap follows."
          : "True — the pair is already ordered, so no swap follows.";
      }
    } else if (currentAlgo === "insertion") {
      completion = "Completion condition: the sorted prefix has grown to include every record.";
      if (phase === "Initial State") {
        condition = "Is the first record a valid sorted prefix?";
        outcome = "True — prefix length is 1; the next record will be held.";
      } else if (phase.startsWith("Pick position")) {
        condition = "Where does the held key belong when compared right-to-left through the sorted prefix?";
        outcome = "The scan begins by comparing the held key with the sorted prefix.";
      } else if (phase === "Shift right") {
        condition = "Is the record to the left after the held key in the requested order?";
        outcome = "True — shift that record right to make room.";
      } else if (phase === "Found slot") {
        condition = "Is the record to the left already in correct relative order with the held key?";
        outcome = "False — stop scanning and insert immediately after it.";
      } else if (phase === "Insert complete") {
        condition = "Was the held key inserted at the stable slot found by the scan?";
        outcome = "True — the sorted prefix grew by one record.";
      }
    } else if (currentAlgo === "merge") {
      completion = "Completion condition: every split segment has been merged back into one ordered array.";
      if (phase === "Divide Stage") {
        condition = "Can a segment of length two or more be split into halves?";
        outcome = "True — divide until single records are inherently sorted.";
      } else if (phase.startsWith("Split")) {
        condition = "Which contiguous range is the left half before the midpoint?";
        outcome = "The midpoint identifies the left half before the right half.";
      } else if (phase.startsWith("Compare")) {
        condition = "Which front record belongs next in the auxiliary buffer?";
        outcome = "The chosen front record is appended to the output next.";
      } else if (phase === "Add to auxiliary buffer") {
        condition = "Was the selected front record the next one in the requested order?";
        outcome = "True — it was appended to the auxiliary buffer.";
      } else if (phase.startsWith("Copy remaining")) {
        condition = "Is one side of the merge empty?";
        outcome = "True — append the remaining side without further comparisons.";
      } else if (phase.includes("complete")) {
        condition = "Does the auxiliary buffer contain every record from the segment in order?";
        outcome = "True — the buffer was written back to the array.";
      }
    } else if (currentAlgo === "timsort") {
      completion = "Completion condition: all natural runs are ordered and merged in this teaching model.";
      if (phase === "Simplified Timsort model") {
        condition = "Are there sections already ordered in the requested direction?";
        outcome = "The natural-run scan begins.";
      } else if (phase.startsWith("Natural run")) {
        condition = "Is the contiguous run ascending or descending relative to the requested order?";
        outcome = step.runDirection === "opposite"
          ? "False — it is an opposite run and must be reversed."
          : "True — it already matches the requested direction.";
      } else if (phase === "Reverse opposite run") {
        condition = "Was the natural run opposite to the requested direction?";
        outcome = "True — the run was reversed into the requested direction.";
      } else if (phase === "Extend short run") {
        condition = "Is the run shorter than the teaching minrun target?";
        outcome = "True — insertion-style placements extended it.";
      } else if (phase === "Merge comparison") {
        condition = "Which front record of the two ordered runs belongs next?";
        outcome = "The winning front record is appended to the merge buffer.";
      } else if (phase === "Add to merge buffer") {
        condition = "Was the chosen front record next in the requested order?";
        outcome = "True — the merge buffer grew by one record.";
      } else if (phase.startsWith("Merge runs")) {
        condition = "Do two ordered runs need to become one ordered run?";
        outcome = "True — the runs were merged and the run stack updated.";
      }
    }

    const moveDelta = Math.max(0, step.moves - (previousStep ? previousStep.moves : 0));
    const change = moveDelta > 0
      ? `${moveDelta} ${step.movementLabel || "movement step"}${moveDelta === 1 ? "" : "s"} recorded.`
      : "No state-changing write at this step.";
    const remaining = sortedCount >= n
      ? "None — every position is marked in final order."
      : `${n - sortedCount} position${n - sortedCount === 1 ? "" : "s"} still to place.`;

    const legends = {
      bubble: "⇄ comparing · ↕ swapped · ✓ sorted",
      insertion: "◆ held key · ✓ sorted prefix · ⇄ comparing · → shifting",
      merge: "⇄ comparing · L/R run halves · ▣ auxiliary buffer · ✓ merged",
      timsort: "✓ matching run · ⟲ reversed run · ▣ merge buffer · ✓ sorted",
    };

    return {
      state: `${phase} · [${step.array.slice(0, 16).join(", ")}${step.array.length > 16 ? ", …" : ""}]`,
      examined,
      condition,
      outcome,
      change,
      remaining,
      completion,
      legend: legends[currentAlgo] || legends.bubble,
      checkpointChoice: options.leftLabel && options.rightLabel
        ? `Choices: ${options.leftLabel} | ${options.rightLabel}`
        : "",
    };
  }

  function makeFrame(array, options = {}) {
    return {
      array: [...array],
      comparing: options.comparing || [],
      activeIndices: options.activeIndices || [],
      sortedIndices: options.sortedIndices || [],
      comparisons: options.comparisons || 0,
      moves: options.moves || 0,
      movementLabel: options.movementLabel || "movement steps",
      phase: options.phase || "Running",
      explanation: options.explanation || "",
      // Additive teaching fields retained for stable step metadata and tests.
      heldKey: options.heldKey === undefined ? null : options.heldKey,
      auxBuffer: options.auxBuffer ? [...options.auxBuffer] : [],
      runStack: options.runStack ? options.runStack.map((run) => ({ ...run })) : [],
      splitRange: options.splitRange || null,
      mergeRange: options.mergeRange || null,
      checkpoint: options.checkpoint || null,
      expectedChoice: options.expectedChoice === undefined ? null : options.expectedChoice,
      checkpointOptions: options.checkpointOptions ? { ...options.checkpointOptions } : null,
      splitTree: options.splitTree || "",
      recordIdentities: options.recordIdentities ? options.recordIdentities.map((record) => ({ ...record })) : [],
      runDirection: options.runDirection || null,
      // Visual teaching fields: one concrete action per frame, the current
      // divide path for Merge Sort, and the run being inspected by Timsort.
      op: options.op || "",
      splitPath: options.splitPath ? [...options.splitPath] : [],
      currentRun: options.currentRun ? { ...options.currentRun } : null,
      // Algorithm-specific teaching surface. Bubble keeps the familiar bars;
      // Insertion uses two lanes plus a lifted key; Merge uses a split tree;
      // Timsort uses run groups. The renderer chooses one per algorithm.
      visual: options.visual || null,
      teaching: options.teaching || null,
    };
  }

  // --------------------------------------------------------------------------
  // Bubble Sort
  // --------------------------------------------------------------------------
  function generateBubbleSteps(data) {
    const arr = [...data];
    const generated = [];
    const n = arr.length;
    let comparisons = 0;
    let moves = 0;
    const sortedIndices = [];

    generated.push(
      makeFrame(arr, {
        phase: "Initial State",
        explanation: `Compare neighbours left to right; swap any pair that is out of order.`,
        movementLabel: "swaps",
        op: "start",
      })
    );

    for (let i = 0; i < n - 1; i++) {
      let swappedThisPass = false;

      for (let j = 0; j < n - i - 1; j++) {
        const a = arr[j];
        const b = arr[j + 1];
        const needSwap = oppositeOrder(a, b);
        comparisons++;

        generated.push(
          makeFrame(arr, {
            comparing: [j, j + 1],
            activeIndices: [j, j + 1],
            sortedIndices: [...sortedIndices],
            comparisons,
            moves,
            phase: `Pass ${i + 1}`,
            explanation: `Compare ${a} and ${b}: ${needSwap ? "out of order, so swap." : "already in order."}`,
            movementLabel: "swaps",
            op: "compare",
          })
        );

        if (needSwap) {
          arr[j] = b;
          arr[j + 1] = a;
          moves++;
          swappedThisPass = true;
          generated.push(
            makeFrame(arr, {
              comparing: [j, j + 1],
              activeIndices: [j, j + 1],
              sortedIndices: [...sortedIndices],
              comparisons,
              moves,
              phase: `Pass ${i + 1} — swap`,
              explanation: `Swap ${a} and ${b}.`,
              movementLabel: "swaps",
              op: "swap",
            })
          );
        }
      }

      sortedIndices.unshift(n - 1 - i);
      if (!swappedThisPass) {
        for (let k = 0; k < n - i - 1; k++) {
          if (!sortedIndices.includes(k)) sortedIndices.push(k);
        }
        generated.push(
          makeFrame(arr, {
            sortedIndices: [...sortedIndices],
            comparisons,
            moves,
            phase: "No swaps needed",
            explanation: `No swaps this pass — the remaining values are ordered.`,
            movementLabel: "swaps",
            op: "done",
          })
        );
        break;
      }
    }

    const allIndices = Array.from({ length: n }, (_, k) => k);
    generated.push(
      makeFrame(arr, {
        sortedIndices: allIndices,
        comparisons,
        moves,
        phase: "Sorted Complete",
        explanation: `Sorted: [${arr.join(", ")}].`,
        movementLabel: "swaps",
        op: "done",
      })
    );

    return generated;
  }

  // --------------------------------------------------------------------------
  // Insertion Sort
  // --------------------------------------------------------------------------
  function generateInsertionSteps(data) {
    const arr = [...data];
    let records = makeRecords(data);
    const generated = [];
    const n = arr.length;
    let comparisons = 0;
    let moves = 0;

    const prefix = (end) => Array.from({ length: Math.max(0, end) }, (_, k) => k);
    const copyRecords = (list) => list.map((record) => ({ ...record }));

    // The visual model keeps the lifted key outside both lanes. The array copy
    // inside the frame still contains the real shifted values, so identity and
    // correctness checks remain unchanged.
    let currentInsertion = null;

    function insertionVisual(options) {
      const sortedCount = (options.sortedIndices || []).length;
      // A shift writes into the next slot (the lifted key's old position).
      // Include that temporary destination so the movement is visible, while
      // prefixSize still reports the genuinely sorted prefix length.
      const visibleCount = options.op === "shift" ? sortedCount + 1 : sortedCount;
      const sorted = copyRecords(records.slice(0, visibleCount));
      const queue = currentInsertion
        ? copyRecords(currentInsertion.queue)
        : copyRecords(records.slice(sortedCount));
      const held = currentInsertion && options.heldKey ? { ...currentInsertion.held } : null;
      return {
        kind: "insertion",
        sorted,
        queue,
        held,
        prefixSize: sortedCount,
        hole: options.op === "shift" ? options.scanIndex : null,
        shifting: options.op === "shift" ? options.shiftTo : null,
        stopAt: options.op === "compare" ? options.scanIndex : null,
        insertAt: options.insertIndex === undefined ? null : options.insertIndex,
        justInserted: options.op === "insert",
      };
    }

    function pushFrame(options) {
      generated.push(
        makeFrame(arr, {
          movementLabel: "writes/shifts",
          recordIdentities: records,
          ...options,
          visual: options.visual || insertionVisual(options),
        })
      );
    }

    pushFrame({
      activeIndices: n ? [0] : [],
      sortedIndices: n ? [0] : [],
      phase: "Initial State",
      explanation: n
        ? `The first record is a sorted prefix of one.`
        : `Nothing to sort.`,
      op: "start",
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      const heldRecord = { ...records[i] };
      currentInsertion = {
        i,
        held: heldRecord,
        queue: copyRecords(records.slice(i + 1)),
      };
      let j = i - 1;

      // The stable slot is known before the scan so guided practice can ask
      // for a prediction. The visual still performs the real shifts one by one.
      let targetScan = i - 1;
      while (targetScan >= 0 && !inOrder(arr[targetScan], key)) targetScan--;
      const targetSlot = targetScan + 2;
      const needsShift = targetScan < i - 1;

      pushFrame({
        activeIndices: [i],
        sortedIndices: prefix(i),
        comparisons,
        moves,
        phase: `Pick position ${i + 1}`,
        explanation: `Pick up ${formatRecord(heldRecord)}; find its slot in the sorted prefix.`,
        heldKey: heldRecord,
        op: "pick",
        insertIndex: null,
        ...(needsShift
          ? {
              checkpoint: "insertion",
              expectedChoice: targetSlot,
              checkpointOptions: { maxSlot: i + 1 },
            }
          : {}),
      });

      while (j >= 0) {
        comparisons++;
        if (!inOrder(arr[j], key)) {
          arr[j + 1] = arr[j];
          records[j + 1] = { ...records[j] };
          moves++;
          pushFrame({
            comparing: [j, j + 1],
            activeIndices: [j, j + 1],
            sortedIndices: prefix(i),
            comparisons,
            moves,
            phase: "Shift right",
            explanation: `${formatRecord(records[j + 1])} comes after the held key, so shift it right.`,
            heldKey: heldRecord,
            op: "shift",
            scanIndex: j,
            shiftTo: j + 1,
          });
          j--;
        } else {
          pushFrame({
            comparing: [j],
            activeIndices: [j + 1],
            sortedIndices: prefix(i),
            comparisons,
            moves,
            phase: "Found slot",
            explanation: `${formatRecord(records[j])} is already in order, so stop here.`,
            heldKey: heldRecord,
            op: "compare",
            scanIndex: j,
            insertIndex: j + 1,
          });
          break;
        }
      }

      arr[j + 1] = key;
      records[j + 1] = heldRecord;
      moves++;
      pushFrame({
        activeIndices: [j + 1],
        sortedIndices: prefix(i + 1),
        comparisons,
        moves,
        phase: "Insert complete",
        explanation: `Insert ${formatRecord(heldRecord)} at slot ${j + 2}.`,
        heldKey: heldRecord,
        op: "insert",
        insertIndex: j + 1,
      });
      currentInsertion = null;
    }

    pushFrame({
      sortedIndices: prefix(n),
      comparisons,
      moves,
      phase: "Sorted Complete",
      explanation: `Sorted: [${arr.join(", ")}].`,
      op: "done",
    });

    return generated;
  }

  // --------------------------------------------------------------------------
  // Merge Sort
  // --------------------------------------------------------------------------
  function generateMergeSteps(data) {
    const arr = [...data];
    const originalRecords = makeRecords(data);
    let records = originalRecords.map((record) => ({ ...record }));
    const generated = [];
    const n = arr.length;
    let comparisons = 0;
    let moves = 0;
    let splitCheckpointUsed = false;
    const splitPath = [];
    const copyRecords = (list) => list.map((record) => ({ ...record }));

    const range = (start, end) =>
      Array.from({ length: Math.max(0, end - start) }, (_, k) => start + k);

    // A live divide tree. Nodes appear only when their split is performed, and
    // they change status as merges return upward. The renderer turns this into
    // a parent-child diagram instead of another bar row.
    const nodeMap = new Map();
    const nodeId = (left, right) => `${left}:${right}`;
    let currentMergeVisual = null;

    function ensureNode(left, right, parentId = null) {
      const id = nodeId(left, right);
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          id,
          left,
          right,
          parentId,
          children: [],
          status: right - left <= 1 ? "leaf" : "pending",
        });
      }
      if (parentId) {
        const parent = nodeMap.get(parentId);
        if (parent && !parent.children.includes(id)) parent.children.push(id);
      }
      return nodeMap.get(id);
    }

    function snapshotTree(activeId, activeStatus) {
      return Array.from(nodeMap.values()).map((node) => {
        let status = node.status;
        if (node.id === activeId && activeStatus) {
          status = activeStatus;
        } else if ((activeStatus === "merging" || activeStatus === "merged") && activeId && node.status !== "merged") {
          let cursor = nodeMap.get(activeId);
          while (cursor && cursor.parentId) {
            if (cursor.parentId === node.id) {
              status = "active";
              break;
            }
            cursor = nodeMap.get(cursor.parentId);
          }
        }
        return { ...node, children: [...node.children], status };
      });
    }

    function mergeVisual(options) {
      const r = options.mergeRange || options.splitRange || null;
      const activeId = r ? nodeId(r.left, r.right) : null;
      let activeStatus = "";
      if (options.op === "split") activeStatus = "splitting";
      else if (options.op === "leaf") activeStatus = "leaf";
      else if (options.op === "compare" || options.op === "buffer") activeStatus = "merging";
      else if (options.op === "merge") activeStatus = "merged";
      const group = currentMergeVisual && activeId === currentMergeVisual.id
        ? { ...currentMergeVisual }
        : null;
      return {
        kind: "merge",
        tree: snapshotTree(activeId, activeStatus),
        activeId,
        rootId: n ? nodeId(0, n) : null,
        group,
        // A stable snapshot of the unsorted starting row. The divide tree can
        // change, but this row always reminds learners what was being split.
        source: originalRecords.map((record) => ({ ...record })),
      };
    }

    function pushFrame(options) {
      generated.push(
        makeFrame(arr, {
          movementLabel: "array writes",
          recordIdentities: records,
          splitPath: [...splitPath],
          ...options,
          visual: options.visual || mergeVisual(options),
        })
      );
    }

    if (n) ensureNode(0, n);

    pushFrame({
      phase: "Divide Stage",
      explanation: `Divide the list into halves until each group holds one record.`,
      splitTree: "No split yet",
      op: "start",
    });

    // Recursive, top-down divide-and-conquer: the divide phase is shown all
    // the way down to single records before the first merge begins.
    function mergeRange(left, mid, right) {
      const leftRecords = records.slice(left, mid);
      const rightRecords = records.slice(mid, right);
      const merged = [];
      const splitRange = { left, mid, right };
      const splitLabel = formatSplitRange(splitRange);
      const segmentIndices = range(left, right);
      const parentNode = nodeMap.get(nodeId(left, right));
      const parentId = parentNode ? parentNode.parentId : null;
      let i = 0;
      let j = 0;

      function setMergeVisual(kind, extra = {}) {
        currentMergeVisual = {
          id: nodeId(left, right),
          kind,
          leftRecords: copyRecords(leftRecords),
          rightRecords: copyRecords(rightRecords),
          leftCursor: i,
          rightCursor: j,
          buffer: copyRecords(merged),
          returnToParent: parentId,
          ...extra,
        };
      }

      while (i < leftRecords.length && j < rightRecords.length) {
        comparisons++;
        const leftRecord = leftRecords[i];
        const rightRecord = rightRecords[j];
        const takeLeft = inOrder(leftRecord.value, rightRecord.value);
        const winner = takeLeft ? leftRecord : rightRecord;
        const tie = leftRecord.value === rightRecord.value;

        setMergeVisual("compare", {
          winnerSide: takeLeft ? "left" : "right",
          tie,
        });

        pushFrame({
          comparing: [left + i, mid + j],
          activeIndices: [left + i, mid + j],
          comparisons,
          moves,
          phase: `Compare records ${left + i + 1} and ${mid + j + 1}`,
          explanation: tie
            ? `Equal values — take ${formatRecord(leftRecord)} first so arrival order is kept.`
            : `Compare ${formatRecord(leftRecord)} and ${formatRecord(rightRecord)}; take the earlier one.`,
          auxBuffer: merged,
          splitRange,
          mergeRange: splitRange,
          splitTree: splitLabel,
          checkpoint: "merge",
          expectedChoice: takeLeft ? "left" : "right",
          checkpointOptions: {
            leftLabel: formatRecord(leftRecord),
            rightLabel: formatRecord(rightRecord),
            tie,
          },
          op: "compare",
        });

        merged.push({ ...winner });
        moves++;

        setMergeVisual("buffer", {
          winnerSide: takeLeft ? "left" : "right",
          appended: formatRecord(winner),
        });

        pushFrame({
          activeIndices: segmentIndices,
          comparisons,
          moves,
          phase: "Add to auxiliary buffer",
          explanation: `${formatRecord(winner)} enters the auxiliary buffer.`,
          auxBuffer: merged,
          splitRange,
          mergeRange: splitRange,
          splitTree: splitLabel,
          op: "buffer",
        });

        if (takeLeft) i++;
        else j++;
      }

      while (i < leftRecords.length) {
        merged.push({ ...leftRecords[i] });
        moves++;
        setMergeVisual("append", {
          emptySide: "right",
          appended: formatRecord(leftRecords[i]),
        });
        pushFrame({
          activeIndices: segmentIndices,
          comparisons,
          moves,
          phase: "Copy remaining left record",
          explanation: `Copy ${formatRecord(leftRecords[i])} straight into the buffer.`,
          auxBuffer: merged,
          splitRange,
          mergeRange: splitRange,
          splitTree: splitLabel,
          op: "buffer",
        });
        i++;
      }

      while (j < rightRecords.length) {
        merged.push({ ...rightRecords[j] });
        moves++;
        setMergeVisual("append", {
          emptySide: "left",
          appended: formatRecord(rightRecords[j]),
        });
        pushFrame({
          activeIndices: segmentIndices,
          comparisons,
          moves,
          phase: "Copy remaining right record",
          explanation: `Copy ${formatRecord(rightRecords[j])} straight into the buffer.`,
          auxBuffer: merged,
          splitRange,
          mergeRange: splitRange,
          splitTree: splitLabel,
          op: "buffer",
        });
        j++;
      }

      for (let k = 0; k < merged.length; k++) {
        arr[left + k] = merged[k].value;
        records[left + k] = { ...merged[k] };
      }

      const mergedNode = nodeMap.get(nodeId(left, right));
      if (mergedNode) mergedNode.status = "merged";
      setMergeVisual("complete", {
        appended: `merged group ${left + 1}–${right}`,
      });
      pushFrame({
        activeIndices: segmentIndices,
        sortedIndices: segmentIndices,
        comparisons,
        moves,
        phase: `Merge positions ${left + 1}–${right} complete`,
        explanation: `Write the buffer back into positions ${left + 1}–${right}.`,
        auxBuffer: merged,
        splitRange,
        mergeRange: splitRange,
        splitTree: splitLabel,
        op: "merge",
      });
      currentMergeVisual = null;
    }

    function sortRange(left, right) {
      if (right - left <= 1) {
        if (right - left === 1) {
          pushFrame({
            activeIndices: [left],
            comparisons,
            moves,
            phase: `Single record at position ${left + 1}`,
            explanation: `Position ${left + 1} holds one record — already sorted.`,
            splitRange: { left, mid: left, right },
            splitTree: `[${left + 1}–${right}]`,
            op: "leaf",
          });
        }
        return;
      }

      const mid = Math.floor((left + right) / 2);
      const parentId = nodeId(left, right);
      ensureNode(left, mid, parentId);
      ensureNode(mid, right, parentId);
      const splitLabel = formatSplitRange({ left, mid, right });
      splitPath.push(`[${left + 1}–${right}]`);
      const askCheckpoint = !splitCheckpointUsed;
      splitCheckpointUsed = true;

      pushFrame({
        activeIndices: range(left, right),
        comparisons,
        moves,
        phase: `Split positions ${left + 1}–${right}`,
        explanation: `Split positions ${left + 1}–${right} into ${left + 1}–${mid} and ${mid + 1}–${right}.`,
        splitRange: { left, mid, right },
        splitTree: splitLabel,
        op: "split",
        ...(askCheckpoint
          ? {
              checkpoint: "split",
              expectedChoice: "left",
              checkpointOptions: {
                leftLabel: `positions ${left + 1}–${mid}`,
                rightLabel: `positions ${mid + 1}–${right}`,
              },
            }
          : {}),
      });

      sortRange(left, mid);
      sortRange(mid, right);
      splitPath.pop();
      mergeRange(left, mid, right);
    }

    if (n > 0) sortRange(0, n);

    const rootId = n ? nodeId(0, n) : null;
    pushFrame({
      sortedIndices: range(0, n),
      comparisons,
      moves,
      phase: "Sorted Complete",
      explanation: `Sorted: [${arr.join(", ")}].`,
      splitTree: "All groups merged",
      op: "done",
      visual: {
        kind: "merge",
        tree: snapshotTree(rootId, "done"),
        activeId: rootId,
        rootId,
        group: null,
      },
    });

    return generated;
  }

  // --------------------------------------------------------------------------
  // Simplified Timsort teaching model
  // --------------------------------------------------------------------------
  function detectRun(arr, start) {
    const n = arr.length;
    let end = start + 1;
    while (end < n && inOrder(arr[end - 1], arr[end])) end++;

    if (end === start + 1 && end < n && oppositeOrder(arr[end - 1], arr[end])) {
      while (end < n && oppositeOrder(arr[end - 1], arr[end])) end++;
      return { end, reversed: true };
    }
    return { end, reversed: false };
  }

  const RUN_LABELS = ["A", "B", "C", "D", "E", "F"];

  function copyRunRecords(records, start, end) {
    return records.slice(start, end).map((record) => ({ ...record }));
  }

  function completedRunSegments(records, runs) {
    return runs.map((run, index) => ({
      start: run.start,
      end: run.end,
      direction: "matching",
      status: "done",
      label: `Run ${RUN_LABELS[index % RUN_LABELS.length]}`,
      records: copyRunRecords(records, run.start, run.end),
    }));
  }

  function detectionSegments(records, runs, current, remainderStart, n) {
    const segments = completedRunSegments(records, runs);
    if (current) {
      segments.push({
        start: current.start,
        end: current.end,
        direction: current.direction,
        status: current.direction === "opposite" ? "current-opposite" : "current",
        label: "Current run",
        records: copyRunRecords(records, current.start, current.end),
      });
    }
    if (remainderStart < n) {
      segments.push({
        start: remainderStart,
        end: n,
        direction: "unsorted",
        status: "unsorted",
        label: "Not scanned",
        records: copyRunRecords(records, remainderStart, n),
      });
    }
    return segments;
  }

  function mergeRunSegments(records, activeRuns, left, mid, right) {
    return activeRuns.map((run, index) => {
      let status = "idle";
      if (run.start === left && run.end === mid) status = "merging-left";
      else if (run.start === mid && run.end === right) status = "merging-right";
      return {
        start: run.start,
        end: run.end,
        direction: "matching",
        status,
        label: `Run ${RUN_LABELS[index % RUN_LABELS.length]}`,
        records: copyRunRecords(records, run.start, run.end),
      };
    });
  }

  function mergeRunRange(arr, records, left, mid, right, generated, counters, activeRuns, minrun) {
    const leftPart = arr.slice(left, mid);
    const rightPart = arr.slice(mid, right);
    const leftRecords = records.slice(left, mid);
    const rightRecords = records.slice(mid, right);
    const merged = [];
    const mergedRecords = [];
    const stackView = [
      { start: left, end: mid, label: "left run" },
      { start: mid, end: right, label: "right run" },
    ];
    const mergeRange = { left, mid, right };
    let i = 0;
    let j = 0;

    function pushMergeFrame(phase, explanation, options = {}) {
      const mergeKind = options.op === "merge"
        ? "complete"
        : options.op === "compare"
          ? "compare"
          : "buffer";
      const merge = {
        kind: mergeKind,
        leftRecords: copyRunRecords(records, left, mid),
        rightRecords: copyRunRecords(records, mid, right),
        leftCursor: i,
        rightCursor: j,
        buffer: mergedRecords.map((record) => ({ ...record })),
        returnToParent: null,
        ...(options.mergeExtra || {}),
      };
      const segments = options.op === "merge"
        ? [{
            start: left,
            end: right,
            direction: "matching",
            status: "merged",
            label: "Merged run",
            records: copyRunRecords(records, left, right),
          }]
        : mergeRunSegments(records, activeRuns, left, mid, right);

      generated.push(
        makeFrame(arr, {
          activeIndices: options.activeIndices || [],
          comparisons: counters.comparisons,
          moves: counters.moves,
          phase,
          explanation,
          movementLabel: "model writes",
          mergeRange,
          runStack: stackView,
          auxBuffer: mergedRecords,
          recordIdentities: records,
          ...options,
          visual: {
            kind: "timsort",
            runs: segments,
            merge,
            minrun,
            action: options.op || "",
          },
        })
      );
    }

    while (i < leftPart.length && j < rightPart.length) {
      counters.comparisons++;
      const takeLeft = inOrder(leftPart[i], rightPart[j]);
      const leftRecord = leftRecords[i];
      const rightRecord = rightRecords[j];
      const winner = takeLeft ? leftRecord : rightRecord;

      pushMergeFrame(
        "Merge comparison",
        `Compare the two front records; take the ${currentMode === "descending" ? "larger" : "smaller"} one.`,
        {
          comparing: [left + i, mid + j],
          activeIndices: [left + i, mid + j],
          op: "compare",
          mergeExtra: { winnerSide: takeLeft ? "left" : "right" },
        }
      );

      merged.push(winner.value);
      mergedRecords.push({ ...winner });
      counters.moves++;

      pushMergeFrame(
        "Add to merge buffer",
        `${formatRecord(winner)} enters the merge buffer.`,
        {
          activeIndices: [left, right - 1],
          op: "buffer",
          mergeExtra: {
            winnerSide: takeLeft ? "left" : "right",
            appended: formatRecord(winner),
          },
        }
      );

      if (takeLeft) i++;
      else j++;
    }

    while (i < leftPart.length) {
      merged.push(leftPart[i]);
      mergedRecords.push({ ...leftRecords[i] });
      counters.moves++;
      pushMergeFrame(
        "Copy remaining left run",
        `Copy ${formatRecord(leftRecords[i])} straight into the buffer.`,
        {
          activeIndices: [left + i],
          op: "buffer",
          mergeExtra: {
            emptySide: "right",
            appended: formatRecord(leftRecords[i]),
          },
        }
      );
      i++;
    }

    while (j < rightPart.length) {
      merged.push(rightPart[j]);
      mergedRecords.push({ ...rightRecords[j] });
      counters.moves++;
      pushMergeFrame(
        "Copy remaining right run",
        `Copy ${formatRecord(rightRecords[j])} straight into the buffer.`,
        {
          activeIndices: [mid + j],
          op: "buffer",
          mergeExtra: {
            emptySide: "left",
            appended: formatRecord(rightRecords[j]),
          },
        }
      );
      j++;
    }

    for (let k = 0; k < mergedRecords.length; k++) {
      arr[left + k] = merged[k];
      records[left + k] = { ...mergedRecords[k] };
    }

    stackView.push({ start: left, end: right, label: "merged run" });
    pushMergeFrame(
      `Merge runs ${left + 1}–${mid} and ${mid + 1}–${right}`,
      `Merge into one run and write it back into positions ${left + 1}–${right}.`,
      {
        activeIndices: Array.from({ length: right - left }, (_, k) => left + k),
        sortedIndices: Array.from({ length: right - left }, (_, k) => left + k),
        op: "merge",
      }
    );
    void activeRuns;
  }

  function generateTimsortSteps(data) {
    const arr = [...data];
    let records = makeRecords(data);
    const generated = [];
    const n = arr.length;
    const counters = { comparisons: 0, moves: 0 };
    // Teaching minrun deliberately stays small so small classroom arrays still
    // show run detection, reversal and merging. CPython uses 32-64 and would
    // treat most arrays this short as a single run; the UI says so explicitly.
    const TEACHING_MIN_RUN = 3;
    const minrun = Math.min(TEACHING_MIN_RUN, Math.max(1, n));
    const runs = [];

    generated.push(
      makeFrame(arr, {
        phase: "Simplified Timsort model",
        explanation: `Find natural runs. Teaching minrun = ${minrun}; CPython uses 32–64 and extra machinery.`,
        movementLabel: "model writes",
        recordIdentities: records,
        runStack: [],
        op: "start",
        visual: {
          kind: "timsort",
          runs: n
            ? [{
                start: 0,
                end: n,
                direction: "unsorted",
                status: "input",
                label: "Unsorted input",
                records: copyRunRecords(records, 0, n),
              }]
            : [],
          merge: null,
          minrun,
          action: "start",
        },
      })
    );

    let start = 0;
    while (start < n) {
      const detected = detectRun(arr, start);
      let end = detected.end;
      const detectedEnd = end;
      const runDirection = detected.reversed ? "opposite" : "matching";

      generated.push(
        makeFrame(arr, {
          activeIndices: Array.from({ length: end - start }, (_, k) => start + k),
          comparisons: counters.comparisons,
          moves: counters.moves,
          phase: `Natural run at ${start + 1}–${end}`,
          explanation: detected.reversed
            ? `Positions ${start + 1}–${end} run opposite to the requested order — reverse them.`
            : `Positions ${start + 1}–${end} already match the requested order — keep this run.`,
          movementLabel: "model writes",
          recordIdentities: records,
          runDirection,
          currentRun: { start, end, direction: runDirection },
          runStack: runs.map((run) => ({ ...run })),
          checkpoint: "timsort_run",
          expectedChoice: detected.reversed ? "descending" : "ascending",
          checkpointOptions: {
            leftLabel: "Matching the requested order",
            rightLabel: "Opposite to the requested order",
            runRange: `${start + 1}–${end}`,
          },
          op: detected.reversed ? "run-opposite" : "run-matching",
          visual: {
            kind: "timsort",
            runs: detectionSegments(records, runs, { start, end, direction: runDirection }, end, n),
            merge: null,
            minrun,
            action: detected.reversed ? "run-opposite" : "run-matching",
          },
        })
      );

      if (detected.reversed) {
        let l = start;
        let r = end - 1;
        while (l < r) {
          const tmpValue = arr[l];
          arr[l] = arr[r];
          arr[r] = tmpValue;
          const tmpRecord = records[l];
          records[l] = records[r];
          records[r] = tmpRecord;
          counters.moves += 2;
          l++;
          r--;
        }
        generated.push(
          makeFrame(arr, {
            activeIndices: Array.from({ length: end - start }, (_, k) => start + k),
            comparisons: counters.comparisons,
            moves: counters.moves,
            phase: "Reverse opposite run",
            explanation: `Reverse positions ${start + 1}–${end} into the requested order.`,
            movementLabel: "model writes",
            recordIdentities: records,
            runDirection: "matching",
            currentRun: { start, end, direction: "matching" },
            runStack: runs.map((run) => ({ ...run })),
            op: "reverse",
            visual: {
              kind: "timsort",
              runs: detectionSegments(records, runs, { start, end, direction: "matching" }, end, n)
                .map((segment) => segment.status === "current"
                  ? { ...segment, status: "reversing", note: "just reversed" }
                  : segment),
              merge: null,
              minrun,
              action: "reverse",
            },
          })
        );
      }

      const targetEnd = Math.min(n, Math.max(end, start + minrun));
      if (targetEnd > end) {
        for (let i = end; i < targetEnd; i++) {
          const key = arr[i];
          const keyRecord = records[i];
          let j = i - 1;
          counters.comparisons++;
          while (j >= start && !inOrder(arr[j], key)) {
            counters.comparisons++;
            arr[j + 1] = arr[j];
            records[j + 1] = records[j];
            counters.moves++;
            j--;
          }
          arr[j + 1] = key;
          records[j + 1] = keyRecord;
          counters.moves++;
        }
        generated.push(
          makeFrame(arr, {
            activeIndices: Array.from({ length: targetEnd - start }, (_, k) => start + k),
            comparisons: counters.comparisons,
            moves: counters.moves,
            phase: "Extend short run",
            explanation: `Extend the short run with linear insertion up to minrun ${minrun}.`,
            movementLabel: "model writes",
            recordIdentities: records,
            currentRun: { start, end: targetEnd, direction: "matching" },
            runStack: runs.map((run) => ({ ...run })),
            op: "extend",
            visual: {
              kind: "timsort",
              runs: detectionSegments(records, runs, { start, end: targetEnd, direction: "matching" }, targetEnd, n)
                .map((segment) => segment.status === "current"
                  ? {
                      ...segment,
                      status: "extending",
                      extendedFrom: detectedEnd,
                      note: `linear insertion to minrun ${minrun}`,
                    }
                  : segment),
              merge: null,
              minrun,
              action: "extend",
            },
          })
        );
        end = targetEnd;
      }

      runs.push({ start, end });
      start = end;
    }

    while (runs.length > 1) {
      const nextRuns = [];
      for (let i = 0; i < runs.length; i += 2) {
        if (i + 1 >= runs.length) {
          nextRuns.push(runs[i]);
          continue;
        }
        const first = runs[i];
        const second = runs[i + 1];
        mergeRunRange(
          arr,
          records,
          first.start,
          first.end,
          second.end,
          generated,
          counters,
          runs.map((run) => ({ ...run })),
          minrun
        );
        nextRuns.push({ start: first.start, end: second.end });
      }
      runs.length = 0;
      runs.push(...nextRuns);

      generated.push(
        makeFrame(arr, {
          comparisons: counters.comparisons,
          moves: counters.moves,
          phase: "Run stack updated",
          explanation: `After merging, the ordered runs are ${runs
            .map((run, index) => `Run ${RUN_LABELS[index % RUN_LABELS.length]} (positions ${run.start + 1}–${run.end})`)
            .join(" and ")}.`,
          movementLabel: "model writes",
          recordIdentities: records,
          runStack: runs.map((run) => ({ ...run })),
          op: "stack",
          visual: {
            kind: "timsort",
            runs: completedRunSegments(records, runs),
            merge: null,
            minrun,
            action: "stack",
          },
        })
      );
    }

    generated.push(
      makeFrame(arr, {
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        comparisons: counters.comparisons,
        moves: counters.moves,
        phase: "Sorted Complete",
        explanation: `Sorted: [${arr.join(", ")}]. Teaching model — not CPython internals.`,
        movementLabel: "model writes",
        recordIdentities: records,
        runStack: runs.map((run) => ({ ...run })),
        op: "done",
        visual: {
          kind: "timsort",
          runs: n
            ? [{
                start: 0,
                end: n,
                direction: "matching",
                status: "done",
                label: "Sorted run",
                records: copyRunRecords(records, 0, n),
              }]
            : [],
          merge: null,
          minrun,
          action: "done",
        },
      })
    );

    return generated;
  }

  function generateSteps(algo, data, mode) {
    const previousMode = currentMode;
    currentMode = mode;
    let result;
    switch (algo) {
      case "insertion":
        result = generateInsertionSteps(data);
        break;
      case "merge":
        result = generateMergeSteps(data);
        break;
      case "timsort":
        result = generateTimsortSteps(data);
        break;
      case "bubble":
      default:
        result = generateBubbleSteps(data);
        break;
    }
    currentMode = previousMode;
    return result;
  }

  // --------------------------------------------------------------------------
  // End-of-run understanding check
  // --------------------------------------------------------------------------
  // A learner must apply the operation they just watched before the run counts.
  // This is not a playback mode: Play and Next remain the only transport controls.
  const UNDERSTANDING_CHECKS = {
    bubble: {
      question: "Bubble Sort sees two neighbouring records out of order. What happens next?",
      options: [
        { value: "adjacent", label: "Swap only that adjacent pair, then keep scanning." },
        { value: "jump", label: "Move the larger record straight to the end in one jump." },
      ],
      correct: "adjacent",
      wrong: "Not yet. Bubble Sort never moves a record past more than one neighbour at a time. The largest value reaches the end gradually through adjacent swaps.",
      correctMessage: "Correct. Adjacent swaps are the core operation; repeating them settles the largest remaining value at the end.",
      hint: "Look at the two highlighted positions. Bubble Sort compares neighbours, not distant records.",
    },
    insertion: {
      question: "Insertion Sort holds a key and shifts a larger record right. Why is that shift needed?",
      options: [
        { value: "slot", label: "It opens the stable slot for the held key without losing the larger record." },
        { value: "remove", label: "It permanently removes the larger record from the sorted prefix." },
      ],
      correct: "slot",
      wrong: "Not yet. A shift makes room; it does not discard a record. The held key is inserted into the gap, and equal values keep their arrival order.",
      correctMessage: "Correct. Shifting opens the gap for the held key while preserving every record and its stable arrival order.",
      hint: "Follow the held key. Every shifted record is moved, not deleted, and the gap is where the key will land.",
    },
    merge: {
      question: "During a merge, one side becomes empty. What should happen next?",
      options: [
        { value: "copy", label: "Copy the remaining records from the other side without more comparisons." },
        { value: "split", label: "Split the remaining records again and merge later." },
      ],
      correct: "copy",
      wrong: "Not yet. Once one ordered side is empty there is no front pair left to compare, so the remaining side can be copied straight through.",
      correctMessage: "Correct. The remaining side is already ordered, so copying it finishes the merge without extra comparisons.",
      hint: "Look at the two front slots. If one side has no front record, a comparison is no longer possible.",
    },
    timsort: {
      question: "The teaching model finds a descending run while the goal is ascending order. What happens first?",
      options: [
        { value: "reverse", label: "Reverse the run so it matches the requested order." },
        { value: "swap-all", label: "Ignore the run and sort the whole list with adjacent swaps." },
      ],
      correct: "reverse",
      wrong: "Not yet. Timsort first recognises the run's direction. An opposite run is reversed before it joins other ordered runs; it is not re-sorted from scratch.",
      correctMessage: "Correct. Reversing an opposite run turns it into an ordered section that can be merged efficiently with its neighbours.",
      hint: "Check the run direction marker. A run in the opposite direction is already ordered — just the other way.",
    },
  };

  function understandingCheckFor(algo) {
    return UNDERSTANDING_CHECKS[algo] || UNDERSTANDING_CHECKS.bubble;
  }

  function reshuffleUnderstandingCheck() {
    const check = understandingCheckFor(currentAlgo);
    checkOptionAlgo = currentAlgo;
    if (window.RandomizeModule && typeof window.RandomizeModule.shuffled === "function") {
      checkOptionOrder = window.RandomizeModule.shuffled(check.options);
    } else {
      checkOptionOrder = [...check.options];
    }
    return checkOptionOrder;
  }

  function getUnderstandingOptions() {
    if (!checkOptionOrder.length || checkOptionAlgo !== currentAlgo) {
      reshuffleUnderstandingCheck();
    }
    return checkOptionOrder;
  }

  function setCheckFeedback(message, type) {
    const feedback = document.getElementById("sim-check-feedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove("is-correct", "is-incorrect", "is-hint");
    if (type) feedback.classList.add(`is-${type}`);
  }

  function renderUnderstandingCheck() {
    const panel = document.getElementById("sim-check-panel");
    const isFinal = steps.length > 0 && currentStepIdx === steps.length - 1;
    if (panel) panel.style.display = isFinal ? "block" : "none";
    if (!isFinal) return;

    const check = understandingCheckFor(currentAlgo);
    const questionEl = document.getElementById("sim-check-question");
    if (questionEl) questionEl.textContent = check.question;

    getUnderstandingOptions().forEach((option, index) => {
      const button = document.getElementById(`sim-check-option-${index === 0 ? "a" : "b"}`);
      if (!button) return;
      button.textContent = option.label;
      button.setAttribute("data-answer", option.value);
      button.disabled = checkAnsweredCorrectly;
      button.classList.remove("btn-primary", "btn-secondary");
      button.classList.add(index === 0 ? "btn-primary" : "btn-secondary");
    });

    if (checkAnsweredCorrectly) setCheckFeedback(check.correctMessage, "correct");
    else setCheckFeedback("", "");
  }

  function answerUnderstandingCheck(choice) {
    if (!steps.length || currentStepIdx !== steps.length - 1) {
      return { correct: false, message: "Finish the visual run before answering the check." };
    }
    if (checkAnsweredCorrectly) {
      return { correct: true, already: true, message: understandingCheckFor(currentAlgo).correctMessage };
    }

    const check = understandingCheckFor(currentAlgo);
    const correct = String(choice) === check.correct;
    if (!correct) {
      setCheckFeedback(check.wrong, "incorrect");
      if (window.App && window.App.playSound) window.App.playSound("error");
      return { correct: false, message: check.wrong };
    }

    checkAnsweredCorrectly = true;
    setCheckFeedback(check.correctMessage, "correct");
    renderUnderstandingCheck();
    if (!screenCompletedForRun && window.App && window.App.awardMilestone) {
      screenCompletedForRun = true;
      window.App.awardMilestone(`sim.${currentAlgo}`);
      updateProceedButtonState();
    }
    if (window.App && window.App.playSound) window.App.playSound("tap");
    return { correct: true, message: check.correctMessage };
  }

  function resetUnderstandingCheck() {
    checkAnsweredCorrectly = false;
    setCheckFeedback("", "");
  }

  function updateControlStates() {
    const nextBtn = document.getElementById("sim-next-btn");
    const playBtn = document.getElementById("sim-play-btn");
    if (nextBtn) nextBtn.disabled = currentStepIdx >= steps.length - 1;
    if (playBtn) playBtn.disabled = currentAlgo === "comparison";
  }

  // --------------------------------------------------------------------------
  // Rendering and playback
  // --------------------------------------------------------------------------
  // Every meaningful operation gets one visual badge and one concrete mark.
  // Symbols are always paired with text so state is never conveyed by colour alone.
  const OPERATION_META = {
    start: { icon: "▶", label: "Start", tone: "start" },
    compare: { icon: "⇄", label: "Compare", tone: "compare" },
    swap: { icon: "⇄", label: "Swap", tone: "swap" },
    pick: { icon: "◆", label: "Pick up", tone: "pick" },
    shift: { icon: "→", label: "Shift right", tone: "shift" },
    insert: { icon: "⬇", label: "Insert", tone: "insert" },
    split: { icon: "✂", label: "Split", tone: "split" },
    leaf: { icon: "•", label: "Single record", tone: "leaf" },
    buffer: { icon: "＋", label: "Add to buffer", tone: "buffer" },
    merge: { icon: "⊕", label: "Merge", tone: "merge" },
    stack: { icon: "≡", label: "Run stack", tone: "stack" },
    "run-matching": { icon: "✓", label: "Matching run", tone: "run" },
    "run-opposite": { icon: "⟲", label: "Opposite run", tone: "reverse" },
    reverse: { icon: "⟲", label: "Reverse run", tone: "reverse" },
    extend: { icon: "＋", label: "Extend run", tone: "extend" },
    done: { icon: "✓", label: "Sorted", tone: "done" },
  };

  function operationFor(step) {
    if (step.op && OPERATION_META[step.op]) return OPERATION_META[step.op];
    const phase = step.phase || "";
    if (/swap/.test(phase)) return OPERATION_META.swap;
    if (phase.startsWith("Pick")) return OPERATION_META.pick;
    if (phase === "Shift right") return OPERATION_META.shift;
    if (phase === "Insert complete") return OPERATION_META.insert;
    if (phase.startsWith("Split")) return OPERATION_META.split;
    if (phase.startsWith("Single record")) return OPERATION_META.leaf;
    if (phase.startsWith("Compare") || phase === "Merge comparison") return OPERATION_META.compare;
    if (phase.startsWith("Add to")) return OPERATION_META.buffer;
    if (phase.startsWith("Merge runs") || phase.includes("complete")) return OPERATION_META.merge;
    if (phase.startsWith("Natural run")) {
      return step.runDirection === "opposite"
        ? OPERATION_META["run-opposite"]
        : OPERATION_META["run-matching"];
    }
    if (phase === "Reverse opposite run") return OPERATION_META.reverse;
    if (phase === "Extend short run") return OPERATION_META.extend;
    if (phase === "Run stack updated") return OPERATION_META.stack;
    if (phase === "Sorted Complete" || phase === "No swaps needed") return OPERATION_META.done;
    return OPERATION_META.start;
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderOperationBanner(step, extra = "", showHeld = true) {
    const meta = operationFor(step);
    const held = showHeld && step.heldKey
      ? `<span class="sim-held-token"><span aria-hidden="true">◆</span> Held: ${escapeHtml(formatRecord(step.heldKey))}</span>`
      : "";
    return `<div class="sim-op-banner sim-op-${meta.tone}">
      <span class="sim-op-icon" aria-hidden="true">${meta.icon}</span>
      <span class="sim-op-label">${escapeHtml(meta.label)}</span>
      ${held}
      ${extra}
    </div>`;
  }

  function renderRecordCard(record, options = {}) {
    const classes = ["sim-record-card", ...(options.classes || [])].join(" ");
    const value = record ? escapeHtml(record.value) : "?";
    const identity = record
      ? `<span class="sim-card-id">${escapeHtml(record.label)} · #${record.arrival}</span>`
      : "";
    const marker = options.marker
      ? `<span class="sim-card-marker" aria-hidden="true">${escapeHtml(options.marker)}</span>`
      : "";
    const note = options.note
      ? `<span class="sim-card-note">${escapeHtml(options.note)}</span>`
      : "";
    const aria = options.aria || (record
      ? `${record.label}, value ${record.value}, arrival ${record.arrival}`
      : "empty slot");
    return `<div class="${classes}" aria-label="${escapeHtml(aria)}">
      ${marker}<strong>${value}</strong>${identity}${note}
    </div>`;
  }

  function renderBubbleRibbon(step) {
    const sorted = step.sortedIndices || [];
    if (!sorted.length) return "";
    const first = sorted[0] + 1;
    const last = sorted[sorted.length - 1] + 1;
    const rangeText = first === last ? `position ${first}` : `positions ${first}–${last}`;
    return `<div class="sim-run-ribbon"><span class="sim-ribbon-label">Final tail</span>
      <span class="sim-ribbon-chip run-matching">✓ ${rangeText}</span></div>`;
  }

  // Shared workbench for Merge Sort and Timsort merges: two front groups,
  // a growing output group, and an explicit empty-group action.
  function renderBufferWorkbench(group, labels, options = {}) {
    if (!group) {
      if (!options.showIdle) return "";
      return `<div class="sim-merge-workbench is-idle">
        <p class="sim-merge-action">Waiting for two ordered groups to merge.</p>
        <div class="sim-merge-groups">
          <div class="sim-merge-group is-left"><span class="sim-merge-group-label">${escapeHtml(labels.left)}</span><span class="sim-merge-empty">not chosen yet</span></div>
          <span class="sim-merge-arrow" aria-hidden="true">→</span>
          <div class="sim-merge-group is-right"><span class="sim-merge-group-label">${escapeHtml(labels.right)}</span><span class="sim-merge-empty">not chosen yet</span></div>
        </div>
        <div class="sim-merge-output"><span class="sim-merge-group-label">${escapeHtml(labels.output)}</span><span class="sim-merge-empty">empty until a merge begins</span></div>
      </div>`;
    }
    const leftRecords = group.leftRecords || [];
    const rightRecords = group.rightRecords || [];
    const buffer = group.buffer || [];
    const leftCursor = group.leftCursor || 0;
    const rightCursor = group.rightCursor || 0;

    function renderGroup(records, cursor, side) {
      if (group.emptySide === side) {
        return `<div class="sim-merge-group is-${side} is-empty">
          <span class="sim-merge-group-label">${escapeHtml(labels[side])}</span>
          <span class="sim-merge-empty">empty — no comparisons left</span>
        </div>`;
      }
      const cards = records.length
        ? records.map((record, index) => {
            const classes = [];
            let marker = "";
            if (index < cursor) {
              classes.push("is-consumed");
              marker = "✓";
            } else if (index === cursor && group.kind === "compare") {
              classes.push("is-front");
              marker = "⇄";
            } else if (index === cursor && group.kind === "buffer" && group.winnerSide === side) {
              classes.push("is-taken");
              marker = "＋";
            } else if (index === cursor && group.kind === "append") {
              classes.push("is-taken");
              marker = "＋";
            }
            return renderRecordCard(record, { classes, marker });
          }).join("")
        : '<span class="sim-merge-empty">empty</span>';
      return `<div class="sim-merge-group is-${side}">
        <span class="sim-merge-group-label">${escapeHtml(labels[side])}</span>
        <div class="sim-card-row">${cards}</div>
      </div>`;
    }

    const output = buffer.length
      ? buffer.map((record, index) => {
          const isNew = index === buffer.length - 1 && group.kind !== "complete";
          return renderRecordCard(record, {
            classes: ["is-output", isNew ? "is-new" : ""],
            marker: isNew ? "＋" : "",
          });
        }).join("")
      : '<span class="sim-merge-empty">empty</span>';

    const actionText = {
      compare: "Compare the first available record in each group.",
      buffer: "The chosen record joins the output group.",
      append: `${group.emptySide === "left" ? "Left" : "Right"} group is empty — copy the rest without comparing.`,
      complete: "One ordered group is ready to return.",
    }[group.kind] || "";

    return `<div class="sim-merge-workbench">
      <p class="sim-merge-action">${escapeHtml(actionText)}</p>
      <div class="sim-merge-groups">
        ${renderGroup(leftRecords, leftCursor, "left")}
        <span class="sim-merge-arrow" aria-hidden="true">→</span>
        ${renderGroup(rightRecords, rightCursor, "right")}
      </div>
      <div class="sim-merge-output">
        <span class="sim-merge-group-label">${escapeHtml(labels.output)}</span>
        <div class="sim-card-row">${output}</div>
      </div>
      ${group.kind === "complete" && labels.returnText
        ? `<div class="sim-merge-return">✓ ${escapeHtml(labels.returnText)}</div>`
        : ""}
    </div>`;
  }

  // Each algorithm gets its own teaching surface. Only Bubble Sort keeps the
  // bar row; the other three use a model that matches how the algorithm works.
  function renderBubbleStage(step) {
    const values = step.array || [];
    const n = values.length;
    const minVal = n ? Math.min(...values) : 0;
    const maxVal = n ? Math.max(...values) : 1;
    const spread = maxVal - minVal || 1;
    const dense = n > 10;
    const comparing = step.comparing || [];
    const active = step.activeIndices || [];
    const sorted = step.sortedIndices || [];
    const comparingSet = new Set(comparing);
    const activeSet = new Set(active);
    const sortedSet = new Set(sorted);
    const halves = (step.op === "leaf" ? null : step.mergeRange || step.splitRange) || null;
    const run = step.currentRun || null;

    const bars = values
      .map((val, idx) => {
        const classes = ["sim-bar-item"];
        if (comparingSet.has(idx)) classes.push("comparing");
        if (sortedSet.has(idx)) classes.push("sorted");
        if (activeSet.has(idx) && !sortedSet.has(idx)) classes.push("active");
        if (halves) {
          if (idx >= halves.left && idx < halves.mid) classes.push("half-left");
          else if (idx >= halves.mid && idx < halves.right) classes.push("half-right");
        }
        if (run && idx >= run.start && idx < run.end) {
          classes.push(run.direction === "opposite" ? "run-opposite" : "run-matching");
        }
        if (step.op === "swap" && comparingSet.has(idx)) classes.push("swapping");

        let marker = "";
        if (step.op === "swap" && comparingSet.has(idx)) marker = "↕";
        else if (comparingSet.has(idx)) marker = "⇄";
        else if (sortedSet.has(idx)) marker = "✓";

        const height = Math.round(((val - minVal) / spread) * 150 + 42);
        const identity = (step.recordIdentities || [])[idx];
        const label = identity
          ? `${identity.label} · #${identity.arrival}`
          : `Pos ${idx + 1}`;
        const aria = `Position ${idx + 1}, value ${val}${
          identity ? `, ${identity.label}, arrival ${identity.arrival}` : ""
        }`;
        return `<div class="${classes.join(" ")}" aria-label="${aria}">
          <div class="sim-bar-marker" aria-hidden="true">${marker}</div>
          <div class="sim-bar-pillar" style="height: ${height}px;">${dense ? "" : val}</div>
          ${dense ? "" : `<div class="sim-bar-label">${label}</div>`}
        </div>`;
      })
      .join("");

    return `${renderOperationBanner(step)}
      ${renderBubbleRibbon(step)}
      <div class="sim-bars ${dense ? "sim-bars--dense" : ""}">${
        bars || '<p class="sim-empty-stage">Nothing to sort.</p>'
      }</div>`;
  }

  function renderInsertionStage(step) {
    const v = step.visual || {};
    const sorted = v.sorted || [];
    const queue = v.queue || [];
    const held = v.held || null;
    const prefixSize = v.prefixSize === undefined ? sorted.length : v.prefixSize;
    const showGap = Boolean(held) && v.insertAt !== null && v.insertAt !== undefined && !v.justInserted;

    function sortedCard(idx) {
      if (v.hole === idx) {
        return `<div class="sim-record-card sim-hole" aria-label="Gap left by the shifted record">
          <span class="sim-card-marker" aria-hidden="true">□</span>
          <strong>gap</strong>
          <span class="sim-card-note">shifted right</span>
        </div>`;
      }
      const classes = [];
      let marker = "";
      let note = "";
      if (v.shifting === idx) {
        classes.push("is-shifting");
        marker = "→";
        note = "shifted right";
      }
      if (v.stopAt === idx) {
        classes.push("is-stop");
        marker = "|";
        note = "in order — stop";
      }
      if (v.justInserted && v.insertAt === idx) {
        classes.push("is-inserted");
        marker = "◆";
        note = "held key placed";
      }
      return renderRecordCard(sorted[idx], { classes, marker, note });
    }

    const sortedParts = [];
    for (let idx = 0; idx <= sorted.length; idx++) {
      if (showGap && v.insertAt === idx) {
        sortedParts.push(`<div class="sim-insert-gap" aria-label="Insertion slot">
          <span aria-hidden="true">⇣</span> insert here
        </div>`);
      }
      if (idx < sorted.length) sortedParts.push(sortedCard(idx));
    }

    const heldTray = held && !v.justInserted
      ? `<div class="sim-held-tray">
          <span class="sim-held-label">Lifted key</span>
          ${renderRecordCard(held, { classes: ["is-held"], marker: "◆" })}
          <span class="sim-held-arrow" aria-hidden="true">${
            showGap ? "⇣ slot found" : "⇢ scan right to left"
          }</span>
        </div>`
      : "";

    return `${renderOperationBanner(step, "", false)}
      <div class="sim-insertion-board">
        <section class="sim-lane sim-lane-sorted" aria-label="Sorted section">
          <div class="sim-lane-head">
            <span><span class="sim-lane-index">1</span> Sorted section</span>
            <span>positions 1–${prefixSize}</span>
          </div>
          ${heldTray}
          <div class="sim-card-row">${
            sortedParts.join("") || '<span class="sim-empty-lane">no sorted records yet</span>'
          }</div>
        </section>
        <span class="sim-lane-arrow" aria-hidden="true">⇢</span>
        <section class="sim-lane sim-lane-unsorted" aria-label="Unsorted queue">
          <div class="sim-lane-head">
            <span><span class="sim-lane-index">2</span> Unsorted queue</span>
            <span>${queue.length} waiting</span>
          </div>
          <div class="sim-card-row">${
            queue.length
              ? queue.map((record) => renderRecordCard(record)).join("")
              : '<span class="sim-empty-lane">all records placed</span>'
          }</div>
        </section>
      </div>`;
  }

  function renderOriginalArrayStrip(step) {
    const source = (step.visual && step.visual.source) || step.recordIdentities || [];
    if (!source.length) return "";
    const cards = source.map((record) => renderRecordCard(record, { marker: "" })).join("");
    return `<section class="sim-merge-source" aria-label="Original array">
      <div class="sim-board-label">Original array <span>the starting input for every split</span></div>
      <div class="sim-card-row">${cards}</div>
    </section>`;
  }

  function renderMergeStage(step) {
    const v = step.visual || {};
    const nodes = v.tree || [];
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const values = step.array || [];
    const statusText = {
      pending: "waiting",
      splitting: "splitting now",
      active: "on the active path",
      leaf: "single record",
      merging: "merging now",
      merged: "merged",
      done: "sorted",
    };

    function renderNode(node) {
      const children = (node.children || [])
        .map((id) => byId.get(id))
        .filter(Boolean);
      const nodeValues = values.slice(node.left, node.right);
      return `<div class="sim-merge-node is-${escapeHtml(node.status || "pending")}"
          aria-label="Group ${node.left + 1} to ${node.right}, ${escapeHtml(statusText[node.status] || node.status || "waiting")}">
        <div class="sim-merge-node-card">
          <span class="sim-merge-node-range">${node.left + 1}–${node.right}</span>
          <span class="sim-merge-node-values">${nodeValues.map(escapeHtml).join(" · ")}</span>
          <span class="sim-merge-node-status">${escapeHtml(statusText[node.status] || node.status || "waiting")}</span>
        </div>
        ${children.length
          ? `<div class="sim-merge-children">${children.map(renderNode).join("")}</div>`
          : ""}
      </div>`;
    }

    const root = byId.get(v.rootId) || nodes.find((node) => !node.parentId) || null;
    const treeHtml = root
      ? `<div class="sim-merge-tree-scroll"><div class="sim-merge-tree">${renderNode(root)}</div></div>`
      : '<p class="sim-empty-stage">Nothing to split.</p>';

    const m = step.mergeRange;
    const group = v.group;
    const workbench = renderBufferWorkbench(group, {
      left: m ? `Left half ${m.left + 1}–${m.mid}` : "Left half",
      right: m ? `Right half ${m.mid + 1}–${m.right}` : "Right half",
      output: "Auxiliary buffer",
      returnText: group && group.returnToParent
        ? "merged group returns to its parent ↑"
        : "final sorted array",
    }, { showIdle: true });

    return `${renderOperationBanner(step)}
      ${renderOriginalArrayStrip(step)}
      <div class="sim-board-label">Divide tree <span>split down to single records, then merge back up</span></div>
      ${treeHtml}
      ${workbench}`;
  }

  function renderTimsortStage(step) {
    const v = step.visual || {};
    const runs = v.runs || [];
    const directionText = {
      matching: "↑ matches order",
      opposite: "↓ opposite — reverse",
      unsorted: "? not scanned yet",
    };
    const statusText = {
      input: "input",
      current: "detecting",
      "current-opposite": "detecting",
      reversing: "reversing",
      extending: "extending",
      done: "ordered run",
      idle: "waiting",
      "merging-left": "merging",
      "merging-right": "merging",
      merged: "merged run",
    };

    const runHtml = runs.map((run) => {
      const classes = ["sim-run-group", `is-${run.status || "idle"}`, `dir-${run.direction || "matching"}`];
      const cards = (run.records || []).map((record, index) => {
        const cardClasses = [];
        let marker = "";
        if (run.status === "reversing") {
          cardClasses.push("is-reversed");
          marker = "⟲";
        }
        if (run.status === "extending" && run.extendedFrom !== undefined && run.start + index >= run.extendedFrom) {
          cardClasses.push("is-extended");
          marker = "＋";
        }
        if (run.status === "done" || run.status === "merged") marker = "✓";
        if (String(run.status || "").startsWith("merging")) cardClasses.push("is-merging");
        return renderRecordCard(record, { classes: cardClasses, marker });
      }).join("");
      return `<section class="${classes.join(" ")}" aria-label="Run ${escapeHtml(run.label || "run")}, positions ${run.start + 1} to ${run.end}">
        <div class="sim-run-head">
          <span class="sim-run-name">${escapeHtml(run.label || "Run")}</span>
          <span class="sim-run-direction">${escapeHtml(directionText[run.direction] || "")}</span>
          <span class="sim-run-status">${escapeHtml(statusText[run.status] || run.status || "")}</span>
        </div>
        <div class="sim-card-row">${cards || '<span class="sim-empty-lane">empty</span>'}</div>
        <div class="sim-run-foot">
          positions ${run.start + 1}–${run.end}${run.note ? ` · ${escapeHtml(run.note)}` : ""}
        </div>
      </section>`;
    }).join('<span class="sim-run-boundary" aria-hidden="true">│</span>');

    const m = step.mergeRange;
    const workbench = renderBufferWorkbench(v.merge, {
      left: m ? `Left run ${m.left + 1}–${m.mid}` : "Left run",
      right: m ? `Right run ${m.mid + 1}–${m.right}` : "Right run",
      output: "Merge buffer",
      returnText: "merged run returns to the run stack ↑",
    });

    return `${renderOperationBanner(step, "", false)}
      <div class="sim-model-note">Simplified teaching model · minrun ${escapeHtml(v.minrun || 3)} · not CPython internals</div>
      <div class="sim-board-label">Run groups <span>boundaries mark each ordered section</span></div>
      <div class="sim-run-board">${runHtml || '<p class="sim-empty-stage">No runs yet.</p>'}</div>
      ${workbench}`;
  }

  function renderStage(step) {
    const stage = document.getElementById("sim-stage");
    if (!stage) return;

    if (currentAlgo === "insertion") stage.innerHTML = renderInsertionStage(step);
    else if (currentAlgo === "merge") stage.innerHTML = renderMergeStage(step);
    else if (currentAlgo === "timsort") stage.innerHTML = renderTimsortStage(step);
    else stage.innerHTML = renderBubbleStage(step);
  }

  function updateProgress(index) {
    const fill = document.getElementById("sim-progress-fill");
    const bar = document.getElementById("sim-progressbar");
    const total = steps.length || 1;
    const percent = Math.round(((index + 1) / total) * 100);
    if (fill && fill.style) fill.style.width = `${percent}%`;
    if (bar) {
      bar.setAttribute("aria-valuenow", String(percent));
      bar.setAttribute("aria-valuetext", `Step ${index + 1} of ${steps.length}`);
    }
  }

  function renderStep(index) {
    if (index < 0 || index >= steps.length) return;
    currentStepIdx = index;
    const step = steps[index];

    const commentary = document.getElementById("sim-commentary-text");
    const stepCounter = document.getElementById("sim-step-counter");
    const compsEl = document.getElementById("sim-metric-comps");
    const movesEl = document.getElementById("sim-metric-moves");
    const movesLabelEl = document.getElementById("sim-metric-moves-label");
    const phaseEl = document.getElementById("sim-metric-phase");

    const teaching = step.teaching || teachingFor(step, steps[index - 1]);
    const meta = operationFor(step);
    const reason = String(teaching.outcome || "").replace(/^(True|False)\s+—\s+/, "");
    const commentaryLabel = document.getElementById("sim-commentary-label");
    const commentaryWhy = document.getElementById("sim-commentary-why");
    // One action label, one concrete sentence and an optional short reason.
    // Detailed conditions remain in the optional "Why? Step details" panel.
    const firstSentence = String(step.explanation || "").split(/(?<=[.!?])\s+/)[0];
    const commentaryText = firstSentence || `${meta.label} at step ${index + 1}.`;

    if (stepCounter) stepCounter.textContent = `Step ${index + 1} of ${steps.length}`;
    if (commentaryLabel) commentaryLabel.textContent = meta.label;
    if (commentary) commentary.textContent = commentaryText;
    if (commentaryWhy) {
      commentaryWhy.textContent = reason ? `Why: ${reason}` : "";
      commentaryWhy.hidden = !reason;
    }
    if (compsEl) compsEl.textContent = step.comparisons;
    if (movesEl) movesEl.textContent = `${step.moves}`;
    if (movesLabelEl) movesLabelEl.textContent = step.movementLabel || "movement steps";
    if (phaseEl) phaseEl.textContent = `${meta.label} · ${step.phase}`;

    renderStage(step);
    updateProgress(index);
    renderUnderstandingCheck();

    const teachingIds = {
      "sim-teach-state": teaching.state,
      "sim-teach-examined": teaching.examined,
      "sim-teach-condition": teaching.condition,
      "sim-teach-outcome": teaching.outcome,
      "sim-teach-change": teaching.change,
      "sim-teach-remaining": teaching.remaining,
      "sim-teach-complete": teaching.completion,
      "sim-teaching-legend": teaching.checkpointChoice
        ? `${teaching.legend} · ${teaching.checkpointChoice}`
        : teaching.legend,
    };
    Object.entries(teachingIds).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });

    updateControlStates();

    if (index === steps.length - 1) {
      pause();
      if (!checkAnsweredCorrectly) {
        setCheckFeedback("Answer the check below to log this algorithm in your investigation.", "hint");
      }
    }
  }

  function updatePlayPauseButton() {
    const btn = document.getElementById("sim-play-btn");
    if (!btn) return;
    btn.textContent = isPlaying ? "⏸ Pause" : "▶ Play";
    btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    btn.classList.toggle("active", isPlaying);
    btn.classList.toggle("btn-secondary", isPlaying);
    btn.classList.toggle("btn-primary", !isPlaying);
  }

  // Internal frame advancement is deliberately separate from the manual Next
  // handler. The automatic timer can keep advancing while isPlaying is true;
  // calling nextStep() from the timer would pause playback on its first tick.
  function advanceOneStep() {
    if (currentStepIdx >= steps.length - 1) return false;
    renderStep(currentStepIdx + 1);
    return true;
  }

  function play() {
    if (isPlaying || currentAlgo === "comparison" || !steps.length) return;
    if (currentStepIdx >= steps.length - 1) {
      // Replaying from the end must visibly render frame 1 before the first
      // interval tick, otherwise the first operation is silently skipped.
      renderStep(0);
    }
    // Clear any stale timer before creating another one so repeated clicks
    // or speed changes can never leave overlapping intervals active.
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
    isPlaying = true;
    updatePlayPauseButton();
    updateControlStates();
    playbackTimer = setInterval(() => {
      if (!isPlaying) {
        pause();
        return;
      }
      // renderStep() calls pause() when it reaches the final frame, which
      // clears this interval from inside the tick. The extra guard covers
      // an already-complete sequence without advancing beyond the end.
      if (!advanceOneStep()) pause();
    }, speedDelay);
  }

  function pause() {
    isPlaying = false;
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
    updatePlayPauseButton();
  }

  function togglePlayPause() {
    if (isPlaying) pause();
    else play();
  }

  function nextStep() {
    // Next is a deliberate single operation. If playback is running, stop the
    // timer first so the interval cannot consume a second step immediately.
    if (isPlaying) pause();
    advanceOneStep();
  }

  function prevStep() {
    // Deprecated compatibility wrapper. The redesigned UI has no Previous
    // control; backward stepping would undermine the one-way teaching flow.
    return false;
  }

  function regenerateSteps() {
    pause();
    steps = generateSteps(currentAlgo, currentInputData, currentMode);
    reshuffleUnderstandingCheck();
    resetUnderstandingCheck();
    screenCompletedForRun = false;
    currentStepIdx = 0;
    renderStep(0);
  }

  function getInput() {
    return [...currentInputData];
  }

  function updateInputDatasetSelector() {
    const select = document.getElementById("sim-input-dataset-select");
    if (!select) return;
    if (inputDatasetType === "custom" && select.options && document.createElement) {
      const hasCustom = Array.from(select.options).some((option) => option.value === "custom");
      if (!hasCustom) {
        const option = document.createElement("option");
        option.value = "custom";
        option.textContent = "Custom values";
        select.appendChild(option);
      }
    }
    select.value = INPUT_DATASET_LABELS[inputDatasetType] ? inputDatasetType : "custom";
    select.setAttribute("aria-valuetext", INPUT_DATASET_LABELS[inputDatasetType] || "custom values");
  }

  function setInput(values) {
    const normalised = normaliseInput(values);
    if (!normalised) return false;
    currentInputData = normalised;
    inputDatasetType = "custom";
    updateInputDatasetSelector();
    if (currentAlgo !== "comparison") regenerateSteps();
    return true;
  }

  function setDatasetType(type) {
    if (!INPUT_DATASET_LABELS[type]) return false;
    inputDatasetType = type;
    currentInputData = createInputDataset(type);
    updateInputDatasetSelector();
    if (currentAlgo !== "comparison") regenerateSteps();
    return true;
  }

  function setGuidedMode() {
    // Deprecated compatibility wrapper. Watch/Guided modes were removed; all
    // learners now use the same two-control visual path.
    return false;
  }

  // --------------------------------------------------------------------------
  // Algorithm and mode switching
  // --------------------------------------------------------------------------
  const ALGO_INFO = {
    bubble: {
      title: "Bubble Sort",
      desc: "Compares adjacent pairs and swaps them when needed. Simple to see, but quadratic on typical inputs.",
      bigO: "Time O(n²) average/worst, O(n) best with early exit | Space O(1) | Stable",
      badge: "Pairwise baseline",
    },
    insertion: {
      title: "Insertion Sort",
      desc: "Builds a sorted prefix by shifting larger values right and inserting a held key into place.",
      bigO: "Time O(n²) worst, O(n) nearly sorted | Space O(1) | Stable",
      badge: "Good on small or nearly sorted data",
    },
    merge: {
      title: "Merge Sort",
      desc: "Divides the list into halves, sorts each half and merges ordered runs using auxiliary memory.",
      bigO: "Time O(n log n) guaranteed | Space O(n) | Stable",
      badge: "Predictable divide-and-conquer",
    },
    timsort: {
      title: "Timsort — simplified teaching model",
      desc: "A conceptual model of natural-run detection, reversal of opposite runs, short-run extension and merging. It is not CPython's exact implementation.",
      bigO: "CPython: O(n log n) average/worst, O(n) best | Space O(n) | Stable",
      badge: "Conceptual model, not CPython internals",
    },
  };

  function updateAlgoInfoCard(algo) {
    const info = ALGO_INFO[algo] || ALGO_INFO.bubble;
    const titleEl = document.getElementById("sim-algo-title");
    const descEl = document.getElementById("sim-algo-desc");
    const bigOEl = document.getElementById("sim-algo-bigo");
    const badgeEl = document.getElementById("sim-algo-badge");
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;
    if (bigOEl) bigOEl.textContent = info.bigO;
    if (badgeEl) badgeEl.textContent = info.badge;
  }

  function setAlgorithm(algo) {
    pause();

    const isBridge = algo === "connection";
    const isComparison = algo === "comparison";
    const validAlgorithm = Object.prototype.hasOwnProperty.call(ALGO_INFO, algo);
    const nextAlgo = isBridge ? currentAlgo : (validAlgorithm || isComparison ? algo : "bubble");

    let activeTabId = null;
    document.querySelectorAll(".algo-tab-btn").forEach((btn) => {
      const active = btn.getAttribute("data-algo") === algo;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.tabIndex = active ? 0 : -1;
      if (active) activeTabId = btn.id || null;
    });

    const simPanel = document.getElementById("sim-interactive-panel");
    const compPanel = document.getElementById("sim-comparison-panel");
    const algoCard = document.getElementById("sim-algo-info-card");
    const bridgePanel = document.getElementById("sim-connection-panel");

    if (simPanel) {
      simPanel.style.display = isComparison || isBridge ? "none" : "block";
      if (activeTabId) simPanel.setAttribute("aria-labelledby", activeTabId);
    }
    if (compPanel) compPanel.style.display = isComparison ? "block" : "none";
    if (algoCard) algoCard.style.display = isComparison || isBridge ? "none" : "block";
    if (bridgePanel) bridgePanel.style.display = isBridge ? "block" : "none";

    if (!isBridge && window.TimsortBridgeModule && typeof window.TimsortBridgeModule.deactivate === "function") {
      window.TimsortBridgeModule.deactivate();
    }

    if (isBridge) {
      // The conceptual connection is a learning layer, not a sorting algorithm.
      // Keep the last valid simulator algorithm so playback state stays valid.
      if (window.TimsortBridgeModule && typeof window.TimsortBridgeModule.activate === "function") {
        window.TimsortBridgeModule.activate();
      }
      return;
    }

    currentAlgo = nextAlgo;

    if (isComparison) {
      // Benchmarks now require an explicit dataset choice. Opening the tab must
      // never award the comparison milestone on its own.
      renderComparisonIntro();
      return;
    }

    updateAlgoInfoCard(currentAlgo);
    regenerateSteps();
  }

  function setMode(mode) {
    pause();
    currentMode = mode;

    const ascBtn = document.getElementById("sim-mode-asc");
    const descBtn = document.getElementById("sim-mode-desc");
    if (ascBtn && descBtn) {
      const asc = mode === "ascending";
      ascBtn.classList.toggle("active", asc);
      descBtn.classList.toggle("active", !asc);
      ascBtn.setAttribute("aria-pressed", asc ? "true" : "false");
      descBtn.setAttribute("aria-pressed", asc ? "false" : "true");
    }

    if (currentAlgo === "comparison") return;

    regenerateSteps();
  }

  function setSpeed(delay) {
    speedDelay = Number(delay) || 900;
    if (isPlaying) {
      pause();
      play();
    }
  }

  // --------------------------------------------------------------------------
  // Comparison lab
  // --------------------------------------------------------------------------
  function formatCount(value) {
    return typeof value === "number" ? value.toLocaleString() : "—";
  }

  function movementCopy(item) {
    if (!item || item.moves === null || item.moves === undefined) {
      return "Movement not exposed by CPython";
    }
    return `${formatCount(item.moves)} ${item.move_metric || "movement steps"}`;
  }

  function spaceCopy(space) {
    const value = String(space || "");
    if (/O\(1\)/i.test(value)) return "No extra list (constant extra space)";
    if (/O\(log/i.test(value)) return "Small stack space";
    if (/O\(n\)/i.test(value)) return "Extra buffer that grows with the input";
    return `Extra space: ${value || "not stated"}`;
  }

  function stabilityCopy(stability) {
    return /stable/i.test(String(stability || ""))
      ? "Keeps equal records in arrival order"
      : "May change equal records' arrival order";
  }

  function clearComparisonResults() {
    ["comparison-results", "comparison-chart", "comparison-interpretation"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = "";
        element.innerHTML = "";
      }
    });
    const badge = document.getElementById("comparison-success-badge");
    if (badge) badge.hidden = true;
    const loading = document.getElementById("comparison-loading");
    if (loading) loading.hidden = true;
    const sampleEl = document.getElementById("comparison-sample");
    if (sampleEl) sampleEl.textContent = "Choose a pattern to see its input sample and measured results.";
    const tableBody = document.getElementById("comparison-table-body");
    if (tableBody) {
      tableBody.innerHTML = '<tr><td colspan="7" class="comparison-empty">No benchmark results yet.</td></tr>';
    }
  }

  function setComparisonPatternHelp(dataset) {
    const help = document.getElementById("comparison-pattern-help");
    if (!help) return;
    const label = DATASET_LABELS[dataset] || "random-like";
    const explanation = DATASET_EXPLANATIONS[dataset] || DATASET_EXPLANATIONS.random;
    help.textContent = `Currently selected: ${label} — ${explanation}.`;
  }

  function renderComparisonCards(payload) {
    const container = document.getElementById("comparison-results");
    if (!container) return;
    const entries = Object.entries(payload.algorithms || {});
    if (!entries.length) return;
    const counts = entries.map(([, item]) => item.comparisons).filter(Number.isFinite);
    const minComparisons = counts.length ? Math.min(...counts) : null;
    const leaders = entries.filter(([, item]) => item.comparisons === minComparisons);

    container.innerHTML = entries.map(([key, item]) => {
      const isLeader = item.comparisons === minComparisons;
      const badge = isLeader
        ? `<span class="comparison-card-badge">${leaders.length === 1 ? "Fewest comparisons this run" : "Joint fewest comparisons"}</span>`
        : "";
      return `<article class="comparison-result-card ${key === "timsort" ? "is-native" : ""}">
        <div class="comparison-card-head"><h4>${escapeHtml(item.name)}</h4>${badge}</div>
        <div class="comparison-card-number"><strong>${formatCount(item.comparisons)}</strong><span>comparisons on this dataset</span></div>
        <p class="comparison-card-move">${escapeHtml(movementCopy(item))}</p>
        <dl class="comparison-card-meta">
          <div><dt>Time pattern</dt><dd>${escapeHtml(item.big_o_time)}</dd></div>
          <div><dt>Extra space</dt><dd>${escapeHtml(spaceCopy(item.big_o_space))}</dd></div>
          <div><dt>Equal records</dt><dd>${escapeHtml(stabilityCopy(item.stability))}</dd></div>
        </dl>
      </article>`;
    }).join("");
  }

  function renderComparisonChart(payload) {
    const container = document.getElementById("comparison-chart");
    if (!container) return;
    const entries = Object.entries(payload.algorithms || {});
    if (!entries.length) return;
    const max = Math.max(1, ...entries.map(([, item]) => Math.max(0, item.comparisons || 0)));
    container.innerHTML = `
      <p class="comparison-chart-caption">Comparisons made on this dataset — a shorter bar means fewer comparisons. This chart only compares the same unit.</p>
      ${entries.map(([key, item]) => {
        const percent = Math.round(((item.comparisons || 0) / max) * 100);
        return `<div class="comparison-chart-row ${key === "timsort" ? "is-native" : ""}">
          <span class="comparison-chart-name">${escapeHtml(item.name)}</span>
          <span class="comparison-chart-track"><span class="comparison-chart-fill" style="width:${percent}%"></span></span>
          <strong class="comparison-chart-value">${formatCount(item.comparisons)}</strong>
        </div>`;
      }).join("")}
    `;
    container.setAttribute("aria-label", `Comparisons made by four algorithms on the selected dataset: ${entries.map(([, item]) => `${item.name} ${item.comparisons}`).join(", ")}.`);
  }

  function buildComparisonInterpretation(payload) {
    const algorithms = payload.algorithms || {};
    const entries = Object.entries(algorithms);
    if (!entries.length) return "";
    const label = DATASET_LABELS[activeDataset] || "selected";
    const minComparisons = Math.min(...entries.map(([, item]) => item.comparisons));
    const leaders = entries.filter(([, item]) => item.comparisons === minComparisons);
    const leaderText = leaders.length === 1
      ? `${leaders[0][1].name} made the fewest comparisons (${formatCount(minComparisons)}).`
      : `${leaders.map(([, item]) => item.name).join(" and ")} tied for the fewest comparisons (${formatCount(minComparisons)}).`;
    const parts = [
      `On this ${label} dataset of ${formatCount(payload.size)} records, ${leaderText}`,
      "Every algorithm finishes with the same sorted values, but it can get there through different comparisons and movements.",
    ];

    if (activeDataset === "sorted") {
      const bubble = algorithms.bubble;
      parts.push(bubble && bubble.moves === 0
        ? "Bubble Sort made 0 adjacent swaps because it found no neighbouring pairs out of order."
        : "Algorithms that recognise existing order can do less work on already sorted data.");
    } else if (activeDataset === "reversed") {
      parts.push("Reversed data puts many neighbouring pairs in the wrong order, so Bubble Sort has many swaps to make.");
    } else if (activeDataset === "nearly_sorted") {
      parts.push("Nearly ordered data can let algorithms that spot existing runs or small swaps do less work.");
    } else if (activeDataset === "duplicates") {
      parts.push("Repeated equal values make stability visible: a stable algorithm keeps their original arrival order.");
    } else {
      parts.push("Mixed order gives the algorithms no simple shortcut, so their comparison counts can differ.");
    }

    const merge = algorithms.merge;
    if (merge && merge.moves > 0) {
      parts.push(`Merge Sort wrote ${formatCount(merge.moves)} values into an extra buffer, which is why it needs additional memory.`);
    }
    const timsort = algorithms.timsort;
    if (timsort && (timsort.moves === null || timsort.moves === undefined)) {
      parts.push("Timsort's internal movements are not exposed by CPython, so no movement number is shown.");
    }
    parts.push("Timings are single-shot local measurements, not a rigorous ranking; educational Python implementations are not a like-for-like race against CPython's built-in sorted().");
    return parts.join(" ");
  }

  function renderComparisonTable(payload) {
    const tableBody = document.getElementById("comparison-table-body");
    if (!tableBody) return;

    const algorithms = payload.algorithms || {};
    tableBody.innerHTML = Object.entries(algorithms)
      .map(([key, item]) => {
        const isTim = key === "timsort";
        const movement = item.moves === null || item.moves === undefined
          ? "Not exposed"
          : `${formatCount(item.moves)} ${item.move_metric || "movement steps"}`;

        return `
          <tr class="${isTim ? "table-row-highlight" : ""}">
            <td class="comparison-algo-name">${escapeHtml(item.name)}</td>
            <td><code>${formatCount(item.comparisons)}</code></td>
            <td>${escapeHtml(movement)}</td>
            <td><code>${item.time_ms} ms</code></td>
            <td><code>${escapeHtml(item.big_o_time)}</code></td>
            <td><code>${escapeHtml(item.big_o_space)}</code></td>
            <td class="comparison-stability">✓ ${escapeHtml(item.stability)}</td>
          </tr>
        `;
      })
      .join("");

    const sampleEl = document.getElementById("comparison-sample");
    if (sampleEl) {
      sampleEl.textContent = `Sample input (first 8 of ${payload.size}): [${(payload.sample_input || []).join(", ")}]`;
    }
    renderComparisonCards(payload);
    renderComparisonChart(payload);
    const interpretation = document.getElementById("comparison-interpretation");
    if (interpretation) interpretation.textContent = buildComparisonInterpretation(payload);
    const badge = document.getElementById("comparison-success-badge");
    if (badge) badge.hidden = false;
  }

  function benchmarkFailure(status, detail) {
    const error = new Error(detail || `HTTP ${status}`);
    error.status = status;
    error.kind = status >= 400 && status < 600 ? "http" : "client";
    return error;
  }

  function validateBenchmarkPayload(data) {
    if (!data || typeof data !== "object" || !data.algorithms || typeof data.algorithms !== "object") {
      throw benchmarkFailure(200, "invalid-response");
    }
    const entries = Object.entries(data.algorithms);
    if (!entries.length) throw benchmarkFailure(200, "invalid-response");
    const numericFields = ["comparisons", "time_ms"];
    entries.forEach(([, item]) => {
      if (!item || typeof item.name !== "string" || typeof item.big_o_time !== "string" ||
          typeof item.big_o_space !== "string" || typeof item.stability !== "string") {
        throw benchmarkFailure(200, "invalid-response");
      }
      numericFields.forEach((field) => {
        if (!Number.isFinite(item[field])) throw benchmarkFailure(200, "invalid-response");
      });
      if (item.moves !== null && !Number.isFinite(item.moves)) {
        throw benchmarkFailure(200, "invalid-response");
      }
    });
    if (!Number.isFinite(data.size)) throw benchmarkFailure(200, "invalid-response");
    return data;
  }

  function benchmarkStatusCopy(error) {
    const status = error && error.status;
    if (status === 404) {
      return {
        state: "endpoint-missing",
        title: "Server reachable, but the benchmark API is missing (HTTP 404). Restart server.py so it loads the current code — no benchmark numbers are shown.",
        detail: "The page itself loaded, but this server process does not provide /api/benchmark.",
      };
    }
    if (status === 403) {
      return {
        state: "origin-rejected",
        title: "The local server rejected this page's origin (HTTP 403). Open the app from the same local server address — no benchmark numbers are shown.",
        detail: "Reload from http://127.0.0.1:<port>/ rather than a different port or file://.",
      };
    }
    if (status === 400 || status === 413) {
      return {
        state: "invalid-request",
        title: `The benchmark request was rejected (HTTP ${status}). No benchmark numbers are shown.`,
        detail: "The requested dataset or size was not accepted by the server.",
      };
    }
    if (status === 500) {
      return {
        state: "server-error",
        title: "The benchmark server reported an internal error (HTTP 500). No benchmark numbers are shown.",
        detail: "Check the server terminal for details.",
      };
    }
    if (status === 200) {
      return {
        state: "invalid-response",
        title: "The benchmark response was not in the expected format. No benchmark numbers are shown.",
        detail: "Restart server.py and try again.",
      };
    }
    if (error && error.name === "AbortError") {
      return {
        state: "timeout",
        title: `The benchmark request timed out after ${BENCHMARK_TIMEOUT_MS / 1000}s. No benchmark numbers are shown.`,
        detail: "The server may be busy or stalled.",
      };
    }
    return {
      state: "request-failed",
      title: "The local server could not be reached or the request failed before a response arrived. No benchmark numbers are shown.",
      detail: "Start server.py and reload this page.",
    };
  }

  function setBenchmarkStatus(status, statusEl) {
    benchmarkStatus = status;
    if (!statusEl) return;
    statusEl.textContent = status.title;
    statusEl.setAttribute("data-state", status.state);
    statusEl.classList.remove("is-success", "is-error", "is-running");
    if (status.state === "success") statusEl.classList.add("is-success");
    else if (status.state !== "idle" && status.state !== "running") statusEl.classList.add("is-error");
    else if (status.state === "running") statusEl.classList.add("is-running");
  }

  function renderComparisonIntro() {
    const statusEl = document.getElementById("comparison-status-msg");
    benchmarkStatus = {
      state: "idle",
      title: "Choose a data pattern to run a benchmark.",
      detail: "No numbers are shown until you request a measurement.",
    };
    setBenchmarkStatus(benchmarkStatus, statusEl);
    clearComparisonResults();
    setComparisonPatternHelp(activeDataset);
    document.querySelectorAll(".comp-dataset-btn").forEach((btn) => {
      const selected = btn.getAttribute("data-dataset") === activeDataset;
      btn.classList.toggle("active", selected);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
    });
  }

  async function runComparisonBenchmark(datasetType) {
    const tableBody = document.getElementById("comparison-table-body");
    const statusEl = document.getElementById("comparison-status-msg");
    if (!tableBody) return benchmarkStatus;

    const dataset = DATASET_LABELS[datasetType] ? datasetType : "random";
    activeDataset = dataset;
    // A new choice clears every previous result before a request is sent, so
    // failed or stale responses can never display misleading numbers.
    clearComparisonResults();
    setComparisonPatternHelp(dataset);
    const previewEl = document.getElementById("comparison-sample");
    if (previewEl) {
      previewEl.textContent = `Selected ${DATASET_LABELS[dataset]} preview: [${createInputDataset(dataset).join(", ")}] · measured sample appears after the run.`;
    }
    const loadingEl = document.getElementById("comparison-loading");
    if (loadingEl) loadingEl.hidden = false;
    document.querySelectorAll(".comp-dataset-btn").forEach((btn) => {
      const active = btn.getAttribute("data-dataset") === dataset;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
    });

    const requestId = ++benchmarkRequestId;
    const label = DATASET_LABELS[dataset];
    setBenchmarkStatus({
      state: "running",
      title: `Measuring four algorithms on ${label} data (60 items)…`,
      detail: "Waiting for the local server. The same input is sent for every algorithm.",
    }, statusEl);

    const controller = typeof AbortController === "function" ? new AbortController() : null;
    let timer = null;
    if (controller) {
      timer = setTimeout(() => controller.abort(), BENCHMARK_TIMEOUT_MS);
    }

    try {
      const response = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_type: dataset, size: 60 }),
        ...(controller ? { signal: controller.signal } : {}),
      });

      let payload = null;
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw benchmarkFailure(
          response.status,
          errorPayload && errorPayload.error ? errorPayload.error : `HTTP ${response.status}`
        );
      }
      payload = validateBenchmarkPayload(await response.json());
      if (requestId !== benchmarkRequestId) return benchmarkStatus;

      renderComparisonTable(payload);
      setBenchmarkStatus({
        state: "success",
        title: `✓ Measured on ${label} data. The cards and chart use the returned results; full technical details are in Advanced below.`,
        detail: `Same 60-item dataset for all four algorithms · Python ${payload.python_version || "unknown"} · movement metrics are algorithm-specific.`,
      }, statusEl);
      if (window.App && window.App.awardMilestone) {
        window.App.awardMilestone("comparison.benchmark");
        updateProceedButtonState();
      }
    } catch (err) {
      if (requestId !== benchmarkRequestId) return benchmarkStatus;
      tableBody.innerHTML = '<tr><td colspan="7" class="comparison-empty">No benchmark numbers are shown because no measurement was made.</td></tr>';
      const sampleEl = document.getElementById("comparison-sample");
      if (sampleEl) sampleEl.textContent = "Sample input unavailable — no benchmark completed.";
      setBenchmarkStatus(benchmarkStatusCopy(err), statusEl);
    } finally {
      if (timer) clearTimeout(timer);
      // A stale request must not unlock the controls or hide the loading state
      // belonging to the newer request that superseded it.
      if (requestId === benchmarkRequestId) {
        const loading = document.getElementById("comparison-loading");
        if (loading) loading.hidden = true;
        document.querySelectorAll(".comp-dataset-btn").forEach((btn) => {
          btn.disabled = false;
          btn.removeAttribute("aria-busy");
        });
      }
    }
    return benchmarkStatus;
  }

  function reset() {
    pause();
    if (window.TimsortBridgeModule && typeof window.TimsortBridgeModule.reset === "function") {
      window.TimsortBridgeModule.reset();
    }
    benchmarkRequestId += 1;
    benchmarkStatus = {
      state: "idle",
      title: "No benchmark yet",
      detail: "Select a data pattern to run a benchmark.",
    };
    currentAlgo = "bubble";
    currentMode = "ascending";
    activeDataset = "random";
    inputDatasetType = "ward_sample";
    currentInputData = [...initialData];
    updateInputDatasetSelector();
    clearComparisonResults();
    setComparisonPatternHelp(activeDataset);
    const statusEl = document.getElementById("comparison-status-msg");
    setBenchmarkStatus(benchmarkStatus, statusEl);
    document.querySelectorAll(".comp-dataset-btn").forEach((btn) => {
      const active = btn.getAttribute("data-dataset") === "random";
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
    });
    // Restore tab/panel state as well as the internal algorithm. setAlgorithm
    // handles both, and regenerates steps for the reset Bubble Sort run.
    setAlgorithm("bubble");
    updateProceedButtonState();
  }

  const SCREEN_FIVE_MILESTONE_LABELS = {
    "sim.bubble": "complete the Bubble Sort run and its understanding check",
    "sim.insertion": "complete the Insertion Sort run and its understanding check",
    "sim.merge": "complete the Merge Sort run and its understanding check",
    "sim.connection": "complete the conceptual connection section",
    "sim.timsort": "complete the Timsort model run and its understanding check",
    "comparison.benchmark": "choose a dataset and run a successful Comparison Lab benchmark",
  };

  function screenFiveReadiness() {
    if (!window.App || !window.App.getProgress) return { ready: true, missing: [] };
    const progress = window.App.getProgress();
    const required = (progress.screenRequirements && progress.screenRequirements[5]) || [];
    const missing = required.filter((key) => !progress.milestones || !progress.milestones[key]);
    return { ready: missing.length === 0, missing };
  }

  function updateProceedButtonState() {
    const proceedBtn = document.getElementById("sim-proceed-btn");
    if (!proceedBtn) return;
    const readiness = screenFiveReadiness();
    proceedBtn.disabled = !readiness.ready;
    proceedBtn.setAttribute("aria-disabled", readiness.ready ? "false" : "true");
    proceedBtn.classList.toggle("btn-primary", readiness.ready);
    proceedBtn.classList.toggle("btn-outline", !readiness.ready);
  }

  function refreshProgression() {
    updateProceedButtonState();
  }

  function init() {
    const speedSelect = document.getElementById("sim-speed-select");
    const inputDatasetSelect = document.getElementById("sim-input-dataset-select");
    if (speedSelect) speedDelay = parseInt(speedSelect.value, 10) || 900;

    const playBtn = document.getElementById("sim-play-btn");
    const nextBtn = document.getElementById("sim-next-btn");
    const ascBtn = document.getElementById("sim-mode-asc");
    const descBtn = document.getElementById("sim-mode-desc");
    const checkOptionA = document.getElementById("sim-check-option-a");
    const checkOptionB = document.getElementById("sim-check-option-b");
    const proceedBtn = document.getElementById("sim-proceed-btn");

    if (playBtn) playBtn.addEventListener("click", togglePlayPause);
    if (nextBtn) nextBtn.addEventListener("click", nextStep);
    if (ascBtn) ascBtn.addEventListener("click", () => setMode("ascending"));
    if (descBtn) descBtn.addEventListener("click", () => setMode("descending"));
    if (speedSelect) {
      speedSelect.addEventListener("change", (e) => setSpeed(parseInt(e.target.value, 10)));
    }
    if (inputDatasetSelect) {
      inputDatasetSelect.addEventListener("change", (e) => setDatasetType(e.target.value));
    }
    if (checkOptionA) {
      checkOptionA.addEventListener("click", () => {
        answerUnderstandingCheck(checkOptionA.getAttribute("data-answer"));
      });
    }
    if (checkOptionB) {
      checkOptionB.addEventListener("click", () => {
        answerUnderstandingCheck(checkOptionB.getAttribute("data-answer"));
      });
    }

    document.querySelectorAll(".algo-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-algo");
        if (target) setAlgorithm(target);
      });

      btn.addEventListener("keydown", (event) => {
        const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!keys || keys.indexOf(event.key) === -1) return;
        if (typeof event.preventDefault === "function") event.preventDefault();
        const tabs = Array.prototype.slice.call(document.querySelectorAll(".algo-tab-btn"));
        const current = tabs.indexOf(btn);
        if (current < 0 || !tabs.length) return;
        let nextIndex = current;
        if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else if (event.key === "ArrowRight") nextIndex = (current + 1) % tabs.length;
        else nextIndex = (current - 1 + tabs.length) % tabs.length;
        const targetBtn = tabs[nextIndex];
        if (!targetBtn) return;
        if (typeof targetBtn.focus === "function") targetBtn.focus();
        const target = targetBtn.getAttribute("data-algo");
        if (target) setAlgorithm(target);
      });
    });

    document.querySelectorAll(".comp-dataset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        runComparisonBenchmark(btn.getAttribute("data-dataset") || "random");
      });
    });

    if (proceedBtn) {
      updateProceedButtonState();
      proceedBtn.addEventListener("click", () => {
        const current = screenFiveReadiness();
        if (!current.ready) {
          const missing = current.missing.map((key) => SCREEN_FIVE_MILESTONE_LABELS[key] || key);
          const commentary = document.getElementById("sim-commentary-text");
          if (commentary) {
            commentary.textContent = `Before continuing: ${missing.join("; ")}.`;
          }
          return;
        }
        if (window.App) window.App.goToScreen(6);
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
    });

    updateAlgoInfoCard("bubble");
    updatePlayPauseButton();
    regenerateSteps();
  }

  return {
    init,
    reset,
    play,
    pause,
    nextStep,
    prevStep,
    setMode,
    setSpeed,
    setAlgorithm,
    setInput,
    getInput,
    setDatasetType,
    setGuidedMode,
    answerUnderstandingCheck,
    reshuffleUnderstandingCheck,
    answerCheckpoint: answerUnderstandingCheck,
    showCheckpointHint: () => understandingCheckFor(currentAlgo).hint,
    refreshProgression,
    runComparisonBenchmark,
    generateSteps,
    getState: () => {
      const step = steps[currentStepIdx] || {};
      const finalFrame = steps.length ? steps[steps.length - 1] : {};
      return {
        currentAlgo,
        currentMode,
        currentStepIdx,
        totalSteps: steps.length,
        isPlaying,
        playbackTimerActive: playbackTimer !== null,
        activeDataset,
        inputDatasetType,
        inputData: [...currentInputData],
        movementLabel: step.movementLabel || "movement steps",
        phase: step.phase || "",
        finalArray: finalFrame.array ? [...finalFrame.array] : [],
        finalRecords: finalFrame.recordIdentities
          ? finalFrame.recordIdentities.map((record) => ({ ...record }))
          : [],
        // Deprecated mode fields are retained for API compatibility only.
        guidedMode: false,
        checkpointType: null,
        expectedChoice: null,
        checkpointTie: false,
        checkpointAnswered: checkAnsweredCorrectly,
        guidedCorrectCount: checkAnsweredCorrectly ? 1 : 0,
        guidedRequiredCount: 1,
        checkpointMessage: checkAnsweredCorrectly
          ? understandingCheckFor(currentAlgo).correctMessage
          : "",
        understandingCheckAnswered: checkAnsweredCorrectly,
        understandingCheckQuestion: understandingCheckFor(currentAlgo).question,
        understandingCheckOrder: getUnderstandingOptions().map((option) => option.value),
        heldKey: step.heldKey ? { ...step.heldKey } : null,
        auxBuffer: step.auxBuffer ? step.auxBuffer.map((record) => ({ ...record })) : [],
        splitRange: step.splitRange ? { ...step.splitRange } : null,
      };
    },
  };
})();

window.SimulatorModule = SimulatorModule;
