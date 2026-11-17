import streamlit as st
from pathlib import Path
import base64
import time


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="Dabbo's Orchard",
    page_icon="🥭",
    layout="centered"
)


# ============================================================
# SESSION STATE
# ============================================================

if "step" not in st.session_state:
    st.session_state.step = 1


# ============================================================
# LESSON DATA
# ============================================================

TOTAL_MANGOES = 50
MANGO_TYPE = "Alphonso"
RIPENESS = "Ripe"
QUANTITY = 8
PRICE = 20

remaining = TOTAL_MANGOES - QUANTITY
total_money = QUANTITY * PRICE


# ============================================================
# BACKGROUND IMAGE
# ============================================================

image_path = Path("orchard_bg.jpg")

if image_path.exists():

    with open(image_path, "rb") as image_file:
        encoded_image = base64.b64encode(
            image_file.read()
        ).decode()

    background = f"""
    <style>

    .stApp {{
        background:
        linear-gradient(
            rgba(0, 20, 10, 0.55),
            rgba(0, 20, 10, 0.65)
        ),
        url("data:image/jpeg;base64,{encoded_image}");

        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}

    </style>
    """

    st.markdown(
        background,
        unsafe_allow_html=True
    )


# ============================================================
# UI STYLING
# ============================================================

st.markdown(
    """
    <style>

    /* Main content width */

    .block-container {
        max-width: 950px;
        padding-top: 25px;
        padding-bottom: 60px;
    }


    /* Make normal Streamlit text readable */

    .stApp {
        color: white;
    }


    /* Streamlit headings */

    h1, h2, h3 {
        color: white !important;
        text-shadow: 2px 2px 5px black;
    }


    /* Normal text */

    p, label {
        color: white !important;
    }


    /* Buttons */

    .stButton > button {
        width: 100%;
        min-height: 50px;

        background: rgba(10, 35, 20, 0.92);

        color: white;

        border: 2px solid rgba(255, 255, 255, 0.30);

        border-radius: 15px;

        font-size: 18px;
        font-weight: 800;
    }


    .stButton > button:hover {
        border-color: #fbbf24;
        color: #fbbf24;
    }


    /* Progress bar */

    .stProgress > div > div > div > div {
        background-color: #f59e0b;
    }


    /* Info */

    [data-testid="stAlert"] {
        border-radius: 18px;
    }


    /* Containers */

    [data-testid="stVerticalBlockBorderWrapper"] {
        background: rgba(3, 25, 15, 0.88);
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,0.20);
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# HEADER
# ============================================================

st.title("🥭 Dabbo's Orchard")

st.subheader(
    "Learn Python through a simple mango story"
)


st.progress(
    st.session_state.step / 8
)


st.write(
    f"### Learning Step {st.session_state.step} of 8"
)


# ============================================================
# STEP 1 — STORY
# ============================================================

if st.session_state.step == 1:

    with st.container(border=True):

        st.header("📖 Dabbo's Story")

        st.write(
            "👨‍🌾 This is Dabbo."
        )

        st.write(
            "Dabbo takes care of a beautiful mango orchard. 🌳🥭"
        )

        st.write(
            "His orchard has many mango trees and many mango boxes."
        )

        st.write(
            "Every box contains mangoes."
        )

        st.write(
            "Today, a buyer has come to buy some mangoes."
        )

        st.write(
            "Let's follow Dabbo and learn Python through his work."
        )


    st.divider()


    with st.container(border=True):

        st.header("📦 One Mango Box")

        st.write(
            "Dabbo opens one box."
        )

        st.write(
            "He counts the mangoes."
        )

        st.metric(
            label="🥭 Mangoes in the box",
            value="50"
        )

        st.success(
            "Dabbo knows that this box contains 50 mangoes."
        )


    st.info(
        "Next, we will learn how Dabbo can remember the number 50."
    )


# ============================================================
# STEP 2 — VARIABLE
# ============================================================

elif st.session_state.step == 2:

    with st.container(border=True):

        st.header("📦 Dabbo Needs to Remember a Number")

        st.write(
            "Dabbo has counted 50 mangoes."
        )

        st.write(
            "But he may need this number again later."
        )

        st.write(
            "So he needs a way to remember it."
        )


    st.divider()


    with st.container(border=True):

        st.header("💡 Python Concept: Variable")

        st.write(
            "Imagine you have a box."
        )

        st.write(
            "You put something inside the box."
        )

        st.write(
            "Then you give the box a name."
        )

        st.write(
            "Later, you can use that name to find what you stored."
        )


        st.success(
            "In Python, this named storage is called a VARIABLE."
        )


    with st.container(border=True):

        st.write("🥭 Dabbo remembers:")

        st.metric(
            label="Mangoes",
            value="50"
        )

        st.write(
            "The important idea is:"
        )

        st.info(
            "A variable is simply a name that helps Python remember a value."
        )


# ============================================================
# STEP 3 — BUYER REQUEST
# ============================================================

elif st.session_state.step == 3:

    with st.container(border=True):

        st.header("🛒 The Buyer Arrives")

        st.write(
            "A buyer comes to Dabbo's orchard."
        )

        st.write(
            "The buyer tells Dabbo exactly what he wants."
        )


    st.divider()


    with st.container(border=True):

        st.subheader("🥭 The buyer wants:")

        st.success(
            "Mango type: Alphonso"
        )

        st.success(
            "Condition: Ripe"
        )

        st.success(
            "Quantity: 8 mangoes"
        )


    st.divider()


    with st.container(border=True):

        st.header("💡 Python Concept: Storing Information")

        st.write(
            "Dabbo now has three important pieces of information."
        )

        st.write(
            "1. Which mango?"
        )

        st.write(
            "2. What condition?"
        )

        st.write(
            "3. How many?"
        )

        st.info(
            "Python can remember information so that we can use it later."
        )


# ============================================================
# STEP 4 — IF CONDITION
# ============================================================

elif st.session_state.step == 4:

    with st.container(border=True):

        st.header("🤔 Dabbo Makes a Decision")

        st.write(
            "The buyer wants Alphonso mangoes."
        )

        st.write(
            "The buyer also wants ripe mangoes."
        )

        st.write(
            "Dabbo cannot simply give any mango."
        )

        st.write(
            "He must first check the buyer's request."
        )


    st.divider()


    with st.container(border=True):

        st.header("💡 Python Concept: IF")

        st.write(
            "An IF condition means:"
        )

        st.success(
            "👉 Check something before doing something."
        )

        st.write(
            "Dabbo asks himself:"
        )

        st.write(
            "❓ Do I have the mango type the buyer wants?"
        )

        st.write(
            "❓ Are the mangoes ripe?"
        )


    st.divider()


    with st.container(border=True):

        st.header("🌱 Simple Example")

        st.write(
            "IF the mango is Alphonso..."
        )

        st.write(
            "AND IF the mango is ripe..."
        )

        st.success(
            "✅ Then Dabbo can give the mango to the buyer."
        )

        st.info(
            "This kind of decision is called an IF condition in Python."
        )


# ============================================================
# STEP 5 — FOR LOOP
# ============================================================

elif st.session_state.step == 5:

    with st.container(border=True):

        st.header("📦 Dabbo Searches the Boxes")

        st.write(
            "Dabbo has many mango boxes."
        )

        st.write(
            "He needs to find the box containing Alphonso mangoes."
        )

        st.write(
            "He starts checking the boxes one by one."
        )


    st.divider()


    with st.container(border=True):

        st.header("💡 Python Concept: FOR LOOP")

        st.write(
            "Imagine Dabbo saying:"
        )

        st.write(
            "🔍 Check this box."
        )

        st.write(
            "🔍 Check the next box."
        )

        st.write(
            "🔍 Check the next box."
        )

        st.write(
            "🔍 Keep checking."
        )


        st.success(
            "When Python repeats the same task for many items, we can use a FOR LOOP."
        )


    st.divider()


    with st.container(border=True):

        st.subheader("🔎 Dabbo is checking the boxes...")

        boxes = [
            "Box 1",
            "Box 2",
            "Box 3",
            "Box 4",
            "Box 5"
        ]

        search_area = st.empty()

        for box in boxes:

            search_area.info(
                f"🔍 Dabbo is checking {box}..."
            )

            time.sleep(0.6)

        search_area.success(
            "🎉 Dabbo found the Alphonso mango box!"
        )


    st.info(
        "Simple meaning: A FOR LOOP helps Python repeat a task."
    )


# ============================================================
# STEP 6 — SUBTRACTION
# ============================================================

elif st.session_state.step == 6:

    with st.container(border=True):

        st.header("🥭 The Buyer Takes 8 Mangoes")

        st.write(
            "Dabbo's box originally had 50 mangoes."
        )

        st.write(
            "The buyer takes 8 mangoes."
        )

        st.write(
            "Now Dabbo needs to know how many are left."
        )


    st.divider()


    with st.container(border=True):

        st.header("💡 Python Concept: SUBTRACTION")

        st.write(
            "When something is taken away, we subtract it."
        )

        st.metric(
            "Mangoes before the sale",
            "50"
        )

        st.metric(
            "Mangoes given to buyer",
            "8"
        )

        st.metric(
            "Mangoes remaining",
            "42"
        )


    st.success(
        "50 − 8 = 42"
    )


    st.info(
        "Python can perform this calculation for Dabbo."
    )


# ============================================================
# STEP 7 — MULTIPLICATION
# ============================================================

elif st.session_state.step == 7:

    with st.container(border=True):

        st.header("💰 Dabbo Calculates the Price")

        st.write(
            "The buyer bought 8 mangoes."
        )

        st.write(
            "Each mango costs ₹20."
        )

        st.write(
            "Dabbo needs to calculate the total amount."
        )


    st.divider()


    with st.container(border=True):

        st.header("💡 Python Concept: MULTIPLICATION")

        st.write(
            "Instead of adding ₹20 eight times..."
        )

        st.write(
            "Dabbo can multiply."
        )


        st.metric(
            "Number of mangoes",
            "8"
        )

        st.metric(
            "Price of one mango",
            "₹20"
        )

        st.metric(
            "Total",
            "₹160"
        )


    st.success(
        "8 × ₹20 = ₹160"
    )


    st.info(
        "Python can multiply numbers and calculate the total automatically."
    )


# ============================================================
# STEP 8 — COMPLETE STORY
# ============================================================

elif st.session_state.step == 8:

    with st.container(border=True):

        st.header("🎉 Dabbo Completes the Order")

        st.write(
            "The buyer asked for ripe Alphonso mangoes."
        )

        st.write(
            "Dabbo checked his mango boxes."
        )

        st.write(
            "He found the required mangoes."
        )

        st.write(
            "He gave 8 mangoes to the buyer."
        )

        st.write(
            "The box went from 50 mangoes to 42 mangoes."
        )

        st.write(
            "The buyer paid ₹160."
        )


    st.success(
        "🥭 Dabbo successfully completed the order!"
    )


    st.divider()


    st.header("🧠 What Did We Learn?")


    with st.container(border=True):

        st.subheader("📦 Variable")

        st.write(
            "A variable helps Python remember information."
        )

        st.caption(
            "Dabbo remembered that his box contained 50 mangoes."
        )


    with st.container(border=True):

        st.subheader("🤔 IF Condition")

        st.write(
            "IF helps Python make a decision."
        )

        st.caption(
            "Dabbo checked whether the mango matched the buyer's request."
        )


    with st.container(border=True):

        st.subheader("🔄 FOR Loop")

        st.write(
            "A FOR LOOP repeats a task."
        )

        st.caption(
            "Dabbo checked his boxes one by one."
        )


    with st.container(border=True):

        st.subheader("➖ Subtraction")

        st.write(
            "Subtraction helps us find what remains."
        )

        st.caption(
            "50 mangoes − 8 mangoes = 42 mangoes."
        )


    with st.container(border=True):

        st.subheader("✖️ Multiplication")

        st.write(
            "Multiplication helps us calculate totals quickly."
        )

        st.caption(
            "8 mangoes × ₹20 = ₹160."
        )


    st.balloons()

    st.success(
        "🎓 Congratulations! You completed Dabbo's Python lesson."
    )


# ============================================================
# NAVIGATION
# ============================================================

st.divider()

col1, col2 = st.columns(2)


with col1:

    if st.session_state.step > 1:

        if st.button("⬅️ Previous"):

            st.session_state.step -= 1

            st.rerun()


with col2:

    if st.session_state.step < 8:

        if st.button("Next ➡️"):

            st.session_state.step += 1

            st.rerun()

    else:

        if st.button("🔄 Start Again"):

            st.session_state.step = 1

            st.rerun()


# ============================================================
# FOOTER
# ============================================================

st.caption(
    "🥭 Dabbo's Orchard • Learn Python through a simple story"
)