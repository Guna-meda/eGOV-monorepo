'''
USE: Provides a function to clean the raw data.
'''

import re
import pandas as pd


def clean_text(text):
    """
    Basic complaint text cleaning
    """

    if pd.isna(text):
        return ""

    text = str(text).lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", "", text)

    # Remove email addresses
    text = re.sub(r"\S+@\S+", "", text)

    # Remove 10-digit phone numbers
    text = re.sub(r"\b\d{10}\b", "", text)

    # Remove special characters
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()
