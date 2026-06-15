from functools import lru_cache
import re

from src.preprocessing.text_cleaning import normalize_text


MODEL_BY_LANG = {
    "hi": "Helsinki-NLP/opus-mt-hi-en",
    "mr": "Helsinki-NLP/opus-mt-mr-en",
}

SEAMLESS_LANG_BY_LANG = {
    "hi": "hin",
    "mr": "mar",
}

AKSHARAMUKHA_SCRIPT_BY_LANG = {
    "hi": "Devanagari",
    "mr": "Devanagari",
}

SEAMLESS_MODEL_NAME = "facebook/seamless-m4t-v2-large"

HINGLISH_PHRASES = {
    "paani nahi aa raha": "no water is coming",
    "pani nahi aa raha": "no water is coming",
    "paani ki kami": "water shortage",
    "pani ki kami": "water shortage",
    "tanker bhejo": "send water tanker",
    "tanker chahiye": "water tanker needed",
    "jaldi madad": "urgent help",
    "kripya madad kijiye": "please help",
    "krupaya sahayya kara": "please help",
    "loker madat kara": "please help quickly",
    "teen din se": "for three days",
    "3 din se": "for three days",
    "sadak kharab": "road is damaged",
    "kachra nahi uthaya": "garbage was not collected",
    "nala band hai": "drain is blocked",
    "gutter overflow": "drain overflow",
    "bijli ka pole": "electric pole",
}

INDIC_DOMAIN_GLOSSES = {
    "पानी": "water",
    "पाणी": "water",
    "नहीं आ रहा": "no water supply",
    "नाही येत": "no water supply",
    "येत नाही": "no water supply",
    "तीन दिवस": "for three days",
    "तीन दिन": "for three days",
    "टैंकर": "water tanker",
    "टँकर": "water tanker",
    "कचरा": "garbage",
    "नाला": "drain",
    "गटर": "drain overflow",
    "सड़क": "road",
    "रस्ता": "road",
    "खड्डा": "pothole",
}


def normalize_hinglish_phrases(text: str) -> str:
    normalized = normalize_text(text)
    for source, target in HINGLISH_PHRASES.items():
        normalized = re.sub(rf"\b{re.escape(source)}\b", target, normalized)
    return normalized


def _looks_like_indic_script(text: str) -> bool:
    return any("\u0900" <= char <= "\u097f" for char in text)


def _domain_gloss(text: str) -> str:
    matches = [gloss for source, gloss in INDIC_DOMAIN_GLOSSES.items() if source in text]
    return " ".join(dict.fromkeys(matches))


@lru_cache(maxsize=4)
def _load_helsinki_model(model_name: str):
    try:
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    except ImportError as exc:
        raise RuntimeError(
            "Translation dependencies are missing. Run: python -m pip install -r requirements-translation.txt"
        ) from exc
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return tokenizer, model


@lru_cache(maxsize=2)
def _load_seamless_model(model_name: str = SEAMLESS_MODEL_NAME):
    try:
        from transformers import AutoProcessor, SeamlessM4Tv2Model
    except ImportError as exc:
        raise RuntimeError(
            "Seamless translation dependencies are missing. Run: python -m pip install -r requirements-translation.txt"
        ) from exc
    processor = AutoProcessor.from_pretrained(model_name)
    model = SeamlessM4Tv2Model.from_pretrained(model_name)
    return processor, model


def transliterate_with_aksharamukha(text: str, lang: str = "hi", target: str = "ISO") -> str:
    try:
        from aksharamukha import transliterate
    except ImportError as exc:
        raise RuntimeError("Aksharamukha is missing. Run: python -m pip install aksharamukha") from exc

    source_script = AKSHARAMUKHA_SCRIPT_BY_LANG.get(lang, "Devanagari")
    return transliterate.process(source_script, target, text)


def _translate_with_helsinki(text: str, model_name: str) -> str:
    tokenizer, model = _load_helsinki_model(model_name)
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=256)
    outputs = model.generate(**inputs, max_length=256, num_beams=4)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def _translate_with_seamless(text: str, lang: str) -> str:
    processor, model = _load_seamless_model()
    source_lang = SEAMLESS_LANG_BY_LANG.get(lang, "hin")
    inputs = processor(text=text, src_lang=source_lang, return_tensors="pt")
    outputs = model.generate(**inputs, tgt_lang="eng", generate_speech=False)
    token_ids = outputs[0].cpu().tolist()
    return processor.decode(token_ids, skip_special_tokens=True)


def _translate_with_indictrans2(text: str, lang: str) -> str:
    raise RuntimeError(
        "IndicTrans2 requires the AI4Bharat IndicTrans2 inference package/checkpoints, "
        "which are not installed in this environment. Use --backend seamless or --backend helsinki."
    )


def translate_to_english(text: str, lang: str = "hi", use_pretrained: bool = True, backend: str = "auto") -> dict[str, str]:
    preprocessed = " ".join(text.split()) if _looks_like_indic_script(text) else normalize_hinglish_phrases(text)
    model_name = MODEL_BY_LANG.get(lang)

    if not use_pretrained or backend == "phrase" or model_name is None:
        return {
            "input_text": text,
            "preprocessed_text": preprocessed,
            "translated_text": preprocessed,
            "translation_model": "hinglish_phrase_normalizer",
        }

    if backend == "aksharamukha":
        translated = transliterate_with_aksharamukha(preprocessed, lang=lang)
        model_used = "aksharamukha_transliteration"
    elif backend == "seamless":
        translated = _translate_with_seamless(preprocessed, lang)
        model_used = SEAMLESS_MODEL_NAME
    elif backend == "indictrans2":
        translated = _translate_with_indictrans2(preprocessed, lang)
        model_used = "ai4bharat/indictrans2"
    else:
        translated = _translate_with_helsinki(preprocessed, model_name)
        model_used = model_name

    gloss = _domain_gloss(text)
    if gloss and backend != "aksharamukha":
        translated = f"{translated} {gloss}"
    return {
        "input_text": text,
        "preprocessed_text": preprocessed,
        "translated_text": translated,
        "translation_model": model_used,
    }
