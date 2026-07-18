import argparse
import json
import sys

from src.preprocessing.translation import translate_to_english


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Translate Hinglish/Hindi/Marathi grievance text to English.")
    parser.add_argument("text", nargs="*", help="Complaint text to translate.")
    parser.add_argument("--lang", default="hi", choices=["hi", "mr"], help="Source language hint for pretrained model.")
    parser.add_argument(
        "--backend",
        default="auto",
        choices=["auto", "helsinki", "seamless", "indictrans2", "aksharamukha", "phrase"],
        help="Conversion backend. auto/helsinki translate, seamless uses SeamlessM4T, aksharamukha transliterates.",
    )
    parser.add_argument("--no-pretrained", action="store_true", help="Use only the lightweight Hinglish phrase normalizer.")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON.")
    args = parser.parse_args()

    complaint_text = " ".join(args.text).strip()
    if not complaint_text:
        complaint_text = input("Enter complaint: ").strip()

    backend = "phrase" if args.no_pretrained else args.backend
    result = translate_to_english(complaint_text, lang=args.lang, use_pretrained=not args.no_pretrained, backend=backend)
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    print("\nTranslation")
    print("-" * 40)
    print(f"Input        : {result['input_text']}")
    print(f"Preprocessed : {result['preprocessed_text']}")
    print(f"English      : {result['translated_text']}")
    print(f"Model        : {result['translation_model']}")


if __name__ == "__main__":
    main()
