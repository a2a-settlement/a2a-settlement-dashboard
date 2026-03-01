def main() -> int:
    try:
        import streamlit  # noqa: F401
        import plotly  # noqa: F401
    except Exception as e:
        print("dashboard deps import failed:", e)
        return 1

    print("dashboard deps import: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
