from __future__ import annotations

from app.services.recurrence_service import RecurrenceService


class FakeRepository:
    def __init__(self, records: list[dict[str, str]]) -> None:
        self.records = records

    def get_all(self) -> list[dict[str, str]]:
        return self.records


def test_full_table_calculates_recurrence_from_distinct_historical_years() -> None:
    service = RecurrenceService(
        repository=FakeRepository(
            [
                {"Ward Name": "Bellandur", "Category": "Electrical", "Grievance Date": "2021-05-10 10:00:00"},
                {"Ward Name": "Bellandur", "Category": "Electrical", "Grievance Date": "2022-05-12 10:00:00"},
                {"Ward Name": "Bellandur", "Category": "Electrical", "Grievance Date": "2022-05-13 10:00:00"},
                {"Ward Name": "Bellandur", "Category": "Electrical", "Grievance Date": "2023-06-01 10:00:00"},
            ]
        )
    )

    results = service.get_recurrence_table()

    assert len(results) == 1
    result = results[0]
    assert result.ward_id == "bellandur"
    assert result.ward_name == "Bellandur"
    assert result.serviceCode == "Electrical"
    assert result.is_hotspot is True
    assert result.recurrence_score == 0.5
    assert [month.month for month in result.recurring_months] == [5, 6]
    assert result.recurring_months[0].month_name == "May"
    assert result.recurring_months[0].years == [2021, 2022]
    assert result.recurring_months[0].is_hotspot is True
    assert result.recurring_months[1].years == [2023]
    assert result.recurring_months[1].is_hotspot is False
    assert result.monthly_counts["2022"][4] == 2
    assert len(result.monthly_counts["2022"]) == 12


def test_full_table_keeps_non_hotspot_rows_and_compact_yearly_month_counts() -> None:
    service = RecurrenceService(
        repository=FakeRepository(
            [
                {"Ward Name": "Jakkur", "Category": "Electrical", "Grievance Date": "2021-01-10 10:00:00"},
                {"Ward Name": "Jakkur", "Category": "Water Supply", "Grievance Date": "2022-01-10 10:00:00"},
            ]
        )
    )

    results = service.get_recurrence_table()

    assert [row.serviceCode for row in results] == ["Electrical", "Water Supply"]
    assert all(row.is_hotspot is False for row in results)
    assert all(set(row.monthly_counts) == {"2021", "2022"} for row in results)
    assert all(len(counts) == 12 for row in results for counts in row.monthly_counts.values())


def test_single_ward_detail_returns_only_that_wards_rows() -> None:
    service = RecurrenceService(
        repository=FakeRepository(
            [
                {"Ward Name": "Bellandur", "Category": "Electrical", "Grievance Date": "2021-05-10 10:00:00"},
                {"Ward Name": "Bellandur", "Category": "Electrical", "Grievance Date": "2022-05-12 10:00:00"},
                {"Ward Name": "Jakkur", "Category": "Electrical", "Grievance Date": "2022-05-12 10:00:00"},
            ]
        )
    )

    results = service.get_ward_recurrence("Bellandur")

    assert len(results) == 1
    assert results[0].ward_id == "bellandur"
    assert results[0].recurring_months[0].month == 5
