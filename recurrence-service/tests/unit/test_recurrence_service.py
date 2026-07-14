from __future__ import annotations

import pytest

from app.services.recurrence_service import RecurrenceService


class FakeRepository:
    def __init__(self, records: list[dict[str, str]]) -> None:
        self.records = records

    def get_all(self) -> list[dict[str, str]]:
        return self.records


def test_detect_recurring_months_flags_hotspot_by_ward_service_and_month() -> None:
    service = RecurrenceService(
        repository=FakeRepository(
            [
                {
                    "Ward Name": "Bellandur",
                    "Category": "Electrical",
                    "Grievance Date": "2021-05-10 10:00:00",
                },
                {
                    "Ward Name": "Bellandur",
                    "Category": "Electrical",
                    "Grievance Date": "2022-05-12 10:00:00",
                },
                {
                    "Ward Name": "Bellandur",
                    "Category": "Electrical",
                    "Grievance Date": "2022-05-13 10:00:00",
                },
                {
                    "Ward Name": "Bellandur",
                    "Category": "Electrical",
                    "Grievance Date": "2023-06-01 10:00:00",
                },
            ]
        )
    )

    response = service.detect_recurring_months()

    assert response.total_records == 4
    assert response.years_in_dataset == [2021, 2022, 2023]
    assert len(response.results) == 1

    result = response.results[0]
    assert result.ward_id == "bellandur"
    assert result.ward_name == "Bellandur"
    assert result.serviceCode == "Electrical"
    assert result.is_hotspot is True
    assert result.recurrence_score == pytest.approx(0.6667)
    assert [month.month for month in result.recurring_months] == [5]
    assert result.recurring_months[0].years_with_complaints == 2

    may_2022 = [
        count
        for count in result.monthly_counts
        if count.year == 2022 and count.month == 5
    ][0]
    assert may_2022.complaint_count == 2


def test_detect_recurring_months_can_use_sub_category_as_service_code() -> None:
    service = RecurrenceService(
        repository=FakeRepository(
            [
                {
                    "Ward Name": "Jakkur",
                    "Category": "Electrical",
                    "Sub Category": "Street Light Not Working",
                    "Grievance Date": "2021-01-10 10:00:00",
                },
                {
                    "Ward Name": "Jakkur",
                    "Category": "Electrical",
                    "Sub Category": "Street Light Not Working",
                    "Grievance Date": "2022-01-10 10:00:00",
                },
            ]
        )
    )

    response = service.detect_recurring_months(service_code_field="sub_category")

    assert response.service_code_field == "sub_category"
    assert response.results[0].serviceCode == "Street Light Not Working"


def test_detect_recurring_months_rejects_unknown_service_code_field() -> None:
    service = RecurrenceService(repository=FakeRepository([]))

    with pytest.raises(ValueError, match="service_code_field"):
        service.detect_recurring_months(service_code_field="unknown")
