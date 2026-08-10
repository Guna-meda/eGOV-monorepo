from src.classification.category_mismatch import check_possible_mismatch


def test_returns_true_when_categories_do_not_match():
    assert check_possible_mismatch("Water Supply", "Sanitation") is True


def test_returns_false_when_categories_match_case_insensitively():
    assert check_possible_mismatch("  water supply  ", "WATER SUPPLY") is False
