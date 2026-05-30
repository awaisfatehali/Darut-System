from fastapi import FastAPI
import joblib
import re
import numpy as np
from pydantic import BaseModel

app = FastAPI()

model = joblib.load("model.pkl")


# ----------------------
# REQUEST MODEL (same as your original)
# ----------------------
class InputData(BaseModel):
    text: str


# ----------------------
# CLEAN TEXT
# ----------------------
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ----------------------
# DANGER PATTERNS
# ----------------------
danger_patterns = [

    # ---------------------------
    # DIRECT SUICIDE / SELF-HARM
    # ---------------------------
    r"maut",r"mout", r"mar jao", r"marr jao", r"marna",
    r"marna chata ho", r"marna chahta ho", r"marna chata hu", r"marna chahta hu",
    r"khudkushi", r"suicide",
    r"apni jaan le", r"jaan le loon", r"jaan le lunga",
    r"khud ko maar", r"khud ko khatam", r"khud ko khtm",
    r"zindagi khatam karna", r"zindagi khatm karna",

    # ---------------------------
    # SPELLING / CHAT VARIATIONS
    # ---------------------------
    r"mar jana", r"marjana", r"mar janaa",
    r"khudkushi krna", r"khudkushi karna",
    r"jeena nahi", r"jeena ni", r"jeena nhi",
    r"zinda nahi rehna", r"zinda nai rehna", r"zinda ni rehna",
    r"sab khatam", r"sab khtm", r"sab khatm",
    r"zindagi bekaar", r"zindagi bakar", r"zindagi bekar",

    # ---------------------------
    # HOPELESSNESS / EXTREME FATIGUE
    # ---------------------------
    r"thak gaya hoon", r"thak gya ho", r"thak gaya hu", r"thak gya hu",
    r"bohot thak gaya", r"bht thak gya", r"bohat thak gya",
    r"bas bohot ho gaya", r"bas bohat ho gaya", r"bas bht ho gya",
    r"ab aur nahi", r"ab or nahi", r"ab nahi hota",

    # ---------------------------
    # DEATH WISH / ESCAPE THOUGHTS
    # ---------------------------
    r"maut acha", r"maut achi hai", r"maut behtar",
    r"mar jana behtar", r"mar jana acha hai",
    r"kaash main mar jata", r"kaash main mar jati",
    r"kaash main na hota", r"kaash main na hoti",
    r"zindagi se chutkara", r"zindagi se nijat",

    # ---------------------------
    # LONELINESS / ISOLATION
    # ---------------------------
    r"akela hoon", r"akela hu", r"akeli hoon", r"akeli hu",
    r"bohot akela", r"bohat akela", r"bht akela",
    r"tanha hoon", r"tanha hu", r"bilkul akela",
    r"koi nahi hai", r"koi bhi nahi", r"koi sath nahi",

    # ---------------------------
    # EMOTIONAL BREAKDOWN
    # ---------------------------
    r"koi samajhta nahi", r"koi samjhta ni", r"koi smjhta ni",
    r"kisi ko farq nahi", r"kisi ko fark ni",
    r"dil bhar gaya", r"dil bhar gya",
    r"andar se khali", r"andar se khali hoon",
    r"ro nahi sakta", r"rona nahi ata",

    # ---------------------------
    # SELF WORTH / NEGATIVE IDENTITY
    # ---------------------------
    r"main bekaar hoon", r"main bekar ho", r"main kuch nahi hoon",
    r"main kuch bhi nahi", r"worthless", r"main fazool hoon",
    r"main kisi kaam ka nahi", r"main kisi kam ka nahi",

    # ---------------------------
    # ANXIETY / PANIC / DISTRESS
    # ---------------------------
    r"ghabrahat", r"anxiety ho rahi", r"bohot tension",
    r"stress bohot zyada", r"dimagh phat raha", r"dimagh kharab",
    r"saans nahi aa rahi", r"breathing problem feel",
    
]

def detect_high_risk(text):
    text = text.lower()
    return any(re.search(p, text) for p in danger_patterns)


# ----------------------
# CORE ANALYSIS (IMPROVED LOGIC + ORIGINAL FORMAT)
# ----------------------
def analyze(text):
    cleaned = clean_text(text)

    probs = model.predict_proba([cleaned])[0]
    pred = int(np.argmax(probs))
    confidence = float(np.max(probs))

    # override for high-risk phrases
    if detect_high_risk(cleaned):
        pred = 1
        confidence = max(confidence, 0.87)

    # label logic
    if confidence < 0.70:
        label = "Uncertain"
    else:
        label = "Depression" if pred == 1 else "No Depression"

    # SAME RESPONSE FORMAT AS YOUR ORIGINAL CODE
    return {
        "prediction": label,
        "confidence": round(confidence, 3)
    }


# ----------------------
# API ENDPOINT (UNCHANGED FOR FRONTEND COMPATIBILITY)
# ----------------------
@app.post("/predict")
def predict(data: InputData):
    return analyze(data.text)