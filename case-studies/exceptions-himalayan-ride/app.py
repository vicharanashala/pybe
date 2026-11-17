"""
The High Pass: Swati's Himalayan Expedition
PyBe Discovery Lab (v2 Rebuild) · Single-File Streamlit Deliverable
Discover Python Exception Handling (try / except / else / finally / raise)
through the physical intuition of a 474 km solo Royal Enfield motorcycle ride.
"""

import streamlit as st
from pathlib import Path
import base64
import inspect
import io
from PIL import Image, ImageDraw, ImageFont
import datetime

# ==============================================================================
# 1. PAGE CONFIGURATION
# ==============================================================================
st.set_page_config(
    page_title="The High Pass: Swati's Himalayan Ride (PyBe)",
    page_icon="🏍️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ==============================================================================
# 2. SESSION STATE MANAGEMENT
# ==============================================================================
if "scene_idx" not in st.session_state:
    st.session_state.scene_idx = 0
if "selected_options" not in st.session_state:
    st.session_state.selected_options = {}
if "sim_scenario" not in st.session_state:
    st.session_state.sim_scenario = "clean"
if "explorer_name" not in st.session_state:
    st.session_state.explorer_name = "Swati Explorer"

# ==============================================================================
# 3. 12-SCENE UNIFIED DATA SCHEMA (BRO VERIFIED ALTITUDES)
# ==============================================================================
SCENES = [
    {
        "id": 1,
        "act": "ACT 1: THE RIDE",
        "place": "MANALI BASE",
        "alt": "6,726 FT",
        "alt_num": 6726,
        "photo": "assets/photos/01_manali.jpg",
        "narration": "Dawn breaks in Manali. Four hundred seventy-four kilometers of high wilderness lie ahead.",
        "rider": ("Swati", "Dug-Dug is packed. Zero phone signal or mechanics once we leave the valley."),
        "guide": ("Tashi (BRO)", "Fuel gets you rolling, Swati. A plan for each breakdown gets you through."),
        "code_lines": None,
        "question": "Why carry specific spare parts if your fuel tank is already full?",
        "options": [
            ("A", "Mountain hazards strike regardless of how well the motorcycle runs.", True, "Unforeseen mountain shocks require dedicated, ready-made recovery routines."),
            ("B", "Extra weight in saddlebags improves tyre traction on steep switchbacks.", False, "Unnecessary ballast makes handling clumsy on treacherous hairpin turns."),
            ("C", "Experienced Himalayan riders never encounter mechanical trouble.", False, "The Himalayas spare no rider; preparation is survival."),
            ("D", "High altitude causes pure petrol to evaporate twice as quickly.", False, "Carrying spares is about hardware failure, not fuel evaporation.")
        ]
    },
    {
        "id": 2,
        "act": "ACT 1: THE RIDE",
        "place": "ROHTANG LA",
        "alt": "13,050 FT",
        "alt_num": 13050,
        "photo": "assets/photos/02_rohtang.jpg",
        "narration": "Muddy switchbacks climb into dense fog. Scree tumbles across the Pir Panjal.",
        "rider": ("Swati", "Rohtang is sheer mud and sliding slate. Rocks are tumbling across the switchback."),
        "guide": ("Tashi (BRO)", "You can't skip the pass. You attempt the crossing, braced for shocks."),
        "code_lines": None,
        "question": "When entering an active rockfall zone, what is the sensible rider strategy?",
        "options": [
            ("A", "Close your eyes, accelerate blindly, and hope gravity forgets you exist.", False, "Blind hope guarantees disaster when environmental hazards strike."),
            ("B", "Attempt the hazardous stretch while keeping your recovery toolkit ready.", True, "Bracing for failure while executing risky work is the essence of try."),
            ("C", "Turn back to Manali whenever rain makes the mountain road slippery.", False, "Surrendering at every challenge means you will never reach Leh."),
            ("D", "Assume modern motorcycles are impervious to falling Himalayan boulders.", False, "No machine can withstand tumbling boulders without active vigilance.")
        ]
    },
    {
        "id": 3,
        "act": "ACT 2: PHYSICAL INTUITION",
        "place": "ZINGZINGBAR",
        "alt": "14,000 FT",
        "alt_num": 14000,
        "photo": "assets/photos/03_zingzingbar.jpg",
        "narration": "A freezing glacial torrent rushes across the gravel track, choking the engine.",
        "rider": ("Swati", "Icy water engulfed the exhaust pipe! Dug-Dug coughed, sputtered, and stalled."),
        "guide": ("Tashi (BRO)", "Water soaked the spark plug. Don't touch tyres; dry the electrical spark!"),
        "code_lines": [
            ("ATTEMPT:", "swati.cross_stream()"),
            ("ON WATER_IN_ENGINE:", "swati.dry_spark_plug()")
        ],
        "question": "Why must Swati reach specifically for her spark plug tool instead of tyre cement?",
        "options": [
            ("A", "Because tyre repair cement takes three hours to dry in freezing mountain air.", False, "Curing time is irrelevant when tyres are undamaged."),
            ("B", "Because a generic toolkit always fixes any machine breakdown automatically.", False, "Tools have distinct functions; generic fixes cannot solve electrical stalls."),
            ("C", "Because water in the carburetor requires an electrical fix, not rubber patches.", True, "Each distinct hazard requires its own specific, matching recovery procedure."),
            ("D", "Because checking tyre pressure clears silt trapped inside the exhaust.", False, "Tyre pressure has zero connection to a flooded carburetor.")
        ]
    },
    {
        "id": 4,
        "act": "ACT 2: PHYSICAL INTUITION",
        "place": "BARALACHA LA",
        "alt": "16,040 FT",
        "alt_num": 16040,
        "photo": "assets/photos/04_baralacha.jpg",
        "narration": "Sharp glacial slate punctures the rear wheel on the ascent to Baralacha La.",
        "rider": ("Swati", "Pssss! Razor moraine slate tore the rear tyre. The rim is touching rock."),
        "guide": ("Tashi (BRO)", "The spark tool won't help now! Pull out the puncture strip kit."),
        "code_lines": [
            ("ATTEMPT:", "swati.cross_pass()"),
            ("ON WATER_IN_ENGINE:", "swati.dry_spark_plug()"),
            ("ON FLAT_TYRE:", "swati.plug_puncture()")
        ],
        "question": "What happens if Swati only carries a single recovery plan for water stalls?",
        "options": [
            ("A", "The motorcycle automatically detects the flat tyre and seals itself.", False, "Machines have no self-healing capabilities in the wilderness."),
            ("B", "Drying the clean spark plug will magically refill air into the punctured tyre.", False, "A water handler cannot fix physical lacerations in rubber."),
            ("C", "Swati can use hot engine oil to weld the severed rubber tyre back together.", False, "Engine oil destroys tyre rubber rather than fixing puncture holes."),
            ("D", "She remains stranded because an electrical fix cannot seal slashed rubber.", True, "Different failures demand distinct handlers, not a single catch-all routine.")
        ]
    },
    {
        "id": 5,
        "act": "ACT 2: PHYSICAL INTUITION",
        "place": "SARCHU",
        "alt": "14,070 FT",
        "alt_num": 14070,
        "photo": "assets/photos/05_sarchu.jpg",
        "narration": "Afternoon sun warms Sarchu plain. Dug-Dug cruised over the border without a sputter.",
        "rider": ("Swati", "Dry gravel, open throttle! Dug-Dug purred flawlessly without a single breakdown today."),
        "guide": ("Tashi (BRO)", "A completely clean run! Pour that steaming thermos chai right now."),
        "code_lines": [
            ("ATTEMPT:", "swati.ride_highway()"),
            ("ON WATER_IN_ENGINE:", "swati.dry_spark_plug()"),
            ("ON FLAT_TYRE:", "swati.plug_puncture()"),
            ("ONLY IF NO BREAKDOWN:", "swati.drink_hot_chai()")
        ],
        "question": "If Swati had spent four hours fixing an engine flood, does she get the celebration chai?",
        "options": [
            ("A", "No, victory chai is reserved exclusively for runs that experienced zero breakdowns.", True, "The else block runs only if the try block succeeded without any errors."),
            ("B", "Yes, tea must always be consumed whenever any tool is unpacked.", False, "Celebrations are not triggered during emergency repair operations."),
            ("C", "Yes, hot chai is poured regardless of whether the motorcycle is broken.", False, "A clean-run bonus executes only on clean runs, never after errors."),
            ("D", "No, hot chai is forbidden at high altitudes due to low boiling points.", False, "The restriction is purely logical: reward follows a flawless run.")
        ]
    },
    {
        "id": 6,
        "act": "ACT 2: PHYSICAL INTUITION",
        "place": "PANG",
        "alt": "15,280 FT",
        "alt_num": 15280,
        "photo": "assets/photos/06_pang.jpg",
        "narration": "Dusk chills the canyon at 15,280 feet. Sub-zero night winds whistle over the tents.",
        "rider": ("Swati", "Sun is gone. Freezing wind is howling. Exhaustion is setting in hard."),
        "guide": ("Tashi (BRO)", "Clean day or breakdown battle, night is sub-zero. Pitch that tent!"),
        "code_lines": [
            ("ATTEMPT:", "swati.ride_highway()"),
            ("ON WATER_IN_ENGINE:", "swati.dry_spark_plug()"),
            ("ON FLAT_TYRE:", "swati.plug_puncture()"),
            ("ONLY IF NO BREAKDOWN:", "swati.drink_hot_chai()"),
            ("ALWAYS BEFORE SLEEP:", "swati.pitch_tent()")
        ],
        "question": "Which task must Swati perform regardless of whether today was smooth or disastrous?",
        "options": [
            ("A", "Celebrate with hot chai even if the engine died and night is falling.", False, "Celebrations are skipped when an afternoon was spent fixing breakdowns."),
            ("B", "Pitch the shelter tent, because sub-zero nightfall spares nobody.", True, "The finally block represents mandatory cleanup that must run every time."),
            ("C", "Replace both tyres every evening even when no puncture occurred.", False, "Repairs are strictly contingent on actual damage, not routine nightly camp tasks."),
            ("D", "Drain all engine oil into the sand before sleeping each night.", False, "Draining good oil would permanently ruin the motorcycle engine.")
        ]
    },
    {
        "id": 7,
        "act": "ACT 2: PHYSICAL INTUITION",
        "place": "MOREY PLAINS",
        "alt": "15,400 FT",
        "alt_num": 15400,
        "photo": "assets/photos/07_morey_plains.jpg",
        "narration": "Forty kilometers of straight plateau. Time to lock in the 4-stage survival protocol.",
        "rider": ("Swati", "Endless straight horizons. We need our four daily stages locked in strict sequence."),
        "guide": ("Tashi (BRO)", "Attempt first, handle specific shocks, reward clean runs, pitch shelter always."),
        "code_lines": [
            ("1. ATTEMPT:", "swati.ride_highway()"),
            ("2. ON SPECIFIC SHOCK:", "swati.fix_problem()"),
            ("3. ONLY IF NO BREAKDOWN:", "swati.drink_hot_chai()"),
            ("4. ALWAYS BEFORE SLEEP:", "swati.pitch_tent()")
        ],
        "question": "Arrange Swati's 4 trail stages into their required chronological execution order:",
        "options": [
            ("A", "1. Attempt -> 2. Specific Handlers -> 3. Clean Reward -> 4. Mandatory Camp", True, "Perfect! try -> except -> else -> finally is locked into memory."),
            ("B", "1. Clean Reward -> 2. Attempt -> 3. Mandatory Camp -> 4. Specific Handlers", False, "You cannot claim clean-run rewards before attempting the ride!"),
            ("C", "1. Mandatory Camp -> 2. Specific Handlers -> 3. Attempt -> 4. Clean Reward", False, "Camp duty happens at sunset after the attempt, not before departure."),
            ("D", "1. Specific Handlers -> 2. Attempt -> 3. Clean Reward -> 4. Mandatory Camp", False, "Handlers only respond to failures; they never precede the risky attempt.")
        ]
    },
    {
        "id": 8,
        "act": "ACT 3: THE SYNTAX BRIDGE",
        "place": "DEBRING",
        "alt": "15,500 FT",
        "alt_num": 15500,
        "photo": "assets/photos/08_debring.jpg",
        "narration": "Camping at Debring beneath the summit. Swati's notebook words morph directly into Python.",
        "rider": ("Swati", "Look at my trail notebook! The English rules line up line-by-line with Python."),
        "guide": ("Tashi (BRO)", "Watch the words shift in place. Python keywords are just mountain common sense."),
        "code_lines": [
            ("try:", "swati.cross_stream()"),
            ("except WaterInEngineError:", "swati.dry_spark_plug()"),
            ("except FlatTyreError:", "swati.plug_puncture()"),
            ("else:", "swati.drink_hot_chai()"),
            ("finally:", "swati.pitch_tent()")
        ],
        "question": "Which Python keyword maps directly to Swati's 'ATTEMPT' risky stretch?",
        "options": [
            ("A", "The 'while' statement, because riders keep circling until they reach Leh.", False, "while defines loops, not dangerous blocks guarded against errors."),
            ("B", "The 'if' statement, because ordinary checks handle unpredictable environmental shocks.", False, "if/else tests expected conditions, whereas try guards against crashes."),
            ("C", "The 'try' keyword, marking the block of risky code guarded against crashes.", True, "Exact match: try executes the code you hope succeeds."),
            ("D", "The 'def' statement, because functions represent fuel tanks on motorcycles.", False, "def declares functions, not exception-handling boundaries.")
        ]
    },
    {
        "id": 9,
        "act": "ACT 3: THE SYNTAX BRIDGE",
        "place": "TANGLANG LA",
        "alt": "17,480 FT",
        "alt_num": 17480,
        "photo": "assets/photos/09_tanglang_la.jpg",
        "narration": "Summit pass at 17,480 feet. Run the real 12-line Python function across 4 conditions.",
        "rider": ("Swati", "17,480 feet! Oxygen is thin. Let's run Dug-Dug's script against every storm."),
        "guide": ("Tashi (BRO)", "Test all four days. Notice how finally executes even during fuel collapse!"),
        "code_lines": [
            ("def ride_day(condition):", "..."),
            ("    try:", "swati.ride(condition)"),
            ("    except WaterInEngineError:", "swati.dry_spark()"),
            ("    except FlatTyreError:", "swati.plug_tyre()"),
            ("    else:", "swati.drink_chai()"),
            ("    finally:", "swati.pitch_tent()")
        ],
        "question": "On Day 4 (OutOfFuelError with no handler), does finally: swati.pitch_tent() still run?",
        "options": [
            ("A", "No, unhandled exceptions immediately terminate the computer without running finally.", False, "Incorrect: finally is guaranteed to execute before the exception bubbles up."),
            ("B", "Yes, but only if the user manually presses an emergency restart key.", False, "Python's runtime engine guarantees finally runs automatically."),
            ("C", "No, Python converts unhandled exceptions into else blocks on freezing passes.", False, "else is completely bypassed whenever any exception is raised."),
            ("D", "Yes, finally always runs to ensure safety before the program terminates.", True, "Vital takeaway: finally executes unconditionally, even on fatal unhandled crashes.")
        ]
    },
    {
        "id": 10,
        "act": "ACT 3: THE SYNTAX BRIDGE",
        "place": "KARU",
        "alt": "11,100 FT",
        "alt_num": 11100,
        "photo": "assets/photos/10_karu.jpg",
        "narration": "Descending into the fertile Indus Valley. Transferring mountain logic to real-world code.",
        "rider": ("Swati", "Paved tarmac at last! How does our mountain model apply to standard programming?"),
        "guide": ("Tashi (BRO)", "When user input fails conversion, ValueError is your flooded stream."),
        "code_lines": [
            ("try:", "qty = int(input('Enter liters: '))"),
            ("except ValueError:", "print('Please enter digits only!')"),
            ("else:", "pump_petrol(qty)"),
            ("finally:", "close_fuel_cap()")
        ],
        "question": "In real code: qty = int(user_input). If the user types 'abc', what happens?",
        "options": [
            ("A", "Python raises ValueError; an except ValueError block catches it and recovers.", True, "Just like water in an engine, invalid user input raises a specific named error."),
            ("B", "The function automatically converts 'abc' into zero without throwing any warnings.", False, "Python refuses to silently guess; int('abc') immediately raises ValueError."),
            ("C", "The else block runs and awards the user a victory chai flask automatically.", False, "else is skipped because int('abc') raises an unhandled ValueError."),
            ("D", "The computer catches FireError and powers down the screen immediately.", False, "Standard input parsing errors raise ValueError, not hardware errors.")
        ]
    },
    {
        "id": 11,
        "act": "ACT 3: THE SYNTAX BRIDGE",
        "place": "SHEY",
        "alt": "11,500 FT",
        "alt_num": 11500,
        "photo": "assets/photos/11_shey.jpg",
        "narration": "Passing ancient Shey Monastery. What if Swati discovers bad fuel before riding?",
        "rider": ("Swati", "Wait! What if I inspect the petrol tank and find kerosene before starting?"),
        "guide": ("Tashi (BRO)", "Don't wait for the engine to blow up. Sound the alarm yourself with raise!"),
        "code_lines": [
            ("if fuel_quality < 0.8:", "raise ContaminatedFuelError('Bad petrol!')"),
            ("try:", "swati.ride_to_leh()"),
            ("except ContaminatedFuelError as e:", "flush_fuel_tank()"),
            ("finally:", "log_trail_entry()")
        ],
        "question": "Why would a programmer deliberately write: raise ContaminatedFuelError()?",
        "options": [
            ("A", "To make the program execute twice as fast by skipping the try block entirely.", False, "raise triggers exceptions; it has nothing to do with speeding up code."),
            ("B", "To halt dangerous execution early when internal safety conditions are violated.", True, "raise signals that an unrecoverable condition occurred, stopping further damage."),
            ("C", "Because Python requires every function to raise at least one fatal crash.", False, "Exceptions are used for exceptional failure states, not arbitrary requirements."),
            ("D", "To bypass finally and prevent the shelter tent from being pitched.", False, "finally executes even when an explicit raise is triggered.")
        ]
    },
    {
        "id": 12,
        "act": "ACT 3: THE SYNTAX BRIDGE",
        "place": "LEH (SHANTI STUPA)",
        "alt": "11,562 FT",
        "alt_num": 11562,
        "photo": "assets/photos/12_leh.jpg",
        "narration": "Arrival at Shanti Stupa! Four hundred seventy-four kilometers conquered. You are a Himalayan Pythonist.",
        "rider": ("Swati", "Shanti Stupa! 474 kilometers conquered without abandoning Dug-Dug once!"),
        "guide": ("Tashi (BRO)", "You rode the high pass and mastered Python exceptions. Claim your credential!"),
        "code_lines": [
            ("CONQUERED:", "474 KM across Manali-Leh Highway"),
            ("MASTERED:", "try, except, else, finally, raise"),
            ("STATUS:", "Certified Himalayan Pythonist")
        ],
        "question": "You have conquered all 12 Himalayan stages! Claim your verified credential below:",
        "options": [
            ("A", "Review the physical 4-stage routine again from Manali.", False, "You can restart anytime using the Previous button."),
            ("B", "Test your Python skills on additional simulated breakdown edge cases.", False, "Experiment with the 12-line simulator on Tanglang La!"),
            ("C", "Issue my verified PyBe Himalayan Pythonist certificate now!", True, "Congratulations! Your certificate is ready to download below."),
            ("D", "Download the complete single-file Streamlit app.py implementation.", False, "app.py is available in the repository root for submission.")
        ]
    }
]

# ==============================================================================
# 4. BACKGROUND IMAGE INJECTION (BASE64 CSS AS IN HAMDAN'S PR)
# ==============================================================================
current_scene = SCENES[st.session_state.scene_idx]
photo_path = Path(current_scene["photo"])

if photo_path.exists():
    with open(photo_path, "rb") as img_f:
        encoded_img = base64.b64encode(img_f.read()).decode()
    bg_style = f"""
    <style>
    .stApp {{
        background: linear-gradient(rgba(9, 13, 22, 0.75), rgba(9, 13, 22, 0.92)),
                    url("data:image/jpeg;base64,{encoded_img}");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}
    </style>
    """
else:
    bg_style = """
    <style>
    .stApp {
        background: linear-gradient(135deg, #090d16 0%, #151d30 100%);
    }
    </style>
    """

st.markdown(bg_style, unsafe_allow_html=True)

# Custom App Styling
st.markdown("""
<style>
    .block-container {
        max-width: 1200px;
        padding-top: 20px;
        padding-bottom: 40px;
    }
    h1, h2, h3 { color: #f5b942 !important; font-family: serif; }
    p, label { color: #f1f5f9 !important; }
    
    /* Speech Bubble Styling */
    .bubble-wrap {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
    }
    .bubble-wrap.rider { justify-content: flex-start; }
    .bubble-wrap.guide { justify-content: flex-end; flex-direction: row-reverse; }
    
    .avatar-badge {
        width: 34px; height: 34px; min-width: 34px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold; font-size: 13px;
    }
    .rider .avatar-badge { background: #0284c7; color: white; border: 1px solid #38bdf8; }
    .guide .avatar-badge { background: #d97706; color: #0b101d; border: 1px solid #f5b942; }
    
    .bubble-box {
        padding: 9px 14px;
        border-radius: 12px;
        max-width: 460px;
        font-size: 14px;
        line-height: 1.4;
    }
    .rider .bubble-box {
        background: rgba(14, 34, 61, 0.88);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #f0f9ff;
    }
    .guide .bubble-box {
        background: rgba(43, 31, 14, 0.9);
        border: 1px solid rgba(245, 185, 66, 0.45);
        color: #fefce8;
    }
    
    /* Code Peek Card */
    .code-peek-card {
        background: rgba(8, 12, 22, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 10px 14px;
        font-family: monospace;
        font-size: 13px;
        margin-top: 10px;
    }
</style>
""", unsafe_allow_html=True)

# ==============================================================================
# 5. HEADER HUD & PROGRESS
# ==============================================================================
hud_col1, hud_col2, hud_col3 = st.columns([3, 2, 1])

with hud_col1:
    st.markdown(f"### 🏍️ THE HIGH PASS: {current_scene['place']}")
    st.caption(f"{current_scene['act']} · Elevation: **{current_scene['alt']}** (BRO Survey)")

with hud_col2:
    st.progress((st.session_state.scene_idx + 1) / len(SCENES))

with hud_col3:
    st.markdown(f"<div style='text-align:right; font-family:monospace; font-size:16px; color:#f5b942; font-weight:bold;'>{st.session_state.scene_idx + 1:02d} / {len(SCENES):02d}</div>", unsafe_allow_html=True)

# ==============================================================================
# 6. ASYMMETRICAL TWO-COLUMN LAYOUT: STORY STAGE (2.2) vs CHECKPOINT PANEL (1.0)
# ==============================================================================
col_story, col_checkpoint = st.columns([2.2, 1.0], gap="medium")

# ------------------------------------------------------------------------------
# LEFT COLUMN: THE STORY STAGE
# ------------------------------------------------------------------------------
with col_story:
    with st.container(border=True):
        st.markdown(f"*{current_scene['narration']}*")
        
        # Dialogue Bubbles
        rider_name, rider_text = current_scene["rider"]
        guide_name, guide_text = current_scene["guide"]
        
        st.markdown(f"""
        <div class="bubble-wrap rider">
            <div class="avatar-badge">SW</div>
            <div class="bubble-box">
                <strong style="color:#38bdf8; font-size:11px; text-transform:uppercase;">{rider_name}</strong><br/>
                {rider_text}
            </div>
        </div>
        <div class="bubble-wrap guide">
            <div class="avatar-badge">TS</div>
            <div class="bubble-box">
                <strong style="color:#f5b942; font-size:11px; text-transform:uppercase;">{guide_name}</strong><br/>
                {guide_text}
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Code Peek (Appears Act 2/Scene 3 Onwards)
        if current_scene["code_lines"]:
            with st.container():
                st.markdown("**Mountain Protocol Code:**")
                code_html = "<div class='code-peek-card'>"
                for kw, txt in current_scene["code_lines"]:
                    code_html += f"<div><span style='color:#f5b942; font-weight:bold;'>{kw}</span> <span style='color:#7dd3fc;'>{txt}</span></div>"
                code_html += "</div>"
                st.markdown(code_html, unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# RIGHT COLUMN: CHECKPOINT PANEL (~30% WIDTH)
# ------------------------------------------------------------------------------
with col_checkpoint:
    with st.container(border=True):
        st.markdown(f"#### 🛡️ Checkpoint")
        st.write(current_scene["question"])
        
        # Scene 9: Real 12-line Simulator Integration
        if current_scene["id"] == 9:
            st.markdown("---")
            st.markdown("**Run the 12-Line Python Engine:**")
            sim_choice = st.selectbox(
                "Pick road condition:",
                ["clean (No errors)", "water (Glacial stream flood)", "puncture (Razor moraine slate)", "fuel (Empty tank - Unhandled)"],
                index=0
            )
            cond_key = sim_choice.split()[0]
            
            # Real In-Process Python Function Execution
            class WaterInEngineError(Exception): pass
            class FlatTyreError(Exception): pass
            class OutOfFuelError(Exception): pass

            class Motorcycle:
                def ride(self, cond):
                    if cond == "water": raise WaterInEngineError("Freezing glacial stream flooded carburetor!")
                    elif cond == "puncture": raise FlatTyreError("Razor moraine slate sliced the rear tyre tube!")
                    elif cond == "fuel": raise OutOfFuelError("Fuel tank empty at 17,480 FT! No handler registered.")

            swati = Motorcycle()

            def ride_day(condition):
                print("▶ 1. Setting off onto high pass (try)")
                try:
                    swati.ride(condition)
                except WaterInEngineError:
                    print("⚡ 2. Handled: Dried spark plug and cleared carburetor!")
                except FlatTyreError:
                    print("⚡ 2. Handled: Plugged tyre puncture with strip kit!")
                else:
                    print("☕ 3. Clean run reward: Hot cardamom chai at camp!")
                finally:
                    print("⛺ 4. Mandatory protocol: Tent pitched before sub-zero nightfall.")

            # Capture Execution Output
            buf = io.StringIO()
            import contextlib
            with contextlib.redirect_stdout(buf):
                try:
                    ride_day(cond_key)
                except Exception as e:
                    print(f"💥 CRASH TRACEBACK (Unhandled): {type(e).__name__}: {e}")

            st.code(buf.getvalue(), language="text")
            with st.expander("Inspect Actual Python Source"):
                st.code(inspect.getsource(ride_day), language="python")
            st.markdown("---")
        
        # Scene 12: Certificate Generation & Download
        elif current_scene["id"] == 12:
            st.session_state.explorer_name = st.text_input("Explorer Name:", value=st.session_state.explorer_name)
            
            # Generate Certificate Image with Pillow
            cert_img = Image.new("RGB", (800, 500), color=(12, 19, 34))
            draw = ImageDraw.Draw(cert_img)
            # Gold borders
            draw.rectangle([(15, 15), (785, 485)], outline=(245, 185, 66), width=4)
            draw.rectangle([(25, 25), (775, 475)], outline=(255, 255, 255, 40), width=1)
            # Texts
            draw.text((400, 60), "HIMALAYAN EXPEDITION CREDENTIAL", fill=(245, 185, 66), anchor="mm")
            draw.text((400, 85), "PYBE DISCOVERY LAB · MANALI TO LEH (474 KM)", fill=(148, 163, 184), anchor="mm")
            draw.text((400, 160), "This certifies that", fill=(203, 213, 225), anchor="mm")
            draw.text((400, 210), st.session_state.explorer_name, fill=(255, 255, 255), anchor="mm")
            draw.text((400, 270), "has conquered 474 km of high passes and mastered Python Exception Handling", fill=(148, 163, 184), anchor="mm")
            draw.text((400, 300), "(try, except, else, finally, raise)", fill=(245, 185, 66), anchor="mm")
            draw.text((400, 420), f"Issued: {datetime.date.today().strftime('%B %d, %Y')} · Pass Summit: 17,480 FT", fill=(100, 116, 139), anchor="mm")
            
            # Convert to byte buffer for download
            cert_buf = io.BytesIO()
            cert_img.save(cert_buf, format="PNG")
            st.image(cert_img, use_container_width=True)
            st.download_button(
                label="💾 Download Certificate PNG",
                data=cert_buf.getvalue(),
                file_name=f"Himalayan_Pythonist_{st.session_state.explorer_name.replace(' ', '_')}.png",
                mime="image/png"
            )
            st.balloons()
            st.markdown("---")

        # Standard Checkpoint Options
        selected_idx = st.session_state.selected_options.get(st.session_state.scene_idx, None)
        
        for idx, (letter, text, is_correct, feedback) in enumerate(current_scene["options"]):
            btn_key = f"opt_{st.session_state.scene_idx}_{idx}"
            if st.button(f"{letter}. {text}", key=btn_key):
                st.session_state.selected_options[st.session_state.scene_idx] = idx
                st.rerun()

        # Display Selected Feedback
        if selected_idx is not None:
            letter, text, is_correct, feedback = current_scene["options"][selected_idx]
            if is_correct:
                st.success(f"**✅ Well Reasoned:** {feedback}")
            else:
                st.error(f"**❌ Mountain Reality:** {feedback}")

# ==============================================================================
# 7. NAVIGATION CONTROLS (PREVIOUS / NEXT)
# ==============================================================================
st.markdown("---")
nav_col1, nav_col2, nav_col3 = st.columns([1, 4, 1])

with nav_col1:
    if st.button("◀ Previous", disabled=(st.session_state.scene_idx == 0)):
        st.session_state.scene_idx -= 1
        st.rerun()

with nav_col3:
    if st.session_state.scene_idx < len(SCENES) - 1:
        if st.button("Next ▶", type="primary"):
            st.session_state.scene_idx += 1
            st.rerun()
    else:
        if st.button("Restart ↺", type="primary"):
            st.session_state.scene_idx = 0
            st.rerun()
