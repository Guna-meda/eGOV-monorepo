'''
USE: Builds the dataset by merging given intake and ASR text files, and applies text cleaning to the raw text.
Returns a DataFrame with the merged and cleaned dataset.
'''

import pandas as pd

from src.preprocessing.text_cleaning import clean_text


def build_dataset(intake_path, text_path):
    """
    Builds the NLP dataset by merging:
    ids_intake.csv
    +
    text_asr.csv
    """

    # Load files
    intake_df = pd.read_csv(intake_path)
    text_df = pd.read_csv(text_path)

    # Handle different boolean formats safely
    text_df["is_primary"] = (
        text_df["is_primary"].astype(str).str.lower().isin(["true", "1"])
    )

    # Keep only primary ASR records
    text_primary = text_df[text_df["is_primary"]].copy()

    # Select required columns
    text_primary = text_primary[
        [
            "complaint_id",
            "text_raw",
            "asr_lang",
            "transcript_ts",
        ]
    ]

    intake_df = intake_df[
        [
            "complaint_id",
            "source_channel",
            "intake_ts_local",
        ]
    ]

    # Merge
    dataset = intake_df.merge(
        text_primary,
        on="complaint_id",
        how="inner",
    )

    # Remove duplicate complaint IDs
    dataset = dataset.drop_duplicates(subset=["complaint_id"])

    # Create text column
    dataset["text"] = dataset["text_raw"]

    # Clean text
    dataset["clean_text"] = dataset["text"].apply(clean_text)

    return dataset
