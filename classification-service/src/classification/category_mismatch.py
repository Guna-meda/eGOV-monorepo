def _normalize_category(value: str | None) -> str | None:
    if value is None:
        return None

    normalized = str(value).strip()
    return normalized.lower() if normalized else None


def check_possible_mismatch(user_category: str | None, predicted_category: str | None) -> bool:
    """Return True when the selected category differs from the predicted category."""
    normalized_user = _normalize_category(user_category)
    normalized_predicted = _normalize_category(predicted_category)

    if normalized_user is None or normalized_predicted is None:
        return False

    return normalized_user != normalized_predicted
