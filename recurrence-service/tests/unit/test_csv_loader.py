from pathlib import Path

import pytest

from app.integrations.csv_loader import DataLoader


def test_load_all_discovers_and_loads_csv_files(tmp_path: Path) -> None:
    (tmp_path / "complaints.csv").write_text(
        "complaint_id,category,ward\n1,Water Leakage,10\n",
        encoding="utf-8",
    )
    (tmp_path / "ward_mapping.csv").write_text(
        "ward_id,ward_name\n10,Central Ward\n",
        encoding="utf-8",
    )

    loader = DataLoader(
        raw_dir=tmp_path,
        required_columns={
            "complaints": ["complaint_id", "category", "ward"],
            "ward_mapping": ["ward_id", "ward_name"],
        },
    )

    datasets = loader.load_all()

    assert set(datasets.keys()) == {"complaints", "ward_mapping"}
    assert loader.get_dataframe("complaints").shape[0] == 1
    assert loader.list_available_datasets() == ["complaints", "ward_mapping"]


def test_load_csv_raises_on_missing_required_columns(tmp_path: Path) -> None:
    (tmp_path / "complaints.csv").write_text(
        "complaint_id,description\n1,Leakage\n",
        encoding="utf-8",
    )

    loader = DataLoader(
        raw_dir=tmp_path,
        required_columns={"complaints": ["complaint_id", "category"]},
    )

    with pytest.raises(ValueError, match="Missing required columns"):
        loader.load_csv("complaints")
