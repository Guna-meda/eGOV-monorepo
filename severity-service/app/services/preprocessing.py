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

        # lowercase
        text = text.lower()

        # remove urls
        text = re.sub(r"http\S+", " ", text)

        # remove emails
        text = re.sub(r"\S+@\S+", " ", text)

        # remove numbers
        text = re.sub(r"\d+", " ", text)

        # remove punctuation
        text = re.sub(r"[^a-zA-Z ]", " ", text)

        # remove extra spaces
        text = re.sub(r"\s+", " ", text)

        return text.strip()

    @staticmethod
    def word_count(text: str) -> int:

        text = TextPreprocessor.clean(text)

        return len(text.split())

    @staticmethod
    def character_count(text: str) -> int:

        text = TextPreprocessor.clean(text)

        return len(text)

    @staticmethod
    def contains_numbers(text: str) -> bool:

        if text is None:
            return False

        return bool(re.search(r"\d", str(text)))

    @staticmethod
    def contains_special_characters(text: str) -> bool:

        if text is None:
            return False

        return bool(re.search(r"[^a-zA-Z0-9 ]", str(text)))