import re


class TextPreprocessor:
    """
    Text preprocessing used during both
    training and inference.
    """

    @staticmethod
    def clean(text: str) -> str:

        if text is None:
            return ""

        text = str(text)

        # Lowercase
        text = text.lower()

        # Remove URLs
        text = re.sub(r"http\S+", " ", text)

        # Remove Emails
        text = re.sub(r"\S+@\S+", " ", text)

        # Remove Numbers
        text = re.sub(r"\d+", " ", text)

        # Keep only alphabets and spaces
        text = re.sub(r"[^a-zA-Z ]", " ", text)

        # Remove extra spaces
        text = re.sub(r"\s+", " ", text).strip()

        return text